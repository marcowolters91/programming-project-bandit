import { describe, it, expect, vi, beforeEach } from 'vitest';
import GaussianBandit from '../../src/functions/GaussBandit.js';

describe('GaussianBandit', () => {
  const strategyNames = ['A', 'B', 'C'];

  beforeEach(() => {
    vi.restoreAllMocks(); // alle Mocks zurücksetzen
  });

  it('initialisiert korrekt mit gegebenen Strategien', () => {
    const bandit = new GaussianBandit(strategyNames, 1.5);
    expect(bandit.K).toBe(3);
    expect(bandit.sigma).toBe(1.5);
    expect(bandit.strategies).toHaveLength(3);
    expect(bandit.counts).toEqual([0, 0, 0]);
    expect(bandit.sumRewards).toEqual([0, 0, 0]);
    expect(typeof bandit.strategies[0].mean).toBe('number');
  });

  it('erzeugt unterschiedliche zufällige Mittelwerte zwischen 3 und 10', () => {
    vi.spyOn(global.Math, 'random').mockReturnValue(0.5);
    const bandit = new GaussianBandit(['X'], 1.0);
    // randomMean = 3 + 0.5 * (10 - 3) = 6.5
    expect(bandit.strategies[0].mean).toBeCloseTo(6.5, 5);
  });

  it('liefert Rewards, die sich um den Mittelwert bewegen', () => {
    const bandit = new GaussianBandit(['Test'], 0);
    // sigma = 0 → reward == mean
    const reward = bandit.pull(0);
    expect(reward).toBeCloseTo(bandit.strategies[0].mean, 10);
  });

  it('erhöht Zähler und Summen korrekt nach jedem Pull', () => {
    const bandit = new GaussianBandit(strategyNames);
    const reward = bandit.pull(1);
    expect(bandit.counts[1]).toBe(1);
    expect(bandit.sumRewards[1]).toBeCloseTo(reward, 10);
    expect(bandit.totalPulls).toBe(1);
    expect(bandit.cumulativeReward).toBeCloseTo(reward, 10);
  });

  it('wirft keinen Fehler bei mehrfachen Zügen', () => {
    const bandit = new GaussianBandit(strategyNames);
    expect(() => {
      for (let i = 0; i < 5; i++) bandit.pull(2);
    }).not.toThrow();
    expect(bandit.counts[2]).toBe(5);
  });

  it('setzt interne Zustände korrekt mit reset() zurück', () => {
    const bandit = new GaussianBandit(strategyNames);
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
    // Mock Math.random so that u=0.25, v=0.75
    const mockValues = [0.25, 0.75];
    vi.spyOn(global.Math, 'random').mockImplementation(() => mockValues.shift() ?? 0.9);
    const z = bandit._randn();
    // Erwartung: nur prüfen, dass es eine endliche Zahl ist
    expect(Number.isFinite(z)).toBe(true);
  });

  it('berechnet _sampleReward basierend auf mean und sigma', () => {
    const bandit = new GaussianBandit(['Demo'], 2);
    vi.spyOn(bandit, '_randn').mockReturnValue(1.5);
    const result = bandit._sampleReward(0);
    expect(result).toBeCloseTo(bandit.strategies[0].mean + 1.5 * 2, 5);
  });
});
