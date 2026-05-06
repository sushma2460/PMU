# PMU App — Color Palette & Design Guide

**Version:** 1.0  
**Date:** 2026-05-06  
**Prepared for:** Designer  
**Source:** `src/app/globals.css`

---

## 1. Brand Colors

These are the core brand colors used throughout the application.

| Color Name          | Hex Code  | Preview         | Usage                              |
|---------------------|-----------|-----------------|------------------------------------|
| Brand Black         | `#1A1A1A` | ■ Near Black    | Primary text, headings             |
| Brand Vibrant Pink  | `#D83A56` | ■ Deep Rose     | Active CTAs, luxury buttons        |
| Brand Gold (Hot Pink)| `#FF4D6D`| ■ Hot Pink-Red  | Accent, icons, highlights          |
| Brand Rose          | `#F8B8C8` | ■ Soft Rose     | Primary buttons, focus rings       |
| Brand Cream         | `#FDECEE` | ■ Blush Cream   | Secondary backgrounds, soft areas  |

---

## 2. Light Mode — Semantic Color Tokens

These tokens define how colors are applied across UI components in Light Mode (default).

### Surfaces & Backgrounds

| Token               | Hex / Value | Usage                        |
|---------------------|-------------|------------------------------|
| Background          | `#FFFFFF`   | Full page background         |
| Card                | `#FFFFFF`   | Card / panel surfaces        |
| Popover             | `#FFFFFF`   | Dropdowns, tooltips, menus   |
| Muted               | `#F4F4F5`   | Subtle / low-emphasis areas  |
| Secondary           | `#FDECEE`   | Secondary section backgrounds|

### Text Colors

| Token               | Hex / Value | Usage                        |
|---------------------|-------------|------------------------------|
| Foreground          | `#1A1A1A`   | Primary body text            |
| Card Foreground     | `#1A1A1A`   | Text on cards                |
| Popover Foreground  | `#1A1A1A`   | Text in popovers             |
| Secondary Foreground| `#1A1A1A`   | Text on secondary surfaces   |
| Muted Foreground    | `#71717A`   | Placeholder / subtle text    |
| Primary Foreground  | `#FFFFFF`   | Text on primary (pink) buttons|
| Accent Foreground   | `#FFFFFF`   | Text on accent buttons       |

### Interactive / Action Colors

| Token               | Hex / Value | Usage                          |
|---------------------|-------------|--------------------------------|
| Primary             | `#F8B8C8`   | Main action buttons            |
| Accent              | `#FF4D6D`   | Highlight buttons, links       |
| Ring                | `#F8B8C8`   | Focus outlines / accessibility |
| Luxury Button Active| `#D83A56`   | Hover: `#C02E48`               |

---

## 3. Dark Mode — Semantic Tokens

Dark mode uses a monochrome (neutral gray) scale — no brand color accents.

| Token               | Value (OKLCH)             | Approximate Hex |
|---------------------|---------------------------|-----------------|
| Background          | `oklch(0.145 0 0)`        | `#1C1C1C`       |
| Foreground          | `oklch(0.985 0 0)`        | `#FAFAFA`       |
| Card                | `oklch(0.205 0 0)`        | `#282828`       |
| Muted               | `oklch(0.269 0 0)`        | `#333333`       |
| Muted Foreground    | `oklch(0.708 0 0)`        | `#A3A3A3`       |
| Border              | `oklch(1 0 0 / 10%)`      | White 10% alpha |
| Destructive         | `oklch(0.704 0.191 22.2)` | ~`#E05C4B`      |

---

## 4. Typography

| Role      | Font Family   | Variable             |
|-----------|---------------|----------------------|
| Body/Sans | **Inter**     | `--font-inter`       |
| Headings  | **Playfair**  | `--font-playfair`    |
| Monospace | **Geist Mono**| `--font-geist-mono`  |

---

## 5. Border Radius Scale

| Token       | Value                       |
|-------------|-----------------------------|
| Base Radius | `0.625rem` (10px)           |
| sm          | `calc(base × 0.6)` = 6px   |
| md          | `calc(base × 0.8)` = 8px   |
| lg          | `base` = 10px               |
| xl          | `calc(base × 1.4)` = 14px  |
| 2xl         | `calc(base × 1.8)` = 18px  |
| 3xl         | `calc(base × 2.2)` = 22px  |
| 4xl         | `calc(base × 2.6)` = 26px  |

---

## 6. Brand Aesthetic Summary

> **PMU Luxury Beauty Studio**

The visual identity communicates luxury, femininity, and sophistication:

- **Base:** Clean ivory/white — elegant and minimal
- **Warmth:** Soft rose (`#F8B8C8`) and blush cream (`#FDECEE`) — feminine and inviting
- **Energy:** Hot pink-red accents (`#FF4D6D`, `#D83A56`) — bold, confident CTAs
- **Grounding:** Near-black (`#1A1A1A`) text — refined, not harsh
- **Typography:** Serif headings (Playfair) paired with clean sans body (Inter) — classic meets modern

---

## 7. Quick Reference — All Hex Codes

```
#FFFFFF  — White (Background)
#FDECEE  — Blush Cream (Secondary)
#F8B8C8  — Soft Rose (Primary / Ring)
#FF4D6D  — Hot Pink (Accent / Brand Gold)
#D83A56  — Vibrant Pink (Brand / Active Button)
#C02E48  — Deep Rose (Button Hover State)
#F4F4F5  — Light Gray (Muted)
#71717A  — Medium Gray (Muted Text)
#1A1A1A  — Near Black (Brand Black / Text)
```

---

*Source file: `src/app/globals.css` — PMU Project*
