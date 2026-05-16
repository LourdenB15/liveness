# Liveness SDK

An event-driven JavaScript SDK for browser-based **Active Liveness Detection** and **Face Identity Verification**. This library leverages MediaPipe Face Mesh and TensorFlow.js (MobileNet V2) to provide a complete eKYC-ready frontend solution.

Developed as a Bachelor of Science in Information Technology Capstone Project (2026).

## Key Features

- **Randomized Active Challenges**: Prevents replay attacks by requiring users to perform random actions (Blink, Turn Left, Turn Right) generated at runtime.
- **Identity Enrollment & Verification**: Full biometric flow including face feature extraction and Cosine Similarity matching (>80% threshold).
- **Robust Blink Detection**: Implements a state-machine based blink detector (Open-to-Closed transition) to eliminate false positives.
- **SaaS Management Dashboard**: Complete admin interface for API key management, user verification logs, and system metrics.
- **Robust Validation**: Implements strict schema validation using Zod across both frontend and backend for data integrity.
- **Performance Optimized**: Built-in FPS throttling (default 30 FPS) to ensure smooth performance and battery efficiency on mobile devices.
- **Framework Agnostic**: Core SDK is written in Vanilla JavaScript, compatible with React, Vue, Angular, Svelte, or plain HTML.
- **Event-Driven API**: Simple subscription model for real-time UI synchronization.

## Project Structure

This project is organized as a monorepo:

- **`apps/demo`**: The primary React-based demonstration and playground.
- **`apps/saas-web`**: The SaaS platform frontend dashboard (React + Tailwind). Includes API key management, user logs, and identity verification metrics.
- **`apps/saas-api`**: The SaaS orchestration and verification backend (Node.js + PostgreSQL/pgvector). Handles secure biometric storage and matching.
- **`packages/engine`**: Core computer vision logic and mathematical utilities.
- **`packages/sdk`**: The public-facing SDK wrapper for easy integration.

## Quick Start

```javascript
import { LivenessSDK } from "@liveness/sdk";

// 1. Initialize with custom config
const sdk = new LivenessSDK({
  challengeTimeout: 10000,
  targetFPS: 30,
});

// 2. Subscribe to events
sdk.on("challenge", ({ instruction }) => updateUI(instruction));
sdk.on("success", ({ descriptor }) => verifyIdentity(descriptor));
sdk.on("failure", (err) => console.error(err.message));

// 3. Start Session
await sdk.load();
await sdk.start(videoElement, canvasElement);
```

## System Architecture & Methodology

### 1. Active Liveness Detection

The system employs **geometric landmarks** to differentiate between a live user and a spoofing attempt.

- **Blink Detection**: Calculates the **Eye Aspect Ratio (EAR)**. A valid blink requires the EAR to exceed a specific "Open" threshold before dropping below a "Closed" threshold.
- **Head Pose Estimation**: Uses **Z-axis depth ratios** of facial landmarks (cheeks vs. chin) to accurately detect head rotation (yaw).
- **Randomization**: The sequence of challenges is randomized for every session to mitigate replay attacks.

### 2. Face Recognition & Feature Extraction

Upon successful liveness verification, the system utilizes a pre-trained MobileNet V2 model via TensorFlow.js to extract a **128-dimensional feature vector** (embedding) from the detected face. This vector is normalized to unit length to ensure consistency.

### 3. Identity Matching Algorithm

Identity verification is performed using **Cosine Similarity**, which measures the cosine of the angle between two non-zero vectors.

- **Similarity Score Calculation**: Computed via the Dot Product of the normalized live vector and the stored enrolled vector.
- **Threshold**:
  - **Score > 0.8**: High-confidence identity confirmation.
  - **Score < 0.6**: Identity mismatch.

## API Reference

### `new LivenessSDK(config)`

- **`headTurnThreshold`** _(number, default: 0.4)_: Sensitivity for head turn detection.
- **`blinkEARThreshold`** _(number, default: 0.25)_: EAR value indicating a closed eye.
- **`challengeTimeout`** _(number, default: 5000)_: Max duration (ms) allowed per challenge.
- **`targetFPS`** _(number, default: 30)_: Limits detection loop frame rate.
- **`minFaceSize`** _(number, default: 0.2)_: Minimum face size relative to frame (0-1).
- **`maxFaceSize`** _(number, default: 0.4)_: Maximum face size relative to frame (0-1).
- **`basePath`** _(string, default: "")_: Base path for model assets (e.g., "/assets").

### Methods

- `load()`: Initializes Machine Learning models.
- `start(video, canvas)`: Requests camera permissions and starts the detection loop.
- `stop(video?)`: Halts detection and releases media stream tracks.
- `on(event, callback)` / `off(event, callback)`: Event subscription management.

## Events Reference

| Event       | Payload                  | Trigger                            |
| :---------- | :----------------------- | :--------------------------------- |
| `ready`     | `void`                   | Models are fully loaded.           |
| `challenge` | `{ type, instruction }`  | A new randomized challenge starts. |
| `progress`  | `{ progress, rawValue }` | Real-time feedback for head turns. |
| `success`   | `{ descriptor }`         | Liveness passed; vector generated. |
| `failure`   | `{ code, message }`      | Challenge failed or face lost.     |
| `error`     | `Error`                  | Critical setup/runtime errors.     |

## Integration & Deployment Options

The Liveness SDK is flexible and can be integrated into your system in two ways:

### 1. Managed Cloud Service (Recommended)

Integrate with the **Liveness Cloud** for a production-ready, zero-maintenance solution. Our managed platform handles secure biometric storage, high-performance matching, and provides a comprehensive management dashboard.

- **Admin Dashboard**: Manage API keys, view verification logs, and monitor system metrics.
- **Secure Infrastructure**: Enterprise-grade security with `pgvector`-backed biometric matching.
- **Simplified Integration**: Use the SDK to capture descriptors and verify them against our managed endpoints.

#### Getting Started with the Cloud

1.  **Access the Dashboard**: Navigate to our [Management Console](#) (Coming Soon).
2.  **Create an Account**: Sign up and verify your organization email.
3.  **Generate API Keys**: Create a new project and generate a `Public Key` (for frontend initialization) and a `Secret Key` (for backend verification).

#### API & Integration Flow

The Liveness Cloud provides a streamlined flow for both user enrollment and recurring verification:

**A. User Enrollment**
Capture the user's initial biometric template to establish their identity.

1.  Initialize the SDK and listen for the `success` event.
2.  Send the `descriptor` to the Cloud Enrollment API.

```javascript
sdk.on("success", async ({ descriptor }) => {
  await fetch("https://api.cloud-placeholder.com/api/liveness/enroll", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": "YOUR_SECRET_KEY",
    },
    body: JSON.stringify({ name: "John Doe", descriptor }),
  });
});
```

**B. Identity Verification**
Compare a live session against existing records.

1.  Perform a liveness session.
2.  Send the resulting `descriptor` to the Cloud Verification API.
3.  The Cloud returns a similarity score and matching result.

```javascript
sdk.on("success", async ({ descriptor }) => {
  const response = await fetch(
    "https://api.cloud-placeholder.com/api/liveness/verify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "YOUR_SECRET_KEY",
      },
      body: JSON.stringify({ descriptor }),
    },
  );
  const { verified, match } = await response.json();
  if (verified) console.log(`Welcome back, ${match.name}!`);
});
```

### 2. Custom Backend Integration

If you have specific compliance requirements or prefer to maintain your own biometric infrastructure, you can integrate the core SDK with your custom backend.

#### Data Payload Structure

When the SDK's `success` event fires, send the 128-dimensional descriptor to your server:

```json
{
  "userId": "12345",
  "descriptor": [0.123, -0.456, 0.789, ...],
  "timestamp": "2026-01-01T12:00:00Z"
}
```

#### Custom Implementation Blueprint

You can use any backend (Node.js, Python, Go, etc.) as long as it supports vector similarity math.

1.  **Storage**: Use a database that supports vector types (e.g., PostgreSQL with `pgvector`, MongoDB with Atlas Vector Search, or Pinecone).
2.  **Comparison**: Use **Cosine Similarity** to compare the live descriptor against the stored enrollment descriptor.
3.  **Security Checklist**:
    - **HTTPS Only**: Biometric data must always be transmitted over encrypted channels.
    - **Signature Verification**: Add a server-side signature to the payload to prevent tampering.
    - **Rate Limiting**: Implement strict rate limiting on your verification endpoints.

## Development & Internal Setup

### 1. Prerequisites

- **Node.js**: v18 or higher.
- **PostgreSQL**: With the `pgvector` extension installed (for platform developers).

### 2. Demo Application

The primary demonstration is built with **React 19** and **Tailwind CSS**, located in `apps/demo`.

```bash
# From root
npm run dev
```

### 3. Platform Development (Internal)

The source code for the managed SaaS platform is located in `apps/saas-web` and `apps/saas-api`. These are intended for internal development and contributions to the Liveness Cloud infrastructure.

```bash
# 1. Setup Database (Requires PostgreSQL + pgvector)
cd apps/saas-api
npm run init-db

# 2. Start API and Web Dashboard from root
npm run dev:api
npm run dev:saas
```

### 4. Vanilla JS Implementation

Demonstrates SDK interoperability without any frontend framework.

- Run `npm run dev`
- Visit `http://localhost:5173/demo-vanilla.html`

### 5. Testing & Validation

The core algorithms of the system are rigorously tested using **Vitest** in `packages/engine`.

- **Run Tests**: `npm test`

### 6. SDK Distribution

To distribute the Liveness SDK as a standalone library:

- **Build Command**: `npm run build:sdk`
- **Output**: Generates a `packages/sdk/dist/` directory containing the bundled SDK and type definitions.

## Error Codes

- `FACE_NOT_FOUND`: No face detected in frame.
- `CHALLENGE_TIMEOUT`: User failed to complete the action in time.
- `CAMERA_ACCESS_DENIED`: Camera permissions blocked by user or browser.
- `MODEL_LOAD_FAILED`: CDN connection or model initialization error.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (Developed for educational purposes as a Capstone Project 2026).
