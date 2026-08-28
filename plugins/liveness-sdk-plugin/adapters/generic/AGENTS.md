# Universal AI Agent Rules for Liveness SDK

When implementing or modifying features involving @liveness/sdk and biometric face verification, all AI agents must adhere to the following rules:

1. Video and Camera:
   - Always include playsInline, autoPlay, and muted attributes on video elements.
   - Always call sdk.stop(videoElement) and stop all tracks on videoElement.srcObject when unmounting.

2. Static Model Assets:
   - The SDK requires MediaPipe Face Mesh (face_mesh/) and MobileNet V2 (mobilenet-v2/) binary assets.
   - Configure basePath in new LivenessSDK({ basePath }) or host assets in public/.

3. Active Challenge Pool:
   - Supported active challenges: BLINK, TURN_LEFT, TURN_RIGHT.
   - Initial positioning phase: WAITING.

4. Privacy and Biometrics:
   - Liveness checks and feature extraction execute 100% on the client.
   - Never send raw camera streams to the server. Send only the 1792-dimensional numerical vector descriptor, session token, timestamp, challenges, and integrity hash.
   - Cosine similarity threshold >= 0.80.

5. Webhooks:
   - Verify HMAC-SHA256 signatures in x-liveness-signature against the raw body buffer (req.rawBody).
