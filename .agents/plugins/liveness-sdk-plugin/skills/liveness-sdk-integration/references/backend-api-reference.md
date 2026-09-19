# Liveness Backend API Reference

This document provides specifications for the Liveness Cloud REST API.

---

## 1. Cloud REST API Specifications

Base URL: `https://api.liveness.cloud/api/liveness` (production) or `http://localhost:3000/api/liveness` (local dev)

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
