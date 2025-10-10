import { useMemo, useState } from 'react';
import GaussianBandit from '../functions/GaussBandit.js';
import '../styles/gauss.css';

import NormalDistributionChart from '../diagrams/normalDistributionChart';
import UserGreedyTrend from '../diagrams/algorithmTrendChart';
import { greedy } from '../functions/greedy.js';
import { epsilonGreedy } from '../functions/epsilonGreedy.js';

export default function GaussBandit() {
  const [strategyNames] = useState(['🎶 Pop', '🎸 Rock', '🎤 Hip-Hop', '🎧 EDM']);

  const banditUser = useMemo(() => new GaussianBandit(strategyNames), [strategyNames]);
  const banditGreedy = useMemo(() => new GaussianBandit(strategyNames), [strategyNames]);
  const banditEpsilon = useMemo(() => new GaussianBandit(strategyNames), [strategyNames]);

  const [turns, setTurns] = useState(0);
  const [maxTurns, setMaxTurns] = useState('');
  const [userHistory, setUserHistory] = useState([]);
  const [greedyHistory, setGreedyHistory] = useState([]);
  const [epsilonHistory, setEpsilonHistory] = useState([]);

  const maxTurnsN = maxTurns === '' ? null : Number(maxTurns);
  const reachedMax = maxTurnsN != null && turns >= maxTurnsN;

  const pullGreedyOnce = () => {
    const valuesGreedy = banditGreedy.strategies.map((_, i) =>
      banditGreedy.counts[i] > 0 ? banditGreedy.sumRewards[i] / banditGreedy.counts[i] : 0
    );
    const greedyIndex = greedy(valuesGreedy);
    const rewardGreedy = banditGreedy.pull(greedyIndex);
    setGreedyHistory(prev => [
      ...prev,
      { turn: turns + 1, strategyIndex: greedyIndex, reward: rewardGreedy },
    ]);
  };

  const pullEpsilonOnce = () => {
    const valuesEps = banditEpsilon.strategies.map((_, i) =>
      banditEpsilon.counts[i] > 0 ? banditEpsilon.sumRewards[i] / banditEpsilon.counts[i] : 0
    );
    const epsIndex = epsilonGreedy(
      valuesEps,
      banditEpsilon.strategies.length,
      0.1,
      banditEpsilon.counts
    );
    const rewardEps = banditEpsilon.pull(epsIndex);
    setEpsilonHistory(prev => [
      ...prev,
      { turn: turns + 1, strategyIndex: epsIndex, reward: rewardEps },
    ]);
  };

  const handleNextRound = () => {
    if (reachedMax) return;
    pullGreedyOnce();
    pullEpsilonOnce();
    setTurns(t => t + 1);
  };

  const handlePull = strategyIndex => {
    if (reachedMax) return;

    const rewardUser = banditUser.pull(strategyIndex);
    setUserHistory(prev => [...prev, { turn: turns + 1, strategyIndex, reward: rewardUser }]);

    pullGreedyOnce();
    pullEpsilonOnce();

    setTurns(t => t + 1);
  };

  const handleReset = () => {
    banditUser.reset();
    banditGreedy.reset();
    banditEpsilon.reset();
    setTurns(0);
    setUserHistory([]);
    setGreedyHistory([]);
    setEpsilonHistory([]);
    setMaxTurns('');
  };

  const hasAnyHistory = userHistory.length + greedyHistory.length + epsilonHistory.length > 0;
  const showNormalChart = reachedMax;

  return (
    <section className="bandit-dashboard">
      <div className="bandit-shell">
        <header className="dashboard-header">
          <h2>Gauss-Bandit</h2>
          <p className="intro">
            Analysiere verschiedene Musikgenre-Strategien auf Basis einer normalverteilten
            Reward-Struktur.
          </p>
        </header>

        <main className="main">
          {/* LINKS – 1:1 wie Bernoulli */}
          <div className="left-col">
            <div className="control-panel block">
              <h3>Simulation</h3>
              <div className="row">
                <label>
                  Anzahl Genres
                  <input className="bb-input" type="number" value={strategyNames.length} disabled />
                </label>
                <label>
                  Max. Runden
                  <input
                    className="bb-input"
                    type="number"
                    min="1"
                    value={maxTurns}
                    onChange={e => {
                      const v = e.target.value;
                      setMaxTurns(v === '' ? '' : Math.max(1, parseInt(v, 10)));
                    }}
                  />
                </label>
              </div>
              <div className="row">
                <button className="bb-btn primary" onClick={handleNextRound} disabled={reachedMax}>
                  Nächste Runde
                </button>
                <button className="bb-btn reset-btn" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </div>

            <div className="user-choice block">
              <h3>Wähle ein Genre</h3>
              <div className="strategies-grid">
                {strategyNames.map((name, i) => (
                  <button key={i} onClick={() => handlePull(i)} disabled={reachedMax}>
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RECHTS */}
          <div className="right-col">
            <div className="charts-card">
              <div className="charts-grid">
                <div className="chart-box">
                  {hasAnyHistory ? (
                    <UserGreedyTrend
                      userHistory={userHistory}
                      greedyHistory={greedyHistory}
                      epsilonHistory={epsilonHistory}
                    />
                  ) : (
                    <div className="chart-empty" />
                  )}
                </div>

                <div className="chart-box chart--normal">
                  {reachedMax ? (
                    <NormalDistributionChart
                      strategies={strategyNames.map(name => ({ name }))}
                      counts={banditUser.counts}
                      bandit={banditUser}
                    />
                  ) : (
                    <div className="chart-empty" />
                  )}
                </div>
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
