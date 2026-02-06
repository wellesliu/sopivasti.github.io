# Hero Redesign: Split Layout with Featured Carousel

**Date:** 2026-02-06
**Status:** Approved

---

## Summary

Redesign the hero section from a centered tagline to a two-column layout: left side displays stats and Patreon button, right side showcases a rotating carousel of 3 featured apps.

---

## Goals

- Make the homepage feel more polished and curated
- Highlight best apps (Selio, Digits, Hexis) prominently
- Maintain minimalist philosophy
- Keep Patreon button visible and accessible

---

## Design

### Hero Layout

**Desktop (768px+):**

```
┌─────────────────────────────────────────────────────────┐
│ (blue gradient background)                              │
│                                                         │
│   ┌──────────────┐          ┌────────────────────┐     │
│   │ 17 apps      │          │  ┌──────┐          │     │
│   │ No ads       │          │  │ icon │          │     │
│   │ Since 2016   │          │  └──────┘          │     │
│   │              │          │  App Name          │     │
│   │ [Patreon]    │          │  Description...    │     │
│   └──────────────┘          │       ● ○ ○        │     │
│       (~40%)                └────────────────────┘     │
│                                   (~60%)               │
└─────────────────────────────────────────────────────────┘
```

**Mobile (<768px):**

```
┌─────────────────────┐
│ 17 apps · No ads    │
│ Since 2016          │
│                     │
│ [Support on Patreon]│
├─────────────────────┤
│     ┌──────┐        │
│     │ icon │        │
│     └──────┘        │
│     App Name        │
│     Description     │
│       ● ○ ○         │
└─────────────────────┘
```

### Left Column Content

```
17 apps · No ads · Since 2016

[Support on Patreon button]
```

- Replaces the large "Free Mobile Apps. Zero Ads." heading
- Stats line is punchy and scannable
- Patreon button maintains current styling with glow animation

### Carousel

**Featured apps:**
1. Selio
2. Digits
3. Hexis

**Each slide contains:**
- Large app icon (120px desktop, 80px mobile)
- App name (bold)
- Short description (2 lines max)

**Descriptions:**
- **Selio:** "Random finger picker for group decisions. Tap and let fate decide."
- **Digits:** "Countdown-style math puzzles. Reach the target using +, -, x, ÷."
- **Hexis:** "Your Catan game night companion. Dice physics, board setup, resource tracking."

**Visual:**
- Subtle frosted glass card container (semi-transparent)
- Light mode: `rgba(255,255,255,0.15)`
- Dark mode: `rgba(0,0,0,0.25)`

**Behavior:**
- Auto-rotates every 5 seconds
- Pauses on hover (desktop) or touch (mobile)
- Resumes after 10 seconds of no interaction
- Crossfade transition (~400ms)

**Navigation:**
- 3 dots below carousel content
- Current: filled, others: dimmed
- Dots are clickable

**Click action:**
- Clicking a slide smooth-scrolls to that app's card in the grid below
- Target card gets brief highlight animation (~1 second pulse)

### Accessibility

- `aria-live="polite"` on carousel region
- Dots are keyboard-focusable
- Respects `prefers-reduced-motion` (disable auto-rotation if set)

---

## All Apps Grid

No structural changes. Minor additions:

- Selio, Digits, Hexis remain in the grid (carousel highlights, grid catalogs)
- Smooth scroll target with highlight animation when arriving from carousel click
- Keep current app order (no reordering)

---

## Technical Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Restructure hero section markup |
| `styles.css` | Hero split layout, carousel styles, responsive stacking |
| `script.js` | Carousel logic (rotation, dots, pause, scroll-to-app) |

### Approach

**No new dependencies.** Pure HTML/CSS/JS.

**Carousel logic:**
- 3 slide divs, one visible at a time (opacity: 1 vs 0)
- `setInterval` for auto-rotation
- Clear interval on mouseenter/touchstart
- Resume with `setTimeout` after 10s inactivity
- CSS handles fade transitions

**Scroll-to-app:**
- Data attribute on each slide: `data-target="selio"`, etc.
- On click, `document.getElementById(target).scrollIntoView({ behavior: 'smooth' })`
- Add temporary highlight class, remove after animation

**Dark mode:**
- Carousel card background uses CSS variables
- Text colors use existing `--text-primary`, `--text-secondary`

---

## What's Removed

- Large "Free Mobile Apps. Zero Ads." heading (replaced by stats line)

---

## What's Preserved

- Blue gradient background
- Patreon button with glow animation
- Dark/light theme support
- All existing app cards and filter functionality
- Mobile hamburger menu
- No frameworks philosophy

---

## Open Questions

None. Design is complete and approved.

---

## Next Steps

1. Implement HTML structure changes
2. Add carousel CSS
3. Add carousel JavaScript
4. Test on mobile and desktop
5. Test dark mode
6. Verify accessibility (keyboard nav, screen reader)
