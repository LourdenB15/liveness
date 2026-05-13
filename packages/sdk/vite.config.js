// vite.config.sdk.js
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/LivenessSDK.js"),
      name: "LivenessSDK",
      fileName: "liveness-sdk",
      formats: ["es", "umd"],
    },
    outDir: "dist",
    rollupOptions: {
      external: ["@mediapipe/face_mesh", "@tensorflow/tfjs"],
      output: {
        globals: {
          "@mediapipe/face_mesh": "FaceMesh",
          "@tensorflow/tfjs": "tf",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
