// src/FaceRecognitionNet.js
import * as tf from "@tensorflow/tfjs";

function scale(x, params) {
  return tf.add(tf.mul(x, params.weights), params.biases);
}

function convLayer(x, params, strides, withRelu, padding = "same") {
  const { filters, bias } = params.conv;
  let out = tf.conv2d(x, filters, strides, padding);
  out = tf.add(out, bias);
  out = scale(out, params.scale);
  return withRelu ? tf.relu(out) : out;
}

function conv(x, params) {
  return convLayer(x, params, [1, 1], true);
}

function convNoRelu(x, params) {
  return convLayer(x, params, [1, 1], false);
}

function convDown(x, params) {
  return convLayer(x, params, [2, 2], true, "valid");
}

function residual(x, params) {
  let out = conv(x, params.conv1);
  out = convNoRelu(out, params.conv2);
  out = tf.add(out, x);
  out = tf.relu(out);
  return out;
}

function residualDown(x, params) {
  let out = convDown(x, params.conv1);
  out = convNoRelu(out, params.conv2);

  let pooled = tf.avgPool(x, 2, 2, "valid");
  const zeros = tf.zeros(pooled.shape);
  const isPad = pooled.shape[3] !== out.shape[3];
  const isAdjustShape =
    pooled.shape[1] !== out.shape[1] || pooled.shape[2] !== out.shape[2];

  if (isAdjustShape) {
    const padShapeX = [...out.shape];
    padShapeX[1] = 1;
    const zerosW = tf.zeros(padShapeX);
    out = tf.concat([out, zerosW], 1);

    const padShapeY = [...out.shape];
    padShapeY[2] = 1;
    const zerosH = tf.zeros(padShapeY);
    out = tf.concat([out, zerosH], 2);
  }

  pooled = isPad ? tf.concat([pooled, zeros], 3) : pooled;
  out = tf.add(pooled, out);
  out = tf.relu(out);
  return out;
}

function extractParams(weightMap) {
  const extractScale = (prefix) => ({
    weights: weightMap[`${prefix}/scale/weights`],
    biases: weightMap[`${prefix}/scale/biases`],
  });

  const extractConv = (prefix) => ({
    conv: {
      filters: weightMap[`${prefix}/conv/filters`],
      bias: weightMap[`${prefix}/conv/bias`],
    },
    scale: extractScale(prefix),
  });

  const extractResidual = (prefix) => ({
    conv1: extractConv(`${prefix}/conv1`),
    conv2: extractConv(`${prefix}/conv2`),
  });

  return {
    conv32_down: extractConv("conv32_down"),
    conv32_1: extractResidual("conv32_1"),
    conv32_2: extractResidual("conv32_2"),
    conv32_3: extractResidual("conv32_3"),

    conv64_down: extractResidual("conv64_down"),
    conv64_1: extractResidual("conv64_1"),
    conv64_2: extractResidual("conv64_2"),
    conv64_3: extractResidual("conv64_3"),

    conv128_down: extractResidual("conv128_down"),
    conv128_1: extractResidual("conv128_1"),
    conv128_2: extractResidual("conv128_2"),

    conv256_down: extractResidual("conv256_down"),
    conv256_1: extractResidual("conv256_1"),
    conv256_2: extractResidual("conv256_2"),
    conv256_down_out: extractResidual("conv256_down_out"),

    fc: weightMap["fc"],
  };
}

export class FaceRecognitionNet {
  #params = null;

  get isLoaded() {
    return this.#params !== null;
  }

  async load(baseUrl) {
    const cleanBaseUrl = (baseUrl || "").replace(/\/+$/, "");
    const manifestUrl = `${cleanBaseUrl}/face_recognition_model-weights_manifest.json`;
    const response = await fetch(manifestUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to load FaceRecognitionNet manifest from ${manifestUrl}`,
      );
    }
    const manifest = await response.json();
    const weightMap = await tf.io.loadWeights(manifest, cleanBaseUrl);
    this.#params = extractParams(weightMap);
  }

  loadWithWeightMap(weightMap) {
    this.#params = extractParams(weightMap);
  }

  predict(inputTensor) {
    if (!this.#params) {
      throw new Error("FaceRecognitionNet is not loaded. Call load() first.");
    }

    return tf.tidy(() => {
      // Input tensor shape [batch, 150, 150, 3] in RGB (values in [0, 255])
      const meanRgb = tf.tensor1d([122.782, 117.001, 104.298]);
      const normalized = inputTensor.sub(meanRgb).div(tf.scalar(256.0));

      let out = convDown(normalized, this.#params.conv32_down);
      out = tf.maxPool(out, 3, 2, "valid");

      out = residual(out, this.#params.conv32_1);
      out = residual(out, this.#params.conv32_2);
      out = residual(out, this.#params.conv32_3);

      out = residualDown(out, this.#params.conv64_down);
      out = residual(out, this.#params.conv64_1);
      out = residual(out, this.#params.conv64_2);
      out = residual(out, this.#params.conv64_3);

      out = residualDown(out, this.#params.conv128_down);
      out = residual(out, this.#params.conv128_1);
      out = residual(out, this.#params.conv128_2);

      out = residualDown(out, this.#params.conv256_down);
      out = residual(out, this.#params.conv256_1);
      out = residual(out, this.#params.conv256_2);
      out = residualDown(out, this.#params.conv256_down_out);

      const globalAvg = out.mean([1, 2]);
      const fullyConnected = tf.matMul(globalAvg, this.#params.fc);

      const norm = fullyConnected.norm(2, -1, true);
      return fullyConnected.div(norm);
    });
  }

  dispose() {
    this.#params = null;
  }
}
