import { BaseChallenge } from "./BaseChallenge";
import { calculateHeadTurnV2 } from "../utils";

export class TurnLeftChallenge extends BaseChallenge {
  constructor() {
    super("TURN_LEFT");
  }

  evaluate(landmarks, config) {
    const turnRatio = calculateHeadTurnV2(landmarks);
    const passed = turnRatio > config.headTurnThreshold;
    const progress = passed
      ? 1
      : Math.max(0, turnRatio / config.headTurnThreshold);

    return {
      passed,
      progress,
      rawValue: turnRatio,
    };
  }
}
