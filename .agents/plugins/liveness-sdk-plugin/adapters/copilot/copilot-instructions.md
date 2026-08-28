# GitHub Copilot Instructions for Liveness SDK

When generating or editing code involving @liveness/sdk:

1. Video Elements: Always set playsInline, autoPlay, and muted attributes on camera video elements.
2. Asset Hosting: The SDK depends on face_mesh/ and mobilenet-v2/ binary assets. Specify basePath in new LivenessSDK({ basePath }).
3. Challenge Types: Active challenges are BLINK, TURN_LEFT, and TURN_RIGHT. Initial framing is WAITING.
4. Vector Payload: Only send the 1792-dimensional vector descriptor, session token, timestamp, challenges, and integrity hash to backend endpoints. Do not stream raw video.
5. Verification: Use Cosine Similarity with a threshold of >= 0.80.
6. Webhooks: Verify HMAC-SHA256 signatures in x-liveness-signature using the raw request body buffer (req.rawBody).
