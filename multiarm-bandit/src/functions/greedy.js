export function greedy(successes) {
  const maxSuccess = Math.max(...successes);
  const bestArms = successes
    .map((v, i) => (v === maxSuccess ? i : -1))
    .filter((i) => i !== -1);
  return bestArms[Math.floor(Math.random() * bestArms.length)];
}
