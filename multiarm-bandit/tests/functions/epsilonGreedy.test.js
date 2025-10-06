import { describe, it, expect } from 'vitest';
import { epsilonGreedy } from '../../src/functions/epsilonGreedy.js';

describe('epsilonGreedy', () => {
  it('exploriert mit Wahrscheinlichkeit epsilon (zufälliger Arm)', () => {
    const originalRandom = Math.random;

    Math.random = () => 0.05;
    const result = epsilonGreedy([10, 20, 30], 3, 0.1);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(3);

    Math.random = originalRandom;
  });

  it('exploitiert das größte Element, wenn epsilon=0', () => {
    const originalRandom = Math.random;

    const successes = [1, 5, 3, 2];
    Math.random = () => 0.5;
    const result = epsilonGreedy(successes, 4, 0);
    expect(result).toBe(1);

    Math.random = originalRandom;
  });

  it('wählt zufällig zwischen gleichwertigen Maxima', () => {
    const successes = [4, 7, 7, 2];
    const originalRandom = Math.random;

    const epsilon = 0;

    Math.random = () => 0.0;
    expect(epsilonGreedy(successes, 4, epsilon)).toBe(1);

    Math.random = () => 0.999;
    expect(epsilonGreedy(successes, 4, epsilon)).toBe(2);

    Math.random = originalRandom;
  });

  it('verwendet counts zur Berechnung der Mittelwerte (Gaussian-Kompatibilität)', () => {
    const successes = [10, 5, 8];
    const counts = [2, 1, 4];
    const originalRandom = Math.random;

    const epsilon = 0;
    Math.random = () => 0.0;
    const result = epsilonGreedy(successes, 3, epsilon, counts);
    expect([0, 1]).toContain(result);

    Math.random = originalRandom;
  });

  it('funktioniert korrekt, wenn counts[i] = 0', () => {
    const successes = [10, 0];
    const counts = [2, 0];
    const epsilon = 0;
    const result = epsilonGreedy(successes, 2, epsilon, counts);
    expect(result).toBe(0);
  });

  it('gibt 0 zurück, wenn nur ein Arm vorhanden ist', () => {
    const result = epsilonGreedy([42], 1, 0);
    expect(result).toBe(0);
  });

  it('gibt undefined zurück, wenn Array leer ist', () => {
    const result = epsilonGreedy([], 0, 0);
    expect(result).toBeUndefined();
  });

  it('liefert eine gültige Armnummer auch bei counts = null', () => {
    const originalRandom = Math.random;

    const successes = [1, 2, 3];
    const epsilon = 0;
    Math.random = () => 0.5;
    const result = epsilonGreedy(successes, 3, epsilon);
    expect(result).toBe(2);

    Math.random = originalRandom;
  });
});
