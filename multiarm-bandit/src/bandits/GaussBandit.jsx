import { useMemo, useState } from "react";
import GaussianBandit from "../functions/GaussBandit.js";
import "../styles/bandit.css";

import NormalDistributionChart from "../diagrams/normalDistributionChart";
import UserGreedyTrend from "../diagrams/algorithmTrendChart";
import { greedy } from "../functions/greedy.js";

export default function GaussBandit({ title = 'Vergleich von Heizstrategien (Gauss-Bandit)' }) {
  const [strategyNames] = useState([
    'Konstante Temperatur halten',
    'Stoßweise aufheizen',
    'Bedarfsgesteuert (nur bei Kälte)',
    'Nachtabsenkung mit Morgen-Boost',
  ]);
  const [sigma] = useState(1.0);
  const [maxTurns, setMaxTurns] = useState("");

  const banditUser = useMemo(() => new GaussianBandit(strategyNames, sigma), [strategyNames, sigma]);
  const banditGreedy = useMemo(() => new GaussianBandit(strategyNames, sigma), [strategyNames, sigma]);

  const [turns, setTurns] = useState(0);
  const [userHistory, setUserHistory] = useState([]);
  const [greedyHistory, setGreedyHistory] = useState([]);

  const [userSum, setUserSum] = useState(0);
  const [greedySum, setGreedySum] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [greedyCount, setGreedyCount] = useState(0);

  const handlePull = (strategyIndex) => {
    if (maxTurns !== "" && turns >= parseInt(maxTurns, 10)) return;

    const rewardUser = banditUser.pull(strategyIndex);
    setUserHistory((prev) => [...prev, { turn: turns + 1, strategyIndex, reward: rewardUser }]);
    setUserSum((s) => s + rewardUser);
    setUserCount((c) => c + 1);

    const values = banditGreedy.strategies.map((s, i) =>
      banditGreedy.counts[i] > 0 ? banditGreedy.sumRewards[i] / banditGreedy.counts[i] : 0
    );
    const greedyIndex = greedy(values);
    const rewardGreedy = banditGreedy.pull(greedyIndex);
    setGreedyHistory((prev) => [
      ...prev,
      { turn: turns + 1, strategyIndex: greedyIndex, reward: rewardGreedy },
    ]);
    setGreedySum((s) => s + rewardGreedy);
    setGreedyCount((c) => c + 1);

    setTurns((t) => t + 1);
  };

  const handleReset = () => {
    banditUser.reset();
    banditGreedy.reset();
    setTurns(0);
    setUserHistory([]);
    setGreedyHistory([]);
    setUserSum(0);
    setGreedySum(0);
    setUserCount(0);
    setGreedyCount(0);
    setMaxTurns("");
  };

  return (
    <section className="bandit-dashboard">
      <header className="dashboard-header">
        <h2>{title}</h2>
        <p className="intro">
          Teste verschiedene Heizstrategien und beobachte die durchschnittliche Leistung (kW).
        </p>
      </header>

      {/* Control Panel */}
      <div className="control-panel">
        <h3>Simulationseinstellungen</h3>
        <div className="row gap">
          <label>
            Max. Runden:
            <input
              type="number"
              min="1"
              value={maxTurns}
              onChange={e => {
                const val = e.target.value;
                setMaxTurns(val === '' ? '' : Math.max(1, parseInt(val, 10)));
              }}
            />
          </label>
          <button onClick={() => setMaxTurns('')}>Unbegrenzt</button>
        </div>
        <div className="row gap">
          <button onClick={handleReset} className="reset-btn">
            Reset
          </button>
        </div>
      </div>

      {/* Strategie Auswahl */}
      <div className="user-choice">
        <h3>Wähle eine Heizstrategie</h3>
        <div className="strategies-grid">
          {[...Array(banditUser.K).keys()].map((i) => (
            <button
              key={i}
              onClick={() => handlePull(i)}
              disabled={maxTurns !== '' && turns >= maxTurns}
            >
              {banditUser.strategies[i].name}
            </button>
          ))}
        </div>
      </div>

      {/* Ergebnisse */}
      <div className="charts-section">
        <h3>Ergebnisse</h3>
        <p>
          Gespielte Runden: {turns}
          {maxTurns !== '' && ` / ${maxTurns}`}
        </p>

        {/* Tabelle zeigt nur User-Daten */}
        <table>
          <thead>
            <tr>
              <th>Strategie</th>
              <th>Anzahl Züge</th>
              <th>Durchschnittsleistung</th>
            </tr>
          </thead>
          <tbody>
            {banditUser.strategies.map((s, i) => (
              <tr key={i}>
                <td>{s.name}</td>
                <td>{banditUser.counts[i]}</td>
                <td>
                  {banditUser.counts[i]
                    ? (banditUser.sumRewards[i] / banditUser.counts[i]).toFixed(2)
                    : "0.00"}{" "}
                  kW
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Verlauf User vs. Greedy */}
        {userHistory.length > 0 && (
          <UserGreedyTrend userHistory={userHistory} greedyHistory={greedyHistory} />
        )}

        {/* Normalverteilungen */}
        {maxTurns !== "" && turns >= maxTurns && (
          <NormalDistributionChart
            strategies={[{ name: "User" }, { name: "Greedy" }]}
            counts={[userCount, greedyCount]}
            sumRewards={[userSum, greedySum]}
            sigma={sigma}
          />
        )}
      </div>
    </section>
  );
}
