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
npm install @blueprint-paper/css
```

```js
import '@blueprint-paper/css';                       // everything
import '@blueprint-paper/css/tokens';                // or tokens + only what you need
import '@blueprint-paper/css/components/switch.css';
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

Tokens, typography, switch, button, field (input, textarea, select), checkbox, radio, card, list, table, badge, tabs, accordion, alert, tooltip, dialog.

## Themes

Blueprint (navy paper) is the default. For whiteprint (pale paper, navy ink), put `data-theme="whiteprint"` on `<html>`, or `bp-whiteprint` on any `.bp-sheet`.

## Develop

```sh
npm install
npm run build     # src/ -> dist/ and docs/blueprint-paper.css
npm run dev       # serve docs/ on http://localhost:4321
```

Source lives in `src/`: `tokens.css`, `base.css`, and one file per component in `src/components/`. The build inlines them into one stylesheet inside cascade layers (`bp.tokens`, `bp.base`, `bp.components`), so your own CSS always wins without `!important`. Commit `dist/` with your change; CI checks it is up to date.

## License

MIT
