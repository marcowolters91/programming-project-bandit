import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function AlgorithmHitsChart({ histories }) {
  // Maximale Rundenzahl (um die X-Achse zu bestimmen)
  const maxTurns = Math.max(...Object.values(histories).map(arr => arr.length));

  const data = Array.from({ length: maxTurns }, (_, turn) => {
    const entry = { round: turn + 1 };
    Object.keys(histories).forEach(algo => {
      const hist = histories[algo].slice(0, turn + 1);
      entry[algo] = hist.reduce((sum, h) => sum + h.reward, 0);
    });
    return entry;
  });

  // Farben: rotierend, User bekommt fest lila
  const colors = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#0ea5e9', '#22c55e', '#8b5cf6'];

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>Chart: Trefferverlauf der Algorithmen und des Users</h3>

      <LineChart
        width={700}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        {/* X-Achse: Runde */}
        <XAxis
          dataKey="round"
          label={{
            value: 'Runde',
            position: 'insideBottomRight',
            offset: -5,
            style: { textAnchor: 'middle' },
          }}
        />

        {/* Y-Achse: Kumulierte Treffer */}
        <YAxis
          label={{
            value: 'Kumulierte Treffer',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
          }}
        />

        <Tooltip />

        {/* Legende mit zusätzlichem Abstand */}
        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ marginTop: 25 }} />

        {/* Linien pro Algorithmus */}
        {Object.keys(histories).map((algo, idx) => {
          if (histories[algo].length === 0) return null;

          const color = algo === 'User' ? '#8b5cf6' : colors[idx % colors.length];

          return (
            <Line
              key={algo}
              type="monotone"
              dataKey={algo}
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          );
        })}
      </LineChart>
    </div>
  );
}
