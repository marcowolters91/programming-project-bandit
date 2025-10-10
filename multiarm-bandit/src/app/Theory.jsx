import '../styles/bernoulli.css';
import readme from '../../README.md?raw';

export default function ReadmeView({ title='README', intro='Projektübersicht' }) {
  return (
    <section className="bandit-dashboard">
      <div className="bandit-shell">
        <header className="dashboard-header">
          <h2>{title}</h2>
          <p className="intro">{intro}</p>
        </header>
        <main className="readme-main">
          <article className="readme-card">
            <pre className="readme-content">{readme}</pre>
          </article>
        </main>
      </div>
    </section>
  );
}