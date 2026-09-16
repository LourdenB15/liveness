# @liveness/sdk

JavaScript SDK for browser-based active liveness detection and face verification.

## Installation

```bash
npm install @liveness/sdk
```

## Quick start

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

- Runtime challenges (blink, turn left, turn right).
- Face identity feature extraction and vector matching.

## AI agent integration

To configure agent rules and skills in your workspace:

```bash
# Automated cross-agent setup
npx @liveness/sdk setup-agents

# Or copy model assets to your public directory
node ./node_modules/@liveness/engine/scripts/copy-assets.js ./public
```

Agent rules and skill definitions are located in `plugins/liveness-sdk-plugin`.

## License

MIT
