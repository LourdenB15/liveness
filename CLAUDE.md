# Liveness SDK - Claude Agent Instructions

Add this file as `CLAUDE.md` to any project integrating `@liveness/sdk`.

---

## Guidelines for Claude Code

When implementing `@liveness/sdk` in this project:

1. Camera Elements:
   - Video elements must include `playsInline`, `autoPlay`, and `muted`.
   - Request `facingMode: "user"` with ideal dimensions `1280x720`.
   - Call `sdk.stop(videoElement)` and stop stream tracks on unmount.

2. Static Model Assets:
   - MediaPipe Face Mesh (`face_mesh/`) and MobileNet V2 (`mobilenet-v2/`) must be hosted in the public assets directory.
   - Configure `basePath` in `new LivenessSDK({ basePath })`.

3. Active Challenge Pool:
   - Supported active challenges: `BLINK`, `TURN_LEFT`, `TURN_RIGHT`.
   - Initial positioning phase: `WAITING`.

4. Biometric Descriptor and Privacy:
   - Never send raw camera streams to the server.
   - Transmit only the 1792-dimensional numerical vector descriptor, session token, timestamp, challenges, and integrity hash.
   - Biometric matching threshold: Cosine similarity >= 0.80.

5. Webhook Security:
   - Verify incoming webhook signatures (`x-liveness-signature`) with HMAC-SHA256 against the raw request body buffer (`req.rawBody`).
