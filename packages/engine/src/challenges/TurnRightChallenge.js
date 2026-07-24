import { BaseChallenge } from "./BaseChallenge";
import { calculateHeadTurnV2 } from "../utils";

export class TurnRightChallenge extends BaseChallenge {
  constructor() {
    super("TURN_RIGHT");
  }

  evaluate(landmarks, config) {
    const turnRatio = calculateHeadTurnV2(landmarks);
    const passed = turnRatio < -config.headTurnThreshold;
    const progress = passed
      ? 1
      : Math.max(0, turnRatio / -config.headTurnThreshold);

    return {
      passed,
      progress,
      rawValue: turnRatio,
    };
  }
}
