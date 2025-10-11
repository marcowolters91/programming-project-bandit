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

Im konkreten Use Case werden **Spotify-Genres** wie beispielsweise *Pop*, *Hip-Hop*, *Jazz*, *Techno* oder *Indie* verwendet.  
Der Algorithmus erhält nach jeder „Wiedergabe“ ein Feedback in Form einer Belohnung — z. B. wie gut dem Nutzer das Genre gefallen hat.  
Auf Basis dieses Feedbacks passt der Bandit seine Entscheidungspolitik an und lernt fortlaufend, welche Genres die höchste Zufriedenheit erzeugen.

> Beispiel:  
> - Der Nutzer hört *Jazz* und bewertet es positiv → Wahrscheinlichkeit für Jazz steigt.  
> - *Techno* erhält negatives Feedback → wird seltener empfohlen.  
> Mit der Zeit optimiert sich das System automatisch.

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

Das System implementiert verschiedene **Bandit-Strategien** zur Auswahl von Musikgenres, darunter:

- **Greedy-Algorithmus** – Wählt immer das aktuell beste Genre  
- **Epsilon-Greedy** – Erkundet gelegentlich neue Genres  
- **Upper Confidence Bound (UCB)** – Balanciert Risiko und Belohnung  
- **Thompson Sampling** – Wahrscheinlichkeitsbasiertes Lernen  

Die Performance der Strategien wird durch simulierte Nutzerinteraktionen und statistische Auswertungen verglichen.  
Das Frontend visualisiert dabei die Ergebnisse (z. B. Auswahlhäufigkeit, erwartete Belohnung, Lernkurve).

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
- Verwendung von **realen Feedbackdaten** anstelle von Simulationen  
- Erweiterung um **künstliche Nutzerprofile** mit individuellen Präferenzen  
- Aufbau eines Dashboards zur **Visualisierung von Lernprozessen**  
- Vergleich der Strategien in Echtzeit über eine interaktive Oberfläche  

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
