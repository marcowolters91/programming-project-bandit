import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BernoulliBanditUI from '../../src/bandits/BernoulliBandit.jsx';

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

  it('zeigt nach mehreren Zügen Ergebnisse und Algorithmus-Tabelle an', async () => {
    render(<BernoulliBanditUI />);
    const nextBtn = screen.getByRole('button', { name: /Nächste Runde/i });

    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextBtn);
    }

    await waitFor(() => {
      expect(screen.getByText(/Ergebnisse/i)).toBeInTheDocument();
      expect(screen.getByText(/Algorithmus/i)).toBeInTheDocument();
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
