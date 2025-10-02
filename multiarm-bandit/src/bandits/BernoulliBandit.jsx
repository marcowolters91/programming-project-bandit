import { useMemo, useState } from "react";
import "../styles/bandit.css";
import banditImage from "../assets/bandit.png";
import BernoulliBandit from "../functions/BernoulliBandit.js";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LabelList } from "recharts";

export default function BernoulliBanditUI({ title = "Bernoulli-Bandit" }) {
  const [armsCount, setArmsCount] = useState(4);
  const generateProbabilities = (count) =>
    Array.from({ length: count }, () => Math.floor(Math.random() * 101) / 100);

  const [probabilities, setProbabilities] = useState(generateProbabilities(armsCount));
  const bandit = useMemo(() => new BernoulliBandit(probabilities), [probabilities]);

  const algorithmsList = ["Random", "Greedy", "Epsilon", "UCB", "Posterior", "Manual"];
  const epsilon = 0.1;

  const [histories, setHistories] = useState(
    Object.fromEntries(algorithmsList.map((algo) => [algo, []]))
  );

  const [maxTurns, setMaxTurns] = useState("");
  const [turns, setTurns] = useState(0);
  const [locked, setLocked] = useState(false);

  const armNames = useMemo(
    () => Array.from({ length: armsCount }, (_, i) => `Heizstrategie ${String.fromCharCode(65 + i)}`),
    [armsCount]
  );

  const getStats = (algorithm) => {
    const data = histories[algorithm];
    const n_i = Array(armsCount).fill(0);
    const successes = Array(armsCount).fill(0);
    data.forEach((h) => {
      n_i[h.arm]++;
      if (h.reward === 1) successes[h.arm]++;
    });
    return { n_i, successes, total: data.length };
  };

  const chooseArm = (algorithm) => {
    const { n_i, successes, total } = getStats(algorithm);

    if (algorithm === "Random") return Math.floor(Math.random() * armsCount);

    if (algorithm === "Greedy") {
      const maxSuccess = Math.max(...successes);
      const bestArms = successes.map((v, i) => (v === maxSuccess ? i : -1)).filter((i) => i !== -1);
      return bestArms[Math.floor(Math.random() * bestArms.length)];
    }

    if (algorithm === "Epsilon") {
      if (Math.random() < epsilon) return Math.floor(Math.random() * armsCount);
      const maxSuccess = Math.max(...successes);
      const bestArms = successes.map((v, i) => (v === maxSuccess ? i : -1)).filter((i) => i !== -1);
      return bestArms[Math.floor(Math.random() * bestArms.length)];
    }

    if (algorithm === "UCB") {
      const ucbValues = successes.map((s, i) => {
        if (n_i[i] === 0) return Infinity;
        return s / n_i[i] + Math.sqrt((2 * Math.log(total + 1)) / n_i[i]);
      });
      const maxUCB = Math.max(...ucbValues);
      const bestArms = ucbValues.map((v, i) => (v === maxUCB ? i : -1)).filter((i) => i !== -1);
      return bestArms[Math.floor(Math.random() * bestArms.length)];
    }

    if (algorithm === "Posterior") {
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
      const bestArms = samples.map((v, i) => (v === maxSample ? i : -1)).filter((i) => i !== -1);
      return bestArms[Math.floor(Math.random() * bestArms.length)];
    }

    return 0;
  };

  const handleNextTurn = () => {
    if (maxTurns !== "" && turns >= parseInt(maxTurns, 10)) return;
    const newHistories = { ...histories };
    ["Random", "Greedy", "Epsilon", "UCB", "Posterior"].forEach((algo) => {
      const arm = chooseArm(algo);
      const reward = bandit.pull(arm);
      newHistories[algo] = [{ arm, reward, turn: turns + 1, algo }, ...newHistories[algo]];
    });
    setHistories(newHistories);
    setTurns((t) => t + 1);
    if (!locked) setLocked(true);
  };

  const handleManualPull = (arm) => {
    if (maxTurns !== "" && turns >= parseInt(maxTurns, 10)) return;
    const reward = bandit.pull(arm);
    const newHistories = { ...histories };
    newHistories.Manual = [{ arm, reward, turn: turns + 1, algo: "Manual" }, ...newHistories.Manual];
    setHistories(newHistories);
    setTurns((t) => t + 1);
    if (!locked) setLocked(true);
  };

  const handleEndManualRound = () => {
    if (maxTurns === "") return;
    const remainingTurns = parseInt(maxTurns, 10) - turns;
    if (remainingTurns <= 0) return;
    const newHistories = { ...histories };

    for (let t = 0; t < remainingTurns; t++) {
      ["Random", "Greedy", "Epsilon", "UCB", "Posterior"].forEach((algo) => {
        const arm = chooseArm(algo);
        const reward = bandit.pull(arm);
        newHistories[algo] = [{ arm, reward, turn: turns + t + 1, algo }, ...newHistories[algo]];
      });
    }

    setHistories(newHistories);
    setTurns(parseInt(maxTurns, 10));
    setLocked(true);
  };

  const handleReset = () => {
    setHistories(Object.fromEntries(algorithmsList.map((algo) => [algo, []])));
    setTurns(0);
    setLocked(false);
    setProbabilities(generateProbabilities(armsCount));
  };

  const successCounts = armNames.map((arm, i) => {
    const obj = { name: arm };
    algorithmsList.forEach((algo) => {
      obj[algo] = histories[algo].filter((h) => h.arm === i && h.reward === 1).length;
    });
    return obj;
  });

  const isRoundOver = maxTurns !== "" ? turns >= parseInt(maxTurns, 10) : locked;

  const probabilityChartData = probabilities.map((p, i) => ({ name: armNames[i], probability: p }));

  return (
    <section className="card bandit">
      <h2>{title}</h2>
      <img src={banditImage} className="bandit-logo" alt="Bernoulli Bandit" />

      <div className="row gap">
        <label>
          Anzahl Arme:
          <input
            type="number"
            min="1"
            max="26"
            value={armsCount}
            onChange={(e) => {
              const count = Math.max(1, Math.min(26, parseInt(e.target.value) || 1));
              setArmsCount(count);
              setProbabilities(generateProbabilities(count));
              handleReset();
            }}
            disabled={locked}
          />
        </label>

        <label>
          Maximale Züge:
          <input
            type="number"
            min="0"
            value={maxTurns}
            onChange={(e) =>
              setMaxTurns(e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value, 10)))
            }
            disabled={locked}
          />
        </label>

        <button onClick={handleNextTurn} disabled={isRoundOver}>
          Nächster Zug (Algorithmen)
        </button>
        <button onClick={handleReset} className="reset-btn">
          Reset
        </button>
        <button onClick={handleEndManualRound} disabled={isRoundOver}>
          Runde beenden & Algorithmen ausführen
        </button>
      </div>

      <div className="row gap wrap">
        {[...Array(bandit.getArms()).keys()].map((arm) => (
          <button key={arm} onClick={() => handleManualPull(arm)}>
            {armNames[arm]}
          </button>
        ))}
      </div>

      <h3>Trefferanzahl pro Arm & Algorithmus</h3>
      <BarChart width={800} height={350} data={successCounts} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        {algorithmsList.map((algo, idx) => (
          <Bar key={algo} dataKey={algo} fill={["#2196f3", "#ff9800", "#9c27b0", "#f44336", "#00bcd4", "#4caf50"][idx]} />
        ))}
      </BarChart>

      {isRoundOver && (
        <>
          <h3>Wahrscheinlichkeit der Arme</h3>
          <BarChart width={800} height={250} data={probabilityChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 1]} tickFormatter={(v) => `${v * 100}%`} />
            <Tooltip formatter={(v) => `${v * 100}%`} />
            <Bar dataKey="probability" fill="#4caf50">
              <LabelList dataKey="probability" position="top" formatter={(v) => `${v * 100}%`} />
            </Bar>
          </BarChart>
        </>
      )}
    </section>
  );
}
