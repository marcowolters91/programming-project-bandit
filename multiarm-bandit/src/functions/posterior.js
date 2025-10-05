export function posterior(successes, n_i, mode = "bernoulli") {
  const EPS = 1e-10;

  function randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  if (mode === "gaussian") {
    const means = successes.map((sum, i) =>
      n_i[i] > 0 ? sum / n_i[i] : 0
    );

    const samples = means.map((m, i) => {
      const variance = 1 / Math.max(1, n_i[i]);
      return m + Math.sqrt(variance) * randn();
    });

    const maxSample = Math.max(...samples);
    const bestArms = samples
      .map((v, i) => (Math.abs(v - maxSample) < EPS ? i : -1))
      .filter((i) => i !== -1);

    return bestArms.length > 0
      ? bestArms[Math.floor(Math.random() * bestArms.length)]
      : 0;
  }

  const samples = successes.map((s, i) => {
    const alpha = 1 + s;
    const beta = 1 + n_i[i] - s;

    const gamma = (k) => {
      let x = 0;
      for (let j = 0; j < k; j++) x += -Math.log(Math.random());
      return x;
    };

    return gamma(alpha) / (gamma(alpha) + gamma(beta));
  });

  const maxSample = Math.max(...samples);
  const bestArms = samples
    .map((v, i) => (Math.abs(v - maxSample) < EPS ? i : -1))
    .filter((i) => i !== -1);

  return bestArms.length > 0
    ? bestArms[Math.floor(Math.random() * bestArms.length)]
    : 0;
}
