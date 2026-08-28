# Liveness SDK Troubleshooting and Edge Cases

Guide to diagnosing and resolving common integration challenges, browser quirks, and environment issues.

---

## 1. Camera and Video Stream Issues

### A. Video Feed Blocked on Mobile / iOS Safari

- Cause: Mobile Safari requires inline playback permissions for video streams.
- Fix: Ensure the video element has playsInline, autoPlay, and muted attributes:
  ```html
  <video id="liveness-video" playsinline autoplay muted></video>
  ```
  In React:
  ```jsx
  <video ref={videoRef} playsInline autoPlay muted />
  ```

### B. CAMERA_ACCESS_DENIED or BROWSER_NOT_SUPPORTED

- Cause: User denied camera permissions, or the site is served over an insecure context (HTTP without localhost).
- Fix:
  - WebRTC (navigator.mediaDevices.getUserMedia) requires a Secure Context (HTTPS) or http://localhost.
  - Verify browser permissions and guide user to permit camera access in site settings.

---

## 2. Content Security Policy (CSP) Configuration

Because @liveness/sdk executes SIMD WebAssembly and WebGL shaders on client worker threads, strict CSP headers may block model execution unless properly configured.

### Recommended CSP Directives:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval';
  worker-src 'self' blob:;
  connect-src 'self' https://cdn.example.com;
  img-src 'self' data: blob:;
```

- wasm-unsafe-eval: Permits WebAssembly execution.
- worker-src blob: Permits web worker threads to initialize from memory blobs.

---

## 3. Lighting and Occlusion Tuning

### A. Frequent POOR_LIGHTING Failures

- The SDK computes normalized mean tensor brightness across the face region (values ranging from -1.0 to 1.0).
- Default thresholds: `minBrightness: -0.8`, `maxBrightness: 0.9`.
- If testing in darker or high-contrast environments, adjust configuration during initialization:
  ```javascript
  const sdk = new LivenessSDK({
    minBrightness: -0.9,
    maxBrightness: 0.95,
  });
  ```

### B. OCCLUSION_DETECTED

- Occurs when eye spacing or key facial landmarks are obscured.
- Prompt the user to remove glasses, masks, or headwear covering the eye or cheek regions.

---

## 4. Canvas Coordinate Alignment

To prevent face mesh overlays from appearing misaligned:

- Synchronize canvas pixel dimensions directly to video.videoWidth and video.videoHeight:
  ```javascript
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  ```
- Use absolute positioning with identical object-fit and transform rules for both video and canvas elements.

---

## 5. Cleaning Up Hardware Resources

Failing to stop video tracks when navigating away will keep the camera hardware active.

Always perform complete cleanup:

```javascript
function cleanup() {
  sdk.stop(videoElement);
  if (videoElement.srcObject) {
    videoElement.srcObject.getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null;
  }
}
```
