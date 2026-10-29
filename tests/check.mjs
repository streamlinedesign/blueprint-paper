// Checks every docs page in both themes at desktop and phone width:
//   - no horizontal overflow
//   - no console errors
//   - no serious or critical axe-core accessibility violations
// Run: npm test   (needs Chromium: npx playwright install chromium)
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const axeSource = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const pages = ['docs/index.html', 'docs/demo.html', 'docs/lab.html'];
const widths = [1100, 390];
const themes = ['blueprint', 'whiteprint'];
let failures = 0;

const browser = await chromium.launch(process.env.BP_CHROME ? { executablePath: process.env.BP_CHROME } : {});
for (const page of pages) for (const width of widths) for (const theme of themes) {
  const label = `${page} @${width} ${theme}`;
  const p = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await p.goto(pathToFileURL(join(root, page)).href);
  if (theme === 'whiteprint') await p.evaluate(() => document.documentElement.setAttribute('data-theme', 'whiteprint'));
  await p.waitForTimeout(200);

  const scrollW = await p.evaluate(() => document.documentElement.scrollWidth);
  if (scrollW > width) { failures++; console.log(`FAIL ${label}: page scrolls horizontally (${scrollW}px > ${width}px)`); }
  // font loads from Google Fonts fail offline; that is not a page error
  const real = errors.filter((e) => !/fonts\.g|net::ERR|Failed to load resource/.test(e));
  if (real.length) { failures++; console.log(`FAIL ${label}: console errors\n  ${real.join('\n  ')}`); }

  await p.addScriptTag({ content: axeSource });
  const result = await p.evaluate(async () => await window.axe.run(document, { resultTypes: ['violations'] }));
  const bad = result.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  for (const v of bad) {
    failures++;
    console.log(`FAIL ${label}: ${v.id} (${v.impact}) ${v.help}`);
    for (const n of v.nodes.slice(0, 3)) console.log(`  ${n.target.join(' ')}`);
  }
  const minor = result.violations.length - bad.length;
  console.log(`${bad.length ? 'FAIL' : 'ok  '} ${label}${minor ? ` (${minor} minor axe note${minor > 1 ? 's' : ''})` : ''}`);
  await p.close();
}
await browser.close();
if (failures) { console.log(`\n${failures} failure(s)`); process.exit(1); }
console.log('\nall checks passed');
