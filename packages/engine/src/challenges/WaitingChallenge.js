import { BaseChallenge } from "./BaseChallenge";
import { calculateFaceSize } from "../utils";

export class WaitingChallenge extends BaseChallenge {
  constructor() {
    super("WAITING");
  }

  evaluate(landmarks, config) {
    const faceSize = calculateFaceSize(landmarks);
    let distance = null;
    let passed = false;

    if (faceSize < config.minFaceSize) {
      distance = "CLOSER";
    } else if (faceSize > config.maxFaceSize) {
      distance = "FURTHER";
    } else {
      passed = true;
    }

    return {
      passed,
      progress: passed ? 1 : 0,
      rawValue: faceSize,
      distance,
    };
  }
}
