// src/sdk/LivenessSDK.js
import { LivenessEngine } from "@liveness/engine";

export class LivenessSDK {
  constructor(config = {}) {
    this.config = config;
    this.engine = null;
    this.listeners = {
      ready: [],
      challenge: [],
      progress: [],
      success: [],
      failure: [],
      error: [],
    };

    this.instructions = {
      WAITING: "Please position your face in the center of the frame.",
      BLINK: "Please blink both eyes.",
      TURN_LEFT: "Slowly turn your head to your left.",
      TURN_RIGHT: "Slowly turn your head to your right.",
      PROCESSING: "Processing...",
    };
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
    return this;
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback,
      );
    }
    return this;
  }

  _emit(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => {
        try {
          cb(payload);
        } catch (e) {
          console.error(`Error in LivenessSDK listener for '${event}':`, e);
        }
      });
    }
  }

  async load() {
    if (typeof WebAssembly !== "object") {
      this._emit("error", new Error("WebAssembly is not supported in this browser."));
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const callbacks = {
          onReady: () => {
            this._emit("ready");
            resolve();
          },
          onChallengeChanged: (challengeType, distance) => {
            const instruction = this.instructions[challengeType] || "";
            this._emit("challenge", {
              type: challengeType,
              instruction,
              distance,
            });
          },
          onSuccess: (result) => {
            this._emit("success", result);
          },
          onFailure: (error) => {
            this._emit("failure", error);
          },
          onProgress: (progress, rawValue) => {
            this._emit("progress", { progress, rawValue });
          },
        };

        this.engine = new LivenessEngine(callbacks, this.config);
        this.engine.load().catch((err) => {
          this._emit("error", err);
          reject(err);
        });
      } catch (error) {
        this._emit("error", error);
        reject(error);
      }
    });
  }

  async start(videoElement, canvasElement) {
    if (!this.engine) {
      throw new Error("SDK not loaded. Call load() first.");
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this._emit("failure", {
        code: "BROWSER_NOT_SUPPORTED",
        message: "Your browser does not support camera access.",
      });
      return;
    }

    try {
      if (!videoElement.srcObject) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        });
        videoElement.srcObject = stream;

        await new Promise((resolve) => {
          videoElement.onloadedmetadata = () => {
            videoElement.play();
            resolve();
          };
        });
      }

      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      const ctx = canvasElement.getContext("2d");

      this.engine.start(videoElement, ctx);
    } catch (error) {
      this._emit("error", error);
      if (error.name === "NotAllowedError" || error.name === "NotFoundError") {
        this._emit("failure", {
          code: "CAMERA_ACCESS_DENIED",
          message: "Could not access camera. Please check permissions.",
        });
      }
    }
  }

  stop(videoElement) {
    if (this.engine) {
      this.engine.stop();
    }
    if (videoElement && videoElement.srcObject) {
      videoElement.srcObject.getTracks().forEach((track) => track.stop());
      videoElement.srcObject = null;
    }
  }
}
