import { useMemo, useState } from 'react';
import '../styles/bernoulli.css';

import { randomChoice } from '../functions/randomChoice';
import { greedy } from '../functions/greedy';
import { epsilonGreedy } from '../functions/epsilonGreedy';
import { ucb } from '../functions/ucb';
import { posterior } from '../functions/posterior';

import { ProbabilityChart } from '../diagrams/probabilityChart.jsx';
import { AlgorithmHitsChart } from '../diagrams/algorithmHitsChart.jsx';

export default function BernoulliBanditUI() {
  const [armsCount, setArmsCount] = useState(4);
  const [armNames, setArmNames] = useState(generateArmNames(4));
  const [maxTurns, setMaxTurns] = useState(10);
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

  function generateArmNames(count) {
    const names = [
      '🎶 Pop',
      '🎸 Rock',
      '🎤 Hip-Hop',
      '🎧 EDM',
      '💿 House',
      '🎹 Jazz',
      '🎻 Klassik',
      '🔥 Trap',
      '🎚️ Techno',
      '🎺 Funk',
      '🎼 Blues',
      '🎸 Indie',
      '🌾 Country',
      '🎧 LoFi',
      '🏝️ Reggae',
    ];
    if (count <= 15) return names.slice(0, count);
    const extra = Array.from(
      { length: count - 15 },
      (_, i) => `Genre ${String.fromCharCode(65 + i)}`
    );
    return [...names, ...extra];
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
    setTurns(prev => {
      const next = prev + 1;
      if (maxTurns && next >= maxTurns) setLocked(true);
      return next;
    });
  };

  const userStep = arm => {
    if (locked) return;
    const newHistories = { ...histories };
    const rewardUser = Math.random() < probabilities[arm] ? 1 : 0;
    newHistories.User = [...newHistories.User, { arm, reward: rewardUser }];
    algorithmsList.forEach(algo => {
      if (algo === 'User') return;
      const { n_i, successes, total } = getStats(algo);
      const armChoice = chooseArm(algo, n_i, successes, total, armsCount);
      const reward = Math.random() < probabilities[armChoice] ? 1 : 0;
      newHistories[algo] = [...newHistories[algo], { arm: armChoice, reward }];
    });
    setHistories(newHistories);
    setTurns(prev => {
      const next = prev + 1;
      if (maxTurns && next >= maxTurns) setLocked(true);
      return next;
    });
    const msg = `Zug ${turns + 1}: ${armNames[arm]} → ${rewardUser === 1 ? 'Treffer!' : 'Kein Treffer'}`;
    setFeedback({ text: msg, success: rewardUser === 1 });
    setUserLog(prev => [...prev, { text: msg, success: rewardUser === 1 }].slice(-6));
  };

  const reset = () => {
    setHistories(Object.fromEntries(algorithmsList.map(a => [a, []])));
    setTurns(0);
    setLocked(false);
    setArmNames(generateArmNames(armsCount));
    setProbabilities(generateProbabilities(armsCount));
    setFeedback(null);
    setUserLog([]);
  };

  const hardResetArms = count => {
    const safe = Math.min(26, Math.max(2, count));
    setArmsCount(safe);
    setArmNames(generateArmNames(safe));
    setProbabilities(generateProbabilities(safe));
    setHistories(Object.fromEntries(algorithmsList.map(a => [a, []])));
    setTurns(0);
    setLocked(false);
    setFeedback(null);
    setUserLog([]);
  };

  const algoSummary = useMemo(() => {
    return algorithmsList
      .filter(a => a !== 'User')
      .map(algo => {
        const { successes, total } = getStats(algo);
        const mean = total > 0 ? successes.reduce((s, v) => s + v, 0) / total : 0;
        return { algo, pulls: total, hitRate: mean };
      });
  }, [histories, armsCount]);

  return (
    <section className="bandit-dashboard">
      <div className="bandit-shell">
        <header className="dashboard-header">
          <h2>Bernoulli-Bandit</h2>
          <p className="intro">Genres als Arme - Rewards: Gefällt mir (1) / Skip (0)</p>
        </header>

        <main className="main">
          <div className="left-col">
            <div className="control-panel block">
              <h3>Simulation</h3>
              <div className="row">
                <label>
                  Anzahl Genres
                  <input
                    type="number"
                    min="2"
                    max="26"
                    value={armsCount}
                    onChange={e => {
                      const c = Math.min(26, Math.max(2, parseInt(e.target.value || '4', 10)));
                      hardResetArms(c);
                    }}
                  />
                </label>
                <label>
                  Max. Runden
                  <input
                    type="number"
                    min="1"
                    value={maxTurns}
                    onChange={e => setMaxTurns(Math.max(1, parseInt(e.target.value || '1', 10)))}
                  />
                </label>
              </div>
              <div className="row">
                <button onClick={step} disabled={locked}>
                  Nächste Runde
                </button>
                <button className="reset-btn" onClick={reset}>
                  Reset
                </button>
              </div>
            </div>

            <div className="user-choice block">
              <h3>Wähle ein Genre</h3>
              <div className="strategies-grid">
                {armNames.map((name, i) => (
                  <button key={i} onClick={() => userStep(i)} disabled={locked}>
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {(feedback || userLog.length > 0) && (
              <div className="feedback-box block">
                {feedback && (
                  <p className={`feedback-current ${feedback.success ? 'hit' : 'miss'}`}>
                    {feedback.text}
                  </p>
                )}
                {userLog.length > 0 && (
                  <div className="feedback-log">
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
              </div>
            )}
          </div>

          <div className="right-col">
            <div className="charts-card">
              <div className="charts-grid">
                <div style={{ position: 'relative' }}>
                  <AlgorithmHitsChart histories={histories} />
                </div>

                {locked && (
                  <div style={{ position: 'relative' }}>
                    <ProbabilityChart probabilities={probabilities} armNames={armNames} />
                  </div>
                )}
              </div>
            </div>

            <div className="charts-section">
              <h3>Ergebnisse</h3>
              <p>
                Gespielte Runden: {turns}
                {maxTurns ? ` / ${maxTurns}` : null}
              </p>

              <table>
                <thead>
                  <tr>
                    <th>Algorithmus</th>
                    <th>Züge</th>
                    <th>Hit-Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {algoSummary.map(row => (
                    <tr key={row.algo}>
                      <td>{row.algo}</td>
                      <td>{row.pulls}</td>
                      <td>{(row.hitRate * 100).toFixed(1)}%</td>
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
