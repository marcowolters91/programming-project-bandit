import { describe, it, expect, vi } from 'vitest';
import { randomChoice } from '../../src/functions/randomChoice.js';

describe('randomChoice', () => {
  it('soll eine Zahl zwischen 0 und armsCount-1 zurückgeben', () => {
    const armsCount = 5;
    const result = randomChoice(armsCount);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(armsCount);
  });

  it('soll zufällige Werte zurückgeben (Mock Test)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
    const result = randomChoice(10);
    expect(result).toBe(4); // 0.42 * 10 = 4.2 -> floor = 4
    Math.random.mockRestore();
  });

  it('soll einen Fehler werfen, wenn armsCount <= 0 ist', () => {
    expect(() => randomChoice(0)).toThrow('armsCount must be a positive number');
    expect(() => randomChoice(-3)).toThrow('armsCount must be a positive number');
  });

  it('soll einen Fehler werfen, wenn armsCount kein number ist', () => {
    expect(() => randomChoice('abc')).toThrow('armsCount must be a positive number');
    expect(() => randomChoice(null)).toThrow('armsCount must be a positive number');
    expect(() => randomChoice(undefined)).toThrow('armsCount must be a positive number');
  });
});
