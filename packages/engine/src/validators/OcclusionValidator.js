import { BaseValidator } from "./BaseValidator";
import { checkOcclusion } from "../utils";

export class OcclusionValidator extends BaseValidator {
  constructor() {
    super("occlusion");
  }

  async validate(faceTensor, landmarks, config) {
    const occlusionDetected = checkOcclusion(landmarks);

    if (occlusionDetected) {
      return {
        valid: false,
        error: {
          code: "OCCLUSION_DETECTED",
          message:
            "Face is partially covered. Please remove any masks or obstructions.",
        },
        metadata: { occlusionDetected },
      };
    }

    return {
      valid: true,
      metadata: { occlusionDetected },
    };
  }
}
