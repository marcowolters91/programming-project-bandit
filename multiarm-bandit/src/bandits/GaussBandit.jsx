import { useMemo, useState } from 'react';
import GaussianBandit from '../functions/GaussBandit.js';
import '../styles/gauss.css';

import NormalDistributionChart from '../diagrams/normalDistributionChart';
import UserGreedyTrend from '../diagrams/algorithmTrendChart';

import { greedy } from '../functions/greedy.js';
import { epsilonGreedy } from '../functions/epsilonGreedy.js';
import { musicGenres } from '../bandits/MusicGenres.js';

function pickRandomGenres(n) {
  const shuffled = [...musicGenres].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export default function GaussBandit() {
  const [numGenres, setNumGenres] = useState(4);
  const [maxTurns, setMaxTurns] = useState(10);

  const strategyNames = useMemo(() => {
    const safe = Math.min(musicGenres.length, Math.max(1, numGenres));
    return safe === musicGenres.length ? [...musicGenres] : pickRandomGenres(safe);
  }, [numGenres]);

  const banditUser = useMemo(() => new GaussianBandit(strategyNames), [strategyNames]);
  const banditGreedy = useMemo(() => new GaussianBandit(strategyNames), [strategyNames]);
  const banditEpsilon = useMemo(() => new GaussianBandit(strategyNames), [strategyNames]);

  const [turns, setTurns] = useState(0);
  const [userHistory, setUserHistory] = useState([]);
  const [greedyHistory, setGreedyHistory] = useState([]);
  const [epsilonHistory, setEpsilonHistory] = useState([]);

  const reachedMax = turns >= maxTurns;

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
  };

  const hasAnyHistory = userHistory.length + greedyHistory.length + epsilonHistory.length > 0;

  return (
    <section className="bandit-dashboard">
      <div className="bandit-shell">
        <header className="dashboard-header">
          <h2>Gauss-Bandit</h2>
          <p className="intro">
            Beim Gauss-Bandit ist der Reward nicht nur 0 oder 1, sondern ein kontinuierlicher Wert –
            z. B. wie stark dir ein Genre gefällt. Die Ergebnisse folgen einer Gauß’schen
            Normalverteilung, wodurch auch kleine Unterschiede zwischen Strategien sichtbar werden.
            Damit lassen sich feinere Abstufungen und realistischere Nutzerreaktionen darstellen.
          </p>
        </header>

        <main className="main">
          <div className="left-col">
            <div className="control-panel block">
              <h3>Simulation</h3>
              <div className="row">
                <label>
                  Anzahl Genres
                  <input
                    className="bb-input"
                    type="number"
                    min="1"
                    max={musicGenres.length}
                    value={numGenres}
                    onChange={e => {
                      const v = parseInt(e.target.value, 10);
                      setNumGenres(isNaN(v) ? 1 : Math.min(Math.max(1, v), musicGenres.length));
                    }}
                  />
                </label>
                <label>
                  Max. Runden
                  <input
                    className="bb-input"
                    type="number"
                    min="1"
                    value={maxTurns}
                    onChange={e => {
                      const v = parseInt(e.target.value, 10);
                      setMaxTurns(isNaN(v) ? 1 : Math.max(1, v));
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

            {/* Ergebnistabelle für Genres */}
            <div className="charts-section">
              <h3>Ergebnisse</h3>
              <p>
                Gespielte Runden: {turns} / {maxTurns}
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
