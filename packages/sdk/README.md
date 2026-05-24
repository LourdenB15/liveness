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
  minBrightness: 50,
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
- **Advanced Anti-Spoofing**: FFT Moire Detection, Laplacian Texture Analysis, Depth Variance.
- **Identity Verification**: Face identity feature extraction and matching.

## License

MIT
