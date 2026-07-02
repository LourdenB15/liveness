# Liveness SDK

An event-driven JavaScript SDK for browser-based **Active Liveness Detection** and **Face Identity Verification**. This library leverages MediaPipe Face Mesh and TensorFlow.js (MobileNet V2) to provide a complete eKYC-ready frontend solution.

> **Note**: For the full interactive documentation, integration guides, and real-time API reference, please visit our **Documentation Portal** at http://localhost:5173/docs.

## Key Features

- **Randomized Active Challenges**: Prevents replay attacks by requiring users to perform random actions (Blink, Turn Left, Turn Right) generated at runtime.
- **Identity Enrollment & Verification**: Full biometric flow including face feature extraction and Cosine Similarity matching (>80% threshold).
- **Advanced Anti-Spoofing**:
  - **FFT Moire Detection**: Detects digital screen sub-pixel patterns.
  - **Laplacian Texture Analysis**: Identifies low-quality print or digital screen textures.
  - **Depth Variance**: Uses 3D landmarks to differentiate between flat photos and real human faces.
- **Secure SaaS Cloud**: Complete management dashboard with JWT Authentication, API key management, and real-time webhook notifications.

## Project Structure

This project is organized as a monorepo:

- `apps/demo`: The primary React-based demonstration and playground.
- `apps/saas-web`: The SaaS platform frontend dashboard and documentation portal.
- `apps/saas-api`: The SaaS orchestration and verification backend.
- `packages/engine`: Core computer vision logic and mathematical utilities.
- `packages/sdk`: The public-facing SDK wrapper for easy integration.

## Installation

```bash
npm install @liveness/sdk
```

## Quick Start

```javascript
import { LivenessSDK } from "@liveness/sdk";

const sdk = new LivenessSDK({
  challengeTimeout: 10000,
  minBrightness: 50,
});

sdk.on("challenge", ({ instruction }) => updateUI(instruction));
sdk.on("success", (result) => {
  console.log("Verified!", result.descriptor);
  console.log("Security Metadata:", result.antiSpoofing);
});

await sdk.load();
await sdk.start(videoElement, canvasElement);
```

## Local Development

### Prerequisites

- **Node.js**: v18 or higher.
- **PostgreSQL**: With the `pgvector` extension installed.

### Initial Setup

1. Install dependencies from the root directory:
   ```bash
   npm install
   ```
2. Initialize the database:
   ```bash
   cd apps/saas-api
   npm run init-db
   ```

### Running the Project

Use the following commands from the root directory to start the services:

- **Start Demo App**: `npm run dev`
- **Start SaaS API**: `npm run dev:api`
- **Start SaaS Dashboard**: `npm run dev:saas`

## Testing and Building

- **Run Tests**: `npm test`
- **Build SDK**: `npm run build:sdk`

## API Reference

### `new LivenessSDK(config)`

- `minBrightness` (number, default: 50): Minimum required brightness.
- `maxFFTPeak` (number, default: 20.0): Threshold for screen pattern detection.
- `challengeTimeout` (number, default: 5000): Max duration per challenge.

### Events Reference

- `ready`: Models are fully loaded.
- `challenge`: A new challenge starts.
- `success`: All checks passed; biometric vector generated.
- `failure`: Challenge failed or spoof detected.

## Webhook Security

All webhook payloads are signed with **HMAC-SHA256**. To prevent formatting or key-ordering issues, verify the `x-liveness-signature` header using the raw request body buffer:

```javascript
const expected = crypto
  .createHmac("sha256", WEBHOOK_SECRET)
  .update(req.rawBody) // Use raw request body buffer
  .digest("hex");
```

To capture `req.rawBody` in an Express application:

```javascript
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
```

## Error Codes

- `POOR_LIGHTING`: Environment is too dark or has excessive glare.
- `SPOOF_DETECTED`: Screen patterns or flat surfaces detected.
- `OCCLUSION_DETECTED`: Face is partially covered.
