import { BaseChallenge } from "./BaseChallenge";
import { calculateEAR } from "../utils";

export class BlinkChallenge extends BaseChallenge {
  #hasDetectedOpenEyes = false;
  #maxEAR = 0;

  constructor() {
    super("BLINK");
  }

  reset() {
    this.#hasDetectedOpenEyes = false;
    this.#maxEAR = 0;
  }

  evaluate(landmarks, config) {
    const leftEAR = calculateEAR(landmarks, "left");
    const rightEAR = calculateEAR(landmarks, "right");
    const rawValue = Math.min(leftEAR, rightEAR);

    if (rawValue > this.#maxEAR) {
      this.#maxEAR = rawValue;
    }

    const OPEN_THRESHOLD = 0.2;
    if (rawValue >= OPEN_THRESHOLD) {
      this.#hasDetectedOpenEyes = true;
    }

    const targetThreshold = config.blinkEARThreshold ?? 0.25;
    const isBlinking =
      rawValue < targetThreshold ||
      (this.#maxEAR > 0.22 && rawValue < this.#maxEAR * 0.7);

    const passed = this.#hasDetectedOpenEyes && isBlinking;

    return {
      passed,
      progress: passed ? 1 : this.#hasDetectedOpenEyes ? 0.5 : 0,
      rawValue,
    };
  }
}
