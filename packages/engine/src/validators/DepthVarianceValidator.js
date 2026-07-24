import { BaseValidator } from "./BaseValidator";
import { calculateDepthVariance } from "../utils";

export class DepthVarianceValidator extends BaseValidator {
  constructor() {
    super("depthVariance");
  }

  async validate(faceTensor, landmarks, config) {
    const depthVariance = calculateDepthVariance(landmarks);

    if (depthVariance < config.minDepthVariance) {
      return {
        valid: false,
        error: {
          code: "SPOOF_DETECTED",
          message: "Flat surface detected (Possible photo/screen spoof).",
        },
        metadata: { depthVariance },
      };
    }

    return {
      valid: true,
      metadata: { depthVariance },
    };
  }
}
