/**
 * Base abstract class for a Liveness Quality / Anti-Spoofing Validator.
 * (Single Responsibility & Open/Closed Principle)
 */
export class BaseValidator {
  /**
   * @param {string} name - Name of the validator.
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * Validate the given face tensor and landmarks.
   * @param {import("@tensorflow/tfjs").Tensor} faceTensor
   * @param {Array} landmarks
   * @param {Object} config
   * @returns {Promise<{ valid: boolean, error?: { code: string, message: string }, metadata?: Object }>}
   */
  async validate(faceTensor, landmarks, config) {
    throw new Error("validate() must be implemented by subclass.");
  }
}
