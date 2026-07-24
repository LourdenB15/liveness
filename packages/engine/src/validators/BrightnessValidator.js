import { BaseValidator } from "./BaseValidator";
import { calculateBrightness } from "../utils";

export class BrightnessValidator extends BaseValidator {
  constructor() {
    super("brightness");
  }

  async validate(faceTensor, landmarks, config) {
    const brightness = calculateBrightness(faceTensor);

    let minB = config.minBrightness ?? -0.92;
    let maxB = config.maxBrightness ?? 0.95;
    if (minB > 1) minB = (minB - 127.5) / 127.5;
    if (maxB > 1) maxB = (maxB - 127.5) / 127.5;

    if (brightness < minB) {
      return {
        valid: false,
        error: {
          code: "POOR_LIGHTING",
          message: "Environment is too dark. Please move to a brighter area.",
        },
        metadata: { brightness },
      };
    }

    if (brightness > maxB) {
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
