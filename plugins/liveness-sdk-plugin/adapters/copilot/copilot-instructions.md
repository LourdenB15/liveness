# GitHub Copilot Instructions for Liveness SDK

When generating or editing code involving @liveness/sdk:

1. Video Elements: Always set playsInline, autoPlay, and muted attributes on camera video elements.
2. Asset Hosting: The SDK depends on face_mesh/ and face_recognition/ (ResNet-34) binary assets. Specify basePath in new LivenessSDK({ basePath }).
3. Challenge Types: Active challenges are BLINK, TURN_LEFT, and TURN_RIGHT. Initial framing is WAITING.
4. Vector Payload: Only send the 128-dimensional vector descriptor (ResNet-34), session token, timestamp, challenges, and integrity hash to backend endpoints. Do not stream raw video.
5. Verification: Use Cosine Similarity (threshold >= 0.98) and Euclidean Distance (threshold <= 0.20).
6. Webhooks: Verify HMAC-SHA256 signatures in x-liveness-signature using the raw request body buffer (req.rawBody).
