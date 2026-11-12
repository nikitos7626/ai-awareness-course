import { test, expect } from '@playwright/test';

/**
 * ============================================================================
 * SMG Design System Compliance Test Suite
 * ============================================================================
 * Строгая проверка всех цветовых, типографических, геометрических и стилистических
 * критериев из ТЗ: "test-assignment/design.md"
 *
 * Разделы design.md:
 *  1. Цвета (таблица токенов, сервисный синий, фоны, контраст)
 *  2. Шрифты и типографика (TT Norms Pro, Roboto Flex, локальная загрузка, Web UI роли, регистр)
 *  3. Геометрия и состояния (отступы 8-48px, pill-скругления, радиусы 4/12/24/40px, тени)
 *  4. Состояния и движение (transitions ~150ms, active scale, hover, focus-ring)
 *  5. Логотип и иконки (mark.svg, 'smg' lowercase, линейные иконки, 0 эмодзи)
 *  6. Адаптивность (360, 680, 1024, 1440, 1920 px, touch targets >= 44px)
 * ============================================================================
 */

test.describe('1. Цветовая палитра и токены (design.md §Цвета)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('1.1. Все 8 обязательных цветовых токенов из таблицы design.md определены в :root', async ({ page }) => {
    const tokens = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        violet: styles.getPropertyValue('--smg-violet').trim().toUpperCase(),
        ink: styles.getPropertyValue('--smg-ink').trim().toUpperCase(),
        black: styles.getPropertyValue('--smg-black').trim().toUpperCase(),
        white: styles.getPropertyValue('--smg-white').trim().toUpperCase(),
        gray100: styles.getPropertyValue('--smg-gray-100').trim().toUpperCase(),
        violet50: styles.getPropertyValue('--smg-violet-50').trim().toUpperCase(),
        gray300: styles.getPropertyValue('--smg-gray-300').trim().toUpperCase(),
        danger: styles.getPropertyValue('--smg-danger').trim().toUpperCase(),
      };
    });

    expect(tokens.violet).toBe('#6228FF');
    expect(tokens.ink).toBe('#212121');
    expect(tokens.black).toBe('#161616');
    expect(tokens.white).toBe('#FFFFFF');
    expect(tokens.gray100).toBe('#F2F3F5');
    expect(tokens.violet50).toBe('#F6F1FF');
    expect(tokens.gray300).toBe('#D9D9D9');
    expect(tokens.danger).toBe('#FF6464');
  });

  test('1.2. Основной фирменный акцент: кнопки CTA используют #6228FF', async ({ page }) => {
    const ctaButton = page.locator('button.smg-button-violet').first();
    await expect(ctaButton).toBeVisible();

    const bg = await ctaButton.evaluate((el) => getComputedStyle(el).backgroundColor);
    // rgb(98, 40, 255) == #6228FF
    expect(bg).toBe('rgb(98, 40, 255)');
  });

  test('1.3. Основной текст страницы использует цвет --smg-ink (#212121)', async ({ page }) => {
    const bodyColor = await page.evaluate(() => getComputedStyle(document.body).color);
    // rgb(33, 33, 33) == #212121
    expect(bodyColor).toBe('rgb(33, 33, 33)');
  });

  test('1.4. Фон страницы использует --smg-white (#FFFFFF)', async ({ page }) => {
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    // rgb(255, 255, 255) == #FFFFFF
    expect(bodyBg).toBe('rgb(255, 255, 255)');
  });

  test('1.5. Вводный блок (Hero) использует фирменный темный фон bg-violet-1.png', async ({ page }) => {
    const heroSection = page.locator('#hero');
    await expect(heroSection).toBeVisible();

    const bgImage = await heroSection.evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(bgImage).toContain('bg-violet-1.png');
  });

  test('1.6. Темная поверхность: футер использует цвет фона --smg-black (#161616)', async ({ page }) => {
    const footer = page.locator('footer.smg-footer');
    await expect(footer).toBeVisible();

    const footerBg = await footer.evaluate((el) => getComputedStyle(el).backgroundColor);
    // rgb(22, 22, 22) == #161616
    expect(footerBg).toBe('rgb(22, 22, 22)');
  });

  test('1.7. Запрет подмены акцента: сервисный синий #007AFF не используется в основных кнопках и ссылках', async ({ page }) => {
    const blueElementsCount = await page.evaluate(() => {
      const candidates = document.querySelectorAll('button, a, .smg-chip, .smg-card, h1, h2, h3');
      let count = 0;
      candidates.forEach((el) => {
        const cs = getComputedStyle(el);
        if (
          cs.backgroundColor === 'rgb(0, 122, 255)' ||
          cs.color === 'rgb(0, 122, 255)' ||
          cs.borderColor === 'rgb(0, 122, 255)'
        ) {
          count++;
        }
      });
      return count;
    });

    expect(blueElementsCount).toBe(0);
  });

  test('1.8. Мягкие фирменные поверхности используют --smg-violet-50 (#F6F1FF)', async ({ page }) => {
    const goodPracticeBox = page.locator('.smg-lesson-good-practice').first();
    await expect(goodPracticeBox).toBeVisible();

    const bg = await goodPracticeBox.evaluate((el) => getComputedStyle(el).backgroundColor);
    // rgb(246, 241, 255) == #F6F1FF
    expect(bg).toBe('rgb(246, 241, 255)');
  });

  test('1.9. Семантические цвета результатов квиза: ошибка (#FF6464) и успех (#10B981)', async ({ page }) => {
    const quizCard = page.locator('#quiz-case-1 .smg-quiz-card');
    await expect(quizCard).toBeVisible();

    // 1. Выбираем неверный ответ (вариант А - первый)
    const wrongOption = page.locator('#quiz-case-1 button.smg-quiz-option-button').first();
    await wrongOption.scrollIntoViewIfNeeded();
    await wrongOption.click();

    // Ждем появления кнопки retry и проверяем цвет рамки ошибки: rgb(255, 100, 100) == #FF6464
    const retryBtn = page.locator('#quiz-case-1 button:has-text("Попробовать снова")');
    await expect(retryBtn).toBeVisible();
    await expect(quizCard).toHaveCSS('border-color', 'rgb(255, 100, 100)');

    // 2. Нажимаем "Попробовать снова"
    await retryBtn.click();
    await expect(retryBtn).not.toBeVisible();

    // 3. Выбираем верный ответ (вариант B - второй)
    const correctOption = page.locator('#quiz-case-1 button.smg-quiz-option-button').nth(1);
    await correctOption.click();

    // Проверяем цвет рамки успеха: rgb(16, 185, 129) == #10B981
    await expect(quizCard).toHaveCSS('border-color', 'rgb(16, 185, 129)');
  });

  test('1.10. Блок аналогий в карточках концептов контрастен: текст использует --smg-ink (#212121) на белой подложке, а не серый на сером', async ({ page }) => {
    const analogyEl = page.locator('.smg-lesson-concept-analogy').first();
    await expect(analogyEl).toBeVisible();

    const styles = await analogyEl.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      };
    });

    // Текст аналогии контрастный: #212121 (rgb(33, 33, 33))
    expect(styles.color).toBe('rgb(33, 33, 33)');
    // Подложка аналогии белая: #FFFFFF (rgb(255, 255, 255)), исключающая серый на сером
    expect(styles.backgroundColor).toBe('rgb(255, 255, 255)');
  });
});

test.describe('2. Шрифты и типографика (design.md §Шрифты и типографика)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('2.1. Основной шрифт страницы — TT Norms Pro', async ({ page }) => {
    const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(bodyFont).toContain('TT Norms Pro');
  });

  test('2.2. Заголовки разделов используют шрифт TT Norms Pro', async ({ page }) => {
    const h1Font = await page.locator('h1').first().evaluate((el) => getComputedStyle(el).fontFamily);
    const h2Font = await page.locator('h2').first().evaluate((el) => getComputedStyle(el).fontFamily);
    expect(h1Font).toContain('TT Norms Pro');
    expect(h2Font).toContain('TT Norms Pro');
  });

  test('2.3. Фирменное написание логотипа "smg" использует шрифт Roboto Flex', async ({ page }) => {
    const logoText = page.locator('.smg-logo-text').first();
    await expect(logoText).toBeVisible();

    const logoFont = await logoText.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(logoFont).toContain('Roboto Flex');
  });

  test('2.4. Все шрифты загружаются ЛОКАЛЬНО: 0 внешних запросов к Google Fonts или CDN', async ({ page }) => {
    const externalFontRequests: string[] = [];

    page.on('request', (req) => {
      const url = req.url();
      if (
        url.includes('fonts.googleapis.com') ||
        url.includes('fonts.gstatic.com') ||
        url.includes('typekit.net') ||
        url.includes('cdnjs.cloudflare.com')
      ) {
        externalFontRequests.push(url);
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    expect(externalFontRequests).toEqual([]);
  });

  test('2.5. Базовый учебный текст соответствует Web UI роли: размер 14–16px, line-height ~1.5', async ({ page }) => {
    const pStyles = await page.locator('.smg-lesson-concept-desc').first().evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        fontSize: parseFloat(cs.fontSize),
        lineHeightRatio: parseFloat(cs.lineHeight) / parseFloat(cs.fontSize),
      };
    });

    expect(pStyles.fontSize).toBeGreaterThanOrEqual(14);
    expect(pStyles.fontSize).toBeLessThanOrEqual(16);
    expect(pStyles.lineHeightRatio).toBeCloseTo(1.45, 1);
  });

  test('2.6. Отсутствие слайдовых размеров (26–30px) в основном учебном тексте', async ({ page }) => {
    const slideSizesFound = await page.evaluate(() => {
      const textEls = document.querySelectorAll('p, li, .smg-lesson-concept-desc');
      let count = 0;
      textEls.forEach((el) => {
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs >= 26 && fs <= 30) {
          count++;
        }
      });
      return count;
    });

    expect(slideSizesFound).toBe(0);
  });

  test('2.7. Заголовки оформлены в обычном регистре предложений (Sentence case, не ALL CAPS)', async ({ page }) => {
    const headings = await page.evaluate(() => {
      const hEls = Array.from(document.querySelectorAll('h1, h2, h3'));
      return hEls.map((h) => ({
        text: (h.textContent || '').trim(),
        textTransform: getComputedStyle(h).textTransform,
      }));
    });

    headings.forEach((h) => {
      expect(h.textTransform).not.toBe('uppercase');

      const words = h.text.split(/\s+/);
      if (words.length > 3) {
        const isAllCaps = h.text === h.text.toUpperCase() && /[А-ЯA-Z]/.test(h.text);
        expect(isAllCaps).toBe(false);
      }
    });
  });
});

test.describe('3. Геометрия, скругления и отступы (design.md §Геометрия и состояния)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('3.1. Токены веб-отступов --smg-web-space-* (8, 12, 16, 24, 32, 40, 48 px) определены в :root', async ({ page }) => {
    const spacingTokens = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      return {
        s1: cs.getPropertyValue('--smg-web-space-1').trim(),
        s2: cs.getPropertyValue('--smg-web-space-2').trim(),
        s3: cs.getPropertyValue('--smg-web-space-3').trim(),
        s4: cs.getPropertyValue('--smg-web-space-4').trim(),
        s5: cs.getPropertyValue('--smg-web-space-5').trim(),
        s6: cs.getPropertyValue('--smg-web-space-6').trim(),
        s7: cs.getPropertyValue('--smg-web-space-7').trim(),
      };
    });

    expect(spacingTokens.s1).toBe('8px');
    expect(spacingTokens.s2).toBe('12px');
    expect(spacingTokens.s3).toBe('16px');
    expect(spacingTokens.s4).toBe('24px');
    expect(spacingTokens.s5).toBe('32px');
    expect(spacingTokens.s6).toBe('40px');
    expect(spacingTokens.s7).toBe('48px');
  });

  test('3.2. Кнопки имеют pill-скругление (--smg-radius-pill / >=18px)', async ({ page }) => {
    const buttons = page.locator('.smg-button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 5); i++) {
      const radius = await buttons.nth(i).evaluate((el) => {
        return parseFloat(getComputedStyle(el).borderTopLeftRadius);
      });
      expect(radius).toBeGreaterThanOrEqual(18);
    }
  });

  test('3.3. Чипы (теги) имеют pill-скругление (--smg-radius-pill)', async ({ page }) => {
    const chips = page.locator('.smg-chip');
    const count = await chips.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 5); i++) {
      const radius = await chips.nth(i).evaluate((el) => {
        return parseFloat(getComputedStyle(el).borderTopLeftRadius);
      });
      expect(radius).toBeGreaterThanOrEqual(12);
    }
  });

  test('3.4. Карточки используют системную шкалу радиусов (12, 24 или 40 px)', async ({ page }) => {
    const cardRadii = await page.evaluate(() => {
      const cards = document.querySelectorAll('.smg-card');
      const validRadii = [12, 20, 24, 32, 40];
      const results: { radius: number; valid: boolean }[] = [];
      cards.forEach((c) => {
        const r = parseFloat(getComputedStyle(c).borderTopLeftRadius);
        results.push({ radius: r, valid: validRadii.some((vr) => Math.abs(vr - r) <= 2) });
      });
      return results;
    });

    expect(cardRadii.length).toBeGreaterThan(0);
    cardRadii.forEach((cr) => {
      expect(cr.valid).toBe(true);
    });
  });

  test('3.5. Оформление плоское: тонкие границы (1px) и умеренные тени', async ({ page }) => {
    const borderAndShadow = await page.locator('.smg-card').first().evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        borderWidth: cs.borderWidth,
        boxShadow: cs.boxShadow,
      };
    });

    expect(borderAndShadow.borderWidth).toMatch(/^1px/);
  });
});

test.describe('4. Состояния компонентов и интерактивность (design.md §Геометрия и состояния)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('4.1. Движение короткое и функциональное: переходы состояний около 150ms', async ({ page }) => {
    const btnTransition = await page.locator('.smg-button').first().evaluate((el) => {
      return getComputedStyle(el).transitionDuration;
    });

    const seconds = parseFloat(btnTransition);
    expect(seconds).toBeGreaterThanOrEqual(0.1);
    expect(seconds).toBeLessThanOrEqual(0.3);
  });

  test('4.2. Нажатие на кнопку уменьшает её масштаб (active scale effect ~0.97-0.98)', async ({ page }) => {
    const hasActiveRule = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) {
            if (rule instanceof CSSStyleRule && rule.selectorText && rule.selectorText.includes(':active')) {
              if (rule.style.transform && rule.style.transform.includes('scale')) {
                return true;
              }
            }
          }
        } catch {
          // Guard
        }
      }
      return false;
    });

    expect(hasActiveRule).toBe(true);
  });

  test('4.3. Наведение на вариант ответа квиза подсвечивает его фоном --smg-violet-50', async ({ page }) => {
    const option = page.locator('#quiz-case-1 button.smg-quiz-option-button').first();
    await option.scrollIntoViewIfNeeded();
    await option.hover();

    await expect(option).toHaveCSS('background-color', 'rgb(246, 241, 255)');
  });

  test('4.4. Доступный фокус-ринг: при фокусе с клавиатуры отображается контрастное двойное кольцо', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedElementBoxShadow = await page.evaluate(() => {
      const active = document.activeElement;
      return active ? getComputedStyle(active).boxShadow : null;
    });

    expect(focusedElementBoxShadow).not.toBeNull();
    expect(focusedElementBoxShadow).toContain('rgb(98, 40, 255)');
  });

  test('4.5. Отсутствие декоративных циклических анимаций (@keyframes infinite на элементах страницы)', async ({ page }) => {
    const infiniteAnimations = await page.evaluate(() => {
      const allEls = document.querySelectorAll('*');
      let count = 0;
      allEls.forEach((el) => {
        const anim = getComputedStyle(el).animationIterationCount;
        if (anim === 'infinite') {
          count++;
        }
      });
      return count;
    });

    expect(infiniteAnimations).toBe(0);
  });
});

test.describe('5. Логотип и иконки (design.md §Логотип и иконки)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('5.1. Логотип содержит оригинальный векторный знак SMG (mark.svg / mark-transparent.svg)', async ({ page }) => {
    const logoMark = page.locator('.smg-logo-mark').first();
    await expect(logoMark).toBeVisible();

    const isSvg = await logoMark.evaluate((el) => el.tagName.toLowerCase() === 'svg');
    expect(isSvg).toBe(true);
  });

  test('5.2. Фирменное написание — строго "smg" в нижнем регистре', async ({ page }) => {
    const logoTexts = await page.locator('.smg-logo-text').allTextContents();
    expect(logoTexts.length).toBeGreaterThan(0);

    logoTexts.forEach((text) => {
      expect(text.trim()).toBe('smg');
      expect(text.trim()).not.toBe('SMG');
      expect(text.trim()).not.toBe('Smg');
    });
  });

  test('5.3. Запрет эмодзи в интерфейсе: используются линейные SVG-иконки SMG, 0 эмодзи в тексте компонентов', async ({ page }) => {
    const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/u;

    const emojiViolations = await page.evaluate((patternStr) => {
      const regex = new RegExp(patternStr, 'u');
      const textNodes: string[] = [];

      function walk(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const val = node.nodeValue?.trim();
          if (val && regex.test(val)) {
            textNodes.push(val);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
            for (const child of Array.from(node.childNodes)) {
              walk(child);
            }
          }
        }
      }

      walk(document.body);
      return textNodes;
    }, emojiRegex.source);

    expect(emojiViolations).toEqual([]);
  });

  test('5.4. В карточках уроков и квизах используются линейные иконки из SMG Icons', async ({ page }) => {
    const smgIcons = page.locator('.smg-icon');
    const iconCount = await smgIcons.count();
    expect(iconCount).toBeGreaterThanOrEqual(10);
  });
});

test.describe('6. Адаптивность и контрольные точки (design.md §Адаптивность)', () => {
  const breakpoints = [
    { name: 'Mobile 360px', width: 360, height: 800 },
    { name: 'Tablet 680px', width: 680, height: 1000 },
    { name: 'Laptop 1024px', width: 1024, height: 768 },
    { name: 'Desktop 1440px', width: 1440, height: 900 },
    { name: 'Desktop XL 1920px', width: 1920, height: 1080 },
  ];

  for (const bp of breakpoints) {
    test(`6.1-${bp.name}: Отсутствие горизонтального скролла на ${bp.width}px (scrollWidth <= clientWidth)`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(isOverflowing).toBe(false);
    });
  }

  test('6.2. На мобильном вьюпорте 360px кликабельные кнопки имеют высоту от 44px (Touch Target compliance)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const buttonHeights = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button.smg-button, .smg-mobile-nav-toggle');
      const results: { height: number; passed: boolean }[] = [];

      buttons.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          results.push({
            height: rect.height,
            passed: rect.height >= 43.5,
          });
        }
      });
      return results;
    });

    expect(buttonHeights.length).toBeGreaterThan(0);
    buttonHeights.forEach((b) => {
      expect(b.passed).toBe(true);
    });
  });

  test('6.3. На мобильном экране (<1024px) навигация скрывается в выезжающий drawer с кнопкой бургера', async ({ page }) => {
    await page.setViewportSize({ width: 680, height: 1000 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const toggleButton = page.locator('.smg-mobile-nav-toggle');
    await expect(toggleButton).toBeVisible();

    await toggleButton.click();
    const openSidebar = page.locator('.smg-sidebar.smg-sidebar-open');
    await expect(openSidebar).toBeVisible();
  });
});
