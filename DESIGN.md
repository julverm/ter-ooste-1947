---
name: Kasteel Ter Ooste
description: An archival mystery game with a separately scoped dinner invitation.
colors:
  game-paper: "#efe3c3"
  game-paper-dark: "#e2d2a6"
  game-paper-light: "#f6edd6"
  game-ink: "#2b2318"
  game-soft-ink: "#5a4a33"
  game-lacquer: "#8b1a1a"
  game-dark-lacquer: "#5e0f0f"
  game-copper: "#a67c2e"
  game-stamp: "#9b2a1f"
  game-focus: "#1f4e79"
  invitation-wine: "#360f19"
  invitation-gold: "#d4b77b"
  invitation-paper: "#f0d5aa"
  invitation-ink: "#3a2518"
  invitation-red: "#651e1c"
typography:
  game-body:
    fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, "Times New Roman", serif'
    fontSize: "1.0625rem"
    lineHeight: 1.55
  game-label:
    fontFamily: '"Courier Prime", "Courier New", "Nimbus Mono PS", Courier, monospace'
  invitation-body:
    fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "1rem"
    lineHeight: 1.5
  invitation-display:
    fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.15
rounded:
  square: "0"
spacing:
  invitation-inset: "1.25rem"
  invitation-paper-padding: "2rem 2.5rem 2.25rem"
components:
  invitation-reveal:
    backgroundColor: "transparent"
    textColor: "{colors.invitation-gold}"
    typography: "{typography.invitation-body}"
    rounded: "{rounded.square}"
    padding: "0.5rem"
    height: "60px"
---

# Design System: Kasteel Ter Ooste

## Overview

**Creative North Star: "The archival gamebook and its sealed invitation"**

The incumbent game identity is a readable, period-inflected paper archive: warm document surfaces, dark ink, typewriter labels, and restrained lacquer and copper accents. The menu invitation is a separate, explicitly scoped extension: wine-colored bookcloth, antique-gold details, textured paper, castle engraving, and an opening folio. Its typography and composition belong to `menu/`; they are not defaults for game pages.

The static site uses local assets and relative paths, including when opened through `file://`. Preserve the supplied menu wording and original artwork; raster calligraphy is paired with accessible HTML copy.

**Key Characteristics:**
- Warm archival paper and ink for the game.
- A distinct, sealed-paper invitation extension.
- Readable text, native controls, and local-first implementation.

## Colors

The game palette centers on aged paper, dark brown ink, lacquer red, and copper; the invitation uses its own wine, gold, paper, ink, and red tokens.

### Primary
- **Lacquer Red** (`#8b1a1a`): Game accent, with darker lacquer for depth.
- **Invitation Wine** (`#360f19`): Invitation backdrop and bookcloth.
- **Invitation Gold** (`#d4b77b`): Invitation text and accents against wine.

### Secondary
- **Game Copper** (`#a67c2e`): Aged-metal game accent.
- **Invitation Red** (`#651e1c`): Menu headings and decorative details on paper.

### Neutral
- **Game Paper** (`#efe3c3`), **Dark Paper** (`#e2d2a6`), **Light Paper** (`#f6edd6`): Game document surfaces.
- **Game Ink** (`#2b2318`) and **Soft Ink** (`#5a4a33`): Game text.
- **Invitation Paper** (`#f0d5aa`) and **Invitation Ink** (`#3a2518`): Menu folio surface and text.
- **Game Focus Blue** (`#1f4e79`): Focus token in the game stylesheet.

### Named Rules
**The Separate Invitation Palette Rule.** Keep `menu/menu.css` colors scoped to the invitation; do not apply them to game pages.

## Typography

**Game Body Font:** `"Palatino Linotype", Palatino, "Book Antiqua", Georgia, "Times New Roman", serif`  
**Game Label Font:** `"Courier Prime", "Courier New", "Nimbus Mono PS", Courier, monospace`  
**Invitation Font:** `"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif`

**Character:** The game pairs a book-like reading face with a typewriter label stack. The invitation uses the book face throughout; its original raster calligraphy remains decorative and is accompanied by screen-reader-accessible HTML text.

### Hierarchy
- **Game body** (17px, line-height 1.55): Main reading text.
- **Game labels** (typewriter stack): Labels where the existing game styles use them; no unobserved size is prescribed.
- **Invitation display** (400, `clamp(2rem, 5vw, 3.5rem)`, line-height 1.15): Invitation title.
- **Invitation body** (16px, line-height 1.5): Menu copy and supporting text.

### Named Rules
**The Accessible Calligraphy Rule.** Keep meaningful calligraphy paired with equivalent accessible HTML text; do not make a raster image the only source of copy.

## Layout

The game stylesheet defines a `56rem` maximum-width token. Do not copy the invitation's composition into game layouts. In `menu/`, the outer area is capped at `64rem` and the folio at `43rem`; narrow screens reflow the menu as one paper column. At `480px` and below, the invitation reduces side padding and paper insets and removes desktop-only line breaks. Body text remains readable and can reflow without relying on fixed-width page content.

Keep assets and links relative so the static pages continue to work under a hosted subpath and when opened with `file://`.

## Elevation & Depth

The invitation uses structural shadows to lift the closed cover and paper from the cloth backdrop. Its paper texture and engraved artwork add material depth; the game tokens establish paper and ink colors without prescribing the invitation's shadow treatment.

### Shadow Vocabulary
- **Closed invitation cover** (`0 16px 28px #16060c80`): Cover doors at rest.
- **Menu folio** (`8px 22px 45px #16060c80`): Paper above the invitation backdrop.

## Shapes

Paper and folio surfaces are rectangular with fine, double-line borders; no rounded-corner scale is established beyond square invitation controls. The invitation is a two-door hinged cover, not a game-page container pattern.

## Components

### Invitation folio (invitation only)
- **Shape:** A paper rectangle with a double border, inside a `43rem`-maximum folio.
- **Surface:** Textured warm paper, dark brown text, and engraved local artwork.
- **Motion:** The two cover doors hinge open over `1.6s` using `cubic-bezier(.16, 1, .3, 1)`; the paper unfolds over `1.65s`. `prefers-reduced-motion: reduce` disables animation and transitions.

### Buttons and focus
- Use native HTML buttons for actions and preserve their keyboard behavior.
- Clicking or tapping anywhere on the closed invitation opens it; the native reveal button remains the keyboard action. Closing must not immediately reopen it.
- Keep the invitation's visible `:focus-visible` outline (`2px solid #ffe0a4`, offset `6px`) and equivalent visible focus for links.
- The invitation reveal button has a minimum height of `60px`; secondary menu controls have at least `44px`.

## Do's and Don'ts

### Do:
- **Do** retain the game palette, body face, and typewriter label stack on game pages.
- **Do** keep invitation-only typography, folio geometry, textures, and wine-and-gold colors within `menu/`.
- **Do** preserve the confirmed menu date, **21 November 1947**, and the guest name **Michèle**.
- **Do** keep original local raster artwork and provide accessible HTML copy for calligraphy.
- **Do** preserve relative asset paths, native button semantics, visible focus, and reduced-motion behavior.

### Don't:
- **Don't** impose invitation typography, layout, palette, or folio animation on game pages.
- **Don't** replace the supplied historical menu copy or rebrand the site.
- **Don't** make remote assets, a build step, or a framework a requirement for these static pages.
