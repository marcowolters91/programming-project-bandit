import { useMemo, useState } from "react";
import "../styles/bandit.css";
import banditImage from "../assets/bandit.png";
import BernoulliBandit from "../functions/BernoulliBandit.js";

export default function BernoulliBanditUI({
  title = "Bernoulli-Bandit",
  probabilities = [0.2, 0.5, 0.6, 0.8],
}) {
  const bandit = useMemo(() => new BernoulliBandit(probabilities), [probabilities]);
  const [history, setHistory] = useState([]);
  const [maxTurns, setMaxTurns] = useState("");
  const [turns, setTurns] = useState(0);
  const [locked, setLocked] = useState(false);

  const handlePull = (armIndex) => {
    if (maxTurns !== "" && turns >= parseInt(maxTurns, 10)) {
      alert("Maximale Anzahl an Zügen erreicht!");
      return;
    }
    const reward = bandit.pull(armIndex);
    const entry = { arm: armIndex, reward, turn: turns + 1 };
    setHistory((prev) => [entry, ...prev]);
    setTurns((t) => t + 1);
    if (!locked) setLocked(true);
  };

  const handleReset = () => {
    setHistory([]);
    setTurns(0);
    setLocked(false);
  };

  return (
    <section className="card bandit">
      <h2>{title}</h2>
      <img src={banditImage} className="bandit-logo" alt="Bernoulli Bandit" />

      <div className="row gap">
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
        <button onClick={() => !locked && setMaxTurns("")} disabled={locked}>
          Unbegrenzt
        </button>
      </div>

      <div className="row gap wrap">
        {[...Array(bandit.getArms()).keys()].map((arm) => (
          <button key={arm} onClick={() => handlePull(arm)}>
            Arm {arm}
          </button>
        ))}
        <button onClick={handleReset} className="reset-btn">Ergebnis-Reset</button>
      </div>

      <h3>Ergebnisse</h3>
      <p>
        Aktuelle Züge: {turns}{maxTurns !== "" && ` / ${maxTurns}`}
      </p>

      <ul className="history">
        {history.map((h, i) => (
          <li key={i}>
            Zug {h.turn}: Arm {h.arm} → {h.reward === 1 ? "Erfolg ✅" : "Misserfolg ❌"}
          </li>
        ))}
      </ul>
    </section>
  );
}