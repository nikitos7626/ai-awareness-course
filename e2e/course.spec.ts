import { test, expect } from '@playwright/test';

test.describe('Course E2E Smoke Tests', () => {
  test('Desktop: complete flow (lesson completion, quiz wrong/correct, reload persistence, and reset)', async ({
    page,
  }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Как работать с AI осознанно/);

    // Initial state
    await expect(page.getByText('0/8 тем')).toBeVisible();

    // Mark topic 1 as read
    const markButtons = page.getByRole('button', { name: /отметить как изученное/i });
    await markButtons.first().click();
    await expect(page.getByText('1/8 тем')).toBeVisible();

    // Quiz 1: Choose incorrect option first (first radio button)
    const quiz1 = page.locator('#quiz-case-1');
    const options = quiz1.getByRole('radio');
    await options.first().click();

    // Verify error explanation and retry button appear
    await expect(quiz1.getByText('Есть ошибка ✕')).toBeVisible();
    const retryBtn = quiz1.getByRole('button', { name: /попробовать/i });
    await expect(retryBtn).toBeVisible();

    // Click retry
    await retryBtn.click();
    await expect(quiz1.getByText('Есть ошибка ✕')).not.toBeVisible();

    // Choose correct option (option B / index 1)
    await options.nth(1).click();
    await expect(quiz1.getByText('Решено верно ✓')).toBeVisible();

    // Reload page to test localStorage persistence
    await page.reload();
    await expect(page.getByText('1/8 тем')).toBeVisible();
    await expect(page.locator('#quiz-case-1').getByText('Решено верно ✓')).toBeVisible();

    // Test Reset workflow
    await page.getByRole('button', { name: /начать заново/i }).click();
    await expect(page.getByText('Сбросить всё?')).toBeVisible();
    await page.getByRole('button', { name: 'Да' }).click();

    // Verify reset to 0
    await expect(page.getByText('0/8 тем')).toBeVisible();
  });

  test('Mobile 360px viewport: no horizontal scroll and mobile navigation works', async ({
    page,
  }) => {
    // Set viewport to minimum required width: 360px
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');

    // Check that there is NO horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);

    // Toggle mobile menu
    const navToggle = page.locator('.smg-mobile-nav-toggle');
    await expect(navToggle).toBeVisible();
    await navToggle.click();

    // Sidebar drawer should now be visible
    const sidebar = page.locator('.smg-sidebar');
    await expect(sidebar).toHaveClass(/smg-sidebar-open/);

    // Click Module 2 link in mobile sidebar
    const mod2Link = sidebar.getByRole('link', { name: 'Модуль 2' });
    await mod2Link.click();

    // Sidebar should close after navigation
    await expect(sidebar).not.toHaveClass(/smg-sidebar-open/);
  });
});
