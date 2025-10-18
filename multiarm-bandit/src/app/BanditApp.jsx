import { useState } from 'react';
import '../styles/bandit.css';
import BernoulliBanditUI from '../bandits/BernoulliBandit.jsx';
import GaussBanditUI from '../bandits/GaussBandit.jsx';
import ReadmeView from './Theory.jsx';

export default function BanditApp() {
  const [active, setActive] = useState('bernoulli');

  return (
    <div className="layout">
      <header className="header">
        <h1>Multiarm Bandit Suite</h1>
      </header>

      <h4>
        Hier erfährst du, wie Entscheidungsstrategien hinter modernen Empfehlungssystemen
        funktionieren – vom Zufall bis zur optimalen Auswahl!
      </h4>
      <h4>
        Jeder hat ein Musikgenre, das im Moment besonders angesagt ist. Doch Geschmäcker ändern sich
        – vielleicht entdeckst du bald einen neuen Favoriten! Hier kannst du herausfinden, welches
        Genre aktuell am beliebtesten ist und die meisten Hörstunden verzeichnet.
      </h4>

      <nav
        className="bandit-tabs"
        data-active={
          active === 'bernoulli' ? 1 : active === 'gauss' ? 2 : active === 'theory' ? 3 : 1
        }
      >
        <button
          className={`tab ${active === 'bernoulli' ? 'active' : ''}`}
          onClick={() => setActive('bernoulli')}
        >
          Bernoulli
        </button>
        <button
          className={`tab ${active === 'gauss' ? 'active' : ''}`}
          onClick={() => setActive('gauss')}
        >
          Gauss
        </button>
        <button
          className={`tab ${active === 'theory' ? 'active' : ''}`}
          onClick={() => setActive('theory')}
        >
          Theorie
        </button>
      </nav>

      <main className="main">
        {active === 'bernoulli' && (
          <BernoulliBanditUI
            title="Bernoulli-Bandit"
            probabilities={[
              0.85, 0.7, 0.78, 0.65, 0.62, 0.45, 0.35, 0.6, 0.55, 0.5, 0.48, 0.58, 0.52, 0.57, 0.54,
            ]}
          />
        )}
        {active === 'gauss' && <GaussBanditUI title="Gauss-Bandit" />}
        {active === 'theory' && <ReadmeView title="Projektübersicht" />}
      </main>

      <footer className="footer">
        <small>Marco Wolters, Till Albers, Jonah Lackmann, Felix Heitlage</small>
      </footer>
    </div>
  );
}
