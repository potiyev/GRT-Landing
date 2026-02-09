# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static landing page for the **Lights Out: Reaction Timer** iOS app (App Store ID: `id6748250349`). Deployed via GitHub Pages to `gridreactiontimer.com`. No build tools, no npm, no frameworks — pure HTML/CSS/JavaScript.

## Development & Deployment

- **No build step.** Edit HTML/CSS/JS files directly.
- **Deploy:** Push to `main` branch — GitHub Pages auto-deploys.
- **Custom domain:** Configured via `CNAME` file (`gridreactiontimer.com`).
- **Local dev:** Open `index.html` in a browser. No dev server required.

## Architecture

**Two-page static site:**
- `index.html` — Landing page with hero, feature card grid sections (game modes, themes, compete/track), and screenshot gallery
- `privacy.html` — Privacy policy with navigation

**Core files:**
- `styles.css` — All styling. Mobile-first responsive design with breakpoints at 1024px, 768px, 480px, 350px. Uses 'Cereal' font from Google Fonts. Color palette: primary blue `#0070f3`, text `#222222`. Key layout classes: `.feature-grid` (CSS grid for feature cards), `.feature-card` (card with icon/title/description).
- `translations.js` — Translation data object with keys for 6 languages: `en`, `es`, `ja`, `de`, `fr`, `pt`
- `language-switcher.js` — `LanguageSwitcher` class handling i18n. Persists language choice to `localStorage` (key: `gridreactiontimer-language`). Translates DOM elements via `data-translate`, `data-translate-html`, and `data-translate-alt` attributes.

**Assets:**
- `assets/images_for_website/{Language}/Screen {1-6}.png` — Localized screenshots (folders: English, Spanish, Japanese, German, French, Portuguese)
- `assets/app-store-badge.svg` — App Store download badge

## Internationalization (i18n) Pattern

To add/update translations:
1. Add key-value pairs to the appropriate language object in `translations.js`
2. Use `data-translate="key"` on HTML elements for text content
3. Use `data-translate-html="key"` for HTML content, `data-translate-alt="key"` for image alt text
4. Screenshots auto-switch via `languageFolderMap` in `language-switcher.js` (maps language codes to folder names)

## Ad Configuration

`app-ads.txt` contains Google AdMob publisher verification (pub-1736394740910067).
