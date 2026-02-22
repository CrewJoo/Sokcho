import { test, expect } from '@playwright/test';

test('navigation menu visibility', async ({ page }) => {
    await page.goto('/');

    // Check if logo is present (might be hidden on home, but let's check structure)
    // The logo logic is complex: (isHome && viewMode === 'intro') || !isHome
    // Initially we are at home, viewMode is 'intro' by default?
    // Let's check menu items first as they should always be visible on desktop (lg:flex)

    // Wait for hydration
    await page.waitForLoadState('networkidle');

    // Check generic menu items
    const menuItems = ['PREP', '오디세이', '엘렌코스', '학생부 분석', '실전면접'];

    for (const item of menuItems) {
        const locator = page.getByRole('link', { name: item });
        // Check if it exists and is visible
        await expect(locator).toBeVisible();

        // Check color contrast (white text on dark background)
        // We can't easily check computed style, but visibility is a good proxy.
    }

    // Check action buttons
    await expect(page.getByRole('button', { name: '워크숍 안내' })).toBeVisible();
    await expect(page.getByRole('button', { name: '1:1 코칭 신청' })).toBeVisible();
});
