import { WaitingChallenge } from "./WaitingChallenge";
import { BlinkChallenge } from "./BlinkChallenge";
import { TurnLeftChallenge } from "./TurnLeftChallenge";
import { TurnRightChallenge } from "./TurnRightChallenge";

/**
 * ChallengeRegistry manages available challenge strategies.
 * Demonstrates Open/Closed Principle (open for adding new challenges without altering engine core).
 */
export class ChallengeRegistry {
  #strategies = new Map();

  constructor() {
    this.register(new WaitingChallenge());
    this.register(new BlinkChallenge());
    this.register(new TurnLeftChallenge());
    this.register(new TurnRightChallenge());
  }

  /**
   * Register a new challenge strategy.
   * @param {import("./BaseChallenge").BaseChallenge} challengeStrategy
   */
  register(challengeStrategy) {
    if (!challengeStrategy || !challengeStrategy.type) {
      throw new Error("Invalid challenge strategy registered.");
    }
    this.#strategies.set(challengeStrategy.type, challengeStrategy);
  }

  /**
   * Get a strategy by type.
   * @param {string} type
   * @returns {import("./BaseChallenge").BaseChallenge|undefined}
   */
  get(type) {
    return this.#strategies.get(type);
  }

  /**
   * Return array of valid registered types.
   * @returns {string[]}
   */
  getRegisteredTypes() {
    return Array.from(this.#strategies.keys());
  }

  /**
   * Resolve a sequence of challenges given optional config preferences.
   * @param {string[]|null} customChallenges
   * @returns {import("./BaseChallenge").BaseChallenge[]}
   */
  resolveSequence(customChallenges) {
    const validTypes = this.getRegisteredTypes();
    if (Array.isArray(customChallenges)) {
      const filtered = customChallenges.filter((c) => validTypes.includes(c));
      if (filtered.length > 0) {
        return filtered.map((type) => {
          const strategy = this.get(type);
          strategy.reset();
          return strategy;
        });
      }
    }

    // Default sequence: WAITING, BLINK, randomized TURN_LEFT & TURN_RIGHT
    const sequenceTypes = ["WAITING", "BLINK"];
    const turnPool = ["TURN_LEFT", "TURN_RIGHT"].sort(() => Math.random() - 0.5);
    sequenceTypes.push(...turnPool);

    return sequenceTypes.map((type) => {
      const strategy = this.get(type);
      strategy.reset();
      return strategy;
    });
  }
}
