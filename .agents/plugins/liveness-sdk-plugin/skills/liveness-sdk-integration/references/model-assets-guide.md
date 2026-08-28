# Liveness SDK Model Assets Guide

The @liveness/sdk relies on client-side WebAssembly and neural network models that must be publicly accessible via HTTP(S).

---

## 1. Required Asset Files

The assets are split into two directories:

### face_mesh/ (MediaPipe Face Mesh WASM and Tesselation)

- face_mesh.binarypb (MediaPipe graph binary)
- face_mesh_solution_packed_assets.data (Packed asset binary)
- face_mesh_solution_packed_assets_loader.js (Asset loader script)
- face_mesh_solution_simd_wasm_bin.js (WASM glue runtime)
- face_mesh_solution_simd_wasm_bin.wasm (SIMD-accelerated WASM binary)

### face_recognition/ (TensorFlow.js ResNet-34 FaceRecognitionNet)

- face_recognition_model-weights_manifest.json (Weight manifest)
- face_recognition_model-shard1 (Model weights shard 1)
- face_recognition_model-shard2 (Model weights shard 2)

---

## 2. Where to Find Assets

When installed as a dependency:

```text
node_modules/@liveness/engine/assets/
├── face_mesh/
└── face_recognition/
```

Or copy them via the helper script provided in this plugin:

```bash
node .agents/plugins/liveness-sdk-plugin/skills/liveness-sdk-integration/scripts/copy-liveness-assets.js ./public
```

---

## 3. Placement in Frontend Frameworks

### A. Next.js (App Router or Pages Router)

Copy assets into the public directory:

```text
my-next-app/
└── public/
    ├── face_mesh/
    └── face_recognition/
```

In your component:

```typescript
const sdk = new LivenessSDK({
  basePath: "", // Resolves to /face_mesh/... and /face_recognition/...
});
```

### B. Vite (React, Vue, Svelte)

Copy assets into public/:

```text
my-vite-app/
└── public/
    ├── face_mesh/
    └── face_recognition/
```

In your code:

```typescript
const sdk = new LivenessSDK({
  basePath: "",
});
```

### C. Webpack, Angular, Nuxt

Ensure the build tool copies the face_mesh/ and face_recognition/ directories to your build output distribution root.

---

## 4. Hosting on CDN / Cloud Storage (S3, Cloudflare R2, GCP)

If serving assets from an external CDN:

1. Upload the two folders to your bucket:
   https://cdn.example.com/liveness-models/face_mesh/...
   https://cdn.example.com/liveness-models/face_recognition/...
2. Configure CORS on the storage bucket:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedOrigins": ["https://yourdomain.com", "http://localhost:*"],
       "ExposeHeaders": []
     }
   ]
   ```
3. Set basePath in SDK:
   ```javascript
   const sdk = new LivenessSDK({
     basePath: "https://cdn.example.com/liveness-models",
   });
   ```

---

## 5. Required MIME Types and Headers

Ensure your web server or CDN serves files with correct Content-Type headers:

| File Extension                 | Content-Type Header        |
| :----------------------------- | :------------------------- |
| `.wasm`                        | `application/wasm`         |
| `.json`                        | `application/json`         |
| `.data` / `.bin` / `.binarypb` | `application/octet-stream` |
| `.js`                          | `application/javascript`   |
