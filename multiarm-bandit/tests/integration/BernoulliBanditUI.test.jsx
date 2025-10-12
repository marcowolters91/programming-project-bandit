import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { beforeEach, afterEach, describe, it, vi } from 'vitest';
import BernoulliBanditUI from '../../src/bandits/BernoulliBandit.jsx';

// Charts mocken
vi.mock('../../src/diagrams/probabilityChart.jsx', () => ({
  ProbabilityChart: () => <div>Mocked ProbabilityChart</div>,
}));
vi.mock('../../src/diagrams/algorithmHitsChart.jsx', () => ({
  AlgorithmHitsChart: () => <div>Mocked AlgorithmHitsChart</div>,
}));

beforeEach(() => {
  // Math.random deterministisch mocken
  vi.spyOn(global.Math, 'random').mockReturnValue(0.5);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('BernoulliBanditUI', () => {
  it('zeigt Eingabefelder für Genres und max. Runden an', () => {
    render(<BernoulliBanditUI />);
    expect(screen.getByLabelText(/Anzahl der Genres/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Anzahl der max\. Runden/i)).toBeInTheDocument();
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
    const genreFound = genreButtons.some(btn =>
      /Rock|Pop|Jazz|Hip-Hop|Metal|Classical|EDM|Country/i.test(btn.textContent)
    );
    expect(genreFound).toBe(true);

    const firstGenreBtn = genreButtons.find(btn =>
      /Rock|Pop|Jazz|Hip-Hop|Metal|Classical|EDM|Country/i.test(btn.textContent)
    );
    fireEvent.click(firstGenreBtn);
  });

  it('zeigt nach mehreren Zügen Algorithmus-Tabelle an', async () => {
    render(<BernoulliBanditUI />);
    const nextBtn = screen.getByRole('button', { name: /Nächste Runde/i });

    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextBtn);
    }

    await waitFor(() => {
      // Überschrift prüfen
      expect(screen.getByText(/Welcher Algorithmus hat am besten abgeschnitten\?/i)).toBeInTheDocument();

      // Tabelle prüfen
      const table = screen.getByRole('table');
      const { getByText: getByTextInTable } = within(table);

      expect(getByTextInTable(/Algorithmus/i)).toBeInTheDocument();
      expect(getByTextInTable(/Züge/i)).toBeInTheDocument();
      expect(getByTextInTable(/Hit-Rate/i)).toBeInTheDocument();
    });
  });

  it('beendet Simulation korrekt, wenn maximale Runden erreicht sind', async () => {
    render(<BernoulliBanditUI />);
    const roundsInput = screen.getByLabelText(/Anzahl der max\. Runden/i);
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

  it('zeigt Feedback nach User-Klick', async () => {
    render(<BernoulliBanditUI />);
    const genreButtons = screen.getAllByRole('button');
    const genreBtn = genreButtons.find(btn =>
      /Rock|Pop|Jazz|Hip-Hop|Metal|Classical|EDM|Country/i.test(btn.textContent)
    );
    fireEvent.click(genreBtn);

    await waitFor(() => {
      const feedbacks = screen.queryAllByText(/Zug/i);
      expect(feedbacks.length).toBeGreaterThan(0);
    });
  });
});
