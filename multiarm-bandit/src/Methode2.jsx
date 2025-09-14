import { Link } from 'react-router-dom'

export default function Methode2() {
  return (
    <div className="page">
      <h2>Methode 2</h2>
      <p>Platzhalterseite für deine zweite Methode.</p>
      <Link to="/" className="link">← Zurück</Link>
    </div>
  )
}