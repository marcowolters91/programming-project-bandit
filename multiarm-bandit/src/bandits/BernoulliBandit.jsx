import { useState } from 'react';
import '../styles/bandit.css';

// Algorithmen
import { randomChoice } from '../functions/randomChoice';
import { greedy } from '../functions/greedy';
import { epsilonGreedy } from '../functions/epsilonGreedy';
import { ucb } from '../functions/ucb';
import { posterior } from '../functions/posterior';

// Diagramme
import { ProbabilityChart } from '../diagrams/probabilityChart.jsx';
import { AlgorithmHitsChart } from '../diagrams/algorithmHitsChart.jsx';

export default function BernoulliBanditUI({
  title = 'Vergleich von Heizstrategien (Bernoulli-Bandit)',
}) {
  const [armsCount, setArmsCount] = useState(4);
  const [armNames, setArmNames] = useState(generateArmNames(4));
  const [maxTurns, setMaxTurns] = useState('');
  const [turns, setTurns] = useState(0);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [userLog, setUserLog] = useState([]);

  const generateProbabilities = count =>
    Array.from({ length: count }, () => Math.floor(Math.random() * 101) / 100);

  const [probabilities, setProbabilities] = useState(generateProbabilities(armsCount));

  const algorithmsList = ['Random', 'Greedy', 'Epsilon', 'UCB', 'Posterior', 'User'];
  const epsilon = 0.1;

  const [histories, setHistories] = useState(
    Object.fromEntries(algorithmsList.map(algo => [algo, []]))
  );

  // Armnamen: erste 4 wie Gaussian, ab dann Heizstrategie A–Z
  function generateArmNames(count) {
    const gaussNames = [
      'Konstante Temperatur halten',
      'Stoßweise aufheizen',
      'Bedarfsgesteuert (nur bei Kälte)',
      'Nachtabsenkung mit Morgen-Boost',
    ];
    if (count <= 4) return gaussNames.slice(0, count);
    const extra = Array.from(
      { length: count - 4 },
      (_, i) => `Heizstrategie ${String.fromCharCode(65 + i)}`
    );
    return [...gaussNames, ...extra];
  }

  const getStats = algorithm => {
    const data = histories[algorithm];
    const n_i = Array(armsCount).fill(0);
    const successes = Array(armsCount).fill(0);
    data.forEach(h => {
      n_i[h.arm]++;
      if (h.reward === 1) successes[h.arm]++;
    });
    return { n_i, successes, total: data.length };
  };

  const chooseArm = (algorithm, n_i, successes, total, armsCount) => {
    switch (algorithm) {
      case 'Random':
        return randomChoice(armsCount);
      case 'Greedy': {
        const values = successes.map((s, i) => (n_i[i] > 0 ? s / n_i[i] : 0));
        return greedy(values);
      }
      case 'Epsilon':
        return epsilonGreedy(successes, armsCount, epsilon, n_i);
      case 'UCB':
        return ucb(successes, n_i, total);
      case 'Posterior':
        return posterior(successes, n_i);
      default:
        return 0;
    }
  };

  // Automatischer Schritt
  const step = () => {
    if (locked) return;
    const newHistories = { ...histories };

    algorithmsList.forEach(algo => {
      if (algo === 'User') return;
      const { n_i, successes, total } = getStats(algo);
      const arm = chooseArm(algo, n_i, successes, total, armsCount);
      const reward = Math.random() < probabilities[arm] ? 1 : 0;
      newHistories[algo] = [...newHistories[algo], { arm, reward }];
    });

    setHistories(newHistories);
    setTurns(turns + 1);
    if (maxTurns && turns + 1 >= maxTurns) setLocked(true);
  };

  // Manueller Schritt (User + alle Algorithmen)
  const userStep = arm => {
    if (locked) return;
    const newHistories = { ...histories };

    // User
    const rewardUser = Math.random() < probabilities[arm] ? 1 : 0;
    newHistories.User = [...newHistories.User, { arm, reward: rewardUser }];

    // Alle anderen Algorithmen
    algorithmsList.forEach(algo => {
      if (algo === 'User') return;
      const { n_i, successes, total } = getStats(algo);
      const armChoice = chooseArm(algo, n_i, successes, total, armsCount);
      const reward = Math.random() < probabilities[armChoice] ? 1 : 0;
      newHistories[algo] = [...newHistories[algo], { arm: armChoice, reward }];
    });

    setHistories(newHistories);
    setTurns(turns + 1);

    // Feedback + Log
    const message = `Zug ${turns + 1}: ${armNames[arm]} → ${
      rewardUser === 1 ? 'Treffer!' : 'Kein Treffer'
    }`;
    const success = rewardUser === 1;

    setFeedback({ text: message, success });
    setUserLog(prev => {
      const newLog = [...prev, { text: message, success }];
      return newLog.slice(-5);
    });

    if (maxTurns && turns + 1 >= maxTurns) setLocked(true);
  };

  const reset = () => {
    setHistories(Object.fromEntries(algorithmsList.map(algo => [algo, []])));
    setTurns(0);
    setLocked(false);
    setArmNames(generateArmNames(armsCount));
    setProbabilities(generateProbabilities(armsCount));
    setMaxTurns('');
    setFeedback(null);
    setUserLog([]);
  };

  return (
    <section className="bandit-dashboard">
      <div className="bandit-shell">
        <header className="dashboard-header">
          <h2>Bernoulli-Bandit</h2>
          <p className="intro">Teste verschiedene Heizstrategien und vergleiche ihre Effizienz.</p>
        </header>

        <main className="main">
          {/* Linke Spalte */}
          <div className="left-col">
            <div className="control-panel block">
              <h3>Simulationseinstellungen</h3>
              <div className="row">
                <label>
                  Anzahl Arme:
                  <input
                    type="number"
                    min="2"
                    max="26"
                    value={armsCount}
                    onChange={e => {
                      const count = Math.min(26, Math.max(2, parseInt(e.target.value)));
                      setArmsCount(count);
                      setArmNames(generateArmNames(count));
                      setProbabilities(generateProbabilities(count));
                      setHistories(Object.fromEntries(algorithmsList.map(a => [a, []])));
                      setTurns(0);
                      setLocked(false);
                      setFeedback(null);
                      setUserLog([]);
                      setMaxTurns('');
                    }}
                  />
                </label>
                <label>
                  Max. Runden:
                  <input
                    type="number"
                    min="1"
                    value={maxTurns}
                    onChange={e =>
                      setMaxTurns(
                        e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value))
                      )
                    }
                  />
                </label>
                <button onClick={() => setMaxTurns('')}>Unbegrenzt</button>
              </div>
              <div className="row">
                <button onClick={step} disabled={locked}>
                  Nächste Runde (Automatisch)
                </button>
                <button className="reset-btn" onClick={reset}>
                  Reset
                </button>
              </div>
            </div>

            <div className="user-choice block">
              <h3>Wähle eine Heizstrategie</h3>
              <div className="strategies-grid">
                {armNames.map((name, i) => (
                  <button key={i} onClick={() => userStep(i)} disabled={locked}>
                    {name}
                  </button>
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
              <p>
                Gespielte Runden: {turns}
                {maxTurns !== '' && ` / ${maxTurns}`}
              </p>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
