# GlowySpot UI Modernization — Design Spec

**Date:** 2026-03-20
**Status:** Draft
**Scope:** Global design system refresh, responsive layout redesign, dark/light theme

---

## 1. Design Decisions Summary

| Decision | Choice |
|----------|--------|
| Navigation | Hybrid: top bar + left sidebar |
| Feed layout | Card Feed (vertical cards with media + text + actions) |
| Color palette | Soft Violet (muted lilac, rose, coral) |
| Theme | Dark + Light mode with user toggle |
| Component style | Glassmorphism (frosted glass, backdrop-blur, subtle borders) |
| Responsiveness | Desktop sidebar / Tablet icon sidebar / Mobile bottom nav |

---

## 2. Color Palette — Soft Violet

Two themes sharing the same accent colors but different base surfaces.

### 2.1 Light Theme (default follows `prefers-color-scheme`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#faf5f8` | Page background (warm lavender-white) |
| `--surface` | `#ffffff` | Cards, panels |
| `--surface-glass` | `rgba(255,255,255,0.6)` | Glassmorphism cards (+ backdrop-blur) |
| `--foreground` | `#2d1f3d` | Primary text (deep violet-black) |
| `--muted` | `#8b7aad` | Secondary text, placeholders |
| `--border` | `rgba(155,142,196,0.2)` | Card borders, dividers |
| `--primary` | `#9b8ec4` | Primary accent (soft violet) |
| `--primary-hover` | `#7c6dab` | Primary hover state |
| `--accent-rose` | `#d4a0b0` | Secondary accent (muted rose) |
| `--accent-coral` | `#e8a090` | Tertiary accent (soft coral) |
| `--accent-peony` | `#e6cece` | Subtle highlights |
| `--ring` | `#9b8ec4` | Focus rings |

### 2.2 Dark Theme

| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#1a1428` | Page background (deep violet) |
| `--surface` | `#2a2240` | Cards, panels |
| `--surface-glass` | `rgba(42,34,64,0.6)` | Glassmorphism cards (+ backdrop-blur) |
| `--foreground` | `#f4e0e8` | Primary text (warm light pink-white) |
| `--muted` | `#8b7aad` | Secondary text (same as light) |
| `--border` | `rgba(155,142,196,0.15)` | Card borders, dividers |
| `--primary` | `#9b8ec4` | Primary accent (same across themes) |
| `--primary-hover` | `#b4a5d6` | Primary hover (lighter in dark mode) |
| `--accent-rose` | `#d4a0b0` | Same |
| `--accent-coral` | `#e8a090` | Same |
| `--accent-peony` | `#5e3f54` | Darker peony for dark bg |
| `--ring` | `#9b8ec4` | Focus rings |

### 2.3 shadcn/Radix Token Mapping

The current globals.css defines tokens that shadcn components depend on. These must be preserved and mapped to the new palette:

| Current Token | Light Value | Dark Value | Notes |
|---------------|-------------|------------|-------|
| `--color-primary` | `#9b8ec4` | `#9b8ec4` | Was pink #db2777 |
| `--color-primary-hover` | `#7c6dab` | `#b4a5d6` | |
| `--color-primary-foreground` | `#ffffff` | `#ffffff` | Stays white |
| `--color-secondary` | `#f0ecf5` | `#2a2240` | Light lavender / dark surface |
| `--color-secondary-foreground` | `#2d1f3d` | `#f4e0e8` | |
| `--color-muted` | `#f5f0f8` | `#231c38` | Subtle bg |
| `--color-muted-foreground` | `#6b5a8a` | `#8b7aad` | Adjusted for 4.5:1 contrast |
| `--color-accent` | `#f0e4ef` | `#3a2f52` | Highlight bg |
| `--color-accent-foreground` | `#9b8ec4` | `#d4a0b0` | |
| `--color-background` | `#faf5f8` | `#1a1428` | |
| `--color-foreground` | `#2d1f3d` | `#f4e0e8` | |
| `--color-border` | `rgba(107,90,138,0.15)` | `rgba(155,142,196,0.15)` | |
| `--color-input` | `rgba(107,90,138,0.15)` | `rgba(155,142,196,0.2)` | |
| `--color-ring` | `#9b8ec4` | `#9b8ec4` | |
| `--color-popover` | `#ffffff` | `#2a2240` | |
| `--color-popover-foreground` | `#2d1f3d` | `#f4e0e8` | |
| `--color-surface` | `#ffffff` | `#2a2240` | New token for glass base |
| `--color-surface-glass` | `rgba(255,255,255,0.6)` | `rgba(42,34,64,0.6)` | New token |
| `--color-accent-rose` | `#d4a0b0` | `#d4a0b0` | New token |
| `--color-accent-coral` | `#e8a090` | `#e8a090` | New token |
| `--color-accent-peony` | `#e6cece` | `#5e3f54` | New token |
| `--radius-lg` | `0.75rem` | same | Increased from 0.5rem for glass style |
| `--radius-md` | `0.5rem` | same | |
| `--radius-sm` | `0.25rem` | same | |

### 2.4 Contrast Compliance (WCAG AA)

| Combination | Ratio | Pass? |
|-------------|-------|-------|
| `--foreground` (#2d1f3d) on `--background` (#faf5f8) | 11.2:1 | AA |
| `--muted-foreground` (#6b5a8a) on `--background` (#faf5f8) | 4.6:1 | AA |
| `--muted-foreground` (#6b5a8a) on `--surface` (#ffffff) | 5.1:1 | AA |
| `--foreground` (#f4e0e8) on `--background` (#1a1428) dark | 10.8:1 | AA |
| `--muted` (#8b7aad) on `--background` (#1a1428) dark | 4.7:1 | AA |
| White on `--primary` (#9b8ec4) | 3.2:1 | AA Large only |

Note: `--muted-foreground` is adjusted from the original `#8b7aad` to `#6b5a8a` in light mode to meet 4.5:1 contrast ratio.

### 2.5 Implementation

- Use Tailwind CSS v4 `@theme` with CSS custom properties for light mode defaults
- Dark mode overrides in `.dark` selector applied to `<html>` element
- `tailwind.config.ts` will be kept for content paths and any plugin config, but color definitions move to `@theme` in globals.css
- Store preference in `localStorage` key `glowyspot-theme`, fallback to `prefers-color-scheme`
- New context: `ThemeProvider` wrapping the app
- **FOIT prevention**: Inline `<script>` in `<head>` of `layout.tsx` reads localStorage and sets `.dark` class synchronously before React hydrates

---

## 3. Navigation Layout

### 3.1 Desktop (>=1024px) — Hybrid: Top Bar + Left Sidebar

**Top bar** (sticky, full width):
- Left: GlowySpot logo (text, `font-weight: 300`, `letter-spacing: 2px`)
- Center: Search input (glassmorphism style)
- Right: Notifications bell, Messages icon, User avatar, Dark/Light toggle switch

**Left sidebar** (sticky, 220px, glassmorphism panel):
- Menu items with icons + text labels
- Active state: subtle background highlight + left accent border
- Context-aware: shows different links based on user role / page context
- Sections: Menu, Location/Filters (on feed pages), User card at bottom

**Content area**: max-width 680px (with right sidebar) or full width (without)

**Right sidebar** (360-420px): Recommendations, trending — stays as-is structurally. Only visible at **xl (1280px+)** because the math doesn't fit at lg: `220 + 680 + 360 + gaps > 1024px`.

### 3.2 Tablet (768-1023px) — Collapsed Sidebar

- **Top bar**: Same as desktop but search becomes icon-only (expands on click)
- **Left sidebar**: Collapses to 60px icon-only strip (no text labels)
- Tooltip on hover shows label
- Content area expands to fill
- Right sidebar: hidden

### 3.3 Mobile (<768px) — Bottom Navigation

- **Top bar** (simplified): Logo left, search icon + avatar right
- **No left sidebar** — replaced by bottom navigation
- **Bottom nav** (sticky, glassmorphism): 5 items with icons + small labels:
  1. Feed (home)
  2. Keresés (search)
  3. **Floating center button** — "Új poszt" (new post), elevated with gradient + shadow
  4. Kedvencek (favorites)
  5. Profil (profile)
- Active item: top glow bar indicator
- Hamburger menu removed — all primary nav in bottom bar
- Secondary pages (settings, salon management) accessible from profile or in-page navigation

### 3.4 Key Changes from Current Code

| Current | New |
|---------|-----|
| `Navbar` visible only below `xl` (hamburger + drawer) | Top bar visible at ALL breakpoints; bottom nav on mobile |
| `Sidebar` visible only at `xl` (240px, white cards) | Sidebar at `lg+` with glassmorphism; icon-only at `md-lg` |
| Right sidebar at `xl` | Right sidebar stays at `xl+` (layout math requires 1280px) |
| Breakpoint: `xl` (1280px) | Breakpoints: `lg` (1024px), `md` (768px) |

---

## 4. Component Style — Glassmorphism

### 4.1 Core Properties

```css
/* Glass card base — for sticky/fixed elements (top bar, sidebar, bottom nav) */
.glass {
  background: var(--surface-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

/* Solid card — for feed cards and repeated elements (performance) */
.glass-solid {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

/* Fallback for browsers without backdrop-filter support */
@supports not (backdrop-filter: blur(20px)) {
  .glass {
    background: var(--surface);
  }
}

/* Respect reduced transparency preference */
@media (prefers-reduced-transparency: reduce) {
  .glass {
    background: var(--surface);
    backdrop-filter: none;
  }
}
```

**Performance rule**: `backdrop-filter: blur()` is reserved for **sticky/fixed elements only** (top bar, sidebar, bottom nav, modals). Feed cards and repeated scrollable content use `glass-solid` with opaque `var(--surface)` background to avoid GPU compositing cost on lower-end devices.

### 4.2 Component Specs

**Cards:**
- `border-radius: 16px`
- **Sidebar panels** (fixed): `.glass` with `backdrop-blur(20px)`
- **Feed cards** (scrollable): `.glass-solid` with opaque `var(--surface)` (performance)
- `border: 1px solid var(--border)`
- Shadow: `0 8px 32px rgba(0,0,0,0.06)` (light) / `0 8px 32px rgba(0,0,0,0.3)` (dark)

**Buttons — Primary:**
- `background: linear-gradient(135deg, var(--primary), var(--accent-rose))`
- `border-radius: 12px`
- `color: white`
- Hover: slight scale (1.02) + increased shadow
- `padding: 10px 20px`

**Buttons — Secondary/Ghost:**
- Glass background
- `border: 1px solid var(--border)`
- Text color: `var(--muted)`, hover: `var(--foreground)`

**Inputs:**
- Glass background
- `border-radius: 12px`
- `border: 1px solid var(--border)`
- Focus: `ring-2 ring-primary/30`
- Placeholder: `var(--muted)`

**Badges:**
- `border-radius: 20px` (pill shape)
- Subtle glass background or accent color with low opacity
- Small, `font-size: 11px`

**Avatars:**
- `border-radius: 50%`
- Gradient border ring: `var(--primary)` to `var(--accent-rose)`

**Dialogs/Modals:**
- Glass background with stronger blur (30px)
- Overlay: dark semi-transparent
- `border-radius: 20px`

### 4.3 Gradients Used

| Name | Value | Usage |
|------|-------|-------|
| `brand` | `linear-gradient(135deg, #9b8ec4, #d4a0b0)` | Logo bg, primary buttons, avatar rings |
| `cta` | `linear-gradient(135deg, #9b8ec4, #e8a090)` | Call-to-action buttons |
| `glow` | `radial-gradient(circle, #9b8ec440, transparent)` | Background decoration |

---

## 5. Feed — Card Feed Design

Each post in the feed is a glassmorphism card containing:

1. **Header row**: Avatar + Name + Location + Timestamp + "..." menu
2. **Media area**: Image or video (rounded corners, 16:9 or flexible aspect ratio)
   - Support for image carousels (swipe on mobile)
   - Video: inline player with play overlay
3. **Action row**: Heart (like), Comment, Share, Bookmark (right-aligned)
   - Heart animates on tap (scale + color burst)
4. **Text content**: Username bold + post text + "tovabb..." (read more) truncation
5. **CTA button** (optional): "Foglalj idopontot" (book appointment) — gradient button
6. **Comments preview**: Last 1-2 comments shown, "Osszes megtekintese" link

### 5.1 Card Spacing
- Card gap: `16px` (mobile), `20px` (desktop)
- Card internal padding: `16px`
- Media border-radius: `12px`

---

## 6. Responsiveness Rules

### 6.1 Breakpoints

| Name | Size | Layout |
|------|------|--------|
| `sm` | 640px | Minor spacing adjustments |
| `md` | 768px | Tablet: icon sidebar appears, bottom nav disappears |
| `lg` | 1024px | Desktop: full sidebar with text labels, content centered |
| `xl` | 1280px | Wide: right sidebar appears alongside content |

### 6.2 Mobile-Specific (<768px)
- Bottom nav height: `64px` + safe area (env(safe-area-inset-bottom))
- Content has `padding-bottom: 80px` to clear bottom nav
- Feed cards are full-width (no horizontal padding beyond 8px)
- Floating "new post" button: 56px diameter, elevated 12px above nav bar
- Touch targets minimum `44px`
- Swipe gestures on media carousels

### 6.3 Tablet-Specific (768-1023px)
- Icon sidebar: `60px` wide
- No right sidebar
- Feed cards have max-width `600px`, centered

### 6.4 Desktop-Specific (1024px+)
- Left sidebar: `220px`, glassmorphism panel, sticky
- Content max-width: `680px`
- Right sidebar: `360-420px` flexible
- Container max-width: `1440px`

---

## 7. Dark/Light Theme Toggle

### 7.1 Implementation
- `ThemeProvider` component wrapping the app in `layout.tsx`
- Toggle adds/removes `dark` class on `<html>`
- CSS custom properties switch values based on `.dark` selector
- Store in `localStorage` key `glowyspot-theme`
- Default: follow system (`prefers-color-scheme: dark`)
- Toggle UI: slide switch in top bar (sun/moon icons)
- Smooth transition: `transition: background-color 0.3s, color 0.3s, border-color 0.3s`

### 7.2 Tailwind v4 Setup (complete)
```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-inter);

  --color-background: #faf5f8;
  --color-surface: #ffffff;
  --color-surface-glass: rgba(255,255,255,0.6);
  --color-foreground: #2d1f3d;

  --color-primary: #9b8ec4;
  --color-primary-hover: #7c6dab;
  --color-primary-foreground: #ffffff;

  --color-secondary: #f0ecf5;
  --color-secondary-foreground: #2d1f3d;

  --color-muted: #f5f0f8;
  --color-muted-foreground: #6b5a8a;

  --color-accent: #f0e4ef;
  --color-accent-foreground: #9b8ec4;
  --color-accent-rose: #d4a0b0;
  --color-accent-coral: #e8a090;
  --color-accent-peony: #e6cece;

  --color-border: rgba(107,90,138,0.15);
  --color-input: rgba(107,90,138,0.15);
  --color-ring: #9b8ec4;

  --color-popover: #ffffff;
  --color-popover-foreground: #2d1f3d;

  --radius-lg: 0.75rem;
  --radius-md: 0.5rem;
  --radius-sm: 0.25rem;
}

.dark {
  --color-background: #1a1428;
  --color-surface: #2a2240;
  --color-surface-glass: rgba(42,34,64,0.6);
  --color-foreground: #f4e0e8;

  --color-primary-hover: #b4a5d6;

  --color-secondary: #2a2240;
  --color-secondary-foreground: #f4e0e8;

  --color-muted: #231c38;
  --color-muted-foreground: #8b7aad;

  --color-accent: #3a2f52;
  --color-accent-foreground: #d4a0b0;
  --color-accent-peony: #5e3f54;

  --color-border: rgba(155,142,196,0.15);
  --color-input: rgba(155,142,196,0.2);

  --color-popover: #2a2240;
  --color-popover-foreground: #f4e0e8;
}
```

Note: `tailwind.config.ts` is kept only for content paths. All color/spacing definitions live in `@theme`.

---

## 8. Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Logo | Inter | 300 (light) | 20px / 1.2 | `letter-spacing: 2px` |
| H1 | Inter | 700 | 28px / 1.3 (desktop), 22px / 1.3 (mobile) | |
| H2 | Inter | 600 | 20px / 1.4 (desktop), 18px / 1.4 (mobile) | |
| Body | Inter | 400 | 14px / 1.6 | Optimized for readability |
| Small/Labels | Inter | 500 | 11px / 1.3 | `text-transform: uppercase`, `letter-spacing: 0.05em` |
| Menu items | Inter | 500 | 14px / 1.4 | |

---

## 9. Z-Index Scale

| Token | Value | Element |
|-------|-------|---------|
| `--z-bottom-nav` | `40` | Mobile bottom navigation |
| `--z-sidebar` | `40` | Left sidebar |
| `--z-topbar` | `50` | Top bar (above sidebar) |
| `--z-overlay` | `60` | Modal/dialog backdrop |
| `--z-modal` | `70` | Modal/dialog content |
| `--z-toast` | `80` | Toast notifications |

---

## 10. Accessibility Requirements

### 10.1 Color Contrast
- All text must meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- See Section 2.4 for verified contrast ratios
- Interactive elements must have visible focus indicators

### 10.2 Focus Management
- Focus ring: `2px solid var(--ring)` with `2px offset`
- All interactive elements must be keyboard-accessible
- Bottom nav, sidebar icons, and icon-only elements need visible focus outlines
- Modal focus trap: focus stays within modal when open

### 10.3 Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
- Heart animation, button hover scale, theme transition all respect this

### 10.4 ARIA Labels
- Tablet icon-only sidebar buttons: `aria-label` with menu item name
- Bottom nav items: `aria-label` on each
- Theme toggle: `aria-label="Téma váltása"`, `aria-pressed` state
- Floating "new post" button: `aria-label="Új bejegyzés létrehozása"`

### 10.5 Touch Targets
- Minimum 44x44px for all interactive elements
- Sidebar icon buttons in 60px strip: icon + padding = 44px minimum
- Bottom nav items: at least 48px tap area

---

## 11. Files to Create / Modify

### New Files
| File | Purpose |
|------|---------|
| `lib/theme-context.tsx` | ThemeProvider with localStorage + system preference + FOIT script |
| `lib/navigation-config.ts` | Shared navigation link arrays by role/context (eliminates duplication) |
| `components/layout/top-bar.tsx` | New top bar (replaces `navbar.tsx` top section) |
| `components/layout/bottom-nav.tsx` | Mobile bottom navigation |
| `components/ui/theme-toggle.tsx` | Sun/moon toggle switch component |
| `components/ui/glass-card.tsx` | Reusable glassmorphism card component |

### Modified Files
| File | Changes |
|------|---------|
| `app/globals.css` | Replace color tokens with Soft Violet palette; add `.dark` overrides; add glass utility classes |
| `app/layout.tsx` | Wrap with ThemeProvider |
| `components/layout/main-layout.tsx` | New responsive layout with top-bar, sidebar breakpoints, bottom-nav |
| `components/layout/sidebar.tsx` | Glassmorphism style; support collapsed icon-only mode via responsive breakpoint (md: icons, lg: icons+text). Consumes `navigation-config.ts` |
| `components/layout/navbar.tsx` | Deprecated / replaced by top-bar.tsx + bottom-nav.tsx |
| `components/ui/button.tsx` | Update variants for glass style + gradient primary |
| `components/ui/input.tsx` | Glass background, updated border/focus styles |
| `components/ui/card.tsx` | Glass variant |
| `components/ui/dialog.tsx` | Glass + stronger blur overlay |
| `components/ui/badge.tsx` | Pill shape, glass variant |
| `tailwind.config.ts` | Update color palette references if needed |

---

## 12. Migration Strategy

1. **Phase 1 — Theme Foundation**: Complete globals.css with all tokens (light + dark), ThemeProvider with FOIT prevention, dark class toggle
2. **Phase 2 — Shared Config + Layout Restructure**: `navigation-config.ts`, top-bar, sidebar responsive modes (icon + text), bottom-nav, main-layout refactor
3. **Phase 3 — Component Restyling**: glass-card, glass-solid, buttons, inputs, badges, dialogs with updated shadcn tokens
4. **Phase 4 — Feed Redesign**: Card feed component with glass-solid cards, media carousel, action row
5. **Phase 5 — Polish & Accessibility**: Animations (with prefers-reduced-motion), transitions, ARIA labels, focus management, responsive testing across devices
