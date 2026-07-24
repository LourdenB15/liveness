// src/engine/utils.js
import * as tf from "@tensorflow/tfjs";

const EYE_INDICES = {
  left: [362, 385, 387, 263, 373, 380],
  right: [33, 160, 158, 133, 153, 144],
};

const HEAD_POSE_INDICES = {
  leftCheek: 234,
  rightCheek: 454,
  chin: 152,
};

function euclideanDistance(p1, p2) {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) +
      Math.pow(p1.y - p2.y, 2) +
      Math.pow(p1.z - p2.z, 2),
  );
}

export function calculateEAR(landmarks, side) {
  const indices = EYE_INDICES[side];
  const p1 = landmarks[indices[0]];
  const p2 = landmarks[indices[1]];
  const p3 = landmarks[indices[2]];
  const p4 = landmarks[indices[3]];
  const p5 = landmarks[indices[4]];
  const p6 = landmarks[indices[5]];

  const verticalDist1 = euclideanDistance(p2, p6);
  const verticalDist2 = euclideanDistance(p3, p5);
  const horizontalDist = euclideanDistance(p1, p4);

  if (horizontalDist === 0) return 0;

  const ear = (verticalDist1 + verticalDist2) / (2.0 * horizontalDist);
  return ear;
}

export function calculateHeadTurnV2(landmarks) {
  const leftCheek = landmarks[HEAD_POSE_INDICES.leftCheek];
  const rightCheek = landmarks[HEAD_POSE_INDICES.rightCheek];
  const chin = landmarks[HEAD_POSE_INDICES.chin];

  const leftDepth = leftCheek.z - chin.z;
  const rightDepth = rightCheek.z - chin.z;

  const faceWidth = euclideanDistance(leftCheek, rightCheek);
  if (faceWidth < 0.1) return 0;

  const turnRatio = (rightDepth - leftDepth) / faceWidth;

  return turnRatio;
}

export function calculateCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return dotProduct;
}

export function calculateFaceSize(landmarks) {
  if (!landmarks || landmarks.length === 0) return 0;

  const ys = landmarks.map((l) => l.y);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);

  const height = yMax - yMin;

  return height;
}

export function calculateDepthVariance(landmarks) {
  if (!landmarks || landmarks.length === 0) return 0;

  const xs = landmarks.map((l) => l.x);
  const faceWidth = Math.max(...xs) - Math.min(...xs);
  if (faceWidth < 0.01) return 0;

  const zs = landmarks.map((l) => l.z / faceWidth);
  const meanZ = zs.reduce((sum, z) => sum + z, 0) / zs.length;
  const variance =
    zs.reduce((sum, z) => sum + Math.pow(z - meanZ, 2), 0) / zs.length;

  return variance;
}

export async function calculateLaplacianVariance(imageTensor) {
  return tf.tidy(() => {
    const grayscale =
      imageTensor.shape[3] === 3
        ? tf.image.rgbToGrayscale(imageTensor)
        : imageTensor;

    const kernel = tf.tensor4d([0, 1, 0, 1, -4, 1, 0, 1, 0], [3, 3, 1, 1]);

    const laplacian = tf.conv2d(grayscale, kernel, 1, "valid");

    const mean = laplacian.mean();
    const variance = laplacian.sub(mean).square().mean();

    return variance.dataSync()[0];
  });
}

export async function calculateFFTSpectrum(imageTensor) {
  return tf.tidy(() => {
    const grayscale = tf.image.rgbToGrayscale(imageTensor).squeeze([0, 3]);
    const normalized = grayscale.sub(grayscale.mean());

    const fft = tf.spectral.rfft(normalized);
    const magnitude = fft.abs();

    // Squeeze out low frequency bins (first 15%) corresponding to natural facial contours and lighting,
    // isolating high spatial frequency grid spikes characteristic of screen Moiré interference.
    const numBins = magnitude.shape[1];
    const startBin = Math.floor(numBins * 0.15);
    const highFreqMagnitude = magnitude.slice([0, startBin], [-1, numBins - startBin]);

    const mean = highFreqMagnitude.mean();
    const max = highFreqMagnitude.max();

    const meanVal = mean.dataSync()[0];
    if (meanVal === 0) return 0;

    return max.div(mean).dataSync()[0];
  });
}

export function calculateBrightness(imageTensor) {
  return tf.tidy(() => {
    const mean = imageTensor.mean();
    return mean.dataSync()[0];
  });
}

export function checkOcclusion(landmarks) {
  if (!landmarks || landmarks.length < 468) return true;

  const leftIndices = EYE_INDICES.left;
  const rightIndices = EYE_INDICES.right;

  const leftWidth = euclideanDistance(
    landmarks[leftIndices[0]],
    landmarks[leftIndices[3]],
  );
  const rightWidth = euclideanDistance(
    landmarks[rightIndices[0]],
    landmarks[rightIndices[3]],
  );

  if (leftWidth < 0.01 || rightWidth < 0.01) return true;

  return false;
}

export function generateIntegrityHash(descriptor, sessionToken, timestamp) {
  const data = JSON.stringify(descriptor) + sessionToken + timestamp;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(16);
}
