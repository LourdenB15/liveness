import { describe, expect, it } from "vitest";
import { ChallengeRegistry } from "./ChallengeRegistry";
import { WaitingChallenge } from "./WaitingChallenge";
import { BlinkChallenge } from "./BlinkChallenge";
import { TurnLeftChallenge } from "./TurnLeftChallenge";
import { TurnRightChallenge } from "./TurnRightChallenge";

describe("Challenge Strategies (SOLID SRP & OCP)", () => {
  const mockConfig = {
    minFaceSize: 0.3,
    maxFaceSize: 0.6,
    blinkEARThreshold: 0.25,
    headTurnThreshold: 0.4,
  };

  it("WaitingChallenge evaluates distance correctly", () => {
    const challenge = new WaitingChallenge();
    // Too small face
    const mockLandmarksSmall = [{ y: 0.1 }, { y: 0.2 }]; // height = 0.1
    let result = challenge.evaluate(mockLandmarksSmall, mockConfig);
    expect(result.passed).toBe(false);
    expect(result.distance).toBe("CLOSER");

    // Too large face
    const mockLandmarksLarge = [{ y: 0.1 }, { y: 0.8 }]; // height = 0.7
    result = challenge.evaluate(mockLandmarksLarge, mockConfig);
    expect(result.passed).toBe(false);
    expect(result.distance).toBe("FURTHER");

    // Optimal face
    const mockLandmarksOptimal = [{ y: 0.1 }, { y: 0.5 }]; // height = 0.4
    result = challenge.evaluate(mockLandmarksOptimal, mockConfig);
    expect(result.passed).toBe(true);
    expect(result.distance).toBeNull();
  });

  it("ChallengeRegistry resolves custom and default challenge sequences with randomization", () => {
    const registry = new ChallengeRegistry();

    // Custom sequence without WAITING should contain all elements in any order
    const sequence = registry.resolveSequence(["BLINK", "TURN_LEFT"]);
    expect(sequence.length).toBe(2);
    const customTypes = sequence.map((s) => s.type);
    expect(customTypes).toEqual(expect.arrayContaining(["BLINK", "TURN_LEFT"]));

    // Default sequence should start with WAITING and contain all registered active challenges
    const defaultSequence = registry.resolveSequence(null);
    expect(defaultSequence.length).toBe(4);
    expect(defaultSequence[0].type).toBe("WAITING");
    const activeTypes = defaultSequence.slice(1).map((s) => s.type);
    expect(activeTypes).toEqual(expect.arrayContaining(["BLINK", "TURN_LEFT", "TURN_RIGHT"]));

    // Verify randomization across multiple calls
    let foundDifferentOrder = false;
    const firstActiveOrder = registry.resolveSequence(null).slice(1).map((s) => s.type).join(",");
    for (let i = 0; i < 20; i++) {
      const nextActiveOrder = registry.resolveSequence(null).slice(1).map((s) => s.type).join(",");
      if (nextActiveOrder !== firstActiveOrder) {
        foundDifferentOrder = true;
        break;
      }
    }
    expect(foundDifferentOrder).toBe(true);
  });
});
