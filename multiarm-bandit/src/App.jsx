import { Link } from 'react-router-dom'
import hsosLogo from './assets/hsos.png'
import  "./App.css"

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <img src={hsosLogo} alt="Hochschule Osnabrück" className="logo" />
        <h1>Willkommen</h1>
        <p className="subtitle">Bitte wähle eine Methode:</p>
      </header>

      <main className="main">
        <Link to="/bernoulli-bandit" className="btn">
            <button className="btn">Bernoulli-Bandit</button>
        </Link>
        <Link to="/methode-2" className="btn btn-secondary">
            <button className="btn">Methode 2</button>
        </Link>
      </main>
    </div>
  )
}