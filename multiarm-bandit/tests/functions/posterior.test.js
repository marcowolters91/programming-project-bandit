import { describe, it, expect } from 'vitest';
import { posterior } from '../../src/functions/posterior.js';

describe('posterior', () => {
  it('gibt einen gültigen Index zurück (Bernoulli-Modus, allgemeiner Test)', () => {
    const successes = [3, 1, 2];
    const n_i = [5, 5, 5];
    const result = posterior(successes, n_i, 'bernoulli');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(successes.length);
  });

  it('gibt einen gültigen Index zurück (Gaussian-Modus, allgemeiner Test)', () => {
    const successes = [10, 5, 8];
    const n_i = [10, 10, 10];
    const result = posterior(successes, n_i, 'gaussian');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(successes.length);
  });

  it('funktioniert auch mit nur einem Arm', () => {
    const successes = [5];
    const n_i = [10];
    const result = posterior(successes, n_i, 'bernoulli');
    expect(result).toBe(0);
  });

  it('gibt gültigen Index zurück, wenn alle n_i = 0 (Bernoulli-Modus)', () => {
    const successes = [0, 0, 0];
    const n_i = [0, 0, 0];
    const result = posterior(successes, n_i, 'bernoulli');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(successes.length);
  });

  it('gibt gültigen Index zurück, wenn alle n_i = 0 (Gaussian-Modus)', () => {
    const successes = [0, 0, 0];
    const n_i = [0, 0, 0];
    const result = posterior(successes, n_i, 'gaussian');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(successes.length);
  });

  it('Fallback funktioniert, wenn keine Arme vorhanden sind', () => {
    const successes = [];
    const n_i = [];
    const resultBernoulli = posterior(successes, n_i, 'bernoulli');
    const resultGaussian = posterior(successes, n_i, 'gaussian');
    expect(resultBernoulli).toBe(0);
    expect(resultGaussian).toBe(0);
  });
});
