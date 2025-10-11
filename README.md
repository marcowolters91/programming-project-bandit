[![CI - Build Status](https://github.com/marcowolters91/programming-project-bandit/actions/workflows/ci.yml/badge.svg)](https://github.com/marcowolters91/programming-project-bandit/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/marcowolters91/programming-project-bandit/branch/main/graph/badge.svg)](https://codecov.io/gh/marcowolters91/programming-project-bandit)

# Multi-Armed Bandit – Spotify Genre Optimizer

Ein Open-Source-Projekt zur Demonstration und Simulation von Multi-Armed-Bandit-Algorithmen im Kontext von Musikempfehlungen.  
Das Ziel ist es, verschiedene **Strategien zur Auswahl von Musikgenres auf Spotify** zu vergleichen, um **Nutzerpräferenzen adaptiv zu optimieren**.

> Dieses Projekt wurde im Rahmen des Moduls *Programmierprojekt* an der Hochschule Osnabrück entwickelt.

---

## Projektübersicht

Der Multi-Armed Bandit simuliert, wie ein System durch wiederholtes Ausprobieren („Exploration“) und gezieltes Nutzen von Wissen („Exploitation“) lernt, welche Optionen die besten Ergebnisse liefern.  

In unserem Fall bezieht sich das auf die Auswahl von **Spotify-Musikgenres**.  
Ziel: Das System soll lernen, welche Musikrichtung einem Nutzer am besten gefällt.

> Beispiel (Platzhalter):  
> Das System wählt zwischen Genres wie *Pop*, *Jazz*, *Techno* und *Indie*.  
> Nach jeder „Wiedergabe“ bewertet der Nutzer die Empfehlung, und der Bandit-Algorithmus passt sich an.  

---


## Technologien

- **React (Vite)** – Frontend-Framework
- **Node.js** – Lokaler Server und Paketverwaltung
- **Vitest** – Testing Framework
- **ESLint + Prettier** – Codequalität & Formatierung
- **GitHub Actions** – Continuous Integration (Tests bei jedem Push)

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

## Tests ausführen

Das Projekt nutzt **Vitest** für automatisierte Tests / Coverage.

```bash
npm run coverage
```

Testberichte (Coverage) werden automatisch im Terminal ausgegeben.

---

## Continuous Integration

Das Repository enthält eine **GitHub Actions Workflow-Datei** (`.github/workflows/ci.yml`),  
die bei jedem Push automatisch:

1. Den Code lintet  
2. Den Code mit einem Prettier Bearbeitet
3. Die Tests mit Vitest ausführt  
4. Einen Build erstellt  

---

## Erweiterungsmöglichkeiten (Ausblick)

- Implementierung echter Spotify-Daten via API (z. B. genre-basiertes Feedback)  
- Vergleich verschiedener Strategien wie:
  - Epsilon-Greedy
  - Upper Confidence Bound (UCB)
  - Thompson Sampling  
- Visualisierung der Lernkurve und Belohnungsverteilung  
- Frontend-UI für Nutzerinteraktion und Statistikanzeige  

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
