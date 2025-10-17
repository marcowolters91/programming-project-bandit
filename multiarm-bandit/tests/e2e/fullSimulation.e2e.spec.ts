import { test, expect } from '@playwright/test';

const SLOW_MODE = true;  // true = sichtbar und langsam, false = normal/CI
const STEP_DELAY = 800;  // ms zwischen den einzelnen Aktionen

// Hilfsfunktion für Delay
const pause = (ms: number) => new Promise(res => setTimeout(res, ms));

test.describe('Multiarm Bandit – Vollintegration', () => {
  test('führt komplette Simulation mit beiden Banditen durch', async ({ page }, testInfo) => {
    // Infoausgabe im Terminal
    if (SLOW_MODE) {
      console.log(`Slow-Mode aktiv (${STEP_DELAY} ms Verzögerung pro Schritt)`);
      await page.setViewportSize({ width: 1920, height: 1080 });
      testInfo.annotations.push({ type: 'mode', description: 'Slow-Mode aktiv' });
    }

    const maybePause = async () => { if (SLOW_MODE) await pause(STEP_DELAY); };

    // 1: App öffnen
    await page.goto('http://localhost:5173');
    // sicherstellen, dass die App geladen ist
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('text=Multiarm Bandit Suite', { timeout: 20000 });
    await maybePause();

    // 2: Bernoulli-Bandit starten
    await page.getByRole('button', { name: /Bernoulli/i }).click();
    await expect(page.getByRole('heading', { name: /Bernoulli-Bandit/i })).toBeVisible();
    await maybePause();

    // 3: Simulation Bernoulli
    await page.getByLabel(/Max\. Runden/i).fill('3');
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /Nächste Runde/i }).click();
      await maybePause();
    }

    // prüfen, dass der Counter wirklich 3 erreicht hat
    await page.waitForFunction(() => {
    const el = document.body.innerText.match(/Gespielte Runden:\s*3/);
    return !!el;
    }, { timeout: 10000 });

    // 4: Wechsele zum Gauss-Bandit
    await page.getByRole('button', { name: /Gauss/i }).click();
    await expect(page.getByRole('heading', { name: /Gauss-Bandit/i })).toBeVisible();
    await maybePause();

    // 5 Simulation Gauss
    await page.getByLabel(/Max\. Runden/i).fill('3');
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /Nächste Runde/i }).click();
      await maybePause();
    }

    // 6: Diagramme prüfen & Reset
    await page.waitForSelector('.chart-box', { timeout: 15000 });
    const chartBoxes = page.locator('.chart-box');
    await expect(chartBoxes.first()).toBeVisible();
    await maybePause();

    await page.getByRole('button', { name: /Reset/i }).click();
    await expect(page.getByText(/Gespielte Runden:\s*0/)).toBeVisible();
    await maybePause();

    // 7: Theorie-Seite prüfen
    await page.getByRole('button', { name: /Theorie/i }).click();
    await expect(page.getByText(/Theorie/)).toBeVisible();
    await maybePause();
  });
});
