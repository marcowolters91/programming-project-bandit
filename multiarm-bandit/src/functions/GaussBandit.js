export default class GaussianBandit {
  constructor(strategyNames, sigma = 1.0) {
    this.K = strategyNames.length;
    this.strategies = strategyNames.map((name) => ({
      name,
      mean: this._randomMean(3, 10), // zufälliger Mittelwert zwischen 3–10 kW
    }));
    this.sigma = sigma;

    this.counts = Array(this.K).fill(0);
    this.sumRewards = Array(this.K).fill(0);
    this.totalPulls = 0;
    this.cumulativeReward = 0;
  }

  pull(strategyIndex) {
    const reward = this._sampleReward(strategyIndex);
    this.counts[strategyIndex]++;
    this.sumRewards[strategyIndex] += reward;
    this.totalPulls++;
    this.cumulativeReward += reward;
    return reward;
  }

  _sampleReward(strategyIndex) {
    const mu = this.strategies[strategyIndex].mean;
    return mu + this._randn() * this.sigma;
  }

  reset() {
    this.counts.fill(0);
    this.sumRewards.fill(0);
    this.totalPulls = 0;
    this.cumulativeReward = 0;
  }

  _randomMean(min, max) {
    return min + Math.random() * (max - min);
  }

  _randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }
}
