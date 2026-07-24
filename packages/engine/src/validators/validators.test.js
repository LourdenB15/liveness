import { describe, expect, it, vi } from "vitest";
import { BrightnessValidator } from "./BrightnessValidator";
import { OcclusionValidator } from "./OcclusionValidator";
import { LivenessPipeline } from "./LivenessPipeline";

describe("Anti-Spoofing & Quality Validators (SOLID OCP & SRP)", () => {
  const mockConfig = {
    minBrightness: -0.8,
    maxBrightness: 0.9,
  };

  it("BrightnessValidator returns error on low brightness", async () => {
    const validator = new BrightnessValidator();
    const mockTensor = {
      mean: () => ({ dataSync: () => [-0.9] }),
    };

    const result = await validator.validate(mockTensor, [], mockConfig);
    expect(result.valid).toBe(false);
    expect(result.error.code).toBe("POOR_LIGHTING");
  });

  it("LivenessPipeline runs validators sequentially and collects metadata", async () => {
    const pipeline = new LivenessPipeline();
    const mockTensor = {
      mean: () => ({ dataSync: () => [0.1] }),
    };
    const mockLandmarks = Array(468).fill({ x: 0.5, y: 0.5, z: 0 });

    const result = await pipeline.execute(mockTensor, mockLandmarks, {
      ...mockConfig,
      maxFFTPeak: 100,
      minDepthVariance: -1,
      minLaplacianVariance: -1,
    });

    expect(result.antiSpoofing).toHaveProperty("brightness");
    expect(result.antiSpoofing).toHaveProperty("occlusionDetected");
  });
});
