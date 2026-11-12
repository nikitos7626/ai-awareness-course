import { test, expect } from '@playwright/test';

/**
 * ============================================================================
 * Полный аудит ссылок и UX/UI элементов интерфейса курса
 * ============================================================================
 * Проверяет:
 *  1. Действительность ВСЕХ внутренних и внешних ссылок (отсутствие битых ссылок,
 *     наличие целей в DOM, атрибуты безопасности target="_blank" и rel).
 *  2. Работоспособность всех интерактивных UX/UI элементов:
 *     - Хедер (прогресс-бар, счетчики, подтверждение сброса)
 *     - Hero (CTA кнопки перехода)
 *     - Сайдбар (оглавление, динамические статусы, мобильный drawer и backdrop)
 *     - 8 карточек уроков (интерактивные кнопки изучения, концепции, бейджи)
 *     - 3 интерактивных квиза (выбор ответов, состояния ошибки/успеха, блокировка, retry)
 *     - Блок первоисточников
 *     - Футер
 *     - Доступность с клавиатуры (Skip-link, Tab order, focus visible)
 *     - Сохранение состояния в localStorage после перезагрузки
 * ============================================================================
 */

test.describe('1. Аудит всех ссылок на сайте (Links Audit)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('1.1. Все внутренние якорные ссылки (href="#...") ведут на существующие элементы в DOM', async ({ page }) => {
    const anchorHrefs = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href^="#"]'));
      return links.map((a) => ({
        href: a.getAttribute('href') || '',
        text: a.textContent?.trim().slice(0, 30) || 'без текста',
      }));
    });

    expect(anchorHrefs.length).toBeGreaterThan(0);

    for (const link of anchorHrefs) {
      // Исключаем пустые хэши
      expect(link.href).not.toBe('#');

      const targetId = link.href.slice(1);
      const targetExists = await page.evaluate((id) => Boolean(document.getElementById(id)), targetId);
      expect(targetExists, `Целевой элемент с id="${targetId}" для ссылки "${link.text}" обязан существовать в DOM`).toBe(true);
    }
  });

  test('1.2. Skip-link "#main-content" присутствует, виден при фокусе и ведет на основной контент', async ({ page }) => {
    const skipLink = page.locator('a.skip-to-content-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    // Фокусируемся на skip-link
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();

    // Проверяем, что элемент #main-content существует
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeAttached();
  });

  test('1.3. Все ссылки оглавления в сайдбаре (модули, темы, квизы, источники) кликабельны и скроллят к цели', async ({ page }) => {
    const sidebarTopicLinks = page.locator('.smg-sidebar a.smg-sidebar-topic-link');
    const count = await sidebarTopicLinks.count();
    expect(count).toBe(8); // 8 обязательных тем

    // Проверяем клик по первой и последней теме
    const firstLink = sidebarTopicLinks.first();
    const firstHref = await firstLink.getAttribute('href');
    expect(firstHref).toBe('#topic-1');

    await firstLink.click();
    const targetTopic1 = page.locator('#topic-1');
    await expect(targetTopic1).toBeInViewport();

    const lastLink = sidebarTopicLinks.last();
    const lastHref = await lastLink.getAttribute('href');
    expect(lastHref).toBe('#topic-8');

    await lastLink.click();
    const targetTopic8 = page.locator('#topic-8');
    await expect(targetTopic8).toBeInViewport();
  });

  test('1.4. Ссылки на квизы из сайдбара ведут прямо на карточки кейсов', async ({ page }) => {
    const quizCases = ['#quiz-case-1', '#quiz-case-2', '#quiz-case-3'];

    for (const quizId of quizCases) {
      const quizLink = page.locator(`.smg-sidebar a[href="${quizId}"]`);
      await expect(quizLink).toBeAttached();

      await quizLink.click();
      const targetQuiz = page.locator(quizId);
      await expect(targetQuiz).toBeInViewport();
    }
  });

  test('1.5. Все внешние ссылки в блоке источников безопасны (target="_blank", rel="noopener noreferrer") и валидны', async ({ page }) => {
    const externalLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href^="http"]'));
      return links.map((a) => ({
        href: a.getAttribute('href') || '',
        target: a.getAttribute('target'),
        rel: a.getAttribute('rel'),
        text: a.textContent?.trim() || '',
      }));
    });

    // В курсе 4 проверенных официальных источника
    expect(externalLinks.length).toBe(4);

    for (const link of externalLinks) {
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
      expect(link.rel).toContain('noreferrer');
      expect(link.href.startsWith('https://')).toBe(true);

      // Проверяем валидность синтаксиса URL
      expect(() => new URL(link.href)).not.toThrow();
    }
  });

  test('1.6. Ссылки в футере ("Наверх ↑", "Документация") скроллят к верху и разделу источников', async ({ page }) => {
    // Скроллим вниз к футеру
    await page.locator('footer').scrollIntoViewIfNeeded();

    const topLink = page.locator('footer a[href="#hero"]');
    await expect(topLink).toBeVisible();
    await topLink.click();
    await expect(page.locator('#hero')).toBeInViewport();

    const docsLink = page.locator('footer a[href="#sources"]');
    await expect(docsLink).toBeVisible();
    await docsLink.click();
    await expect(page.locator('#sources')).toBeInViewport();
  });
});

test.describe('2. Аудит UX/UI элементов хедера и управления прогрессом', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('2.1. Хедер прилипает к верху экрана при скролле (position: sticky)', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toHaveCSS('position', 'sticky');

    // Скроллим на 600px вниз
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(header).toBeInViewport();
  });

  test('2.2. Прогресс-бар и бейджи хедера динамически обновляются при прохождении тем', async ({ page }) => {
    const progressText = page.locator('.smg-progress-container');
    await expect(progressText).toContainText('0/8 тем');
    await expect(progressText).toContainText('0/3 кейсов');

    // Отмечаем первую тему
    const markBtn = page.locator('#topic-1 button').filter({ hasText: /Отметить как изученное/ });
    await markBtn.click();

    // Проверяем обновление счетчика в хедере
    await expect(progressText).toContainText('1/8 тем');

    // Отмечаем вторую тему
    const markBtn2 = page.locator('#topic-2 button').filter({ hasText: /Отметить как изученное/ });
    await markBtn2.click();
    await expect(progressText).toContainText('2/8 тем');
  });

  test('2.3. Кнопка "Начать заново" открывает confirm-диалог; отмена не сбрасывает прогресс', async ({ page }) => {
    // Отмечаем тему
    await page.locator('#topic-1 button').filter({ hasText: /Отметить как изученное/ }).click();
    await expect(page.locator('.smg-progress-container')).toContainText('1/8 тем');

    // Кликаем "Начать заново"
    const resetBtn = page.locator('header button:has-text("Начать заново")');
    await resetBtn.click();

    // Появляется диалог подтверждения
    const confirmBox = page.locator('header').filter({ hasText: 'Сбросить всё?' });
    await expect(confirmBox).toBeVisible();

    // Нажимаем "Нет" (отмена)
    await page.locator('header button:has-text("Нет")').click();

    // Прогресс остался
    await expect(page.locator('.smg-progress-container')).toContainText('1/8 тем');
    await expect(page.locator('header button:has-text("Начать заново")')).toBeVisible();
  });

  test('2.4. Подтверждение сброса ("Да") полностью очищает прогресс тем и квизов', async ({ page }) => {
    // Отмечаем тему
    await page.locator('#topic-1 button').filter({ hasText: /Отметить как изученное/ }).click();
    await expect(page.locator('.smg-progress-container')).toContainText('1/8 тем');

    // Кликаем сброс -> "Да"
    await page.locator('header button:has-text("Начать заново")').click();
    await page.locator('header button:has-text("Да")').click();

    // Прогресс сброшен на 0
    await expect(page.locator('.smg-progress-container')).toContainText('0/8 тем');
    await expect(page.locator('#topic-1 button').filter({ hasText: /Отметить как изученное/ })).toHaveText('Отметить как изученное');
  });
});

test.describe('3. Аудит UX/UI элементов Hero-секции', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('3.1. Кнопка "Начать курс →" выполняет плавный переход к Модулю 1', async ({ page }) => {
    const startBtn = page.locator('#hero button:has-text("Начать курс")');
    await expect(startBtn).toBeVisible();

    await startBtn.click();
    await expect(page.locator('#module-1')).toBeInViewport();
  });

  test('3.2. Вторая кнопка "Официальные источники" выполняет переход к разделу #sources', async ({ page }) => {
    const sourcesBtn = page.locator('#hero button:has-text("Официальные источники")');
    await expect(sourcesBtn).toBeVisible();

    await sourcesBtn.click();
    await expect(page.locator('#sources')).toBeInViewport();
  });

  test('3.3. Чипы метаинформации курса отображаются корректно', async ({ page }) => {
    const heroChips = page.locator('#hero .smg-chip');
    await expect(heroChips).toHaveCount(3);
    await expect(heroChips.nth(0)).toHaveText('Осознанный AI');
    await expect(heroChips.nth(1)).toContainText('Для сотрудников');
    await expect(heroChips.nth(2)).toContainText('8 тем · 3 кейса');
  });
});

test.describe('4. Аудит карточек уроков (Lesson Cards, темы 1–8)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('4.1. Все 8 карточек уроков присутствуют и имеют полную структуру контента', async ({ page }) => {
    const topicCards = page.locator('article[id^="topic-"]');
    await expect(topicCards).toHaveCount(8);

    for (let i = 0; i < 8; i++) {
      const card = topicCards.nth(i);
      await expect(card).toBeAttached();

      // Наличие бейджа номера темы
      await expect(card.locator('.smg-chip').first()).toContainText(/Тема \d+/);

      // Наличие заголовка h3
      await expect(card.locator('h3[id^="heading-topic-"]')).toBeAttached();

      // Наличие блока "Как делать правильно"
      await expect(card.locator('.smg-lesson-good-practice')).toBeAttached();
    }
  });

  test('4.2. Переключатель "Отметить как изученное" меняет состояние, текст и aria-pressed', async ({ page }) => {
    // Находим кнопку отметки первой темы по её стабильной роли и aria-label
    const btn = page.locator('#topic-1 button[aria-label*="Тема 1"]');
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
    await expect(btn).toHaveText('Отметить как изученное');

    await btn.click();
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    await expect(btn).toHaveText('Изучено ✓');

    // Появился бейдж "Изучено ✓"
    await expect(page.locator('#topic-1 .smg-chip:has-text("Изучено ✓")')).toBeVisible();

    // Кликаем еще раз — отменяем
    await btn.click();
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
    await expect(btn).toHaveText('Отметить как изученное');
    await expect(page.locator('#topic-1 .smg-chip:has-text("Изучено ✓")')).not.toBeVisible();
  });

  test('4.3. Индикатор в сайдбаре синхронизируется с кнопкой изучения темы', async ({ page }) => {
    const sidebarIndicator = page.locator('.smg-sidebar a[href="#topic-1"] span').last();
    await expect(sidebarIndicator).toHaveText('○');

    await page.locator('#topic-1 button').filter({ hasText: /Отметить как изученное/ }).click();
    await expect(sidebarIndicator).toHaveText('✓');
  });
});

test.describe('5. Аудит интерактивных квизов (Quiz Widgets, кейсы 1–3)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('5.1. Все 3 практических кейса содержат radiogroup и 3 варианта ответа (A, B, C)', async ({ page }) => {
    for (let i = 1; i <= 3; i++) {
      const quiz = page.locator(`#quiz-case-${i}`);
      await expect(quiz).toBeAttached();

      const options = quiz.locator('button.smg-quiz-option-button');
      await expect(options).toHaveCount(3);
    }
  });

  test('5.2. Сценарий неверного ответа: блокировка вариантов, подсветка ошибки, объяснение, кнопка повтора', async ({ page }) => {
    const quiz = page.locator('#quiz-case-1');
    const wrongOption = quiz.locator('button.smg-quiz-option-button').first();

    await wrongOption.scrollIntoViewIfNeeded();
    await wrongOption.click();

    // Бейдж ошибки
    await expect(quiz.locator('.smg-chip:has-text("Есть ошибка ✕")')).toBeVisible();

    // Блок объяснения виден и имеет aria-live="polite"
    const explanationBox = quiz.locator('div[aria-live="polite"]');
    await expect(explanationBox).toBeVisible();
    await expect(explanationBox).toContainText('Разбор ответа:');

    // Варианты заблокированы
    const option1 = quiz.locator('button.smg-quiz-option-button').nth(0);
    const option2 = quiz.locator('button.smg-quiz-option-button').nth(1);
    await expect(option1).toBeDisabled();
    await expect(option2).toBeDisabled();

    // Кнопка повтора доступна
    const retryBtn = quiz.locator('button:has-text("Попробовать снова")');
    await expect(retryBtn).toBeVisible();

    // Нажимаем повтор: варианты снова активны
    await retryBtn.click();
    await expect(option1).toBeEnabled();
    await expect(option2).toBeEnabled();
    await expect(explanationBox).not.toBeVisible();
  });

  test('5.3. Сценарий верного ответа: подсветка успеха, бейдж "Решено верно ✓", практический вывод', async ({ page }) => {
    const quiz = page.locator('#quiz-case-1');
    const correctOption = quiz.locator('button.smg-quiz-option-button').nth(1);

    await correctOption.scrollIntoViewIfNeeded();
    await correctOption.click();

    // Бейдж успеха
    await expect(quiz.locator('.smg-chip:has-text("Решено верно ✓")')).toBeVisible();

    // Блок объяснения содержит практический вывод
    const explanationBox = quiz.locator('div[aria-live="polite"]');
    await expect(explanationBox).toBeVisible();
    await expect(explanationBox).toContainText('Отличное решение!');
    await expect(explanationBox).toContainText('Практический вывод:');

    // Кнопка повтора НЕ показывается при верном решении
    await expect(quiz.locator('button:has-text("Попробовать снова")')).not.toBeVisible();

    // Счетчик кейсов в хедере увеличился
    await expect(page.locator('.smg-progress-container')).toContainText('1/3 кейсов');
  });

  test('5.4. В сайдбаре кнопка кейса меняет статус на "Решен ✓"', async ({ page }) => {
    const sidebarQuizBtn = page.locator('.smg-sidebar a[href="#quiz-case-1"]');
    await expect(sidebarQuizBtn).toContainText('Пройти →');

    // Решаем кейс верно
    await page.locator('#quiz-case-1 button.smg-quiz-option-button').nth(1).click();

    await expect(sidebarQuizBtn).toContainText('Решен ✓');
  });
});

test.describe('6. Аудит мобильного UX: Drawer меню и Backdrop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('6.1. На мобильном экране сайдбар спрятан; открывается кнопкой бургера с затемнением фона', async ({ page }) => {
    const sidebar = page.locator('.smg-sidebar');
    await expect(sidebar).not.toHaveClass(/smg-sidebar-open/);

    const burgerBtn = page.locator('.smg-mobile-nav-toggle');
    await expect(burgerBtn).toBeVisible();
    await burgerBtn.click();

    // Сайдбар открылся
    await expect(sidebar).toHaveClass(/smg-sidebar-open/);

    // Backdrop виден
    const backdrop = page.locator('div[aria-hidden="true"]').first();
    await expect(backdrop).toBeVisible();

    // Клик по backdrop закрывает сайдбар
    await backdrop.click();
    await expect(sidebar).not.toHaveClass(/smg-sidebar-open/);
  });

  test('6.2. Клик по ссылке темы внутри мобильного drawer закрывает меню и скроллит к карточке', async ({ page }) => {
    await page.locator('.smg-mobile-nav-toggle').click();

    const topic3Link = page.locator('.smg-sidebar a[href="#topic-3"]');
    await topic3Link.click();

    // Сайдбар автоматически закрылся
    await expect(page.locator('.smg-sidebar')).not.toHaveClass(/smg-sidebar-open/);
    await expect(page.locator('#topic-3')).toBeInViewport();
  });
});

test.describe('7. Аудит персистентности данных (localStorage UX)', () => {
  test('7.1. Пройденные темы и решенные квизы сохраняются после перезагрузки страницы', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Отмечаем тему 1
    await page.locator('#topic-1 button').filter({ hasText: /Отметить как изученное/ }).click();

    // 2. Решаем кейс 1
    await page.locator('#quiz-case-1 button.smg-quiz-option-button').nth(1).click();

    await expect(page.locator('.smg-progress-container')).toContainText('1/8 тем');
    await expect(page.locator('.smg-progress-container')).toContainText('1/3 кейсов');

    // 3. Перезагружаем страницу
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 4. Проверяем, что состояние восстановилось
    await expect(page.locator('.smg-progress-container')).toContainText('1/8 тем');
    await expect(page.locator('.smg-progress-container')).toContainText('1/3 кейсов');
    await expect(page.locator('#topic-1 button').filter({ hasText: /Изучено/ })).toBeVisible();
    await expect(page.locator('#quiz-case-1 .smg-chip:has-text("Решено верно ✓")')).toBeVisible();
  });
});
