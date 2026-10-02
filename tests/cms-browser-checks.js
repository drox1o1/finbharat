async page => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const assert = (value, message) => { if (!value) throw new Error(message); };
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const paths = ['/blog/', '/blog/local-qa-blog/', '/media/', '/media/local-qa-media/', '/terms/'];
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      const response = await page.goto('http://localhost:4173' + path);
      assert(response.status() === 200, 'Direct editorial URL unavailable');
      await page.evaluate(() => document.fonts.ready);
      assert(await page.locator('h1').count() === 1, 'Wrong editorial H1 count');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Editorial horizontal overflow');
      await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' });
      const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => v.id));
      assert(violations.length === 0, `Editorial accessibility: ${path}: ${violations}`);
    }
  }
  await page.goto('http://localhost:4173/blog/local-qa-blog/');
  assert(await page.locator('.prose h2').textContent() === 'Local verification content', 'Published article body mismatch');
  assert(await page.locator('.prose a').getAttribute('href') === '/calculators/fd/', 'Internal link mismatch');
  assert(await page.locator('meta[property="og:type"]').getAttribute('content') === 'article', 'Article Open Graph mismatch');
  assert(await page.evaluate(() => JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'].some(item => item['@type'] === 'BlogPosting')), 'Blog structured data missing');
  await page.goto('http://localhost:4173/media/local-qa-media/');
  assert(await page.locator('.article-source a').getAttribute('href') === 'https://www.sebi.gov.in/', 'Original source missing');
  await page.goto('http://localhost:4173/mutual-funds/');
  await page.getByText('Local QA FAQ?', { exact: true }).click();
  assert(await page.getByText('A disposable answer for browser verification.', { exact: true }).isVisible(), 'Edited FAQ not rendered');
  await page.goto('http://localhost:4173/terms/');
  assert(await page.locator('.prose h2').textContent() === 'Local QA legal page', 'Legal content not rendered');
  await page.goto('http://localhost:4173/');
  assert((await page.locator('h1').textContent()).includes('Local QA homepage.'), 'Homepage edit not rendered');
  const trigger = page.getByRole('button', { name: /Watch the introduction/ });
  await trigger.click();
  assert(await page.getByRole('dialog').isVisible(), 'Intro dialog did not open');
  assert(await page.getByRole('button', { name: 'Close introduction' }).evaluate(el => el === document.activeElement), 'Dialog initial focus missing');
  const video = page.locator('.intro-dialog video');
  assert(await video.getAttribute('controls') !== null && await video.getAttribute('autoplay') === null, 'Video controls or autoplay mismatch');
  assert(await page.locator('.intro-dialog track').getAttribute('src') === '/video/local-qa.vtt', 'Captions missing');
  for (let index = 0; index < 8; index++) { await page.keyboard.press('Tab'); assert(await page.getByRole('dialog').evaluate(el => el.contains(document.activeElement)), 'Focus escaped modal'); }
  await page.keyboard.press('Escape');
  assert(!(await page.getByRole('dialog').isVisible()), 'Escape did not close dialog');
  assert(await trigger.evaluate(el => el === document.activeElement), 'Dialog focus did not return');
  await trigger.click();
  await page.getByRole('button', { name: 'Close introduction' }).click();
  assert(await video.evaluate(el => el.paused), 'Closed dialog did not pause video');
  await page.setViewportSize({ width: 390, height: 844 });
  await trigger.click();
  await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' });
  const dialogViolations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => v.id));
  assert(dialogViolations.length === 0, `Dialog accessibility: ${dialogViolations}`);
  await page.keyboard.press('Escape');
  assert(errors.length === 0, `Editorial console errors: ${errors.join('\n')}`);
  return { layouts: 15, editorialAccessibility: 15, publishedFields: ['blog', 'newsroom', 'homepage', 'FAQ', 'legal'], dialog: 'controls, captions, focus trap, Escape, close and focus return', errors };
}
