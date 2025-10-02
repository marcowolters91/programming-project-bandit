import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export function AlgorithmHitsChart({ histories }) {
  const maxTurns = Math.max(...Object.values(histories).map((arr) => arr.length));

  // Daten vorbereiten: pro Runde kumulierte Treffer pro Algorithmus
  const data = Array.from({ length: maxTurns }, (_, turn) => {
    const entry = { round: turn + 1 };
    Object.keys(histories).forEach((algo) => {
      const hist = histories[algo].slice(0, turn + 1);
      entry[algo] = hist.reduce((sum, h) => sum + h.reward, 0);
    });
    return entry;
  });

  // Farben (für andere Algorithmen rotiert, User fest lila)
  const colors = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#0ea5e9", "#22c55e", "#8b5cf6"];

  return (
    <div>
      <h3>Treffer pro Algorithmus</h3>
      <LineChart width={700} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="round" />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(histories).map((algo, idx) => {
          if (histories[algo].length === 0) return null;

          // User bekommt immer Lila (#8b5cf6)
          const color = algo === "User" ? "#8b5cf6" : colors[idx % colors.length];

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
