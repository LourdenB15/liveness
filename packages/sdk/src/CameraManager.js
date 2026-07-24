/**
 * CameraManager handles browser media stream initialization and HTML video element setup.
 * (Single Responsibility Principle)
 */
export class CameraManager {
  /**
   * Check if browser camera API is supported.
   * @returns {boolean}
   */
  isSupported() {
    return Boolean(
      typeof navigator !== "undefined" &&
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia,
    );
  }

  /**
   * Request camera stream and bind to HTML video element.
   * @param {HTMLVideoElement} videoElement
   * @returns {Promise<MediaStream>}
   */
  async startStream(videoElement) {
    if (!this.isSupported()) {
      const err = new Error(
        "Your browser does not support camera access or the secure context (HTTPS) requirements.",
      );
      err.name = "BROWSER_NOT_SUPPORTED";
      throw err;
    }

    if (!videoElement.srcObject) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
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

    return videoElement.srcObject;
  }

  /**
   * Stop video stream tracks.
   * @param {HTMLVideoElement} videoElement
   */
  stopStream(videoElement) {
    if (videoElement && videoElement.srcObject) {
      videoElement.srcObject.getTracks().forEach((track) => track.stop());
      videoElement.srcObject = null;
    }
  }
}
