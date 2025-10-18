import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

function normalPDF(x, mu, sigma) {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}

export default function NormalDistributionChart({ bandit }) {
  const xMin = 0;
  const xMax = 35;
  const step = 0.2;

  const chartsData = bandit.strategies.map((s) => {
    const points = [];
    for (let x = xMin; x <= xMax; x += step) {
      points.push({
        x: parseFloat(x.toFixed(2)),
        [s.name]: normalPDF(x, s.mean, s.sigma),
      });
    }
    return points;
  });

  const mergedData = [];
  const len = chartsData[0]?.length || 0;
  for (let i = 0; i < len; i++) {
    const row = { x: chartsData[0][i].x };
    chartsData.forEach(strategyData => {
      Object.keys(strategyData[i]).forEach(key => {
        if (key !== 'x') row[key] = strategyData[i][key];
      });
    });
    mergedData.push(row);
  }

  if (mergedData.length === 0) {
    return <p>Keine Daten für Normalverteilung vorhanden.</p>;
  }

  return (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <h3>Normalverteilungen der Genres</h3>
      <LineChart
        width={700}
        height={400}
        data={mergedData}
        margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" type="number" domain={[xMin, xMax]} />
        <YAxis />
        <Tooltip />
        <Legend
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ marginTop: 25, whiteSpace: 'nowrap' }}
        />
        {bandit.strategies.map((s, i) => (
          <Line
            key={i}
            type="monotone"
            dataKey={s.name}
            name={s.name.slice(2)}
            stroke={`hsl(${i * (360 / bandit.strategies.length)}, 70%, 50%)`}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </div>
  );
}
