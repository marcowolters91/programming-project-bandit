import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BanditApp from '../../src/app/BanditApp.jsx';

describe('BanditApp', () => {
  test('zeigt Startseite korrekt an', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <BanditApp />
      </MemoryRouter>
    );

    expect(screen.getByText(/Multiarm Bandit Suite/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bernoulli/i })).toBeInTheDocument();
  });

  test('navigiert zur Theorie-Seite', async () => {
    render(
      <MemoryRouter initialEntries={['/theory']}>
        <BanditApp />
      </MemoryRouter>
    );

    expect(screen.getByText(/Theorie/i)).toBeInTheDocument();
  });
});
