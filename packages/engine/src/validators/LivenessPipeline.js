import { BrightnessValidator } from "./BrightnessValidator";
import { OcclusionValidator } from "./OcclusionValidator";
import { FFTSpectrumValidator } from "./FFTSpectrumValidator";
import { DepthVarianceValidator } from "./DepthVarianceValidator";
import { LaplacianVarianceValidator } from "./LaplacianVarianceValidator";

/**
 * LivenessPipeline runs a set of Quality and Anti-Spoofing validators.
 * (Open/Closed Principle: Open to adding custom validators without editing engine core)
 */
export class LivenessPipeline {
  #validators = [];

  constructor(validators = []) {
    if (validators.length > 0) {
      this.#validators = validators;
    } else {
      // Default pipeline configuration
      this.addValidator(new BrightnessValidator())
        .addValidator(new OcclusionValidator())
        .addValidator(new FFTSpectrumValidator())
        .addValidator(new DepthVarianceValidator())
        .addValidator(new LaplacianVarianceValidator());
    }
  }

  /**
   * Add a validator to the pipeline.
   * @param {import("./BaseValidator").BaseValidator} validator
   * @returns {LivenessPipeline}
   */
  addValidator(validator) {
    if (validator && typeof validator.validate === "function") {
      this.#validators.push(validator);
    }
    return this;
  }

  /**
   * Run all configured validators sequentially.
   * @param {import("@tensorflow/tfjs").Tensor} faceTensor
   * @param {Array} landmarks
   * @param {Object} config
   * @returns {Promise<{ passed: boolean, error?: Object, antiSpoofing: Object }>}
   */
  async execute(faceTensor, landmarks, config) {
    const antiSpoofing = {};

    for (const validator of this.#validators) {
      const result = await validator.validate(faceTensor, landmarks, config);
      if (result.metadata) {
        Object.assign(antiSpoofing, result.metadata);
      }

      if (!result.valid) {
        return {
          passed: false,
          error: result.error,
          antiSpoofing,
        };
      }
    }

    return {
      passed: true,
      antiSpoofing,
    };
  }
}
