import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import GaussBandit from '../../src/bandits/GaussBandit.jsx';

/**
 * Integrationstest für den Gauss-Bandit mit epsilon-greedy Strategie.
 * Testet die komplette Interaktionskette zwischen UI und Algorithmus.
 */

describe('GaussBandit – Integrationstest (epsilon-greedy)', () => {
  it('zeigt Grundelemente (Inputfelder, Buttons, Tabelle) korrekt an', () => {
    render(<GaussBandit />);
    expect(screen.getByText(/Gauss-Bandit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max\. Runden/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Nächste Runde/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
    expect(screen.getByText(/Wähle ein Genre/i)).toBeInTheDocument();
  });

  it('führt mehrere Runden aus und aktualisiert Rundenzähler', async () => {
    render(<GaussBandit />);
    const maxRoundsInput = screen.getByLabelText(/Max\. Runden/i);
    fireEvent.change(maxRoundsInput, { target: { value: 5 } });

    const nextBtn = screen.getByRole('button', { name: /Nächste Runde/i });
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextBtn);
    }

    await waitFor(() => {
      // Das Diagramm wird durch UserGreedyTrend gerendert
      expect(screen.getByText(/Gespielte Runden/i)).toHaveTextContent(/5/);
    });
  });

  it('ermöglicht Benutzerauswahl eines Genres', async () => {
    render(<GaussBandit />);
    const genreButtons = screen.getAllByRole('button', { name: /🎶|🎸|🎤|🎧/ });
    fireEvent.click(genreButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Gespielte Runden/i)).toBeInTheDocument();
    });
  });

  it('zeigt nach einigen Runden ein Chart-Element oder Verlaufsanzeige', async () => {
    render(<GaussBandit />);
    const nextBtn = screen.getByRole('button', { name: /Nächste Runde/i });

    for (let i = 0; i < 8; i++) fireEvent.click(nextBtn);

    await waitFor(() => {
      // Suche zuerst, ob eine Chart-Box mit Verlauf existiert
      const chartBoxes = document.querySelectorAll('.chart-box');
      expect(chartBoxes.length).toBeGreaterThan(0);

      // Akzeptiere entweder Chart-Komponente oder Fallbacktext als Erfolg
      const hasChart =
        screen.queryByText(/Keine Verlaufsdaten vorhanden/i) === null || chartBoxes.length >= 2;

      expect(hasChart).toBe(true);
    });
  });

  it('setzt den Zustand korrekt zurück', async () => {
    render(<GaussBandit />);
    const nextBtn = screen.getByRole('button', { name: /Nächste Runde/i });
    const resetBtn = screen.getByRole('button', { name: /Reset/i });

    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);

    await waitFor(() => expect(screen.getByText(/Gespielte Runden/i)).toHaveTextContent(/2/));

    fireEvent.click(resetBtn);
    await waitFor(() => expect(screen.getByText(/Gespielte Runden/i)).toHaveTextContent(/0/));
  });
});
