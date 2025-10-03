import { describe, it, expect } from "vitest";
import { greedy } from "../../src/functions/greedy.js";

describe("greedy", () => {
  it("gibt den Index des größten Elements zurück", () => {
    const result = greedy([1, 5, 3, 2]);
    expect(result).toBe(1);
  });

  it("liefert je nach Math.random unterschiedliche Indizes bei mehreren Maxima", () => {
    const successes = [4, 7, 7, 2];

    // Math.random auf 0 setzen → erster Index
    const originalRandom = Math.random;
    Math.random = () => 0.0;
    expect(greedy(successes)).toBe(1);

    // Math.random auf 0.999 setzen → zweiter Index
    Math.random = () => 0.999;
    expect(greedy(successes)).toBe(2);

    // wiederherstellen
    Math.random = originalRandom;
  });

  it("funktioniert mit nur einem Element", () => {
    const result = greedy([42]);
    expect(result).toBe(0);
  });

  it("gibt undefined zurück, wenn Array leer ist", () => {
    const result = greedy([]);
    expect(result).toBeUndefined();
  });
});
