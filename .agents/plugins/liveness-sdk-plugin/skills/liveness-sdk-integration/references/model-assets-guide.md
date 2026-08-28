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

### mobilenet-v2/ (TensorFlow.js Face Feature Extractor)

- model.json (Graph model topology)
- group1-shard1of5.bin
- group1-shard2of5.bin
- group1-shard3of5.bin
- group1-shard4of5.bin
- group1-shard5of5.bin

---

## 2. Where to Find Assets

When installed as a dependency:

```text
node_modules/@liveness/engine/assets/
├── face_mesh/
└── mobilenet-v2/
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
    └── mobilenet-v2/
```

In your component:

```typescript
const sdk = new LivenessSDK({
  basePath: "", // Resolves to /face_mesh/... and /mobilenet-v2/...
});
```

### B. Vite (React, Vue, Svelte)

Copy assets into public/:

```text
my-vite-app/
└── public/
    ├── face_mesh/
    └── mobilenet-v2/
```

In your code:

```typescript
const sdk = new LivenessSDK({
  basePath: "",
});
```

### C. Webpack, Angular, Nuxt

Ensure the build tool copies the face_mesh/ and mobilenet-v2/ directories to your build output distribution root.

---

## 4. Hosting on CDN / Cloud Storage (S3, Cloudflare R2, GCP)

If serving assets from an external CDN:

1. Upload the two folders to your bucket:
   https://cdn.example.com/liveness-models/face_mesh/...
   https://cdn.example.com/liveness-models/mobilenet-v2/...
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
