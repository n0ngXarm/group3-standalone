---
name: group3-theme-accessibility
description: >-
  Guide for managing CSS theme tokens, Light/Dark mode transitions, Chinese typography hierarchy, mobile safe-area insets, and accessibility standards in Group 3 Standalone. Use when creating or styling UI components, tweaking color tokens, or fixing responsive contrast/touch issues.
---

# Group 3 Design Tokens, Theming & Accessibility

Guide for styling components, managing theme state, and adhering to typography and accessibility standards in Group 3 Standalone.

---

## Token Architecture (`tokens-shell.css`)

All color palettes and component styles are governed by [`tokens-shell.css`](file:///home/nong_ing/group3-standalone/source/src/surfaces/group-3-8104/styles/tokens-shell.css) using a **60 / 30 / 10** design system:
- **60% Base**: Canvas and background layers (`--color-bg-primary`, `--color-bg-secondary`).
- **30% Surfaces**: Cards, modals, docks, and dialogue containers (`--color-surface-primary`, `--color-surface-elevated`).
- **10% Accents**: Interactive triggers, badges, and focal cues (`--color-accent`, `--color-accent-jade`, `--color-accent-gold`).

### Core Color Tokens

| Token Name | Light Theme | Dark Theme | Purpose |
| :--- | :--- | :--- | :--- |
| `--color-bg-primary` (`--g3-bg`) | `#f8f5ee` (Warm parchment) | `#11161b` (Deep slate) | Main page background |
| `--color-surface-primary` (`--g3-paper`) | `#ffffff` | `#1c242d` | Cards, popups, docks |
| `--color-accent` (`--g3-red`) | `#cf3a27` | `#e2533e` | Primary CTA, active tone |
| `--color-accent-jade` (`--g3-jade`) | `#1b7577` | `#4eb8ba` | Secondary accent, grammar tag |
| `--color-accent-gold` (`--g3-gold`) | `#b27216` | `#e5b45b` | Highlights, stars, review mode |
| `--color-text-primary` (`--g3-ink`) | `#241c14` | `#f7efe2` | Main Hanzi and headlines |
| `--color-text-muted` (`--g3-muted`) | `#6e6254` | `#a3998b` | Editorial aids, timestamps |

> **Rule**: Do not use hardcoded hex colors or arbitrary utility colors (e.g. `bg-purple-600`) in new components. Always use semantic CSS variables or theme classes.

---

## Theming Policy & Startup Contract

Group 3 enforces a synchronous light-start policy:
1. **Initial Render**: Fresh visitors start in `light` mode synchronously to prevent theme flickering.
2. **Storage Synchronization**: User preferences in `localStorage` are safely loaded, with automatic fallbacks for blocked storage / incognito mode.
3. **Cross-Tab Sync**: Storage event listeners update the theme seamlessly across multiple open tabs.

---

## Typography Standards for Chinese Learning

1. **Hanzi Display**:
   - Must use clean sans-serif/system fonts with ample line-height and letter-spacing (`tracking-normal` to `tracking-wide`).
   - Font sizes must prioritize readability (minimum `1.25rem` for dialogue text).
2. **Pinyin & Tone Marks**:
   - Positioned clearly above or beside Hanzi with tone marks clearly legible.
   - Prevent overlapping between tone marks and uppercase letters.
3. **Thai Editorial Aid**:
   - Styled with secondary/muted text colors (`--color-text-secondary` or `--color-text-muted`) to clarify that it serves as editorial guidance rather than a primary verbatim script.

---

## Mobile Safe-Areas & Touch Standards

- **Safe-Area Insets**:
  ```css
  padding-top: max(1rem, env(safe-area-inset-top));
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
  ```
- **Minimum Touch Targets**: All interactive elements (buttons, close icons, tabs, card selectors) must satisfy:
  - Height `>= 44px`
  - Touch padding `>= 8px`

---

## Verification Tests

Run the following test suites after any CSS or theme modifications:

```bash
cd /home/nong_ing/group3-standalone/source

# Verify theme contracts, storage fallback, and synchronous init
npm test tests/unit/theme-policy.test.js

# Verify mobile viewport CSS, touch target contracts, and safe-area insets
npm test tests/unit/mobile_group3_empirical.test.js
```
