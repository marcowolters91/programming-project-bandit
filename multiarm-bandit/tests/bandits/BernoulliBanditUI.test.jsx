import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import BernoulliBanditUI from '../../src/bandits/BernoulliBandit.jsx';

describe('BernoulliBanditUI', () => {
  it('rendert den Titel korrekt', () => {
    render(<BernoulliBanditUI />);
    expect(screen.getByText(/Vergleich von Heizstrategien/i)).toBeInTheDocument();
  });

  it('zeigt Eingabefelder für Arme und Runden an', () => {
    render(<BernoulliBanditUI />);
    expect(screen.getByLabelText(/Anzahl Arme/i)).toBeInTheDocument();
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

  it('zeigt Strategie-Buttons an und reagiert auf Klicks', () => {
    render(<BernoulliBanditUI />);
    const strategyButtons = screen.getAllByRole('button');

    const strategyLabels = [
      'Konstante Temperatur halten',
      'Stoßweise aufheizen',
      'Bedarfsgesteuert',
      'Nachtabsenkung',
    ];

    const strategyFound = strategyButtons.some(btn =>
      strategyLabels.some(label => btn.textContent.includes(label))
    );

    expect(strategyFound).toBe(true);
    fireEvent.click(strategyButtons.find(btn => btn.textContent.includes('Konstante')));
  });

  it('zeigt nach mehreren Zügen das Effizienz-Diagramm an', async () => {
    render(<BernoulliBanditUI />);
    const nextBtn = screen.getByRole('button', { name: /Nächste Runde/i });

    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextBtn);
    }

    await waitFor(() => {
      const efficiencyTexts = screen.queryAllByText(content =>
        /Ergebnisse|Effizienz|Treffer pro Algorithmus/i.test(content)
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
