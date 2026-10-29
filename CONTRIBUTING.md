# Contributing to Blueprint Paper

This file is the rulebook. If a change follows it, it belongs; if it needs an exception, say so in the pull request.

## How the kit is built

- `src/tokens.css` holds every value a theme may change: colors, type scale, spacing, strokes, motion. Components never hard-code a color.
- `src/base.css` styles the paper (`.bp-sheet`), typography, rules and layout helpers.
- `src/components/*.css` is one file per component. Each file starts with a comment that shows the markup it expects.
- `src/themes/*.css` only override tokens.
- `src/index.css` imports everything into cascade layers: `bp.tokens`, `bp.base`, `bp.components`, `bp.themes`. `scripts/build.mjs` inlines those imports into `dist/blueprint-paper.css` and minifies it. `dist/` is committed so the CDN link works from any commit.
- `src/js/blueprint-paper.js` is optional and must stay so: every component works with CSS alone. The script only adds what CSS cannot do (clipboard, timers, measuring).

## Rules

**Naming.** Classes are `bp-block`, `bp-block__element`, `bp-block--modifier`; transient states are `is-state`. `npm run lint` enforces this.

**Native first.** Reach for `<details>`, `<dialog>`, `<input type="checkbox">`, `role="switch"` before inventing a widget. Keyboard and screen-reader behaviour come free that way.

**State in the line work.** Hollow means off, filled means on. Solid lines are the default; dashed lines and corner marks are rare and mean something (a note, a draft, a drop zone).

**Motion.** Under 300ms, eased out with `--bp-ease`, never on a keyboard action, and off entirely under `prefers-reduced-motion`. A transition explains a state change; it never decorates one.

**Tokens, not numbers.** Spacing from `--bp-1..8`, strokes from `--bp-line` and `--bp-line-bold`, colors from the ink and ground tokens. A new number in a component file needs a comment saying why.

**Accessibility.** `npm test` renders the docs and demo in two themes at two widths and fails on serious axe-core violations, console errors, or horizontal overflow. Keep it green.

## Adding a component

1. Create `src/components/name.css` with the markup comment at the top.
2. Add its `@import` line to `src/index.css` in the `bp.components` layer.
3. Add a section to `docs/index.html` (an example, the markup, the variants) and a link in the side nav. Give the section `data-keywords` so search finds it.
4. If it needs script, add a `bp.name()` function to `src/js/blueprint-paper.js` and keep the CSS-only fallback working.
5. `npm run build && npm run lint && npm test`, then add a line under `## [Unreleased]` in `CHANGELOG.md`.

## Releasing

Versions follow semver. The version sits at 0.9.x until 1.0: changes go under `## [Unreleased]` in the changelog, patch releases are fine, and 1.0 is the moment names freeze. To release:

```sh
npm version minor      # or patch / major: bumps package.json, commits, tags vX.Y.Z
git push --follow-tags
```

The Release workflow checks the tag against `package.json`, builds, lints, tests, publishes to npm with provenance, and creates a GitHub release with the changelog section for that version attached. It needs an `NPM_TOKEN` repository secret.
