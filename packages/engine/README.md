# @liveness/engine

Computer vision and mathematical utilities for active liveness detection. This package uses MediaPipe Face Mesh and TensorFlow.js for face landmark and pose tracking.

## Installation

```bash
npm install @liveness/engine
```

## Features

- 3D facial landmark detection with MediaPipe.
- Eye aspect ratio (EAR), head pose estimation (yaw and pitch), and cosine similarity matching.
- Configurable detection thresholds and timeouts.

## Usage

This package is intended for use within `@liveness/sdk` or custom liveness detection setups.

```javascript
import { LivenessEngine } from "@liveness/engine";

const engine = new LivenessEngine({
  onSuccess: (data) => console.log("Liveness verified", data),
  onFailure: (error) => console.error("Verification failed", error),
});
```

## License

MIT
