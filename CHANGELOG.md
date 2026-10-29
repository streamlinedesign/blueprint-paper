# Changelog

All notable changes to this project are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/). Until 1.0, minor versions may rename things.

## [0.5.0] - 2026-10-29

### Added
- Measure: dimension lines with end ticks and a label, horizontal and vertical, standalone or placed around an element. Units px (default), mm, cm, in; `data-scale="1:50"`.
- Optional script `blueprint-paper.js` (3 kB): auto-measured dimension lines, menu light-dismiss, `bp.toast()`, `bp.theme()`, `bp.format()`.
- Docs: Measure and Optional script sections; the docs page now runs on the kit script.

## [0.4.0] - 2026-10-28

### Added
- `npm test`: renders the docs and demo in Chromium at 1100px and 390px in both themes, and fails on horizontal overflow, console errors, or serious axe-core accessibility violations. Runs in CI.

### Fixed
- Scrollable table wrappers and code blocks are keyboard-focusable (`tabindex="0"`), which the new check caught.

## [0.3.0] - 2026-10-28

### Added
- Dropdown menu and popover on native `<details>`: items, headings, rules, shortcuts, `--right` and `--up` alignment.
- Drawer on native `<dialog>`: right (default), left and bottom, with a 220ms slide.
- Toast: region plus toast styles, solid variant, enter and leave animations; showing is five lines of your own script.
- Docs sections for each, with a working toast button.

## [0.2.0] - 2026-10-28

### Added
- Tabs: styling for scripted tabs, and a CSS-only `.bp-tabset` on radio inputs.
- Accordion on native `<details>`.
- Alert, drawn as a revision note: default, solid, dim, row.
- Tooltip, pure CSS, four positions.
- Dialog on native `<dialog>` with a gridded backdrop and a 180ms enter.
- Whiteprint theme (pale paper, navy ink) via `data-theme="whiteprint"` or `.bp-whiteprint`.
- Docs: theme switch in the header, sections for every new component.

### Changed
- Card title block is now a flex row, so the first cell fills the width.
- Select arrow is a token (`--bp-select-arrow`) so themes can recolor it.

## [0.1.0] - 2026-10-28

### Added
- Tokens: paper and ink colors, type scale, spacing, strokes, motion.
- Base: `.bp-sheet` paper with grid, typography, rules, corner marks, layout helpers.
- Switch: horizontal and vertical (up is on), thumb widths, light track, large size, labelled field. Thumb stretches on press, keyboard flips instantly, reduced motion respected.
- Button: outline, solid, ghost, sizes, block, icon, group.
- Field: label, input, textarea, select, hint, invalid, input group with unit.
- Checkbox and radio.
- Card with title-block header, list rows.
- Table as a parts list.
- Badge and stamp.
- Docs site with search, and a demo page.
