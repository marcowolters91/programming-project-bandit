export function posterior(successes, n_i) {
  const samples = successes.map((s, i) => {
    const alpha = 1 + s;
    const beta = 1 + n_i[i] - s;
    const gamma = k => {
      let x = 0;
      for (let j = 0; j < k; j++) x += -Math.log(Math.random());
      return x;
    };
    return gamma(alpha) / (gamma(alpha) + gamma(beta));
  });
  const maxSample = Math.max(...samples);
  const bestArms = samples.map((v, i) => (v === maxSample ? i : -1)).filter(i => i !== -1);
  return bestArms[Math.floor(Math.random() * bestArms.length)];
}
