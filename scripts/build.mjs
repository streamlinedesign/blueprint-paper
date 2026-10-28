// Builds dist/ from src/: one full stylesheet, one minified, plus per-component files.
// Also copies the full stylesheet into docs/ so the docs site always shows the current build.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'lightningcss';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const dist = join(root, 'dist');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const banner = `/*! Blueprint Paper v${pkg.version} · ${pkg.homepage} · MIT */\n`;

// Inline the @imports of src/index.css, keeping each file inside its layer.
const entry = readFileSync(join(src, 'index.css'), 'utf8');
let full = banner;
for (const line of entry.split('\n')) {
  const m = line.match(/^@import url\("(.+?)"\) layer\((.+?)\);/);
  if (m) {
    full += `@layer ${m[2]} {\n${readFileSync(join(src, m[1]), 'utf8')}}\n`;
  } else if (line.startsWith('@layer ')) {
    full += line + '\n';
  }
}

mkdirSync(dist, { recursive: true });
mkdirSync(join(dist, 'components'), { recursive: true });
writeFileSync(join(dist, 'blueprint-paper.css'), full);

const minify = (code, filename) =>
  transform({ filename, code: Buffer.from(code), minify: true, targets: { safari: 15 << 16, chrome: 105 << 16, firefox: 110 << 16 } }).code;
writeFileSync(join(dist, 'blueprint-paper.min.css'), banner + minify(full, 'blueprint-paper.css'));

// Per-file builds for people who only want tokens + one component.
copyFileSync(join(src, 'tokens.css'), join(dist, 'tokens.css'));
copyFileSync(join(src, 'base.css'), join(dist, 'base.css'));
for (const f of readdirSync(join(src, 'components'))) copyFileSync(join(src, 'components', f), join(dist, 'components', f));
mkdirSync(join(dist, 'themes'), { recursive: true });
for (const f of readdirSync(join(src, 'themes'))) copyFileSync(join(src, 'themes', f), join(dist, 'themes', f));

copyFileSync(join(dist, 'blueprint-paper.css'), join(root, 'docs', 'blueprint-paper.css'));

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1) + ' kB';
console.log(`built dist/blueprint-paper.css (${kb(full)}), .min.css (${kb(readFileSync(join(dist, 'blueprint-paper.min.css'), 'utf8'))})`);
