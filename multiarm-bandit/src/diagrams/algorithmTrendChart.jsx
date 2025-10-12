import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function UserGreedyTrend({
  userHistory = [],
  greedyHistory = [],
  epsilonHistory = [],
}) {
  // Prüfen, ob überhaupt Daten vorhanden sind
  const hasData = userHistory.length > 0 || greedyHistory.length > 0 || epsilonHistory.length > 0;

  // Rohdaten für das Diagramm aufbereiten
  const rawData = userHistory.map((u, i) => ({
    Runde: u.turn,
    User: u.reward,
    Greedy: greedyHistory[i]?.reward ?? null,
    EpsilonGreedy: epsilonHistory[i]?.reward ?? null,
  }));

  // Wenn keine Daten vorhanden sind, Dummy-Datum einfügen
  const data = hasData ? rawData : [{ Runde: 0, User: null, Greedy: null, EpsilonGreedy: null }];

  return (
    <div style={{ textAlign: 'center' }}>
      <h4>Hörverlauf pro Runde</h4>

      <LineChart
        width={700}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        {/* X-Achse: Runde */}
        <XAxis
          dataKey="Runde"
          label={{
            value: 'Runde',
            position: 'insideBottomRight',
            offset: -5,
            style: { textAnchor: 'middle' },
          }}
          domain={[0, 'dataMax']}
          allowDecimals={false}
        />

        {/* Y-Achse: Hörzeit */}
        <YAxis
          label={{
            value: 'Hörzeit',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
          }}
        />

        <Tooltip />
        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ marginTop: 25 }} />

        {/* Linien für User, Greedy und Epsilon-Greedy */}
        <Line
          type="monotone"
          dataKey="User"
          name="User"
          stroke="#82ca9d"
          strokeWidth={2}
          dot={false}
          connectNulls={true}
          isAnimationActive={true}
        />
        <Line
          type="monotone"
          dataKey="Greedy"
          name="Greedy"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
          connectNulls={true}
          isAnimationActive={true}
        />
        <Line
          type="monotone"
          dataKey="EpsilonGreedy"
          name="Epsilon"
          stroke="#ff7300"
          strokeWidth={2}
          dot={false}
          connectNulls={true}
          isAnimationActive={true}
        />
      </LineChart>

      {/* Hinweistext bei fehlenden Daten */}
      {!hasData && <p style={{ marginTop: '1rem', color: '#666' }}></p>}
    </div>
  );
}
