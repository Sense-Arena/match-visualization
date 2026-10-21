import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../storybook-static/', import.meta.url));
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.json': 'application/json',
};
const server = createServer(async (request, response) => {
  const path = resolve(root, `.${new URL(request.url, 'http://localhost').pathname}`);
  if (!path.startsWith(root.endsWith(sep) ? root : root + sep)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(path);
    response.writeHead(200, { 'Content-Type': mime[extname(path)] ?? 'application/octet-stream' }).end(body);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
let activePage;
try {
  browser = await chromium.launch({ headless: true });
  const origin = `http://127.0.0.1:${server.address().port}`;
  for (const [story, activeImage, configStep, totalSteps] of [
    ['base', 'tennis player', 4, 9],
    ['serve', 'tennis player', 1, 10],
    ['return', 'tennis AI', 1, 13],
  ]) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 1100 } });
    activePage = page;
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
      console.error(error.message);
    });
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('response', response => {
      if (response.url().startsWith(origin) && response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(`${origin}/iframe.html?id=mv-tennis-court--${story}&viewMode=story`);
    await page.getByAltText('tennis court surface', { exact: true }).waitFor();
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
    await page.getByRole('button', { name: 'Court hint', exact: true }).click();
    await page.getByRole('tooltip').waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await page.getByRole('tooltip').waitFor({ state: 'hidden' });
    await page.waitForFunction(alt => parseFloat(document.querySelector(`img[alt="${alt}"]`).style.left) > 0, activeImage);
    const image = page.getByAltText(activeImage, { exact: true });
    const before = await image.evaluate(element => parseFloat(element.style.left));
    const box = await image.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 35, box.y + box.height / 2, { steps: 6 });
    await page.mouse.up();
    await page.waitForFunction(
      ({ alt, before }) => parseFloat(document.querySelector(`img[alt="${alt}"]`).style.left) > before + 20,
      { alt: activeImage, before },
    );
    // dnd-kit's pointer sensor suppresses clicks for 50 ms after dropping an item.
    await page.waitForTimeout(75);

    async function navigate(name) {
      const before = await page.locator('[data-court-step]').getAttribute('data-court-step');
      await page.getByRole('button', { name, exact: true }).click();
      await page.waitForFunction(
        before => document.querySelector('[data-court-step]')?.getAttribute('data-court-step') !== before,
        before,
      );
    }
    for (let step = 0; step < configStep; step++) await navigate('next');
    await page.getByRole('tooltip').waitFor({ state: 'visible' });
    assert(await page.getByRole('tooltip').innerText(), 'Configuration form is empty');
    await navigate('back');
    await page.getByRole('tooltip').waitFor({ state: 'hidden' });
    for (let step = configStep - 1; step < totalSteps - 1; step++) {
      await navigate('next');
    }
    const save = page.getByRole('button', { name: 'save', exact: true });
    assert(await save.isEnabled(), 'Save did not enable after all steps');
    await save.click();
    assert.deepEqual(errors, [], `${story} browser errors`);
    await page.close();
    console.log(`${story}: assets, drag and drop, configuration tooltip, back/next and save passed`);
  }
} catch (error) {
  if (activePage && !activePage.isClosed()) {
    console.error(await activePage.locator('body').innerText());
    console.error('Step:', await activePage.locator('[data-court-step]').getAttribute('data-court-step'));
  }
  throw error;
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
