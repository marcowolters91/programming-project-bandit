import { useState } from 'react';
import '../styles/bandit.css';
import BernoulliBanditUI from '../bandits/BernoulliBandit.jsx';
import GaussBanditUI from '../bandits/GaussBandit.jsx';

export default function BanditApp() {
  const [active, setActive] = useState('bernoulli');

  return (
    <div className="layout">
      <header className="header">
        <h1>Multiarm Bandit Suite</h1>
      </header>

      <nav
        className="bandit-tabs"
        data-active={active === 'bernoulli' ? 1 : active === 'gauss' ? 2 : 1}
      >
        <button className={`tab ${active === 'bernoulli' ? 'active' : ''}`} onClick={() => setActive('bernoulli')}>Bernoulli</button>
        <button className={`tab ${active === 'gauss' ? 'active' : ''}`} onClick={() => setActive('gauss')}>Gauss</button>
        {/*Template:  <button className={`tab ${active === 'active state' ? 'active' : ''}`} onClick={() => setActive('active state')}>Name</button> */}
      </nav>

      <main className="main">
        {active === 'bernoulli' && (
          <BernoulliBanditUI title="Bernoulli-Bandit" probabilities={[0.2, 0.5, 0.6, 0.8]} />
        )}
        {active === 'gauss' && <GaussBanditUI title="Gauss-Bandit" />}
      </main>

      <footer className="footer">
        <small>Marco Wolters, Till Albers, Jonah Lackmann, Felix Heitlage</small>
      </footer>
    </div>
  );
}
