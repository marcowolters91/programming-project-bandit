import { describe, it, expect } from 'vitest';
import { posterior } from '../../src/functions/posterior.js';

describe('posterior', () => {
  it('gibt einen gültigen Index im Bernoulli-Modus zurück', () => {
    const successes = [3, 1, 2];
    const n_i = [5, 5, 5];
    const result = posterior(successes, n_i, 'bernoulli');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(successes.length);
  });

  it('gibt einen gültigen Index im Gaussian-Modus zurück', () => {
    const successes = [10, 5, 8];
    const n_i = [10, 10, 10];
    const result = posterior(successes, n_i, 'gaussian');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(successes.length);
  });

  it('bevorzugt im Gaussian-Modus Arme mit höherem Mittelwert', () => {
    const successes = [100, 50];
    const n_i = [10, 10];
    const result = posterior(successes, n_i, 'gaussian');
    expect(result).toBe(0);
  });

  it('bevorzugt im Bernoulli-Modus Arme mit höherer Erfolgsrate', () => {
    const successes = [9, 3];
    const n_i = [10, 10];
    const result = posterior(successes, n_i, 'bernoulli');
    expect(result).toBe(0);
  });

  it('funktioniert mit nur einem Arm', () => {
    const successes = [5];
    const n_i = [10];
    const result = posterior(successes, n_i, 'bernoulli');
    expect(result).toBe(0);
  });

  it('liefert unterschiedliche Ergebnisse bei mehreren gleichwertigen Armen', () => {
    const successes = [5, 5];
    const n_i = [10, 10];
    const originalRandom = Math.random;

    Math.random = () => 0.0;
    expect(posterior(successes, n_i, 'bernoulli')).toBe(0);

    Math.random = () => 0.999;
    expect(posterior(successes, n_i, 'bernoulli')).toBe(1);

    Math.random = originalRandom;
  });

  it('gibt gültigen Index zurück, wenn alle n_i = 0 im Bernoulli-Modus sind', () => {
    const successes = [0, 0, 0];
    const n_i = [0, 0, 0];
    const result = posterior(successes, n_i, 'bernoulli');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(successes.length);
  });

  it('gibt gültigen Index zurück, wenn alle n_i = 0 im Gaussian-Modus sind', () => {
    const successes = [0, 0, 0];
    const n_i = [0, 0, 0];
    const result = posterior(successes, n_i, 'gaussian');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(successes.length);
  });

  it('löst deterministisch den Fallback aus, wenn bestArms leer ist', () => {
    const successes = [];
    const n_i = [];

    const result = posterior(successes, n_i, 'bernoulli');
    expect(result).toBe(0);

    const resultGaussian = posterior(successes, n_i, 'gaussian');
    expect(resultGaussian).toBe(0);
  });
});
