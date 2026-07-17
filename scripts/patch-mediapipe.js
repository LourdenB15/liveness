import fs from "fs";
import filePath from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = filePath.dirname(__filename);

const targetFile = filePath.resolve(
  __dirname,
  "../node_modules/@mediapipe/face_mesh/face_mesh.js",
);

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, "utf8");

  // If already patched with the old way, clean it up first
  const oldPatchMarker = "exports.FaceMesh = globalObj.FaceMesh;";
  if (
    content.includes(oldPatchMarker) &&
    !content.includes("exports.FaceMesh || globalObj.FaceMesh")
  ) {
    console.log("Removing old patch version...");
    // Read clean backup if possible, or we can just restore original by doing clean split
    const splitStr = 'P("VERSION","0.4.1633559619");}).call(this);';
    const idx = content.indexOf(splitStr);
    if (idx !== -1) {
      content = content.slice(0, idx + splitStr.length);
    }
  }

  if (
    !content.includes(
      "exports.FaceMesh = exports.FaceMesh || globalObj.FaceMesh;",
    )
  ) {
    console.log("Patching @mediapipe/face_mesh/face_mesh.js...");

    // Find the end of the IIFE call
    const searchString = 'P("VERSION","0.4.1633559619");}).call(this);';
    if (content.includes(searchString)) {
      const patch = `
if (typeof exports === 'object' && typeof module !== 'undefined') {
  var globalObj = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : {})));
  exports.FaceMesh = exports.FaceMesh || globalObj.FaceMesh;
  exports.FACEMESH_TESSELATION = exports.FACEMESH_TESSELATION || globalObj.FACEMESH_TESSELATION;
  exports.FACEMESH_LIPS = exports.FACEMESH_LIPS || globalObj.FACEMESH_LIPS;
  exports.FACEMESH_LEFT_EYE = exports.FACEMESH_LEFT_EYE || globalObj.FACEMESH_LEFT_EYE;
  exports.FACEMESH_LEFT_EYEBROW = exports.FACEMESH_LEFT_EYEBROW || globalObj.FACEMESH_LEFT_EYEBROW;
  exports.FACEMESH_LEFT_IRIS = exports.FACEMESH_LEFT_IRIS || globalObj.FACEMESH_LEFT_IRIS;
  exports.FACEMESH_RIGHT_EYE = exports.FACEMESH_RIGHT_EYE || globalObj.FACEMESH_RIGHT_EYE;
  exports.FACEMESH_RIGHT_EYEBROW = exports.FACEMESH_RIGHT_EYEBROW || globalObj.FACEMESH_RIGHT_EYEBROW;
  exports.FACEMESH_RIGHT_IRIS = exports.FACEMESH_RIGHT_IRIS || globalObj.FACEMESH_RIGHT_IRIS;
  exports.FACEMESH_FACE_OVAL = exports.FACEMESH_FACE_OVAL || globalObj.FACEMESH_FACE_OVAL;
  exports.FACEMESH_CONTOURS = exports.FACEMESH_CONTOURS || globalObj.FACEMESH_CONTOURS;
  exports.VERSION = exports.VERSION || globalObj.VERSION;
  exports.default = exports.default || {
    FaceMesh: exports.FaceMesh,
    FACEMESH_TESSELATION: exports.FACEMESH_TESSELATION,
    FACEMESH_LIPS: exports.FACEMESH_LIPS,
    FACEMESH_LEFT_EYE: exports.FACEMESH_LEFT_EYE,
    FACEMESH_LEFT_EYEBROW: exports.FACEMESH_LEFT_EYEBROW,
    FACEMESH_LEFT_IRIS: exports.FACEMESH_LEFT_IRIS,
    FACEMESH_RIGHT_EYE: exports.FACEMESH_RIGHT_EYE,
    FACEMESH_RIGHT_EYEBROW: exports.FACEMESH_RIGHT_EYEBROW,
    FACEMESH_RIGHT_IRIS: exports.FACEMESH_RIGHT_IRIS,
    FACEMESH_FACE_OVAL: exports.FACEMESH_FACE_OVAL,
    FACEMESH_CONTOURS: exports.FACEMESH_CONTOURS,
    VERSION: exports.VERSION
  };
}
`;
      // Ensure we replace only the original searchString (excluding any appended stuff)
      const cleanIdx = content.indexOf(searchString);
      if (cleanIdx !== -1) {
        content =
          content.slice(0, cleanIdx + searchString.length) + "\n" + patch;
        fs.writeFileSync(targetFile, content, "utf8");
        console.log(
          "Successfully patched @mediapipe/face_mesh with fallback logic!",
        );
      }
    } else {
      console.error(
        "Could not find standard IIFE end sequence in face_mesh.js",
      );
    }
  } else {
    console.log(
      "@mediapipe/face_mesh/face_mesh.js is already patched with fallback logic.",
    );
  }
} else {
  console.warn(`Target file not found at ${targetFile}. Skipping patch.`);
}
