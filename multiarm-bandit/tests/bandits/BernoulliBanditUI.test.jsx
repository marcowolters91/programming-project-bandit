import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import BernoulliBanditUI from '../../src/bandits/BernoulliBandit.jsx';

describe('BernoulliBanditUI', () => {
  it('zeigt Eingabefelder für Genres und Runden an', () => {
    render(<BernoulliBanditUI />);
    expect(screen.getByLabelText(/Anzahl Genres/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max\. Runden/i)).toBeInTheDocument();
  });

  it('führt Reset korrekt aus', () => {
    render(<BernoulliBanditUI />);
    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);
  });

  it('ermöglicht Klick auf "Nächste Runde"', async () => {
    render(<BernoulliBanditUI />);
    const nextBtn = screen.getByRole('button', { name: /Nächste Runde/i });
    expect(nextBtn).toBeInTheDocument();

    fireEvent.click(nextBtn);
    await waitFor(() => {
      expect(screen.getByText(/Gespielte Runden/i)).toBeInTheDocument();
    });
  });

  it('zeigt Genre-Buttons an und reagiert auf Klicks', () => {
    render(<BernoulliBanditUI />);
    const genreButtons = screen.getAllByRole('button');

    const genres = ['Pop', 'Rock', 'Hip-Hop', 'EDM'];

    const genreFound = genreButtons.some(btn =>
      genres.some(label => btn.textContent.includes(label))
    );

    expect(genreFound).toBe(true);
    // Klick auf einen Genre-Button simulieren
    const popBtn = genreButtons.find(btn => btn.textContent.includes('Pop'));
    fireEvent.click(popBtn);
  });

  it('zeigt nach mehreren Zügen das Effizienz-Diagramm an', async () => {
    render(<BernoulliBanditUI />);
    const nextBtn = screen.getByRole('button', { name: /Nächste Runde/i });

    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextBtn);
    }

    await waitFor(() => {
      const efficiencyTexts = screen.queryAllByText(content =>
        /Ergebnisse|Treffer pro Algorithmus/i.test(content)
      );
      expect(efficiencyTexts.length).toBeGreaterThan(0);
    });
  });

  it('beendet Simulation korrekt, wenn maximale Runden erreicht sind', async () => {
    render(<BernoulliBanditUI />);
    const roundsInput = screen.getByLabelText(/Max\. Runden/i);
    fireEvent.change(roundsInput, { target: { value: 3 } });

    const nextBtn = screen.getByRole('button', { name: /Nächste Runde/i });

    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextBtn);
    }

    await waitFor(() => {
      const roundInfo = screen.getByText(/Gespielte Runden/i);
      expect(roundInfo.textContent).toMatch(/3/);
    });
  });
});
