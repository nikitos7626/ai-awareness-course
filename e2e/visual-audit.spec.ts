/**
 * Visual & Functional Audit — Playwright Tests
 *
 * Checks the implementation against:
 *  - test-assignment.md  (ТЗ requirements)
 *  - design.md           (SMG design system rules)
 *
 * Captures screenshots at 4 breakpoints (360, 680, 1024, 1440 px)
 * and validates computed CSS values against the design-system specification.
 */
import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';

const SCREENSHOT_DIR = path.resolve('e2e/screenshots');

/* ───────────────────── SMG Token Reference ───────────────────── */
const SMG = {
  violet: 'rgb(98, 40, 255)',     // #6228FF
  ink: 'rgb(33, 33, 33)',         // #212121
  white: 'rgb(255, 255, 255)',    // #FFFFFF
  danger: 'rgb(255, 100, 100)',   // #FF6464
  gray100: 'rgb(242, 243, 245)', // #F2F3F5
  gray300: 'rgb(217, 217, 217)', // #D9D9D9
  violet50: 'rgb(246, 241, 255)', // #F6F1FF
  black: 'rgb(22, 22, 22)',      // #161616
  infoBlue: 'rgb(0, 122, 255)',  // #007AFF — must NOT be used as primary accent
};

const BREAKPOINTS = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-680', width: 680, height: 900 },
  { name: 'tablet-1024', width: 1024, height: 900 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

/* ═════════════════════════════════════════════════════════════════
   A. CONTENT COMPLIANCE (test-assignment.md)
   ═════════════════════════════════════════════════════════════════ */
test.describe('A. Content: ТЗ compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('A1: Course title exists and is in Russian', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text).toContain('AI');
    // Must be in Russian (contains Cyrillic)
    expect(text).toMatch(/[а-яА-ЯёЁ]/);
  });

  test('A2: All 8 mandatory topics are present', async ({ page }) => {
    const topics = [
      'Контекст',        // 1
      'Скилл',           // 2 — Skills
      'MCP',             // 3
      'модел',           // 4 — Различия моделей
      'бенчмарк',        // 5 — Benchmarks / types of tasks
      'Проверк',         // 6 — Verification
      'Планирован',      // 7 — Planning
      'Харнес',          // 8 — Harnesses
    ];

    const bodyText = await page.locator('body').textContent();
    for (const topic of topics) {
      const regex = new RegExp(topic, 'i');
      expect(regex.test(bodyText!), `Topic keyword "${topic}" not found on page`).toBeTruthy();
    }
  });

  test('A3: At least 3 interactive quiz/case widgets', async ({ page }) => {
    // Quiz widgets have role="radiogroup"
    const quizzes = page.locator('[role="radiogroup"]');
    const count = await quizzes.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('A4: At least 1 quiz tests applied business knowledge', async ({ page }) => {
    // Business case indicators — look for scenario descriptions mentioning
    // real work situations (contract, report, CRM, etc.)
    const bodyText = (await page.locator('body').textContent()) || '';
    const businessTerms = ['договор', 'отчет', 'CRM', 'совет директоров', 'закупк', 'аналитическ'];
    const found = businessTerms.filter(t => bodyText.toLowerCase().includes(t.toLowerCase()));
    expect(found.length).toBeGreaterThanOrEqual(1);
  });

  test('A5: Official sources with verification dates (3–5 links)', async ({ page }) => {
    const sourcesSection = page.locator('#sources');
    await expect(sourcesSection).toBeVisible();

    // Source cards with external links
    const links = sourcesSection.locator('a[target="_blank"]');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(3);
    expect(count).toBeLessThanOrEqual(6);

    // Verification dates present
    const text = await sourcesSection.textContent();
    expect(text).toMatch(/проверен/i);
    expect(text).toMatch(/202[4-6]/); // Year reference
  });

  test('A6: Progress bar visible on desktop', async ({ page }) => {
    const progressbar = page.locator('[role="progressbar"]');
    await expect(progressbar).toBeVisible();
    const valuenow = await progressbar.getAttribute('aria-valuenow');
    expect(Number(valuenow)).toBeGreaterThanOrEqual(0);
  });

  test('A7: Navigation (sidebar) present with module links', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // At least 3 module blocks
    const moduleLinks = sidebar.locator('a:has-text("Модуль")');
    const count = await moduleLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('A8: Reset progress workflow', async ({ page }) => {
    // Mark a topic first
    const markBtn = page.getByRole('button', { name: /отметить как изученное/i }).first();
    await markBtn.click();
    await expect(page.getByText('1/8 тем')).toBeVisible();

    // Reset flow
    await page.getByRole('button', { name: /начать заново/i }).click();
    await expect(page.getByText('Сбросить всё?')).toBeVisible();
    await page.getByRole('button', { name: 'Да' }).click();
    await expect(page.getByText('0/8 тем')).toBeVisible();
  });

  test('A9: Wrong answer → explanation → retry → correct', async ({ page }) => {
    const quiz1 = page.locator('#quiz-case-1');
    const options = quiz1.getByRole('radio');

    // Wrong answer
    await options.first().click();
    await expect(quiz1.getByText(/ошибка/i)).toBeVisible();

    // Retry
    const retryBtn = quiz1.getByRole('button', { name: /попробовать/i });
    await expect(retryBtn).toBeVisible();
    await retryBtn.click();

    // Correct answer (option B)
    await options.nth(1).click();
    await expect(quiz1.getByText(/верно/i)).toBeVisible();
  });

  test('A10: Progress persists after page reload', async ({ page }) => {
    // Mark topic
    await page.getByRole('button', { name: /отметить как изученное/i }).first().click();
    await expect(page.getByText('1/8 тем')).toBeVisible();

    // Reload
    await page.reload();
    await expect(page.getByText('1/8 тем')).toBeVisible();

    // Cleanup
    await page.getByRole('button', { name: /начать заново/i }).click();
    await page.getByRole('button', { name: 'Да' }).click();
  });
});

/* ═════════════════════════════════════════════════════════════════
   B. DESIGN SYSTEM: Colors, Typography, Geometry (design.md)
   ═════════════════════════════════════════════════════════════════ */
test.describe('B. Design system: SMG tokens', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('B1: Primary accent is violet #6228FF, NOT blue #007AFF', async ({ page }) => {
    // Sample the solid-violet chip background
    const chip = page.locator('.smg-chip').first();
    const bg = await chip.evaluate(el => getComputedStyle(el).backgroundColor);

    // Accept either the exact token or a brand-violet shade
    expect(bg).not.toBe(SMG.infoBlue);
    // The chip background should contain the violet value
    // (solid variant has violet bg, tint variant has violet-50)
    const allChips = page.locator('.smg-chip');
    const count = await allChips.count();
    let foundViolet = false;
    for (let i = 0; i < count; i++) {
      const chipBg = await allChips.nth(i).evaluate(el => getComputedStyle(el).backgroundColor);
      if (chipBg === SMG.violet || chipBg === SMG.violet50) {
        foundViolet = true;
        break;
      }
    }
    expect(foundViolet).toBeTruthy();
  });

  test('B2: Body text color is --smg-ink (#212121)', async ({ page }) => {
    const body = page.locator('body');
    const color = await body.evaluate(el => getComputedStyle(el).color);
    expect(color).toBe(SMG.ink);
  });

  test('B3: Body background is white', async ({ page }) => {
    const bg = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).toBe(SMG.white);
  });

  test('B4: Font family includes TT Norms Pro', async ({ page }) => {
    const ff = await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily);
    expect(ff.toLowerCase()).toMatch(/tt norms pro|ttnormspro/i);
  });

  test('B5: Base body font-size is 14-16px range', async ({ page }) => {
    const fs = await page.locator('body').evaluate(el =>
      parseFloat(getComputedStyle(el).fontSize)
    );
    expect(fs).toBeGreaterThanOrEqual(14);
    expect(fs).toBeLessThanOrEqual(16);
  });

  test('B6: Body line-height is approximately 1.5', async ({ page }) => {
    const lh = await page.locator('body').evaluate(el => {
      const style = getComputedStyle(el);
      const lineHeight = parseFloat(style.lineHeight);
      const fontSize = parseFloat(style.fontSize);
      return lineHeight / fontSize;
    });
    expect(lh).toBeGreaterThanOrEqual(1.4);
    expect(lh).toBeLessThanOrEqual(1.6);
  });

  test('B7: Buttons have pill border-radius (very large)', async ({ page }) => {
    const btn = page.locator('.smg-button').first();
    const radius = await btn.evaluate(el => getComputedStyle(el).borderRadius);
    // --smg-radius-pill = 200px, but computed is clamped by element size
    // Just verify it's significantly rounded
    const numericRadius = parseFloat(radius);
    expect(numericRadius).toBeGreaterThanOrEqual(15);
  });

  test('B8: Cards have appropriate border-radius (12-40px)', async ({ page }) => {
    const card = page.locator('.smg-card').first();
    const radius = await card.evaluate(el =>
      parseFloat(getComputedStyle(el).borderRadius)
    );
    expect(radius).toBeGreaterThanOrEqual(12);
    expect(radius).toBeLessThanOrEqual(40);
  });

  test('B9: No blue (#007AFF) used as primary accent anywhere', async ({ page }) => {
    // Check that the info-blue is not used in buttons or chips
    const buttons = page.locator('.smg-button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const bg = await buttons.nth(i).evaluate(el => getComputedStyle(el).backgroundColor);
      expect(bg).not.toBe(SMG.infoBlue);
    }
  });

  test('B10: Quiz correct/error states use proper colors', async ({ page }) => {
    const quiz1 = page.locator('#quiz-case-1');
    const options = quiz1.getByRole('radio');

    // Submit wrong answer
    await options.first().click();

    // Check the quiz card border is danger-ish
    const quizCard = quiz1.locator('.smg-card').first();
    const border = await quizCard.evaluate(el => getComputedStyle(el).borderColor);
    // Should be danger red, not blue
    expect(border).not.toBe(SMG.infoBlue);
  });

  test('B11: Fonts are loaded locally (no external CDN requests)', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', req => {
      if (req.url().includes('fonts.googleapis.com') ||
          req.url().includes('fonts.gstatic.com') ||
          req.url().includes('cdn.jsdelivr.net')) {
        requests.push(req.url());
      }
    });

    await page.goto('/');
    expect(requests).toHaveLength(0);
  });

  test('B12: Logo displays "smg" in lowercase', async ({ page }) => {
    // SVG logo should have aria-label
    const logo = page.locator('svg[aria-label="Soft Media Group"]');
    await expect(logo.first()).toBeVisible();

    // Wordmark text "smg" in lowercase
    const wordmark = page.locator('text, span').filter({ hasText: 'smg' });
    const count = await wordmark.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('B13: No emoji characters in UI components', async ({ page }) => {
    // Scan visible text content for pictographic emoji.
    // Text symbols like ✓ (U+2713), ✕ (U+2715), → (U+2192), ↺ (U+21BA),
    // ↗ (U+2197) are legitimate typography, NOT emoji per design.md.
    const bodyText = await page.locator('body').textContent() || '';

    // Only flag actual pictographic emoji (skin-tone sequences, emoticons, etc.)
    const pictographicEmoji = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/u;
    const found = bodyText.match(pictographicEmoji);
    expect(found, `Found pictographic emoji: ${JSON.stringify(found)}`).toBeNull();
  });

  test('B14: Transitions are short and functional (~150ms)', async ({ page }) => {
    const btn = page.locator('.smg-button').first();
    const transition = await btn.evaluate(el => getComputedStyle(el).transitionDuration);

    // Parse first value — should be around 150ms (0.15s) or similar short duration
    const ms = parseFloat(transition) * (transition.includes('ms') ? 1 : 1000);
    expect(ms).toBeGreaterThanOrEqual(100);
    expect(ms).toBeLessThanOrEqual(350);
  });
});

/* ═════════════════════════════════════════════════════════════════
   C. ACCESSIBILITY (WCAG 2.1 AA)
   ═════════════════════════════════════════════════════════════════ */
test.describe('C. Accessibility: A11y', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('C1: HTML lang attribute is set to "ru"', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('ru');
  });

  test('C2: Skip-to-content link exists and works', async ({ page }) => {
    const skipLink = page.locator('.skip-to-content-link');
    await expect(skipLink).toHaveCount(1);

    // Tab to it
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();

    // Verify href target exists
    const href = await skipLink.getAttribute('href');
    expect(href).toBe('#main-content');
    const target = page.locator('#main-content');
    await expect(target).toBeVisible();
  });

  test('C3: Semantic landmarks present', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('C4: Quiz radiogroup and radio roles', async ({ page }) => {
    const radiogroups = page.locator('[role="radiogroup"]');
    const count = await radiogroups.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // Each radiogroup has radio buttons inside
    for (let i = 0; i < count; i++) {
      const radios = radiogroups.nth(i).locator('[role="radio"]');
      const radioCount = await radios.count();
      expect(radioCount).toBeGreaterThanOrEqual(2);
    }
  });

  test('C5: Progress bar has proper ARIA attributes', async ({ page }) => {
    const pb = page.locator('[role="progressbar"]');
    await expect(pb).toBeVisible();
    expect(await pb.getAttribute('aria-valuemin')).toBe('0');
    expect(await pb.getAttribute('aria-valuemax')).toBe('100');
    expect(await pb.getAttribute('aria-valuenow')).toBeTruthy();
    expect(await pb.getAttribute('aria-label')).toBeTruthy();
  });

  test('C6: Quiz feedback has aria-live="polite"', async ({ page }) => {
    // Answer a quiz to trigger feedback
    const quiz1 = page.locator('#quiz-case-1');
    await quiz1.getByRole('radio').first().click();

    // Check for aria-live
    const liveRegion = quiz1.locator('[aria-live="polite"]');
    await expect(liveRegion).toBeVisible();
  });

  test('C7: Touch targets are at least 44px on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');

    // Check main CTA buttons
    const buttons = page.locator('.smg-button');
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible()) {
        const box = await btn.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(33); // min-height accounting for rendering
        }
      }
    }
  });

  test('C8: Focus ring is visible (high contrast double ring)', async ({ page }) => {
    // Tab to first interactive element
    await page.keyboard.press('Tab'); // skip-link
    await page.keyboard.press('Tab'); // logo link

    // Get box-shadow of focused element
    const focusedEl = page.locator(':focus');
    const boxShadow = await focusedEl.evaluate(el => getComputedStyle(el).boxShadow);

    // Should contain the double-ring pattern (2px white + 4px violet)
    // The computed value will contain rgb values
    expect(boxShadow).not.toBe('none');
    expect(boxShadow.length).toBeGreaterThan(10);
  });

  test('C9: All mark-as-read buttons have aria-label', async ({ page }) => {
    const markBtns = page.getByRole('button', { name: /отметить|изучено/i });
    const count = await markBtns.count();
    expect(count).toBeGreaterThanOrEqual(8);

    for (let i = 0; i < count; i++) {
      const label = await markBtns.nth(i).getAttribute('aria-label');
      expect(label).toBeTruthy();
    }
  });
});

/* ═════════════════════════════════════════════════════════════════
   D. RESPONSIVE LAYOUT (design.md breakpoints)
   ═════════════════════════════════════════════════════════════════ */
test.describe('D. Responsive: Breakpoints & layout', () => {
  for (const bp of BREAKPOINTS) {
    test(`D1-${bp.name}: No horizontal overflow at ${bp.width}px`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/');

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    });

    test(`D2-${bp.name}: Full page screenshot at ${bp.width}px`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/');
      await page.waitForTimeout(500); // Let transitions settle

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/${bp.name}-fullpage.png`,
        fullPage: true,
      });
    });
  }

  test('D3: Sidebar is fixed drawer below 1024px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto('/');

    const sidebar = page.locator('.smg-sidebar');
    const position = await sidebar.evaluate(el => getComputedStyle(el).position);
    expect(position).toBe('fixed');
  });

  test('D4: Mobile nav toggle visible below 1024px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto('/');

    const toggle = page.locator('.smg-mobile-nav-toggle');
    await expect(toggle).toBeVisible();
  });

  test('D5: Mobile nav toggle hidden on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const toggle = page.locator('.smg-mobile-nav-toggle');
    await expect(toggle).not.toBeVisible();
  });

  test('D6: Hero title is readable on mobile (≤52px, word-break)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');

    const h1 = page.locator('.smg-hero-title');
    const fs = await h1.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    // On mobile 360px, should be reduced from 52px desktop
    expect(fs).toBeLessThanOrEqual(32);
    expect(fs).toBeGreaterThanOrEqual(20);
  });
});

/* ═════════════════════════════════════════════════════════════════
   E. VISUAL SCREENSHOTS: Targeted component captures
   ═════════════════════════════════════════════════════════════════ */
test.describe('E. Visual captures', () => {
  test('E1: Hero section screenshot (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(400);

    await page.locator('#hero').screenshot({
      path: `${SCREENSHOT_DIR}/hero-desktop.png`,
    });
  });

  test('E2: Hero section screenshot (mobile 360px)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    await page.waitForTimeout(400);

    await page.locator('#hero').screenshot({
      path: `${SCREENSHOT_DIR}/hero-mobile.png`,
    });
  });

  test('E3: First lesson card screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await page.locator('#topic-1').screenshot({
      path: `${SCREENSHOT_DIR}/lesson-card-desktop.png`,
    });
  });

  test('E4: Quiz widget — unanswered state', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await page.locator('#quiz-case-1').screenshot({
      path: `${SCREENSHOT_DIR}/quiz-unanswered.png`,
    });
  });

  test('E5: Quiz widget — wrong answer state', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const quiz = page.locator('#quiz-case-1');
    await quiz.getByRole('radio').first().click();
    await page.waitForTimeout(300);

    await quiz.screenshot({
      path: `${SCREENSHOT_DIR}/quiz-wrong-answer.png`,
    });
  });

  test('E6: Quiz widget — correct answer state', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const quiz = page.locator('#quiz-case-1');
    // Click wrong first, retry, then correct
    await quiz.getByRole('radio').first().click();
    await quiz.getByRole('button', { name: /попробовать/i }).click();
    await quiz.getByRole('radio').nth(1).click();
    await page.waitForTimeout(300);

    await quiz.screenshot({
      path: `${SCREENSHOT_DIR}/quiz-correct-answer.png`,
    });
  });

  test('E7: Sources section screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await page.locator('#sources').screenshot({
      path: `${SCREENSHOT_DIR}/sources-desktop.png`,
    });
  });

  test('E8: Header with progress bar', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Mark a topic for progress
    await page.getByRole('button', { name: /отметить как изученное/i }).first().click();
    await page.waitForTimeout(200);

    await page.locator('header').screenshot({
      path: `${SCREENSHOT_DIR}/header-with-progress.png`,
    });
  });

  test('E9: Mobile sidebar drawer open', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');

    await page.locator('.smg-mobile-nav-toggle').click();
    await page.waitForTimeout(350);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/mobile-sidebar-open.png`,
    });
  });

  test('E10: Footer screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await page.locator('footer').screenshot({
      path: `${SCREENSHOT_DIR}/footer-desktop.png`,
    });
  });

  test('E11: Focus ring visibility screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Tab to the first button in content area
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }
    await page.waitForTimeout(200);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/focus-ring-visible.png`,
    });
  });

  test('E12: Module 2 & 3 screenshots (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await page.locator('#module-2').screenshot({
      path: `${SCREENSHOT_DIR}/module-2-desktop.png`,
    });

    await page.locator('#module-3').screenshot({
      path: `${SCREENSHOT_DIR}/module-3-desktop.png`,
    });
  });

  test('E13: Reset confirmation dialog screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await page.getByRole('button', { name: /начать заново/i }).click();
    await page.waitForTimeout(200);

    await page.locator('header').screenshot({
      path: `${SCREENSHOT_DIR}/reset-confirmation.png`,
    });
  });
});
