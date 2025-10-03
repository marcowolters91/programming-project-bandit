import { useMemo, useState } from "react";
import GaussianBandit from "../functions/GaussBandit.js";
import "../styles/bandit.css";

export default function GaussBandit({ title = "Vergleich von Heizstrategien (Gauss-Bandit)" }) {
  const [strategyNames] = useState([
    "Konstante Temperatur halten",
    "Stoßweise aufheizen",
    "Bedarfsgesteuert (nur bei Kälte)",
    "Nachtabsenkung mit Morgen-Boost",
  ]);
  const [sigma] = useState(1.0);

  // Maximal erlaubte Züge (kann auch "" = leer sein)
  const [maxTurns, setMaxTurns] = useState("");

  const bandit = useMemo(() => new GaussianBandit(strategyNames, sigma), [strategyNames, sigma]);
  const [history, setHistory] = useState([]);
  const [turns, setTurns] = useState(0);

  const handlePull = (strategyIndex) => {
    if (maxTurns !== "" && turns >= parseInt(maxTurns, 10)) return; // Limit beachten

    const reward = bandit.pull(strategyIndex);
    setHistory((prev) => [...prev, { turn: turns + 1, strategyIndex, reward }]);
    setTurns((t) => t + 1);
  };

  const handleReset = () => {
    bandit.reset();
    setHistory([]);
    setTurns(0);
    setMaxTurns(""); // zurück auf "leer"
  };

  return (
    <section className="bandit-dashboard">
      {/* Header */}
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
              onChange={(e) => {
                const val = e.target.value;
                setMaxTurns(val === "" ? "" : Math.max(1, parseInt(val, 10)));
              }}
            />
          </label>
          <button onClick={() => setMaxTurns("")}>Unbegrenzt</button>
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
          {[...Array(bandit.K).keys()].map((i) => (
            <button
              key={i}
              onClick={() => handlePull(i)}
              disabled={maxTurns !== "" && turns >= maxTurns}
            >
              {bandit.strategies[i].name}
            </button>
          ))}
        </div>
      </div>

      {/* Ergebnisse */}
      <div className="charts-section">
        <h3>Ergebnisse</h3>
        <p>
          Gespielte Runden: {turns}
          {maxTurns !== "" && ` / ${maxTurns}`}
        </p>

        {/* Tabelle mit empirischen Werten */}
        <table>
          <thead>
            <tr>
              <th>Strategie</th>
              <th>Anzahl Züge</th>
              <th>Durchschnittsleistung</th>
            </tr>
          </thead>
          <tbody>
            {bandit.strategies.map((s, i) => (
              <tr key={i}>
                <td>{s.name}</td>
                <td>{bandit.counts[i]}</td>
                <td>
                  {bandit.counts[i]
                    ? (bandit.sumRewards[i] / bandit.counts[i]).toFixed(2)
                    : "0.00"}{" "}
                  kW
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Historie */}
        {history.length > 0 && (
          <div className="user-log">
            <h4>Letzte Züge</h4>
            <ul>
              {history.slice(-5).map((h, i) => (
                <li key={i}>
                  Zug {h.turn}: {bandit.strategies[h.strategyIndex].name} →{" "}
                  {h.reward.toFixed(2)} kW
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
