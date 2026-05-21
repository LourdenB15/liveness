# Liveness SDK

An event-driven JavaScript SDK for browser-based **Active Liveness Detection** and **Face Identity Verification**. This library leverages MediaPipe Face Mesh and TensorFlow.js (MobileNet V2) to provide a complete eKYC-ready frontend solution.

Developed as a Bachelor of Science in Information Technology Capstone Project (2026).

## Key Features

- **Randomized Active Challenges**: Prevents replay attacks by requiring users to perform random actions (Blink, Turn Left, Turn Right) generated at runtime.
- **Identity Enrollment & Verification**: Full biometric flow including face feature extraction and Cosine Similarity matching (>80% threshold).
- **Advanced Anti-Spoofing**:
  - **FFT Moiré Detection**: Detects digital screen interference patterns to block re-broadcast attacks.
  - **Laplacian Texture Analysis**: Identifies low-quality print or digital screen textures.
  - **Depth Variance**: Uses 3D landmarks to differentiate between flat photos/screens and real human faces.
- **Environmental Awareness**: Built-in brightness monitoring and facial occlusion detection for maximum reliability.
- **Secure SaaS Cloud**: Complete management dashboard with **JWT Authentication**, API key management, and real-time webhook notifications.
- **Event-Driven API**: Simple subscription model for real-time UI synchronization.
- **Performance Optimized**: Built-in FPS throttling and hardware-accelerated detection.

## Project Structure

This project is organized as a monorepo:

- **`apps/demo`**: The primary React-based demonstration and playground.
- **`apps/saas-web`**: The SaaS platform frontend dashboard (React + Tailwind).
- **`apps/saas-api`**: The SaaS orchestration and verification backend (Node.js + PostgreSQL/pgvector).
- **`packages/engine`**: Core computer vision logic and mathematical utilities.
- **`packages/sdk`**: The public-facing SDK wrapper for easy integration.

## Quick Start

```javascript
import { LivenessSDK } from "@liveness/sdk";

const sdk = new LivenessSDK({
  challengeTimeout: 10000,
  minBrightness: 50,
  maxFFTPeak: 20.0,
});

sdk.on("challenge", ({ instruction }) => updateUI(instruction));
sdk.on("success", (result) => {
  console.log("Verified!", result.descriptor);
  console.log("Security Metadata:", result.antiSpoofing);
});
sdk.on("error", ({ code, message }) => console.error(`[${code}] ${message}`));

await sdk.load();
await sdk.start(videoElement, canvasElement);
```

## System Architecture & Methodology

### 1. Active Liveness Detection

- **Blink Detection**: Uses **Eye Aspect Ratio (EAR)** with state-machine logic (Open-to-Closed transition).
- **Head Pose Estimation**: Detects yaw and roll using 3D landmark depth ratios.
- **Randomization**: Sessions use unpredictable challenge sequences to mitigate replay risks.

### 2. Passive Anti-Spoofing (3D & Texture)

- **Geometric Depth**: Calculates variance across face landmarks; flat surfaces (photos/screens) are automatically rejected.
- **Moiré Analysis**: Performs **Frequency Domain Analysis (FFT)** on face images to detect the high-frequency pixel grid patterns typical of digital screen spoofs.
- **Occlusion Detection**: Validates landmark density to ensure the face isn't partially covered by hands or masks.

### 3. Identity Matching

Identity verification is performed using **Cosine Similarity** on 1792-dimensional normalized feature vectors extracted via MobileNet V2.

## API Reference

### `new LivenessSDK(config)`

- **`minBrightness`** _(number, default: 50)_: Minimum required average brightness (0-255).
- **`maxFFTPeak`** _(number, default: 20.0)_: Threshold for screen pattern detection.
- **`challengeTimeout`** _(number, default: 5000)_: Max duration (ms) per challenge.
- **`targetFPS`** _(number, default: 30)_: Frame rate limit for detection.
- **`basePath`** _(string)_: Path to model assets.

### Events Reference

| Event       | Payload                             | Trigger                                  |
| :---------- | :---------------------------------- | :--------------------------------------- |
| `ready`     | `void`                              | Models are fully loaded.                 |
| `challenge` | `{ type, instruction, distance }`   | A new challenge starts (with distance hints). |
| `progress`  | `{ progress, rawValue }`            | Real-time feedback for actions.          |
| `success`   | `LivenessResult`                    | All checks passed; vector generated.     |
| `failure`   | `{ code, message }`                 | Challenge failed or spoof detected.      |
| `error`     | `{ code, message }`                 | Critical hardware or system errors.      |

## Integration & Deployment Options

### 1. Managed Cloud Service (Recommended)

Integrate with the **Liveness Cloud** for a production-ready solution. Our managed platform handles secure biometric storage and high-performance matching.

#### Webhook Security
All webhook payloads are signed with a secret key using **HMAC-SHA256**.
- **Header**: `x-liveness-signature`

```javascript
const signature = req.headers["x-liveness-signature"];
const expected = crypto
  .createHmac("sha256", WEBHOOK_SECRET)
  .update(JSON.stringify(req.body))
  .digest("hex");
```

### 2. Custom Backend Integration

If you prefer to maintain your own infrastructure, you can integrate the core SDK with your custom backend.

#### Data Payload Structure
When the SDK's `success` event fires, send the 1792-dimensional descriptor to your server:
```json
{
  "userId": "12345",
  "descriptor": [0.123, -0.456, 0.789, ...],
  "timestamp": 1716336000000,
  "integrity": "hash_value"
}
```

## Development & Internal Setup

### 1. Prerequisites
- **Node.js**: v18 or higher.
- **PostgreSQL**: With the `pgvector` extension installed.

### 2. Running the Project
```bash
# 1. Setup Database
cd apps/saas-api
npm run init-db

# 2. Start Services from root
npm run dev      # Demo App
npm run dev:api  # Cloud API
npm run dev:saas # Cloud Dashboard
```

### 3. Testing & Building
- **Run Tests**: `npm test`
- **Build SDK**: `npm run build:sdk`

## Error Codes

- `POOR_LIGHTING`: Environment is too dark or has excessive glare.
- `SPOOF_DETECTED`: Screen patterns, flat surfaces, or low textures detected.
- `OCCLUSION_DETECTED`: Face is partially covered.
- `CAMERA_ACCESS_DENIED`: Permissions blocked or camera not found.
- `WASM_NOT_SUPPORTED`: Browser missing WebAssembly support.

## License

MIT License - Developed for educational purposes (2026).
