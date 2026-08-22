import fs from "fs";
import filePath from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = filePath.dirname(__filename);

const targetPkg = filePath.resolve(
  __dirname,
  "../node_modules/@mediapipe/face_mesh/package.json",
);

const targetFile = filePath.resolve(
  __dirname,
  "../node_modules/@mediapipe/face_mesh/face_mesh.js",
);

// 1. Fix package.json (remove "module" field so bundlers treat it as CommonJS instead of broken ESM)
if (fs.existsSync(targetPkg)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(targetPkg, "utf8"));
    if (pkg.module) {
      delete pkg.module;
      fs.writeFileSync(targetPkg, JSON.stringify(pkg, null, 2), "utf8");
      console.log("Successfully removed 'module' field from @mediapipe/face_mesh/package.json");
    }
  } catch (err) {
    console.error("Failed to patch @mediapipe/face_mesh/package.json:", err);
  }
}

// 2. Fix face_mesh.js
if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, "utf8");

  // Find the end of the IIFE call
  const searchString = 'P("VERSION","0.4.1633559619");}).call(this);';
  const cleanIdx = content.indexOf(searchString);

  if (cleanIdx !== -1) {
    // Cut off everything after the IIFE
    content = content.slice(0, cleanIdx + searchString.length);

    const patch = `
if (typeof exports === 'object' && typeof module !== 'undefined') {
  var globalObj = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : {})));
  var FaceMesh = exports.FaceMesh || globalObj.FaceMesh;
  var FACEMESH_TESSELATION = exports.FACEMESH_TESSELATION || globalObj.FACEMESH_TESSELATION;
  var FACEMESH_LIPS = exports.FACEMESH_LIPS || globalObj.FACEMESH_LIPS;
  var FACEMESH_LEFT_EYE = exports.FACEMESH_LEFT_EYE || globalObj.FACEMESH_LEFT_EYE;
  var FACEMESH_LEFT_EYEBROW = exports.FACEMESH_LEFT_EYEBROW || globalObj.FACEMESH_LEFT_EYEBROW;
  var FACEMESH_LEFT_IRIS = exports.FACEMESH_LEFT_IRIS || globalObj.FACEMESH_LEFT_IRIS;
  var FACEMESH_RIGHT_EYE = exports.FACEMESH_RIGHT_EYE || globalObj.FACEMESH_RIGHT_EYE;
  var FACEMESH_RIGHT_EYEBROW = exports.FACEMESH_RIGHT_EYEBROW || globalObj.FACEMESH_RIGHT_EYEBROW;
  var FACEMESH_RIGHT_IRIS = exports.FACEMESH_RIGHT_IRIS || globalObj.FACEMESH_RIGHT_IRIS;
  var FACEMESH_FACE_OVAL = exports.FACEMESH_FACE_OVAL || globalObj.FACEMESH_FACE_OVAL;
  var FACEMESH_CONTOURS = exports.FACEMESH_CONTOURS || globalObj.FACEMESH_CONTOURS;
  var VERSION = exports.VERSION || globalObj.VERSION;

  module.exports = {
    FaceMesh: FaceMesh,
    FACEMESH_TESSELATION: FACEMESH_TESSELATION,
    FACEMESH_LIPS: FACEMESH_LIPS,
    FACEMESH_LEFT_EYE: FACEMESH_LEFT_EYE,
    FACEMESH_LEFT_EYEBROW: FACEMESH_LEFT_EYEBROW,
    FACEMESH_LEFT_IRIS: FACEMESH_LEFT_IRIS,
    FACEMESH_RIGHT_EYE: FACEMESH_RIGHT_EYE,
    FACEMESH_RIGHT_EYEBROW: FACEMESH_RIGHT_EYEBROW,
    FACEMESH_RIGHT_IRIS: FACEMESH_RIGHT_IRIS,
    FACEMESH_FACE_OVAL: FACEMESH_FACE_OVAL,
    FACEMESH_CONTOURS: FACEMESH_CONTOURS,
    VERSION: VERSION,
    default: {
      FaceMesh: FaceMesh,
      FACEMESH_TESSELATION: FACEMESH_TESSELATION,
      FACEMESH_LIPS: FACEMESH_LIPS,
      FACEMESH_LEFT_EYE: FACEMESH_LEFT_EYE,
      FACEMESH_LEFT_EYEBROW: FACEMESH_LEFT_EYEBROW,
      FACEMESH_LEFT_IRIS: FACEMESH_LEFT_IRIS,
      FACEMESH_RIGHT_EYE: FACEMESH_RIGHT_EYE,
      FACEMESH_RIGHT_EYEBROW: FACEMESH_RIGHT_EYEBROW,
      FACEMESH_RIGHT_IRIS: FACEMESH_RIGHT_IRIS,
      FACEMESH_FACE_OVAL: FACEMESH_FACE_OVAL,
      FACEMESH_CONTOURS: FACEMESH_CONTOURS,
      VERSION: VERSION
    }
  };
  exports.FaceMesh = FaceMesh;
  exports.FACEMESH_TESSELATION = FACEMESH_TESSELATION;
  exports.FACEMESH_LIPS = FACEMESH_LIPS;
  exports.FACEMESH_LEFT_EYE = FACEMESH_LEFT_EYE;
  exports.FACEMESH_LEFT_EYEBROW = FACEMESH_LEFT_EYEBROW;
  exports.FACEMESH_LEFT_IRIS = FACEMESH_LEFT_IRIS;
  exports.FACEMESH_RIGHT_EYE = FACEMESH_RIGHT_EYE;
  exports.FACEMESH_RIGHT_EYEBROW = FACEMESH_RIGHT_EYEBROW;
  exports.FACEMESH_RIGHT_IRIS = FACEMESH_RIGHT_IRIS;
  exports.FACEMESH_FACE_OVAL = FACEMESH_FACE_OVAL;
  exports.FACEMESH_CONTOURS = FACEMESH_CONTOURS;
  exports.VERSION = VERSION;
  exports.default = module.exports.default;
}
`;
    content = content + "\n" + patch;
    fs.writeFileSync(targetFile, content, "utf8");
    console.log(
      "Successfully patched @mediapipe/face_mesh with fallback logic!",
    );
  } else {
    console.error(
      "Could not find standard IIFE end sequence in face_mesh.js",
    );
  }
} else {
  console.warn(`Target file not found at ${targetFile}. Skipping patch.`);
}
