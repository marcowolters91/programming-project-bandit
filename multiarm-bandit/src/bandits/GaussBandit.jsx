import { useMemo, useState } from "react";
import GaussianBandit from "../functions/GaussBandit.js";
import "../styles/bandit.css"; // optional
import banditImage from "../assets/bandit.png"; // optional

export default function GaussBandit() {
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
    setHistory((prev) => [{ turn: turns + 1, strategyIndex, reward }, ...prev]);
    setTurns((t) => t + 1);
  };

  const handleReset = () => {
    bandit.reset();
    setHistory([]);
    setTurns(0);
    setMaxTurns(""); // zurück auf "leer"
  };

  return (
    <section className="card bandit">
      <h2>Heizstrategien Bandit – Manuelles Testen mit Limit</h2>
      {banditImage && <img src={banditImage} className="bandit-logo" alt="Heizstrategien" />}

      <div className="row gap">
        <label>
          Max. Züge:{" "}
          <input
            type="number"
            min="1"
            value={maxTurns}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setMaxTurns(""); // Eingabe darf leer sein
              } else {
                setMaxTurns(Math.max(1, parseInt(val, 10)));
              }
            }}
          />
        </label>
        <button onClick={() => setMaxTurns("")}>Unbegrenzt</button>
      </div>

      <div className="row gap">
        {[...Array(bandit.K).keys()].map((i) => (
          <button
            key={i}
            onClick={() => handlePull(i)}
            disabled={maxTurns !== "" && turns >= maxTurns}
          >
            {bandit.strategies[i].name}
          </button>
        ))}
        <button onClick={handleReset} className="reset-btn">
          Reset
        </button>
      </div>

      <h3>Ergebnisse</h3>
      <p>
        Getestete Strategien: {turns}
        {maxTurns !== "" && ` / ${maxTurns}`}
      </p>

      <table>
        <thead>
          <tr>
            <th>Strategie</th>
            <th>Anzahl Züge</th>
            <th>Empirische Durchschnittsleistung</th>
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

      <ul className="history">
        {history.map((h, i) => (
          <li key={i}>
            Zug {h.turn}: {bandit.strategies[h.strategyIndex].name} →{" "}
            {h.reward.toFixed(2)} kW
          </li>
        ))}
      </ul>
    </section>
  );
}
