export default class BernoulliBandit {
  constructor(probabilities) {
    this.probabilities = probabilities;
  }

  pull(armIndex) {
    if (armIndex < 0 || armIndex >= this.probabilities.length) {
      throw new Error("Ungültiger Arm gewählt");
    }
    const p = this.probabilities[armIndex];
    return Math.random() < p ? 1 : 0;
  }

  getArms() {
    return this.probabilities.length;
  }
}
