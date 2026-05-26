// src/engine/utils.test.js
import * as tf from "@tensorflow/tfjs";
import { describe, expect, it } from "vitest";
import {
  calculateBrightness,
  calculateCosineSimilarity,
  calculateEAR,
  calculateFFTSpectrum,
  calculateFaceSize,
  calculateHeadTurnV2,
  checkOcclusion,
} from "./utils";

const p = (x, y, z = 0) => ({ x, y, z });

describe("Liveness Algorithms", () => {
  describe("calculateEAR (Eye Aspect Ratio)", () => {
    it("should return 0 if horizontal distance is 0", () => {
      const landmarks = Array(500).fill(p(0, 0, 0));
      const ear = calculateEAR(landmarks, "left");
      expect(ear).toBe(0);
    });

    it("should calculate correct ratio for a simple open eye", () => {
      const landmarks = Array(500).fill(p(0, 0, 0));
      landmarks[362] = p(0, 0);
      landmarks[263] = p(10, 0);
      landmarks[385] = p(5, 5);
      landmarks[380] = p(5, -5);
      landmarks[387] = p(5, 5);
      landmarks[373] = p(5, -5);

      const ear = calculateEAR(landmarks, "left");
      expect(ear).toBeCloseTo(1.0);
    });

    it("should calculate low ratio for closed eye", () => {
      const landmarks = Array(500).fill(p(0, 0, 0));
      landmarks[362] = p(0, 0);
      landmarks[263] = p(10, 0);
      landmarks[385] = p(5, 0.5);
      landmarks[380] = p(5, -0.5);
      landmarks[387] = p(5, 0.5);
      landmarks[373] = p(5, -0.5);

      const ear = calculateEAR(landmarks, "left");
      expect(ear).toBeCloseTo(0.1);
    });
  });

  describe("calculateCosineSimilarity", () => {
    it("should return 1.0 for identical vectors", () => {
      const vecA = [1, 0, 0];
      const vecB = [1, 0, 0];
      expect(calculateCosineSimilarity(vecA, vecB)).toBe(1);
    });

    it("should return 0 for orthogonal vectors", () => {
      const vecA = [1, 0, 0];
      const vecB = [0, 1, 0];
      expect(calculateCosineSimilarity(vecA, vecB)).toBe(0);
    });

    it("should return -1.0 for opposite vectors", () => {
      const vecA = [1, 0, 0];
      const vecB = [-1, 0, 0];
      expect(calculateCosineSimilarity(vecA, vecB)).toBe(-1);
    });

    it("should handle complex vectors", () => {
      const vecA = [0.5, 0.5, 0.5, 0.5];
      const vecB = [0.5, 0.5, 0.5, 0.5];
      expect(calculateCosineSimilarity(vecA, vecB)).toBeCloseTo(1);
    });
  });

  describe("calculateHeadTurnV2", () => {
    it("should return 0 for neutral pose (equal depth)", () => {
      const landmarks = Array(500).fill(p(0, 0, 0));
      landmarks[152] = p(5, 10, 0);
      landmarks[234] = p(0, 5, -1);
      landmarks[454] = p(10, 5, -1);

      const ratio = calculateHeadTurnV2(landmarks);
      expect(ratio).toBe(0);
    });

    it("should return positive for Left Turn (Right cheek moves away)", () => {
      const landmarks = Array(500).fill(p(0, 0, 0));
      landmarks[152] = p(5, 10, 0);

      landmarks[234] = p(0, 5, 0);
      landmarks[454] = p(10, 5, -5);

      landmarks[234] = p(0, 5, -5);
      landmarks[454] = p(10, 5, 0);

      const ratio = calculateHeadTurnV2(landmarks);
      expect(ratio).toBeGreaterThan(0);
    });
  });

  describe("calculateBrightness", () => {
    it("should calculate the mean brightness of a tensor", () => {
      const img = tf.tensor4d([0.1, 0.2, 0.3, 0.4], [1, 2, 2, 1]);
      const brightness = calculateBrightness(img);
      expect(brightness).toBeCloseTo(0.25);
      img.dispose();
    });
  });

  describe("checkOcclusion", () => {
    it("should return true if landmarks are missing", () => {
      expect(checkOcclusion([])).toBe(true);
      expect(checkOcclusion(Array(100).fill(p(0, 0)))).toBe(true);
    });

    it("should return false for fully visible face landmarks", () => {
      const landmarks = Array(468).fill(p(0, 0, 0));
      landmarks[362] = p(0, 0);
      landmarks[263] = p(1, 0);
      landmarks[33] = p(5, 0);
      landmarks[133] = p(6, 0);

      expect(checkOcclusion(landmarks)).toBe(false);
    });

    it("should return true if eyes are too close/collapsed (occlusion)", () => {
      const landmarks = Array(468).fill(p(0, 0, 0));
      landmarks[362] = p(0, 0);
      landmarks[263] = p(0.005, 0);
      landmarks[33] = p(5, 0);
      landmarks[133] = p(6, 0);

      expect(checkOcclusion(landmarks)).toBe(true);
    });
  });

  describe("calculateFFTSpectrum", () => {
    it("should return a number representing high-frequency energy", async () => {
      const img = tf.tidy(() => tf.randomNormal([1, 4, 4, 3]));
      const spectrum = await calculateFFTSpectrum(img);
      expect(typeof spectrum).toBe("number");
      img.dispose();
    });
  });

  describe("calculateFaceSize", () => {
    it("should return 0 if no landmarks", () => {
      expect(calculateFaceSize([])).toBe(0);
    });

    it("should return height of the face", () => {
      const landmarks = [
        p(0.25, 0.25),
        p(0.75, 0.25),
        p(0.25, 0.75),
        p(0.75, 0.75),
      ];
      expect(calculateFaceSize(landmarks)).toBeCloseTo(0.5);
    });

    it("should return height even for large coordinates", () => {
      const landmarks = [p(100, 100), p(300, 100), p(100, 400), p(300, 400)];
      expect(calculateFaceSize(landmarks)).toBe(300);
    });
  });
});
