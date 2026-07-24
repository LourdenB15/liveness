import { BaseValidator } from "./BaseValidator";
import { calculateBrightness } from "../utils";

export class BrightnessValidator extends BaseValidator {
  constructor() {
    super("brightness");
  }

  async validate(faceTensor, landmarks, config) {
    const brightness = calculateBrightness(faceTensor);

    if (brightness < config.minBrightness) {
      return {
        valid: false,
        error: {
          code: "POOR_LIGHTING",
          message: "Environment is too dark. Please move to a brighter area.",
        },
        metadata: { brightness },
      };
    }

    if (brightness > config.maxBrightness) {
      return {
        valid: false,
        error: {
          code: "POOR_LIGHTING",
          message:
            "Environment is too bright (Glare detected). Please adjust lighting.",
        },
        metadata: { brightness },
      };
    }

    return {
      valid: true,
      metadata: { brightness },
    };
  }
}
