export function greedy(values) {
  const maxValue = Math.max(...values);
  const bestArms = values.map((v, i) => (v === maxValue ? i : -1)).filter(i => i !== -1);
  return bestArms[Math.floor(Math.random() * bestArms.length)];
}
