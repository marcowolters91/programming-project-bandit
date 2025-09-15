import { useState } from "react";
import BernoulliBandit from "./BernoulliBandit";
import "./BernoulliBandit.css";
import banditImage from "./bandit.png"; 
import { Link } from 'react-router-dom'

const bandit = new BernoulliBandit([0.2, 0.5, 0.6, 0.8]);

export default function BernoulliBandit_App() {
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
    setHistory((prev) => [
      { arm: armIndex, reward, turn: prev.length + 1 },
      ...prev,
    ]);
    setTurns((prev) => prev + 1);

    if (!locked) {
      setLocked(true);
    }
  };

  const handleReset = () => {
    setHistory([]);
    setTurns(0);
    setLocked(false);
  };

  const setUnlimitedTurns = () => {
    if (!locked) {
      setMaxTurns(""); 
    }
  };

  const handleMaxTurnsChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setMaxTurns(""); 
    } else {
      const num = Math.max(0, parseInt(value, 10)); 
      setMaxTurns(num);
    }
  };

  return (
    <>
      <h1>Bernoulli-Bandit</h1>
      <p>Welcher Automat ist der Beste?</p>

      <div>
        <img
          src={banditImage}
          className="bandit-logo"
          alt="Bernoulli Bandit"
        />
      </div>

      <div className="turns-input">
        <label>
          Maximale Züge:
          <input
            type="number"
            min="0"
            value={maxTurns}
            onChange={handleMaxTurnsChange}
            disabled={locked}
          />
        </label>
        <button onClick={setUnlimitedTurns} disabled={locked}>
          Unbegrenzt
        </button>
      </div>

      <p>Automatentest:</p>
      <div>
        {[...Array(bandit.getArms()).keys()].map((arm) => (
          <button key={arm} onClick={() => handlePull(arm)}>
            Arm {arm}
          </button>
        ))}
        <button onClick={handleReset} className="reset-btn">
          Ergebnis-Reset
        </button>
      </div>

      <h2>Ergebnisse:</h2>
      <p>
        Aktuelle Züge: {turns}
        {maxTurns !== "" && ` / ${maxTurns}`}
      </p>

      <ul>
        {history.map((h, i) => (
          <li key={i}>
            Zug {h.turn}: Arm {h.arm} →{" "}
            {h.reward === 1 ? "Erfolg ✅" : "Misserfolg ❌"}
          </li>
        ))}
      </ul>
      <div>
        <Link to="/">
              <button className="btn">Zurück</button>
        </Link>
      </div>
    </>
  );
}
