# @liveness/engine

Core computer vision logic and mathematical utilities for Active Liveness Detection. This package leverages MediaPipe Face Mesh and TensorFlow.js to provide low-level detection capabilities.

## Installation

```bash
npm install @liveness/engine
```

## Features

- **Face Mesh Integration**: Uses MediaPipe for accurate 3D facial landmark detection.
- **Mathematical Utilities**: EAR (Eye Aspect Ratio), Laplacian Variance (Texture Analysis), Depth Variance, and FFT (Moire Detection).
- **Configuration Driven**: Highly customizable detection parameters.

## Usage

This package is intended for use within the `@liveness/sdk` or for custom liveness detection implementations.

```javascript
import { LivenessEngine } from '@liveness/engine';

const engine = new LivenessEngine({
  onSuccess: (data) => console.log('Liveness verified', data),
  onFailure: (error) => console.error('Verification failed', error)
});
```

## License

MIT
