import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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
    expect(screen.getByRole('heading', { name: /Gauss-Bandit/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Anzahl der max\. Runden/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Nächste Runde/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
    expect(screen.getByText(/Wähle ein Genre/i)).toBeInTheDocument();
  });

  it('führt mehrere Runden aus und aktualisiert Rundenzähler', async () => {
    render(<GaussBandit />);
    const maxRoundsInput = screen.getByLabelText(/Anzahl der max\. Runden/i);
    fireEvent.change(maxRoundsInput, { target: { value: 5 } });

    const nextBtn = screen.getByRole('button', { name: /Nächste Runde/i });

    // Alle Klicks in act packen
    act(() => {
      for (let i = 0; i < 5; i++) fireEvent.click(nextBtn);
    });

    // Warten bis die UI aktualisiert ist
    await waitFor(
      () => {
        const roundsText = screen.getByText(/Gespielte Runden/i);
        expect(roundsText).toHaveTextContent(/5/);
      },
      { timeout: 10000 } // Timeout verlängert
    );
  });

  it('ermöglicht Benutzerauswahl eines Genres', async () => {
    render(<GaussBandit />);
    const genreButtons = screen.getAllByRole('button').filter(btn => btn.textContent);
    act(() => {
      fireEvent.click(genreButtons[0]);
    });

    await waitFor(() => {
      const roundsText = screen.getByText(/Gespielte Runden/i);
      expect(roundsText).toBeInTheDocument();
      expect(roundsText.textContent).toMatch(/1/);
    });
  });

  it('zeigt nach einigen Runden ein Chart-Element oder Verlaufsanzeige', async () => {
    render(<GaussBandit />);
    const nextBtn = screen.getByRole('button', { name: /Nächste Runde/i });

    act(() => {
      for (let i = 0; i < 8; i++) fireEvent.click(nextBtn);
    });

    await waitFor(
      () => {
        const chartBoxes = document.querySelectorAll('.chart-box');
        expect(chartBoxes.length).toBeGreaterThan(0);

        // Prüfe, ob Chart oder Verlauf vorhanden ist
        const hasChart =
          screen.queryByText(/Keine Verlaufsdaten vorhanden/i) === null || chartBoxes.length >= 2;
        expect(hasChart).toBe(true);
      },
      { timeout: 10000 }
    );
  });

  it('setzt den Zustand korrekt zurück', async () => {
    render(<GaussBandit />);
    const nextBtn = screen.getByRole('button', { name: /Nächste Runde/i });
    const resetBtn = screen.getByRole('button', { name: /Reset/i });

    act(() => {
      fireEvent.click(nextBtn);
      fireEvent.click(nextBtn);
    });

    await waitFor(() => {
      const roundsText = screen.getByText(/Gespielte Runden/i);
      expect(roundsText).toHaveTextContent(/2/);
    });

    act(() => {
      fireEvent.click(resetBtn);
    });

    await waitFor(() => {
      const roundsText = screen.getByText(/Gespielte Runden/i);
      expect(roundsText).toHaveTextContent(/0/);
    });
  });
});
