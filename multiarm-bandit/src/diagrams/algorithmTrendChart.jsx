import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function UserGreedyTrend({
  userHistory = [],
  greedyHistory = [],
  epsilonHistory = [],
}) {
  // Prüfen, ob überhaupt Daten vorhanden sind
  const hasData = userHistory.length > 0 || greedyHistory.length > 0 || epsilonHistory.length > 0;

  // Kumulative Summen und Durchschnittswerte berechnen
  let userSum = 0;
  let greedySum = 0;
  let epsilonSum = 0;

  const rawData = userHistory.map((u, i) => {
    userSum += u.reward;
    const gReward = greedyHistory[i]?.reward ?? null;
    const eReward = epsilonHistory[i]?.reward ?? null;

    if (gReward != null) greedySum += gReward;
    if (eReward != null) epsilonSum += eReward;

    const round = i + 1;
    return {
      Runde: u.turn,
      User: userSum / round,
      Greedy: greedyHistory[i] ? greedySum / round : null,
      EpsilonGreedy: epsilonHistory[i] ? epsilonSum / round : null,
    };
  });

  // Falls keine Daten vorhanden sind → Dummy
  const data = hasData ? rawData : [{ Runde: 0, User: null, Greedy: null, EpsilonGreedy: null }];

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>Durchschnittlicher Reward pro Runde (kumulativ)</h3>

      <LineChart
        width={700}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />

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

        <YAxis
          label={{
            value: 'Ø Reward',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
          }}
        />

        <Tooltip />
        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ marginTop: 25 }} />

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

      {!hasData && <p style={{ marginTop: '1rem', color: '#666' }}>Keine Daten vorhanden</p>}
    </div>
  );
}
