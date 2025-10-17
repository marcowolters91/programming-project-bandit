export default class BernoulliBandit {
  constructor(armNames) {
    this.armNames = [...armNames];
    this.K = this.armNames.length;

    this.probabilities = Array.from(
      { length: this.K },
      () => Math.round((Math.random() * 0.9 + 0.05) * 100) / 100
    );
  }

  pull(armIndex) {
    if (armIndex < 0 || armIndex >= this.K) {
      throw new Error('Ungültiger Arm-Index im BernoulliBandit');
    }
    const p = this.probabilities[armIndex];
    return Math.random() < p ? 1 : 0;
  }

  getArms() {
    return this.K;
  }

  getProbabilities() {
    return [...this.probabilities];
  }

  getArmNames() {
    return [...this.armNames];
  }
}
