import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should have correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/PREP오디세이/);
    });

    test('should navigate to Word Dancing page', async ({ page }) => {
        // Find the link or button to Word Dancing
        // Assuming there is a link with text "워드댄싱" or similar
        // If not, we can look for specific href
        const link = page.getByRole('link', { name: /워드댄싱|Word Dancing/i }).first();

        // If homepage design varies, we might need to be more specific. 
        // Let's assume standard navigation or cards.
        // Based on previous knowledge, there might be cards.

        // Fallback: Check for href
        // await page.click('a[href="/prep-word-dancing"]'); 
        // Using getByRole is better for accessibility check

        // Let's list the expected main links
        // Word Dancing, Training, Analysis, Interview

        await expect(link).toBeVisible();
        await link.click();

        await expect(page).toHaveURL(/.*prep-word-dancing/);
        await expect(page.getByRole('heading', { level: 1 })).toContainText(/워드댄싱|Word Dancing/);
    });

    test('should navigate to Analysis page', async ({ page }) => {
        const link = page.getByRole('link', { name: /분석|Analysis/i }).first();
        await expect(link).toBeVisible();
        await link.click();

        await expect(page).toHaveURL(/.*prep-analysis/);
        await expect(page.getByRole('heading', { level: 1 })).toContainText(/분석/);
    });
});
