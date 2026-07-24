import { BaseChallenge } from "./BaseChallenge";
import { calculateEAR } from "../utils";

export class BlinkChallenge extends BaseChallenge {
  #hasDetectedOpenEyes = false;

  constructor() {
    super("BLINK");
  }

  reset() {
    this.#hasDetectedOpenEyes = false;
  }

  evaluate(landmarks, config) {
    const leftEAR = calculateEAR(landmarks, "left");
    const rightEAR = calculateEAR(landmarks, "right");
    const rawValue = Math.min(leftEAR, rightEAR);

    const OPEN_THRESHOLD = 0.3;
    if (rawValue > OPEN_THRESHOLD) {
      this.#hasDetectedOpenEyes = true;
    }

    const passed =
      this.#hasDetectedOpenEyes && rawValue < config.blinkEARThreshold;

    return {
      passed,
      progress: passed ? 1 : this.#hasDetectedOpenEyes ? 0.5 : 0,
      rawValue,
    };
  }
}
