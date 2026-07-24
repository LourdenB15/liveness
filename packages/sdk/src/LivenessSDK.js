// src/sdk/LivenessSDK.js
import { LivenessEngine } from "@liveness/engine";
import { CameraManager } from "./CameraManager";

const DEFAULT_INSTRUCTIONS = {
  WAITING: "Please position your face in the center of the frame.",
  BLINK: "Please blink both eyes.",
  TURN_LEFT: "Slowly turn your head to your left.",
  TURN_RIGHT: "Slowly turn your head to your right.",
  PROCESSING: "Processing...",
};

/**
 * LivenessSDK provides a clean facade & event-driven client API for browser liveness detection.
 * Refactored with SOLID principles:
 * - SRP: Delegates camera hardware access to CameraManager and core logic to LivenessEngine.
 * - DIP: Accepts optional engine instance / factory and cameraManager via config for dependency injection.
 */
export class LivenessSDK {
  #cameraManager;
  #engineFactory;

  constructor(config = {}) {
    this.config = config;
    this.engine = config.engine || null;
    this.#cameraManager = config.cameraManager || new CameraManager();
    this.#engineFactory =
      config.engineFactory ||
      ((callbacks, cfg) => new LivenessEngine(callbacks, cfg));

    this.listeners = {
      ready: [],
      challenge: [],
      progress: [],
      success: [],
      failure: [],
      error: [],
    };

    this.instructions = {
      ...DEFAULT_INSTRUCTIONS,
      ...config.instructions,
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
        message:
          "WebAssembly is not supported in this browser. Liveness detection requires WASM.",
      });
      return;
    }

    if (!window.WebGLRenderingContext) {
      this._emit("error", {
        code: "WEBGL_NOT_SUPPORTED",
        message:
          "WebGL is not supported. Please enable hardware acceleration.",
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

        if (!this.engine) {
          this.engine = this.#engineFactory(callbacks, this.config);
        }

        this.engine.load().catch((err) => {
          const errorPayload = {
            code: "MODEL_LOAD_FAILED",
            message: `Failed to load AI models: ${err.message}`,
          };
          this._emit("error", errorPayload);
          reject(errorPayload);
        });
      } catch (error) {
        const errorPayload = {
          code: "INITIALIZATION_FAILED",
          message: error.message,
        };
        this._emit("error", errorPayload);
        reject(errorPayload);
      }
    });
  }

  updateConfig(newConfig = {}) {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.instructions) {
      this.instructions = { ...this.instructions, ...newConfig.instructions };
    }
    if (this.engine) {
      this.engine.updateConfig(newConfig);
    }
    return this;
  }

  async start(videoElement, canvasElement, options = {}) {
    if (!this.engine) {
      throw new Error("SDK not loaded. Call load() first.");
    }

    if (
      options &&
      typeof options === "object" &&
      Object.keys(options).length > 0
    ) {
      this.updateConfig(options);
    } else if (this.engine) {
      this.engine.updateConfig(this.config);
    }

    try {
      await this.#cameraManager.startStream(videoElement);

      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      const ctx = canvasElement.getContext("2d");

      this.engine.start(videoElement, ctx);
    } catch (error) {
      let errorPayload = {
        code: "CAMERA_ERROR",
        message: error.message,
      };

      if (error.name === "BROWSER_NOT_SUPPORTED") {
        errorPayload = {
          code: "BROWSER_NOT_SUPPORTED",
          message: error.message,
        };
      } else if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        errorPayload = {
          code: "CAMERA_ACCESS_DENIED",
          message:
            "Camera access was denied by the user. Please update browser permissions.",
        };
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
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
    this.#cameraManager.stopStream(videoElement);
  }
}
