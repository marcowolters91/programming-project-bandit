import { describe, it, expect, vi, beforeEach } from 'vitest';
import GaussianBandit from '../../src/functions/GaussBandit.js';

describe('GaussianBandit', () => {
  const strategyNames = ['A', 'B', 'C'];

  beforeEach(() => {
    vi.restoreAllMocks(); // alle Mocks zurücksetzen
  });

  it('initialisiert korrekt mit gegebenen Strategien', () => {
    vi.spyOn(global.Math, 'random').mockReturnValue(0.5); // deterministisch
    const bandit = new GaussianBandit(strategyNames);
    expect(bandit.K).toBe(3);
    expect(bandit.strategies).toHaveLength(3);
    expect(bandit.counts).toEqual([0, 0, 0]);
    expect(bandit.sumRewards).toEqual([0, 0, 0]);
    expect(typeof bandit.strategies[0].mean).toBe('number');
    expect(typeof bandit.strategies[0].sigma).toBe('number');
  });

  it('erzeugt deterministische Mittelwerte und sigma', () => {
    vi.spyOn(global.Math, 'random').mockReturnValue(0.5);
    const bandit = new GaussianBandit(['X']);
    // mean = 3 + 0.5 * 7 = 6.5
    expect(bandit.strategies[0].mean).toBeCloseTo(6.5, 5);
    // sigma = 0.5 + 0.5 * 1.5 = 1.25
    expect(bandit.strategies[0].sigma).toBeCloseTo(1.25, 5);
  });

  it('liefert Rewards, die sich um den Mittelwert bewegen', () => {
    const bandit = new GaussianBandit(['Test']);
    vi.spyOn(bandit, '_randn').mockReturnValue(0);
    const reward = bandit.pull(0);
    expect(reward).toBeCloseTo(bandit.strategies[0].mean, 10);
  });

  it('erhöht Zähler und Summen korrekt nach jedem Pull', () => {
    const bandit = new GaussianBandit(strategyNames);
    vi.spyOn(bandit, '_randn').mockReturnValue(1); // deterministisch
    const reward = bandit.pull(1);
    expect(bandit.counts[1]).toBe(1);
    expect(bandit.sumRewards[1]).toBeCloseTo(reward, 10);
    expect(bandit.totalPulls).toBe(1);
    expect(bandit.cumulativeReward).toBeCloseTo(reward, 10);
  });

  it('wirft keinen Fehler bei mehrfachen Zügen', () => {
    const bandit = new GaussianBandit(strategyNames);
    vi.spyOn(bandit, '_randn').mockReturnValue(0);
    expect(() => {
      for (let i = 0; i < 5; i++) bandit.pull(2);
    }).not.toThrow();
    expect(bandit.counts[2]).toBe(5);
  });

  it('setzt interne Zustände korrekt mit reset() zurück', () => {
    const bandit = new GaussianBandit(strategyNames);
    vi.spyOn(bandit, '_randn').mockReturnValue(0);
    bandit.pull(0);
    bandit.pull(1);
    bandit.reset();
    expect(bandit.counts).toEqual([0, 0, 0]);
    expect(bandit.sumRewards).toEqual([0, 0, 0]);
    expect(bandit.totalPulls).toBe(0);
    expect(bandit.cumulativeReward).toBe(0);
  });

  it('verwendet korrekt die Normalverteilung im _randn()', () => {
    const bandit = new GaussianBandit(['Demo']);
    // Mock Math.random, sodass u=0.25, v=0.75
    const mockValues = [0.25, 0.75];
    vi.spyOn(global.Math, 'random').mockImplementation(() => mockValues.shift() ?? 0.9);
    const z = bandit._randn();
    expect(Number.isFinite(z)).toBe(true);
  });

  it('berechnet _sampleReward basierend auf mean und sigma', () => {
    const bandit = new GaussianBandit(['Demo']);
    vi.spyOn(bandit, '_randn').mockReturnValue(1.5);
    const result = bandit._sampleReward(0);
    expect(result).toBeCloseTo(bandit.strategies[0].mean + 1.5 * bandit.strategies[0].sigma, 5);
  });
});
