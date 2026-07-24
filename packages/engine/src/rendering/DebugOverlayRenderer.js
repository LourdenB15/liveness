import * as mpFaceMesh from "@mediapipe/face_mesh";

const FACEMESH_TESSELATION =
  mpFaceMesh.FACEMESH_TESSELATION || mpFaceMesh.default?.FACEMESH_TESSELATION;

/**
 * DebugOverlayRenderer handles drawing face mesh overlays onto a HTML Canvas context.
 * (Single Responsibility Principle)
 */
export class DebugOverlayRenderer {
  /**
   * Draw the face mesh tessellation onto the canvas context.
   * @param {CanvasRenderingContext2D|null} canvasCtx
   * @param {Array} landmarksArray
   */
  draw(canvasCtx, landmarksArray) {
    if (
      !canvasCtx ||
      !landmarksArray ||
      landmarksArray.length === 0 ||
      !FACEMESH_TESSELATION
    ) {
      return;
    }

    const canvas = canvasCtx.canvas;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    const landmarks = landmarksArray[0];

    for (const [start, end] of FACEMESH_TESSELATION) {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];
      if (!startPoint || !endPoint) continue;

      canvasCtx.beginPath();
      const startX = (1 - startPoint.x) * canvas.width;
      const startY = startPoint.y * canvas.height;
      const endX = (1 - endPoint.x) * canvas.width;
      const endY = endPoint.y * canvas.height;

      canvasCtx.moveTo(startX, startY);
      canvasCtx.lineTo(endX, endY);
      canvasCtx.strokeStyle = "rgba(0, 255, 0, 0.3)";
      canvasCtx.lineWidth = 1;
      canvasCtx.stroke();
    }
  }

  /**
   * Clear the canvas context.
   * @param {CanvasRenderingContext2D|null} canvasCtx
   */
  clear(canvasCtx) {
    if (canvasCtx && canvasCtx.canvas) {
      canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
    }
  }
}
