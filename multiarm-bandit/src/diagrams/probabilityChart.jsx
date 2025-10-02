import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

export function ProbabilityChart({ probabilities, armNames }) {
  const data = armNames.map((name, i) => ({
    name,
    probability: probabilities[i],
  }));

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Wahrscheinlichkeit der Effizienz</h3>
      <BarChart
        width={700}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 14 }} />
        <YAxis domain={[0, 1]} tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} />
        <Tooltip formatter={(val) => `${(val * 100).toFixed(1)}%`} />
        <Bar dataKey="probability" fill="#fbbf24" radius={[8, 8, 0, 0]}>
          <LabelList
            dataKey="probability"
            position="top"
            formatter={(val) => `${(val * 100).toFixed(1)}%`}
            style={{ fontSize: "14px", fontWeight: "bold" }}
          />
        </Bar>
      </BarChart>
    </div>
  );
}
