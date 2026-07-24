import * as mpFaceMesh from "@mediapipe/face_mesh";

const FaceMesh = mpFaceMesh.FaceMesh || mpFaceMesh.default?.FaceMesh;

/**
 * MediaPipeFaceDetector wraps the MediaPipe FaceMesh model.
 * Demonstrates Dependency Inversion Principle (decouples engine core from raw MediaPipe API).
 */
export class MediaPipeFaceDetector {
  #faceMesh = null;
  #onResultsCallback = null;

  async load(basePath) {
    const cleanBasePath = basePath.endsWith("/")
      ? basePath.slice(0, -1)
      : basePath;

    this.#faceMesh = new FaceMesh({
      locateFile: (file) => `${cleanBasePath}/face_mesh/${file}`,
    });

    this.#faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    this.#faceMesh.onResults((results) => {
      if (this.#onResultsCallback) {
        this.#onResultsCallback(results);
      }
    });
  }

  onResults(callback) {
    this.#onResultsCallback = callback;
  }

  async send(videoElement) {
    if (this.#faceMesh) {
      await this.#faceMesh.send({ image: videoElement });
    }
  }
}
