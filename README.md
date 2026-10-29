# Blueprint Paper

A blueprint-themed, CSS-first UI kit. Navy paper, pale ink, one monospace face, and controls whose state you can read from the line work: hollow is off, filled is on. No JavaScript required for any component.

Docs and live examples: https://streamlinedesign.github.io/blueprint-paper/

## Use it

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/streamlinedesign/blueprint-paper@main/dist/blueprint-paper.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&display=swap">
<body class="bp-sheet">
```

Or from npm:

```sh
npm install blueprint-paper
```

```js
import 'blueprint-paper';                 // everything
import 'blueprint-paper/tokens';          // or tokens + only what you need
import 'blueprint-paper/components/switch.css';
```

## The switch

```html
<label class="bp-switch">
  <input type="checkbox" role="switch">
  <span class="bp-switch__track"></span>
</label>
```

Add `bp-switch--vertical` for a vertical switch where up is on.

## Components

Tokens, typography, switch, button, field (input, textarea, select), checkbox, radio, card, list, table, badge, tabs, accordion, alert, tooltip, dialog, menu, drawer, toast, measure (dimension lines), code (line numbers, copy), progress, skeleton, pagination, breadcrumb, kbd.

## Optional script

The CSS needs no JavaScript. `dist/blueprint-paper.js` (3 kB) adds auto-measured dimension lines (`data-measure="w h" data-unit="mm"`), code blocks with line numbers and a Copy button (`<pre data-code>`), menu light-dismiss, `bp.toast()` and `bp.theme()`.

```html
<script src="https://cdn.jsdelivr.net/gh/streamlinedesign/blueprint-paper@main/dist/blueprint-paper.js" defer></script>
```

## Credits

The toast stack is inspired by the shadcn/ui toast ([Sonner](https://sonner.emilkowal.ski/), by Emil Kowalski), whose motion principles also shaped the switch.

## Themes

Blueprint (navy paper) is the default. For whiteprint (pale paper, navy ink), put `data-theme="whiteprint"` on `<html>`, or `bp-whiteprint` on any `.bp-sheet`.

## Develop

```sh
npm install
npm run build     # src/ -> dist/ and docs/blueprint-paper.css
npm run lint      # class naming and CSS hygiene (stylelint)
npm run dev       # serve docs/ on http://localhost:4321
npm test          # overflow, console and accessibility checks (needs: npx playwright install chromium)
```

Source lives in `src/`: `tokens.css`, `base.css`, and one file per component in `src/components/`. The build inlines them into one stylesheet inside cascade layers (`bp.tokens`, `bp.base`, `bp.components`), so your own CSS always wins without `!important`. Commit `dist/` with your change; CI checks it is up to date.

## License

MIT
