# @liveness/sdk

An event-driven JavaScript SDK for browser-based **Active Liveness Detection** and **Face Identity Verification**.

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

## Features

- **Randomized Active Challenges**: Blink, Turn Left, Turn Right.
- **Identity Verification**: Face identity feature extraction and matching.

## AI Agent Integration (Claude, Antigravity, Cursor)

To help AI coding agents implement and configure this SDK in your projects:

```bash
# Automated cross-agent setup
npx @liveness/sdk setup-agents

# Or copy model assets to your public directory
node ./node_modules/@liveness/engine/scripts/copy-assets.js ./public
```

Agent rules and skill definitions are available in the repository `plugins/liveness-sdk-plugin`.

## License

MIT
