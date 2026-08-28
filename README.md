# Liveness SDK

An event-driven JavaScript SDK for browser-based **Active Liveness Detection** and **Face Identity Verification**. This library leverages MediaPipe Face Mesh and TensorFlow.js (ResNet-34 FaceRecognitionNet) to provide a complete eKYC-ready frontend solution.

> **Note**: For the full interactive documentation, integration guides, and real-time API reference, please visit our **Documentation Portal** at http://localhost:5173/docs.

## Key Features

- **Randomized Active Challenges**: Prevents replay attacks by requiring users to perform random actions (Blink, Turn Left, Turn Right) generated at runtime.
- **Identity Enrollment & Verification**: Full biometric flow including face feature extraction with Cosine Similarity and Euclidean Distance matching.
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
  minBrightness: -0.8,
});

sdk.on("challenge", ({ instruction }) => updateUI(instruction));
sdk.on("success", (result) => {
  console.log("Verified!", result.descriptor);
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

- `minBrightness` (number, default: -0.8): Minimum required normalized tensor brightness [-1.0, 1.0].
- `challengeTimeout` (number, default: 5000): Max duration per challenge.

### Events Reference

- `ready`: Models are fully loaded.
- `challenge`: A new challenge starts.
- `success`: All checks passed; biometric vector generated.
- `failure`: Challenge failed or recognition error.

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
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);
```

## Error Codes

- `POOR_LIGHTING`: Environment is too dark or has excessive glare.
- `OCCLUSION_DETECTED`: Face is partially covered.
- `CHALLENGE_TIMEOUT`: User exceeded maximum allowed time for an active challenge.
- `FACE_NOT_FOUND`: No face detected in camera viewport.
- `CAMERA_ACCESS_DENIED`: Camera permission was blocked by user.

## AI Agent Skills and Rules (Claude, Antigravity, Cursor, Windsurf)

This repository includes a multi-agent skills plugin (`plugins/liveness-sdk-plugin`) that enables AI coding assistants (Claude Code, Antigravity / Gemini CLI, Cursor, Windsurf, GitHub Copilot) to implement, configure, and troubleshoot the Liveness SDK with architectural fidelity.

### Automated Setup

To automatically configure agent rules and skills in the current project or any target directory:

```bash
# Set up all agents in the current workspace
npm run setup:agents

# Set up for a specific agent in an external project
node scripts/setup-agent-skills.js /path/to/target-project --agent=claude
node scripts/setup-agent-skills.js /path/to/target-project --agent=cursor
node scripts/setup-agent-skills.js /path/to/target-project --agent=antigravity
```

### Manual Installation by Agent

#### 1. Claude Code

Copy `plugins/liveness-sdk-plugin/adapters/claude/CLAUDE.md` to your project root as `CLAUDE.md`.

#### 2. Antigravity / Gemini CLI

- Project workspace: Copy `plugins/liveness-sdk-plugin` to `.agents/plugins/liveness-sdk-plugin/`
- Global (all projects): Copy `plugins/liveness-sdk-plugin` to `~/.gemini/config/plugins/liveness-sdk-plugin/`

#### 3. Cursor

Copy `plugins/liveness-sdk-plugin/adapters/cursor/liveness-sdk.mdc` to `.cursor/rules/liveness-sdk.mdc` and `.cursorrules`.

#### 4. Windsurf (Codeium)

Copy `plugins/liveness-sdk-plugin/adapters/windsurf/.windsurfrules` to `.windsurfrules`.

#### 5. GitHub Copilot

Copy `plugins/liveness-sdk-plugin/adapters/copilot/copilot-instructions.md` to `.github/copilot-instructions.md`.

#### 6. Universal Agents (OpenHands, Codex, Aider)

Copy `plugins/liveness-sdk-plugin/adapters/generic/AGENTS.md` to your project root as `AGENTS.md`.

### Copying Static Model Assets

The SDK requires `face_mesh/` and `face_recognition/` (ResNet-34) binary assets in your public directory:

```bash
node plugins/liveness-sdk-plugin/skills/liveness-sdk-integration/scripts/copy-liveness-assets.js ./public
```
