import { useMemo, useState } from 'react';
import GaussianBandit from '../functions/GaussBandit.js';
import '../styles/bandit.css';

import NormalDistributionChart from '../diagrams/normalDistributionChart';
import UserGreedyTrend from '../diagrams/algorithmTrendChart';
import { greedy } from '../functions/greedy.js';

export default function GaussBandit() {
  // --- Logik unverändert ---
  const [strategyNames] = useState([
    'Konstante Temperatur halten',
    'Stoßweise aufheizen',
    'Bedarfsgesteuert (nur bei Kälte)',
    'Nachtabsenkung mit Morgen-Boost',
  ]);
  const [sigma] = useState(1.0);
  const [maxTurns, setMaxTurns] = useState(''); // '' = unbegrenzt

  const banditUser = useMemo(
    () => new GaussianBandit(strategyNames, sigma),
    [strategyNames, sigma]
  );
  const banditGreedy = useMemo(
    () => new GaussianBandit(strategyNames, sigma),
    [strategyNames, sigma]
  );

  const [turns, setTurns] = useState(0);
  const [userHistory, setUserHistory] = useState([]);
  const [greedyHistory, setGreedyHistory] = useState([]);

  const [userSum, setUserSum] = useState(0);
  const [greedySum, setGreedySum] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [greedyCount, setGreedyCount] = useState(0);

  const maxTurnsN = maxTurns === '' ? null : Number(maxTurns);
  const reachedMax = maxTurnsN != null && turns >= maxTurnsN;

  const handlePull = strategyIndex => {
    if (reachedMax) return;

    // User
    const rewardUser = banditUser.pull(strategyIndex);
    setUserHistory(prev => [...prev, { turn: turns + 1, strategyIndex, reward: rewardUser }]);
    setUserSum(s => s + rewardUser);
    setUserCount(c => c + 1);

    // Greedy
    const values = banditGreedy.strategies.map((_, i) =>
      banditGreedy.counts[i] > 0 ? banditGreedy.sumRewards[i] / banditGreedy.counts[i] : 0
    );
    const greedyIndex = greedy(values);
    const rewardGreedy = banditGreedy.pull(greedyIndex);
    setGreedyHistory(prev => [
      ...prev,
      { turn: turns + 1, strategyIndex: greedyIndex, reward: rewardGreedy },
    ]);
    setGreedySum(s => s + rewardGreedy);
    setGreedyCount(c => c + 1);

    setTurns(t => t + 1);
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
    setMaxTurns('');
  };

  const showNormalChart = reachedMax;
  const safeCounts = [Number(userCount) || 0, Number(greedyCount) || 0];
  const safeSums = [Number(userSum) || 0, Number(greedySum) || 0];

  return (
    <section className="bandit-dashboard">
      {/* exakt wie Bernoulli */}
      <div className="bandit-shell">
        <header className="dashboard-header">
          <h2>Gauss-Bandit</h2>
          <p className="intro">
            Analysiere verschiedene Heizstrategien auf Basis einer Gaußverteilung.
          </p>
        </header>

        <main className="main">
          {/* Linke Spalte */}
          <div className="left-col">
            <div className="control-panel block">
              <h3>Simulationseinstellungen</h3>

              <div className="row">
                <label>
                  Anzahl Arme:
                  <input type="number" value={strategyNames.length} disabled />
                </label>

                <label>
                  Max. Runden:
                  <input
                    type="number"
                    min="1"
                    value={maxTurns}
                    onChange={e => {
                      const v = e.target.value;
                      setMaxTurns(v === '' ? '' : Math.max(1, parseInt(v, 10)));
                    }}
                  />
                </label>

                <button onClick={() => setMaxTurns('')}>Unbegrenzt</button>
              </div>

              <div className="row">
                {/*<button onClick={() => handlePull(0)} disabled={reachedMax}>
                  Nächste Runde (Automatisch)
                </button>*/}
                <button onClick={handleReset} className="reset-btn">
                  Reset
                </button>
              </div>
            </div>

            <div className="user-choice block">
              <h3>Wähle eine Heizstrategie</h3>
              <div className="strategies-grid">
                {strategyNames.map((name, i) => (
                  <button key={i} onClick={() => handlePull(i)} disabled={reachedMax}>
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rechte Spalte */}
          <div className="right-col">
            <div className="charts-card">
              <div className="charts-grid">
                {/* Legende bleibt in der Card */}
                <div style={{ position: 'relative' }}>
                  <UserGreedyTrend userHistory={userHistory} greedyHistory={greedyHistory} />
                </div>

                {showNormalChart && (
                  <NormalDistributionChart
                    strategies={[{ name: 'User' }, { name: 'Greedy' }]}
                    counts={safeCounts}
                    sumRewards={safeSums}
                    sigma={sigma}
                  />
                )}
              </div>
            </div>

            <div className="charts-section">
              <h3>Ergebnisse</h3>
              <p>
                Gespielte Runden: {turns}
                {maxTurns !== '' && ` / ${maxTurns}`}
              </p>

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
                      <td>{strategyNames[i]}</td>
                      <td>{banditUser.counts[i]}</td>
                      <td>
                        {banditUser.counts[i]
                          ? (banditUser.sumRewards[i] / banditUser.counts[i]).toFixed(2)
                          : '0.00'}{' '}
                        kW
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
