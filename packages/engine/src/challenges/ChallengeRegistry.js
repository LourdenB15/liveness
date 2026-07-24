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
   * Resolve a randomized sequence of challenges given optional config preferences.
   * If WAITING challenge is in the sequence, it remains as the initial face positioning step.
   * All active challenges are randomly shuffled to prevent replay attacks.
   * @param {string[]|null} customChallenges
   * @returns {import("./BaseChallenge").BaseChallenge[]}
   */
  resolveSequence(customChallenges) {
    const validTypes = this.getRegisteredTypes();
    let selectedTypes;

    if (Array.isArray(customChallenges)) {
      const filtered = customChallenges.filter((c) => validTypes.includes(c));
      if (filtered.length > 0) {
        selectedTypes = filtered;
      }
    }

    if (!selectedTypes) {
      selectedTypes = validTypes;
    }

    const hasWaiting = selectedTypes.includes("WAITING");
    const activeTypes = selectedTypes.filter((type) => type !== "WAITING");

    // Fisher-Yates random shuffle for active challenges
    const shuffledActive = [...activeTypes];
    for (let i = shuffledActive.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledActive[i], shuffledActive[j]] = [shuffledActive[j], shuffledActive[i]];
    }

    const sequenceTypes = hasWaiting ? ["WAITING", ...shuffledActive] : shuffledActive;

    return sequenceTypes.map((type) => {
      const strategy = this.get(type);
      strategy.reset();
      return strategy;
    });
  }
}
