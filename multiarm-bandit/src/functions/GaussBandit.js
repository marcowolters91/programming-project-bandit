export default class GaussianBandit {
  constructor(strategyNames) {
    this.K = strategyNames.length;

    // Jede Strategie = Genre mit zufälliger mittlerer Hörzeit
    this.strategies = strategyNames.map(name => ({
      name,
      mean: 1 + Math.random() * 29,   // Mittelwert zwischen 1 und 30 Minuten
      sigma: 1 + Math.random() * 4,   // Standardabweichung zwischen 1 und 5 Minuten
    }));

    // Statistik-Zähler
    this.counts = Array(this.K).fill(0);
    this.sumRewards = Array(this.K).fill(0);
    this.totalPulls = 0;
    this.cumulativeReward = 0;
  }

  // Ziehen eines Genres → return Hörzeit
  pull(strategyIndex) {
    const reward = this._sampleReward(strategyIndex);
    this.counts[strategyIndex]++;
    this.sumRewards[strategyIndex] += reward;
    this.totalPulls++;
    this.cumulativeReward += reward;
    return reward;
  }

  // Stochastische Hörzeit aus Normalverteilung
  _sampleReward(strategyIndex) {
    const { mean, sigma } = this.strategies[strategyIndex];
    const reward = mean + this._randn() * sigma;
    return Math.max(1, Math.min(reward, 30)); // begrenze zwischen 1 und 30 Minuten
  }

  // Reset der Statistik, Distribution bleibt gleich
  reset() {
    this.counts.fill(0);
    this.sumRewards.fill(0);
    this.totalPulls = 0;
    this.cumulativeReward = 0;
  }

  // Standardnormalverteilung (Box-Muller)
  _randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }
}
