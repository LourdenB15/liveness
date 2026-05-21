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
      this._emit("error", {
        code: "WASM_NOT_SUPPORTED",
        message: "WebAssembly is not supported in this browser. Liveness detection requires WASM."
      });
      return;
    }

    if (!window.WebGLRenderingContext) {
      this._emit("error", {
        code: "WEBGL_NOT_SUPPORTED",
        message: "WebGL is not supported. Please enable hardware acceleration."
      });
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
          const errorPayload = {
            code: "MODEL_LOAD_FAILED",
            message: `Failed to load AI models: ${err.message}`
          };
          this._emit("error", errorPayload);
          reject(errorPayload);
        });
      } catch (error) {
        const errorPayload = {
          code: "INITIALIZATION_FAILED",
          message: error.message
        };
        this._emit("error", errorPayload);
        reject(errorPayload);
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
        message: "Your browser does not support camera access or the secure context (HTTPS) requirements.",
      });
      return;
    }

    try {
      if (!videoElement.srcObject) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 }, 
            height: { ideal: 720 }, 
            facingMode: "user" 
          },
          audio: false,
        });
        videoElement.srcObject = stream;

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Camera stream timed out."));
          }, 10000);

          videoElement.onloadedmetadata = () => {
            clearTimeout(timeout);
            videoElement.play().then(resolve).catch(reject);
          };
        });
      }

      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      const ctx = canvasElement.getContext("2d");

      this.engine.start(videoElement, ctx);
    } catch (error) {
      let errorPayload = {
        code: "CAMERA_ERROR",
        message: error.message
      };

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorPayload = {
          code: "CAMERA_ACCESS_DENIED",
          message: "Camera access was denied by the user. Please update browser permissions.",
        };
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorPayload = {
          code: "CAMERA_NOT_FOUND",
          message: "No camera device was found on this system.",
        };
      }

      this._emit("error", errorPayload);
      this._emit("failure", errorPayload);
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
