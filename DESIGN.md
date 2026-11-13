---
name: Kasteel Ter Ooste
description: A sealed invitation and parchment investigation desk in one material world.
colors:
  wine: "#360f19"
  gold: "#d4b77b"
  paper: "#f0d5aa"
  paper-dark: "#e6c698"
  paper-light: "#f7e4c4"
  ink: "#3a2518"
  soft-ink: "#65452f"
  lacquer: "#651e1c"
  lacquer-hover: "#7a2b2d"
  copper: "#9b7339"
  paper-rule: "#99643d"
  frame: "#793b26"
  frame-light: "#b78d57"
  cream: "#fff8e3"
  button-text: "#fff2d7"
  light-focus: "#ffe0a4"
  success: "#315528"
typography:
  body:
    fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "1.0625rem"
    lineHeight: 1.65
  heading:
    fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "2.8rem"
    fontWeight: 400
    lineHeight: 1.15
  mobile-heading:
    fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "2.05rem"
    fontWeight: 400
    lineHeight: 1.15
  section-heading:
    fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "1.65rem"
    fontWeight: 400
    lineHeight: 1.2
  control:
    fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.3
  archival-code:
    fontFamily: '"Courier New", Courier, monospace'
    fontSize: "0.9rem"
  caption:
    fontSize: "0.75rem"
  metadata:
    fontSize: "0.85rem"
  secondary-label:
    fontSize: "0.95rem"
  small-heading:
    fontSize: "1.1rem"
  card-title:
    fontSize: "1.15rem"
  mobile-subheading:
    fontSize: "1.2rem"
  subheading:
    fontSize: "1.25rem"
  document-title:
    fontSize: "1.35rem"
  mobile-section:
    fontSize: "1.45rem"
  code-digit:
    fontSize: "1.75rem"
  vault-digit:
    fontSize: "2rem"
rounded:
  control: "2px"
spacing:
  page: "2.5rem 3rem 3.5rem"
  mobile-page: "1.75rem 1.5rem 2.5rem"
components:
  primary-action:
    backgroundColor: "{colors.lacquer}"
    textColor: "{colors.button-text}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0.7rem 1rem"
  invitation-reveal:
    backgroundColor: "transparent"
    textColor: "{colors.gold}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0.5rem"
---

# Design system: Kasteel Ter Ooste

## Overview

The user-approved invitation is the visual authority for the whole website:
bordeaux cloth, antique gold, warm parchment, engraved castle and wax seal.
The game translates those same materials into an investigation desk, not a
second typewriter-styled product. `assets/experience.css` is the shared game
theme layered over the existing functional styles. `menu/menu.css` retains
the invitation's separate presentation and reveal behavior.

## Colors

Wine owns the outer page and navigation. Gold belongs on wine; dark ink and
lacquer belong on paper. Lacquer marks actions and selection. Native focus
is lacquer on paper and light gold on wine. Success is green, with text
explaining the state rather than color alone.

## Typography

Use the Palatino/Georgia reading stack for headings, prose and controls.
Normal-weight serif headings replace all-caps typewriter titles. Keep
monospace for literal cipher text, archival codes and block-letter evidence.
Body copy remains live HTML, measured around 70 characters. The invitation
may use original raster calligraphy paired with equivalent accessible copy;
game controls must remain ordinary readable text.

## Layout

A bordered parchment sheet sits on bordeaux cloth with gold navigation.
The castle introduces each page. Titles and task controls follow it; act
identifiers sit below the title. A clear first-dossier action and rules link
lead the start page.

Ordinary game pages are capped at 64rem; the archiving puzzle uses up to
88rem to fit six cards. At 760px the page insets, navigation and document
groups adapt to a single reading column. The P1 card row is the deliberate
exception: all six positions stay horizontally ordered, with contained
scrolling on smaller screens and a six-position overview. At 1280px the
six cards share the available width.

Vigenere words stay aligned in separately scrollable lines; table overflow
stays within each table region. Text zoom must not create page-wide overflow.

## Elevation & Depth

The page shadow is `8px 22px 45px #16060c80`. Actual paper texture, castle
engraving and wax artwork provide material detail. Document sections mostly
use rules rather than stacks of generic cards; individual files and sealed
envelopes can carry double borders and offset shadows.

## Shapes

Fine rules, rectangular sheets and double-line borders define the grammar.
Controls have a restrained 2px radius. The archive row has six actual positions;
never reflow it into an ambiguous top-to-bottom list.

## Components

Use native buttons, form inputs, selects, tabs and audio controls. Primary
controls are at least 48px high; secondary touch actions are at least 44px.
Use explicit wrong-code feedback without revealing an answer.

Act gates preserve the existing codes and saved progress. Introductory
narrative is an openable details element, and the dossier wayfinder lists
only currently visible sections. Focus moves to newly unlocked material.
Tabs retain keyboard navigation; Show all makes every panel accessible.

Archive handles support pointer/touch drag and Left/Right keyboard movement.
The paired movement buttons name the actual horizontal direction. Edge
scrolling assists dragging; cancellation restores the previous order.
The overview reflects the player's arrangement, not a solved arrangement.

The invitation opens through any click on its closed screen or its native
button. Its doors hinge over 1.6s and its paper unfolds over 1.65s. Game
feedback is shorter; there is no theatrical page-load delay. Reduced motion
disables nonessential movement. No autoplay sound.

## Do's and Don'ts

- Keep the invitation and game visually coherent but behaviorally separate.
- Preserve the game's 15 November 1947 canon and the menu's confirmed 21 November 1947 date.
- Preserve all evidence, puzzle answers, saved-progress keys and existing URLs.
- Keep images and paths local and relative for Pages subpaths and file://.
- Do not use the invitation's whole-screen click gesture on game pages.
- Do not reveal solutions through navigation, summaries or automatic ordering.
- Do not trade readable text or native affordances for ornament.
