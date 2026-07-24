import { BaseValidator } from "./BaseValidator";
import { calculateFFTSpectrum } from "../utils";

export class FFTSpectrumValidator extends BaseValidator {
  constructor() {
    super("fftSpectrum");
  }

  async validate(faceTensor, landmarks, config) {
    const fftPeak = await calculateFFTSpectrum(faceTensor);

    if (fftPeak > config.maxFFTPeak) {
      return {
        valid: false,
        error: {
          code: "SPOOF_DETECTED",
          message: "Digital screen pattern detected (Moiré interference).",
        },
        metadata: { fftPeak },
      };
    }

    return {
      valid: true,
      metadata: { fftPeak },
    };
  }
}
