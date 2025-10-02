export function epsilonGreedy(successes, armsCount, epsilon = 0.1) {
  if (Math.random() < epsilon) {
    return Math.floor(Math.random() * armsCount);
  }
  const maxSuccess = Math.max(...successes);
  const bestArms = successes
    .map((v, i) => (v === maxSuccess ? i : -1))
    .filter((i) => i !== -1);
  return bestArms[Math.floor(Math.random() * bestArms.length)];
}
