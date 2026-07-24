/**
 * Abstract base class / interface for a Liveness Challenge strategy.
 * (Single Responsibility & Open/Closed Principle)
 */
export class BaseChallenge {
  /**
   * @param {string} type - Unique identifier for the challenge type.
   */
  constructor(type) {
    this.type = type;
  }

  /**
   * Reset any internal state (e.g. eye open tracking).
   */
  reset() {}

  /**
   * Evaluate the challenge against given face landmarks.
   * @param {Array} landmarks - Facial landmarks array from detector.
   * @param {Object} config - Current engine configuration.
   * @returns {{ passed: boolean, progress: number, rawValue?: number, distance?: string }}
   */
  evaluate(landmarks, config) {
    throw new Error("evaluate() must be implemented by subclass.");
  }
}
