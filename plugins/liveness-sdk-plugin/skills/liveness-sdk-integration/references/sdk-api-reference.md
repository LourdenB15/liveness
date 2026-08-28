# Liveness SDK API Reference

Complete reference for `@liveness/sdk` and `@liveness/engine` interfaces, constructors, methods, events, and error codes based directly on `packages/sdk` and `packages/engine`.

---

## 1. Class: LivenessSDK

Source: `packages/sdk/src/LivenessSDK.js`
Types: `packages/sdk/index.d.ts`

```typescript
import { LivenessSDK } from "@liveness/sdk";

const sdk = new LivenessSDK(config?: LivenessConfig);
```

### Constructor Configuration (`LivenessConfig`)

| Option              | Type       | Default in Engine | Description                                                                                    |
| :------------------ | :--------- | :---------------- | :--------------------------------------------------------------------------------------------- |
| `basePath`          | `string`   | `""`              | Base path or URL where `face_mesh/` and `mobilenet-v2/` directories are served.                |
| `challengeTimeout`  | `number`   | `5000`            | Maximum time allowed (in milliseconds) for the user to complete each challenge.                |
| `blinkEARThreshold` | `number`   | `0.25`            | Eye Aspect Ratio threshold for detecting blinks.                                               |
| `headTurnThreshold` | `number`   | `0.4`             | Normalized yaw ratio threshold required to validate `TURN_LEFT` and `TURN_RIGHT`.              |
| `minFaceSize`       | `number`   | `0.3`             | Minimum face bounding box height ratio relative to frame.                                      |
| `maxFaceSize`       | `number`   | `0.6`             | Maximum face bounding box height ratio relative to frame.                                      |
| `minBrightness`     | `number`   | `-0.8`            | Minimum normalized tensor mean brightness. Below this triggers `POOR_LIGHTING`.                |
| `maxBrightness`     | `number`   | `0.9`             | Maximum normalized tensor mean brightness. Above this triggers `POOR_LIGHTING` (glare).        |
| `targetFPS`         | `number`   | `30`              | Target frame evaluation rate for the video processing loop.                                    |
| `sessionToken`      | `string`   | `null`            | Unique session identifier for replay protection. Defaults to `"local-session"`.                |
| `challenges`        | `string[]` | `null`            | Array of challenge names. Default sequence: `["WAITING", "BLINK", "TURN_LEFT", "TURN_RIGHT"]`. |
| `instructions`      | `object`   | `{...}`           | Custom text overrides for UI challenge prompts.                                                |

#### Default `instructions` in SDK

```javascript
{
  WAITING: "Please position your face in the center of the frame.",
  BLINK: "Please blink both eyes.",
  TURN_LEFT: "Slowly turn your head to your left.",
  TURN_RIGHT: "Slowly turn your head to your right.",
  PROCESSING: "Processing...",
}
```

---

## 2. SDK Methods

### `async load(): Promise<void>`

Checks browser WebAssembly and WebGL support, initializes `LivenessEngine`, and loads MediaPipe Face Mesh and MobileNet V2 graph models.

### `async start(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement, options?: Partial<LivenessConfig>): Promise<void>`

Initializes the webcam stream (if `videoElement.srcObject` is not attached) with `facingMode: "user"` and ideal resolution `1280x720`, synchronizes canvas dimensions to the video, and starts the detection loop.

### `stop(videoElement?: HTMLVideoElement): void`

Stops the internal detection loop, clears the canvas, and terminates all active media stream tracks on `videoElement.srcObject`.

### `updateConfig(newConfig?: Partial<LivenessConfig>): this`

Updates runtime configuration in `LivenessSDK` and `LivenessEngine`.

### `on(event: LivenessEvent, callback: Function): this`

Subscribes to an event emitted by the SDK.

### `off(event: string, callback: Function): this`

Unsubscribes an event listener.

---

## 3. Events & Payloads

### `ready`

Emitted when model loading completes.

```typescript
sdk.on("ready", () => void);
```

### `challenge`

Emitted when a new challenge begins.

```typescript
sdk.on("challenge", (payload: {
  type: string;
  instruction: string;
}) => void);
```

### `progress`

Emitted per frame with completion progress and raw feature value.

```typescript
sdk.on("progress", (payload: {
  progress: number;
  rawValue: any;
}) => void);
```

### `success`

Emitted when all challenges pass and the 1792-d biometric descriptor is extracted.

```typescript
sdk.on("success", (result: {
  descriptor: number[];
  sessionToken: string;
  timestamp: number;
  challenges: string[];
  integrity: string;
}) => void);
```

### `failure` and `error`

Emitted upon challenge failure, timeout, or environment error.

```typescript
sdk.on("failure", (error: { code: string; message: string }) => void);
sdk.on("error", (error: { code: string; message: string }) => void);
```

---

## 4. Engine & SDK Error Codes

| Code                    | Emitted By                                     | Cause                                                     |
| :---------------------- | :--------------------------------------------- | :-------------------------------------------------------- |
| `WASM_NOT_SUPPORTED`    | `LivenessSDK.load()`                           | `typeof WebAssembly !== "object"`                         |
| `WEBGL_NOT_SUPPORTED`   | `LivenessSDK.load()`                           | `!window.WebGLRenderingContext`                           |
| `MODEL_LOAD_FAILED`     | `LivenessSDK.load()` / `LivenessEngine.load()` | Failed to fetch WASM or graph model                       |
| `INITIALIZATION_FAILED` | `LivenessSDK.load()`                           | Exception during engine instantiation                     |
| `BROWSER_NOT_SUPPORTED` | `LivenessSDK.start()`                          | Missing `navigator.mediaDevices.getUserMedia`             |
| `CAMERA_ACCESS_DENIED`  | `LivenessSDK.start()`                          | User denied webcam access                                 |
| `CAMERA_NOT_FOUND`      | `LivenessSDK.start()`                          | No webcam hardware found                                  |
| `CAMERA_ERROR`          | `LivenessSDK.start()`                          | General webcam acquisition failure                        |
| `FACE_NOT_FOUND`        | `LivenessEngine`                               | No face landmarks detected within `challengeTimeout`      |
| `CHALLENGE_TIMEOUT`     | `LivenessEngine`                               | User did not complete challenge within `challengeTimeout` |
| `POOR_LIGHTING`         | `LivenessEngine`                               | Frame brightness out of `[minBrightness, maxBrightness]`  |
| `OCCLUSION_DETECTED`    | `LivenessEngine`                               | Eye landmark distance < 0.01                              |
| `RECOGNITION_FAILED`    | `LivenessEngine`                               | Failure during MobileNet V2 tensor execution              |

---

## 5. Core Engine Utilities

Source: `packages/engine/src/utils.js`

- `calculateEAR(landmarks, side)`: Computes Eye Aspect Ratio for `"left"` or `"right"` eye.
- `calculateHeadTurnV2(landmarks)`: Computes 2D/3D hybrid head yaw ratio using cheek and nose landmarks.
- `calculateFaceSize(landmarks)`: Computes bounding box height ratio across face landmarks.
- `calculateBrightness(imageTensor)`: Computes mean brightness of face image tensor.
- `checkOcclusion(landmarks)`: Checks euclidean distance between eye landmarks.
- `generateIntegrityHash(descriptor, sessionToken, timestamp)`: Generates checksum string.
- `calculateCosineSimilarity(vecA, vecB)`: Computes dot product across normalized 1792-d vectors.
