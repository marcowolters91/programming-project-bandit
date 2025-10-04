export function ucb(successes, n_i, total) {
  const ucbValues = successes.map((s, i) => {
    if (n_i[i] === 0) return Infinity;
    return s / n_i[i] + Math.sqrt((2 * Math.log(total + 1)) / n_i[i]);
  });
  const maxUCB = Math.max(...ucbValues);
  const bestArms = ucbValues.map((v, i) => (v === maxUCB ? i : -1)).filter(i => i !== -1);
  return bestArms[Math.floor(Math.random() * bestArms.length)];
}
