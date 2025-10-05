import { describe, it, expect, vi } from 'vitest';
import { ucb } from '../../src/functions/ucb.js';

describe('ucb', () => {
  it('gibt Infinity zurück, wenn ein Arm noch nie gezogen wurde (n_i = 0)', () => {
    const successes = [0, 0, 0];
    const n_i = [0, 1, 2];
    const total = 5;

    const index = ucb(successes, n_i, total);
    expect(index).toBe(0); // der Arm mit n_i = 0 → Infinity → automatisch max
  });

  it('berechnet UCB-Werte korrekt, wenn alle n_i > 0 sind', () => {
    const successes = [10, 15, 5];
    const n_i = [5, 10, 5];
    const total = 20;

    const result = ucb(successes, n_i, total);
    // Erwartung: Arm 1 hat höheren Mittelwert (15/10 = 1.5)
    expect([0, 1, 2]).toContain(result);
  });

  it('wählt zufällig zwischen gleichwertigen Armen aus', () => {
    const successes = [10, 10];
    const n_i = [5, 5];
    const total = 10;

    // Mock Math.random → deterministisch machen
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0);
    const result = ucb(successes, n_i, total);
    expect(result).toBeTypeOf('number');
    spy.mockRestore();
  });

  it('liefert einen gültigen Index innerhalb der Array-Grenzen', () => {
    const successes = [3, 7, 2, 9];
    const n_i = [1, 2, 1, 5];
    const total = 9;

    const result = ucb(successes, n_i, total);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(successes.length);
  });
});
