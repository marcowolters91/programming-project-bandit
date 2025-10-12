import { test, expect } from '@playwright/test';

test.describe('Multiarm Bandit – Vollintegration', () => {
  test('führt komplette Simulation mit beiden Banditen durch', async ({ page }) => {
    // 1: App öffnen
    await page.goto('http://localhost:5173');
    // sicherstellen, dass die App geladen ist
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('text=Multiarm Bandit Suite', { timeout: 20000 });

    // 2: Bernoulli-Bandit starten
    await page.getByRole('button', { name: /Bernoulli/i }).click();
    await expect(page.getByRole('heading', { name: /Bernoulli-Bandit/i })).toBeVisible();

    // 3: Simulation starten
    await page.getByLabel(/Max\. Runden/i).fill('3');
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /Nächste Runde/i }).click();
    }
    await expect(page.getByText(/Gespielte Runden:\s*3/)).toBeVisible();

    // 4: Wechsele zum Gauss-Bandit
    await page.getByRole('button', { name: /Gauss/i }).click();
    await expect(page.getByRole('heading', { name: /Gauss-Bandit/i })).toBeVisible();

    // 5 Simulation Gauss
    await page.getByLabel(/Max\. Runden/i).fill('2');
    for (let i = 0; i < 2; i++) {
      await page.getByRole('button', { name: /Nächste Runde/i }).click();
    }

    // 6: Diagramme prüfen & Reset
    // Warten, bis mindestens ein Chart-Container gerendert wurde
    await page.waitForSelector('.chart-box', { timeout: 15000 });

    // Warten, bis ein Chart-Container oder irgendein Visualisierungselement sichtbar ist
    await page.waitForSelector('.chart-box', { timeout: 15000 });

    // Fallback: Prüfe, dass der Container sichtbar ist
    const chartBoxes = page.locator('.chart-box');
    await expect(chartBoxes.first()).toBeVisible();

    // Reset danach
    await page.getByRole('button', { name: /Reset/i }).click();
    await expect(page.getByText(/Gespielte Runden:\s*0/)).toBeVisible();

    // 7: Theorie-Seite prüfen
    await page.getByRole('button', { name: /Theorie/i }).click();
    await expect(page.getByText(/Theorie/)).toBeVisible();
  });
});
