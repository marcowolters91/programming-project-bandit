import { useState } from 'react';
import '../styles/bandit.css';

// Diagramme (wie im Repo)
import { ProbabilityChart } from '../diagrams/probabilityChart.jsx';
import { AlgorithmHitsChart } from '../diagrams/algorithmHitsChart.jsx';

export default function GaussBanditUI({
  title = 'Vergleich von Heizstrategien (Gauss-Bandit)',
}) {
  // --- Basiszustand ---
  const [armsCount, setArmsCount] = useState(4);
  const [armNames, setArmNames] = useState(generateArmNames(4));
  const [maxTurns, setMaxTurns] = useState('');
  const [turns, setTurns] = useState(0);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [userLog, setUserLog] = useState([]);

  // Gauß-Parameter je Arm
  const [means, setMeans] = useState(generateMeans(4));
  const [stds, setStds] = useState(generateStds(4));

  // User-Statistik für Tabelle
  const [banditUser, setBanditUser] = useState(makeUserStats(armNames));

  // Für Diagramme kann optional eine History geführt werden
  const [histories, setHistories] = useState({ User: [] });

  // --- Hilfsfunktionen ---
  function generateArmNames(count) {
    const base = [
      'Konstante Temperatur halten',
      'Stoßweise aufheizen',
      'Bedarfsgesteuert (nur bei Kälte)',
      'Nachtabsenkung mit Morgen-Boost',
    ];
    if (count <= 4) return base.slice(0, count);
    const extra = Array.from({ length: count - 4 }, (_, i) => `Heizstrategie ${String.fromCharCode(65 + i)}`);
    return [...base, ...extra];
  }

  function makeUserStats(names) {
    return {
      strategies: names.map(n => ({ name: n })),
      counts: Array(names.length).fill(0),
      sumRewards: Array(names.length).fill(0),
    };
  }

  function generateMeans(n) {
    // sinnvolle kW-Mittelwerte 2.0–8.0
    return Array.from({ length: n }, () => +(2 + Math.random() * 6).toFixed(2));
  }
  function generateStds(n) {
    // moderate Streuung 0.2–1.2
    return Array.from({ length: n }, () => +(0.2 + Math.random() * 1.0).toFixed(2));
  }
  function sampleNormal(mu, sigma) {
    // Box–Muller
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mu + sigma * z;
  }

  // --- Aktionen ---
  const step = () => {
    if (locked) return;
    // Automatik ohne User — nur „Runde“ hochzählen
    const t = turns + 1;
    setTurns(t);
    if (maxTurns && t >= maxTurns) setLocked(true);
  };

  const userStep = arm => {
    if (locked) return;
    // kontinuierlicher Reward (kW)
    const reward = sampleNormal(means[arm], stds[arm]);

    // Tabelle aktualisieren
    setBanditUser(prev => {
      const next = { ...prev };
      next.counts = [...prev.counts];
      next.sumRewards = [...prev.sumRewards];
      next.counts[arm] += 1;
      next.sumRewards[arm] += reward;
      return next;
    });

    // History (für Diagramm) – wir speichern numerischen reward
    setHistories(prev => ({
      ...prev,
      User: [...prev.User, { arm, reward }]
    }));

    const msg = `Zug ${turns + 1}: ${armNames[arm]} → ${reward.toFixed(2)} kW`;
    setFeedback({ text: msg, success: reward >= means[arm] });

    setUserLog(prev => {
      const nl = [...prev, { text: msg, success: reward >= means[arm] }];
      return nl.slice(-5);
    });

    const t = turns + 1;
    setTurns(t);
    if (maxTurns && t >= maxTurns) setLocked(true);
  };

  const reset = () => {
    setTurns(0);
    setLocked(false);
    const names = generateArmNames(armsCount);
    setArmNames(names);
    setMeans(generateMeans(armsCount));
    setStds(generateStds(armsCount));
    setBanditUser(makeUserStats(names));
    setFeedback(null);
    setUserLog([]);
    setHistories({ User: [] });
    setMaxTurns('');
  };

  // --- Render ---
return (
  <section className="bandit-dashboard">

  <div className="bandit-shell">
    <header className="dashboard-header">
      <h2>Gauss-Bandit</h2>
      <p className="intro">Analysiere verschiedene Heizstrategien auf Basis einer Gaußverteilung.</p>
    </header>

    <main className="main">
      <div className="left-col">
        <div className="control-panel block">
          <h3>Simulationseinstellungen</h3>
          <div className="row">
            <label>
              Anzahl Arme:
              <input
                type="number" min="2" max="26" value={armsCount}
                onChange={e => {
                  const count = Math.min(26, Math.max(2, parseInt(e.target.value)));
                  setArmsCount(count);
                  setArmNames(generateArmNames(count));
                  setTurns(0); setLocked(false); setFeedback(null); setUserLog([]); setMaxTurns('');
                }}
              />
            </label>
            <label>
              Max. Runden:
              <input
                type="number" min="1" value={maxTurns}
                onChange={e => setMaxTurns(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value)))}
              />
            </label>
            <button onClick={() => setMaxTurns('')}>Unbegrenzt</button>
          </div>
          <div className="row">
            <button onClick={step} disabled={locked}>Nächste Runde (Automatisch)</button>
            <button className="reset-btn" onClick={reset}>Reset</button>
          </div>
        </div>

        <div className="user-choice block">
          <h3>Wähle eine Heizstrategie</h3>
          <div className="strategies-grid">
            {armNames.map((name, i) => (
              <button key={i} onClick={() => userStep(i)} disabled={locked}>{name}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="right-col">
        <div className="charts-card">
          <div className="charts-grid">
            {locked && <ProbabilityChart probabilities={probabilities} armNames={armNames} />}
            <AlgorithmHitsChart histories={histories} />
          </div>
        </div>

        {feedback && (
          <p className={`feedback ${feedback.success ? 'hit' : 'miss'}`}>{feedback.text}</p>
        )}

        {userLog.length > 0 && (
          <div className="user-log">
            <h4>Letzte Züge</h4>
            <ul>
              {userLog.map((entry, idx) => (
                <li key={idx} className={entry.success ? 'hit' : 'miss'}>
                  {entry.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="charts-section">
          <h3>Ergebnisse</h3>
          <p>Gespielte Runden: {turns}{maxTurns !== '' && ` / ${maxTurns}`}</p>

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
                      : '0.00'} kW
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</section>
);
}