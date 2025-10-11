[![CI - Build Status](https://github.com/marcowolters91/programming-project-bandit/actions/workflows/ci.yml/badge.svg)](https://github.com/marcowolters91/programming-project-bandit/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/marcowolters91/programming-project-bandit/branch/main/graph/badge.svg)](https://codecov.io/gh/marcowolters91/programming-project-bandit)

# Multi-Armed Bandit – Spotify Genre Optimizer

Ein Open-Source-Projekt zur Demonstration und Simulation von Multi-Armed-Bandit-Algorithmen im Kontext von **Musikempfehlungen auf Spotify**.  
Das Ziel ist es, verschiedene **Strategien zur Auswahl von Musikgenres** zu vergleichen, um **Nutzerpräferenzen datenbasiert zu optimieren**.

> Dieses Projekt wurde im Rahmen des Moduls *Programmierprojekt* an der Hochschule Osnabrück entwickelt.

---

## Projektübersicht

Der Multi-Armed Bandit simuliert ein Empfehlungssystem, das mit der Zeit lernt, welche Musikrichtungen ein Nutzer bevorzugt.  
Dabei wird das bekannte **Exploration-Exploitation-Dilemma** genutzt:  
Das System testet neue Genres (Exploration), während es gleichzeitig bekannte Favoriten häufiger empfiehlt (Exploitation).

Im konkreten Use Case werden **Spotify-Genres** wie *Pop*, *Hip-Hop*, *Jazz*, *Techno* oder *Indie* verwendet.  
Nach jeder „Wiedergabe“ bewertet der Nutzer die Empfehlung – positiv oder negativ – und der Algorithmus passt sich adaptiv an.  
So entsteht ein System, das Schritt für Schritt **lernt, welche Musik am besten ankommt**.

---

## 🎵 Bandit-Varianten im Detail

### 🎯 Bernoulli-Bandit

Du willst wissen, ob dein Musikgeschmack gerade der absolute Trend ist?  
Dann bist du hier genau richtig!

In dieser Variante werden die Genres als **Arme des Banditen** dargestellt – jede Entscheidung ist ein Wurf ins musikalische Glück.

**Eintretende Rewards:**
- **1:** Treffer – Das Genre gefällt dem Nutzer!  
- **0:** Kein Treffer – Das Genre wird geskippt.

Die Regeln sind einfach:  
Wähle, höre und bewerte – aber aufgepasst: **es geht auf Zeit!**  
Nur wer schnell und klug entscheidet, findet das aktuell **beliebteste Genre**.  

Doch sei gewarnt:  
Du bist **nicht allein im Spiel** – deine Gegner sind unsichtbar, aber aktiv.  
Ihr alle wetteifert darum, den optimalen Musiktrend zuerst zu entdecken!

---

### 📈 Gaussian-Bandit

Analysiere verschiedene Musikgenre-Strategien auf Basis einer **normalverteilten Reward-Struktur**.  
Hier geht es nicht nur um Treffer oder Nieten, sondern um **graduelle Bewertungen** – wie sehr ein Genre gefallen hat.  

Das Modell erlaubt feinere Nuancen und eignet sich ideal, um Unterschiede zwischen ähnlichen Genres zu erfassen.  
So wird erkennbar, **welche Strategie langfristig die beste Balance zwischen Risiko und Belohnung** liefert.

---

## Technologien

- **React (Vite)** – Frontend-Framework zur Darstellung und Interaktion  
- **Node.js** – Lokaler Entwicklungsserver & Paketverwaltung  
- **Vitest** – Testing Framework für Unit- und Integrationstests  
- **ESLint + Prettier** – Codequalität & Formatierung  
- **GitHub Actions** – Continuous Integration (CI) mit automatisierten Tests  
- **Codecov** – Testabdeckung und Qualitätsanalyse  

---

## Lokale Installation & Start

### Schritte

1. Repository klonen:
   ```bash
   git clone https://github.com/marcowolters91/programming-project-bandit.git
   ```

2. In den Projektordner wechseln:
   ```bash
   cd programming-project-bandit/multiarm-bandit
   ```

3. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

4. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

5. Anwendung öffnen:
   ```
   http://localhost:5173
   ```

---

## Funktionsweise

Das System implementiert mehrere **Bandit-Strategien** zur Optimierung der Musikempfehlungen:

- **Greedy-Algorithmus** – Wählt immer das aktuell beste Genre  
- **Epsilon-Greedy** – Erkundet gelegentlich neue Genres  
- **Upper Confidence Bound (UCB)** – Balanciert Risiko und Belohnung  
- **Thompson Sampling** – Wahrscheinlichkeitsbasiertes Lernen  

Diese Strategien werden in Simulationen verglichen.  
Das Frontend visualisiert die Lernprozesse – z. B.:
- Häufigkeit der Genre-Auswahl  
- Durchschnittliche Belohnung  
- Lernkurven und Konvergenzverhalten  

So kann beobachtet werden, **wie jede Strategie mit der Zeit „intelligenter“ wird**.

---

## Tests ausführen

Das Projekt nutzt **Vitest** für automatisierte Tests und Coverage-Berichte.

```bash
npm run coverage
```

Testberichte (Coverage) werden automatisch im Terminal ausgegeben.

---

## Continuous Integration

Das Repository enthält eine **GitHub Actions Workflow-Datei** (`.github/workflows/ci.yml`),  
die bei jedem Push automatisch:

1. Den Code lintet  
2. Den Code mit Prettier formatiert  
3. Die Tests mit Vitest ausführt  
4. Einen Build erstellt  
5. Die Testabdeckung an Codecov übermittelt  

---

## Erweiterungsmöglichkeiten (Ausblick)

- Integration echter **Spotify-APIs** zur Auswertung von Hörgewohnheiten  
- Verwendung von **realen Feedbackdaten** statt Simulation  
- Erweiterung um **personalisierte Nutzerprofile**  
- Interaktive **Lernvisualisierung** mit Zeitlimit oder Scoreboard  
- Vergleich mehrerer Spielerstrategien in Echtzeit  

---

## Team & Projektmanagement

- Hochschule Osnabrück – Modul *Programmierprojekt (5. Semester)*  
- Projektorganisation über GitHub (Issues, Pull Requests, CI)  
- Kommunikation über MS Teams & Jira  

---

## Lizenz

Dieses Projekt ist **Open Source** und ausschließlich zu **Lern- und Demonstrationszwecken** gedacht.

---

© 2025 Hochschule Osnabrück – Multi-Armed Bandit Projekt
