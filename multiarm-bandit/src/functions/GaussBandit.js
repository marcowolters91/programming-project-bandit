export default class GaussianBandit {
  constructor(strategyNames) {
    this.K = strategyNames.length;

    this.strategies = strategyNames.map(name => ({
      name,
      mean: 3 + Math.random() * 7,
      sigma: 0.5 + Math.random() * 1.5,
    }));

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
    const { mean, sigma } = this.strategies[strategyIndex];
    return mean + this._randn() * sigma;
  }

  reset() {
    this.counts.fill(0);
    this.sumRewards.fill(0);
    this.totalPulls = 0;
    this.cumulativeReward = 0;
  }

  _randn() {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }
}
