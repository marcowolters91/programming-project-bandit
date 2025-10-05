import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function UserGreedyTrend({ userHistory, greedyHistory }) {
  const data = userHistory.map((u, i) => ({
    Runde: u.turn,
    User: u.reward,
    Greedy: greedyHistory[i]?.reward ?? null,
  }));

  if (data.length === 0) {
    return <p>Keine Verlaufsdaten vorhanden.</p>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h4>Leistungsverlauf pro Runde (User vs. Greedy)</h4>
      <LineChart width={700} height={350} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Runde" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="User" stroke="#82ca9d" dot={false} />
        <Line type="monotone" dataKey="Greedy" stroke="#8884d8" dot={false} />
      </LineChart>
    </div>
  );
}
