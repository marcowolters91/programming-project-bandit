import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

function normalPDF(x, mu, sigma) {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}

export default function NormalDistributionChart({ strategies, counts, bandit }) {
  const chartsData = strategies
    .map((s, i) => {
      const { mean, sigma } = bandit.strategies[i];
      if (!counts[i] || counts[i] === 0) return null;

      const points = [];
      for (let x = mean - 3 * sigma; x <= mean + 3 * sigma; x += sigma / 20) {
        points.push({
          x: parseFloat(x.toFixed(2)),
          [s.name]: normalPDF(x, mean, sigma),
        });
      }
      return points;
    })
    .filter(Boolean);

  if (chartsData.length === 0) {
    return <p>Keine Daten für Normalverteilung vorhanden.</p>;
  }

  const mergedData = [];
  const maxLen = Math.max(...chartsData.map(d => d.length));
  for (let j = 0; j < maxLen; j++) {
    const row = {};
    chartsData.forEach(strategyData => {
      if (strategyData[j]) {
        Object.keys(strategyData[j]).forEach(key => {
          if (key === 'x') row.x = strategyData[j].x;
          else row[key] = strategyData[j][key];
        });
      }
    });
    mergedData.push(row);
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h4>Normalverteilungen der Heizstrategien</h4>
      <LineChart width={700} height={350} data={mergedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Legend />
        {strategies.map((s, i) =>
          counts[i] > 0 ? (
            <Line
              key={i}
              type="monotone"
              dataKey={s.name}
              stroke={`hsl(${i * 90}, 70%, 50%)`}
              dot={false}
            />
          ) : null
        )}
      </LineChart>
    </div>
  );
}
