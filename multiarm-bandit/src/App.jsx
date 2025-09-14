import { Link } from 'react-router-dom'
import hsosLogo from './assets/hsos.png'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <img src={hsosLogo} alt="Hochschule Osnabrück" className="logo" />
        <h1>Willkommen</h1>
        <p className="subtitle">Bitte wähle eine Methode:</p>
      </header>

      <main className="main">
        <Link to="/bernoulli-bandit" className="btn">Methode 1</Link>
        <Link to="/methode-2" className="btn btn-secondary">Methode 2</Link>
      </main>
    </div>
  )
}