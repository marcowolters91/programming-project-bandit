[![CI - Build Status](https://github.com/marcowolters91/programming-project-bandit/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/marcowolters91/programming-project-bandit/actions/workflows/ci-cd.yml)
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

## Bandit-Varianten im Detail

### Bernoulli-Bandit

Du willst wissen, ob dein Musikgeschmack gerade der absolute Trend ist?  
Dann bist du hier genau richtig!

In dieser Variante werden die Genres als **Arme des Banditen** dargestellt – jede Entscheidung ist ein Wurf ins musikalische Glück.

**Eintretende Rewards:**
- **1:** Treffer – Das Genre gefällt dem Nutzer!  
- **0:** Kein Treffer – Das Genre wird geskippt.

Die Regeln sind einfach:  
Nur wer klug entscheidet, findet das aktuell **beliebteste Genre**.  

Doch sei gewarnt:  
Du bist **nicht allein im Spiel** – deine Gegner sind unsichtbar, aber aktiv.  
Ihr alle wetteifert darum, den optimalen Musiktrend zuerst zu entdecken.

---

### Gaussian-Bandit

Analysiere verschiedene Musikgenre-Strategien auf Basis einer **normalverteilten Reward-Struktur**.  
Hier geht es nicht nur um Treffer oder Nieten, sondern um **graduelle Bewertungen** – wie wie hörzeit in einem Genre verbracht wird.  

Das Modell erlaubt feinere Nuancen und eignet sich ideal, um Unterschiede zwischen ähnlichen Genres zu erfassen.  
So wird erkennbar, **welche Strategie langfristig die beste Balance zwischen Risiko und Belohnung** liefert.

---

## Systemanforderungen

Zur Nutzung oder Entwicklung werden folgende Systemvoraussetzungen empfohlen:

| Komponente | Mindestanforderung | Empfehlung |
|-------------|--------------------|-------------|
| **Betriebssystem** | Windows 10 / macOS 12 / Linux | Aktuelle Version mit Node.js-Unterstützung |
| **Node.js** | v18.x oder höher | v20.x |
| **npm** | v9 oder höher | Automatisch mit Node installiert |
| **RAM** | 4 GB | 8 GB oder mehr |
| **Browser** | Chrome, Edge, Firefox oder Safari (aktuell) | Chrome für E2E-Tests empfohlen |

> Hinweis:  
> Bei der Nutzung der E2E-Tests muss der **Browsertyp manuell angepasst werden**, wenn kein Chrome verwendet wird (siehe Abschnitt *Qualitätssicherung*).

---

## Alternative Nutzung über GitHub Pages

Das Projekt kann **direkt im Browser** ausgeführt werden – ohne lokale Installation.  
Über folgenden Link gelangst du zur Live-Demo:

**[https://marcowolters91.github.io/programming-project-bandit/](https://marcowolters91.github.io/programming-project-bandit/)**

Die GitHub Pages-Version wird bei jedem erfolgreichen Build automatisch aktualisiert.  
Daher entspricht die dort laufende Anwendung stets dem **aktuellen Stand der Main-Branch**.

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

## Pipeline & Automatisierung

Das Projekt nutzt **GitHub Actions** als Continuous Integration (CI)-Pipeline.  
Bei jedem Push oder Pull Request wird automatisch eine Reihe von Schritten ausgeführt:

1. **Linter-Check:**  
   Prüft, ob der Code den definierten Stil- und Syntaxregeln entspricht.  
2. **Prettier-Formatierung:**  
   Vereinheitlicht automatisch den Code-Stil für bessere Lesbarkeit.  
3. **Unit-Tests & Coverage (Vitest):**  
   Führt alle Tests aus und überprüft die Testabdeckung.  
4. **Build-Schritt:**  
   Baut das Projekt für die Bereitstellung.  
5. **Deployment (optional):**  
   Erfolgreiche Builds werden über GitHub Pages veröffentlicht.  
6. **Coverage-Upload:**  
   Ergebnisse werden an [![codecov](https://codecov.io/gh/marcowolters91/programming-project-bandit/branch/main/graph/badge.svg)](https://codecov.io/gh/marcowolters91/programming-project-bandit) gesendet.

---

## Prettier & ESLint

**Prettier** und **ESLint** sind feste Bestandteile der Codequalitätssicherung.

- **Prettier:**  
  Formatiert den Code automatisch – gleiche Einrückungen, Klammern, Zeilenumbrüche usw.  
  → Ziel: Einheitlicher Stil unabhängig von IDE oder Entwickler.

- **ESLint:**  
  Überprüft den Code auf Fehler, Anti-Patterns und mögliche Bugs.  
  → Ziel: Frühzeitige Erkennung von Syntax- und Logikfehlern.

Diese Tools laufen sowohl lokal (`npm run lint`, `npm run format`) als auch automatisch über die CI-Pipeline.  

---

## Qualitätssicherung

Die Qualität des Codes wird über mehrere Mechanismen sichergestellt:

### 1. **Code Coverage**
Misst, wie viel Prozent des Codes durch Tests abgedeckt sind.  
Ein hoher Coverage-Wert bedeutet, dass viele Codepfade getestet wurden.  

---

### 2. **E2E-Tests (End-to-End)**
E2E-Tests prüfen die Anwendung als Ganzes — vom Frontend bis zur Benutzerinteraktion.

Hinweis:
Bevor die Tests ausgeführt werden, müssen die benötigten Browser-Binaries installiert werden:

npx playwright install --with-deps


Anschließend können die Tests gestartet werden:

npx playwright test --headed


Der Parameter --headed sorgt dafür, dass der Testlauf sichtbar im Browserfenster ausgeführt wird.
Das ist insbesondere hilfreich, um Fehler oder unerwartetes Verhalten direkt zu beobachten.

> Hinweis:  
> Der Browser muss im Test-Setup angepasst werden.  
> Standardmäßig läuft der Test über **Chrome**.  
> Falls ein anderer Browser (z. B. Firefox oder Safari) verwendet wird,  
> muss dieser in der Testkonfiguration angegeben werden:
---

### 3. **Pipeline-Checks**
Die CI-Pipeline fungiert als letzte Schutzschicht:  
Nur wenn alle Tests, Linter und Builds erfolgreich durchlaufen,  
wird ein Commit in den Hauptbranch übernommen oder ein Deployment ausgelöst.

Diese Kombination sorgt für:
- **Stabilen Codefluss**
- **Frühzeitige Fehlererkennung**
- **Automatische Rückmeldung an Entwickler**
---

## Team & Projektmanagement

- Hochschule Osnabrück – Modul *Programmierprojekt (5. Semester)*  
- Projektorganisation über GitHub (Issues, Pull Requests, CI)  
- Kommunikation über MS Teams & Jira  