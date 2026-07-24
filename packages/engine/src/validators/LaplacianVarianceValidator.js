import { BaseValidator } from "./BaseValidator";
import { calculateLaplacianVariance } from "../utils";

export class LaplacianVarianceValidator extends BaseValidator {
  constructor() {
    super("laplacianVariance");
  }

  async validate(faceTensor, landmarks, config) {
    const laplacianVariance = await calculateLaplacianVariance(faceTensor);

    if (laplacianVariance < config.minLaplacianVariance) {
      return {
        valid: false,
        error: {
          code: "SPOOF_DETECTED",
          message: "Low texture detail detected (Possible re-broadcast/print).",
        },
        metadata: { laplacianVariance },
      };
    }

    return {
      valid: true,
      metadata: { laplacianVariance },
    };
  }
}
