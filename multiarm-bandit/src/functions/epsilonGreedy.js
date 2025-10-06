export function epsilonGreedy(successes, armsCount, epsilon = 0.1, counts = null) {
  if (Math.random() < epsilon) {
    return Math.floor(Math.random() * armsCount);
  }

  const values = counts ? successes.map((s, i) => (counts[i] > 0 ? s / counts[i] : 0)) : successes;

  const maxValue = Math.max(...values);
  const bestArms = values.map((v, i) => (v === maxValue ? i : -1)).filter(i => i !== -1);

  return bestArms[Math.floor(Math.random() * bestArms.length)];
}
