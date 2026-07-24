import * as tf from "@tensorflow/tfjs";

/**
 * MobileNetFeatureExtractor wraps the TensorFlow graph model for feature extraction.
 * Demonstrates Dependency Inversion Principle & Single Responsibility.
 */
export class MobileNetFeatureExtractor {
  #recognitionModel = null;

  async load(basePath) {
    const cleanBasePath = basePath.endsWith("/")
      ? basePath.slice(0, -1)
      : basePath;

    const modelUrl = `${cleanBasePath}/mobilenet-v2/model.json`;
    this.#recognitionModel = await tf.loadGraphModel(modelUrl);
  }

  getInputSize() {
    if (!this.#recognitionModel || !this.#recognitionModel.inputs?.[0]) {
      return [224, 224];
    }
    return this.#recognitionModel.inputs[0].shape.slice(1, 3);
  }

  async extractDescriptor(faceTensor) {
    if (!this.#recognitionModel) {
      throw new Error("Recognition model not loaded.");
    }

    const predictionTensor = this.#recognitionModel.predict(faceTensor);
    const normalizedTensor = tf.tidy(() => {
      const norm = predictionTensor.norm();
      if (norm.dataSync()[0] > 1e-6) {
        return predictionTensor.div(norm);
      }
      return predictionTensor;
    });

    const descriptorArray = Array.from(await normalizedTensor.data());
    tf.dispose([predictionTensor, normalizedTensor]);

    return descriptorArray;
  }
}
