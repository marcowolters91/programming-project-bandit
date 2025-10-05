import { describe, it, expect, vi } from 'vitest';
import BernoulliBandit from '../../src/functions/BernoulliBandit.js';

describe('BernoulliBandit', () => {
  it('soll die richtige Anzahl an Armen zurückgeben', () => {
    const bandit = new BernoulliBandit([0.2, 0.5, 0.8]);
    expect(bandit.getArms()).toBe(3);
  });

  it('soll einen Fehler werfen, wenn ein ungültiger ArmIndex genutzt wird', () => {
    const bandit = new BernoulliBandit([0.3, 0.7]);
    expect(() => bandit.pull(-1)).toThrow();
    expect(() => bandit.pull(5)).toThrow();
  });

  it('soll 1 zurückgeben, wenn Math.random() kleiner als Wahrscheinlichkeit ist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1); // kleiner als 0.5
    const bandit = new BernoulliBandit([0.5]);
    expect(bandit.pull(0)).toBe(1);
    Math.random.mockRestore();
  });

  it('soll 0 zurückgeben, wenn Math.random() größer als Wahrscheinlichkeit ist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9); // größer als 0.5
    const bandit = new BernoulliBandit([0.5]);
    expect(bandit.pull(0)).toBe(0);
    Math.random.mockRestore();
  });

  it('soll nur 0 oder 1 zurückgeben (keine anderen Werte)', () => {
    const bandit = new BernoulliBandit([0.3, 0.7]);
    for (let i = 0; i < 100; i++) {
      const result = bandit.pull(0);
      expect([0, 1]).toContain(result);
    }
  });
});
