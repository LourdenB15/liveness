# Liveness Backend API and Webhook Verification Reference

This document provides specifications for the Liveness Cloud REST API and instructions for securing incoming webhooks.

---

## 1. Cloud REST API Specifications

Base URL: `https://<your-domain-or-saas-host>/api/liveness` (e.g. `http://localhost:3000/api/liveness`)

All requests require the `x-api-key` header with a valid API key.

```http
x-api-key: your_live_api_key_here
Content-Type: application/json
```

---

### A. Enroll Biometric Identity (POST /enroll)

Enrolls a user's 128-dimensional face descriptor as an enrolled identity.

#### Request Body

```json
{
  "name": "John Doe",
  "descriptor": [0.0123, -0.0456, ...],
  "sessionToken": "session-uuid-12345",
  "timestamp": 1716336000000,
  "challenges": ["WAITING", "BLINK", "TURN_LEFT", "TURN_RIGHT"],
  "integrity": "9b3c4...sha256"
}
```

#### Response (201 Created)

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "John Doe",
  "createdAt": "2026-08-28T10:00:00.000Z"
}
```

---

### B. 1:N Identity Verification (POST /verify)

Compares a fresh liveness vector against all enrolled identities in the tenant.

#### Request Body

```json
{
  "descriptor": [0.0123, -0.0456, ...],
  "sessionToken": "session-uuid-12345",
  "timestamp": 1716336000000,
  "challenges": ["WAITING", "BLINK", "TURN_LEFT", "TURN_RIGHT"],
  "integrity": "9b3c4...sha256",
  "threshold": 0.95
}
```

#### Response (200 OK)

```json
{
  "verified": true,
  "status": "SUCCESS",
  "match": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "John Doe",
    "similarity": 0.992
  }
}
```

---

### C. 1:1 Identity Verification (POST /verify-one)

Compares a fresh liveness vector directly against a specific `targetId` (User UUID).

#### Request Body

```json
{
  "targetId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "descriptor": [0.0123, -0.0456, ...],
  "sessionToken": "session-uuid-12345",
  "timestamp": 1716336000000,
  "challenges": ["WAITING", "BLINK", "TURN_LEFT", "TURN_RIGHT"],
  "integrity": "9b3c4...sha256",
  "threshold": 0.95
}
```

#### Response (200 OK)

```json
{
  "verified": true,
  "status": "SUCCESS",
  "match": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "John Doe",
    "similarity": 0.991
  }
}
```

---

## 2. Self-Hosted Matching

If you are running verification on your own server or client without the Cloud API, calculate Cosine Similarity and Euclidean Distance between the enrolled and probe descriptor vectors:

```javascript
import {
  calculateCosineSimilarity,
  calculateEuclideanDistance,
} from "@liveness/engine/utils";

// vectorA and vectorB are 128-element arrays of numbers
const similarity = calculateCosineSimilarity(enrolledVector, probeVector);
const distance = calculateEuclideanDistance(enrolledVector, probeVector);
const isMatch = similarity >= 0.95 && distance <= 0.3;

console.log(
  `Match: ${isMatch}, Similarity: ${(similarity * 100).toFixed(2)}%, Distance: ${distance.toFixed(3)}`,
);
```

---

## 3. Webhook Signature Verification

Liveness webhook payloads are signed using HMAC-SHA256 and transmitted in the `x-liveness-signature` header.

Signature verification requires the exact raw request body buffer. Parsing JSON beforehand can alter whitespace or key order and cause verification failure.

### Node.js and Express Example

```javascript
import express from "express";
import crypto from "crypto";

const app = express();

// Capture raw body buffer for verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.post("/webhooks/liveness", (req, res) => {
  const signature = req.headers["x-liveness-signature"];
  const webhookSecret = process.env.LIVENESS_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return res.status(401).json({ error: "Missing signature or secret" });
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(req.rawBody)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const { event, data } = req.body;
  console.log(`Received verified event: ${event}`, data);

  res.status(200).json({ received: true });
});
```

### Next.js App Router Example (app/api/webhooks/liveness/route.ts)

```typescript
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-liveness-signature");
  const secret = process.env.LIVENESS_WEBHOOK_SECRET!;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  return NextResponse.json({ status: "success" });
}
```
