# GlowySpot — Warm Peach Redesign Spec

## Overview

Replace the current Soft Violet/purple color system with a warm, organic Peach + Mint palette that better matches the beauty industry aesthetic. The existing component structure (TopBar, Sidebar, BottomNav, FeedCard, UI primitives) remains intact — only the visual tokens and their application change.

**Why:** User testing showed the Soft Violet palette felt cold and mismatched for a beauty/wellness platform. Inspiration images from successful beauty platforms (warm cream backgrounds, soft peach tones, clean typography) drove this direction.

---

## Design Tokens

All tokens live in `app/globals.css` under the `@theme { }` block. The project uses Tailwind CSS v4, so all color tokens use the `--color-*` prefix with hex or rgba values.

### Light Mode Token Values (complete replacement for `@theme`)

| CSS Variable | Value | Usage |
|---|---|---|
| `--color-background` | `#FAF4F0` | Page background (warm cream) |
| `--color-surface` | `#FFFFFF` | Cards, panels |
| `--color-surface-glass` | `rgba(250,244,240,0.88)` | TopBar, Sidebar glass overlay |
| `--color-foreground` | `#1C1A19` | Primary text |
| `--color-primary` | `#C87860` | Brand color, CTA buttons, likes |
| `--color-primary-hover` | `#B56A52` | Button hover state |
| `--color-primary-foreground` | `#FFFFFF` | Text on primary buttons |
| `--color-secondary` | `#F5EFEC` | Secondary surfaces |
| `--color-secondary-foreground` | `#1C1A19` | Text on secondary surfaces |
| `--color-muted` | `#F0E8E3` | Muted surface tint |
| `--color-muted-foreground` | `#8C7B72` | Secondary text, placeholders |
| `--color-accent` | `#8BBCB5` | Mint — category chips & badges ONLY |
| `--color-accent-foreground` | `#FFFFFF` | Text on solid mint elements |
| `--color-accent-warm` | `#E09070` | Gradient endpoint for peach gradient buttons |
| `--color-border` | `rgba(200,128,106,0.15)` | Subtle borders |
| `--color-input` | `rgba(200,128,106,0.15)` | Input field border |
| `--color-ring` | `#C87860` | Focus ring |
| `--color-popover` | `#FFFFFF` | Popover background |
| `--color-popover-foreground` | `#1C1A19` | Popover text |
| `--color-primary-subtle` | `rgba(200,120,96,0.08)` | Outline/ghost button hover bg |
| `--color-accent-dim` | `#5A9A94` | Outline chip text color (darker mint) |

**Tokens removed (were Soft Violet-era, no longer used):**
- `--color-accent-rose` (was `#d4a0b0`) — deleted
- `--color-accent-coral` (was `#e8a090`) — deleted
- `--color-accent-peony` (was `#e6cece`) — deleted

### Semantic Role Rules

- **Peach (`--color-primary`)**: All interactive CTAs — "Foglalj", "Belépés", like hearts, booking actions
- **Mint (`--color-accent`)**: Taxonomy only — category chips, service badges, filter tags. Never on buttons or nav.
- **Glass surfaces**: Use `var(--color-surface-glass)` + `backdrop-filter: blur(12px)` on TopBar and Sidebar only.

---

## Typography

| Element | Font | Weight | Size | Notes |
|---|---|---|---|---|
| Logo (GlowySpot) | Georgia, serif | 300 | 18–20px | Letter-spacing: 0.18em |
| Section headings | Georgia, serif | 400 | 18–20px | Letter-spacing: 0.05em |
| Body text | Inter / system-ui, sans-serif | 400 | 14–15px | |
| Card titles | Inter, sans-serif | 600 | 14px | |
| Meta / timestamps | Inter, sans-serif | 400 | 12px | color: `var(--color-muted-foreground)` |
| Buttons / labels | Inter, sans-serif | 600 | 12–13px | Letter-spacing: 0.03em |
| Chips / badges | Inter, sans-serif | 600 | 11px | Letter-spacing: 0.06em |

**Rule:** Georgia serif is used exclusively for brand identity elements (logo, section headings). All functional UI text uses Inter/sans-serif.

---

## Navigation

### TopBar
- Background: `var(--color-surface-glass)` → resolves to `rgba(250,244,240,0.88)` + `backdrop-filter: blur(12px)`
- Border-bottom: `1px solid var(--color-border)` → `rgba(200,128,106,0.15)`
- Logo: Georgia, font-weight 300, letter-spacing 0.18em, color `var(--color-foreground)`
- Login button: Peach pill (`var(--color-primary)` bg), rounded-full, font-weight 600
- Sticky, z-index: `var(--z-topbar)` (50)

### Sidebar (desktop)
- Background: `var(--color-surface-glass)` + `backdrop-filter: blur(8px)` (slightly less blur than TopBar)
- Border-right: `1px solid var(--color-border)`
- Icon-only at `md` breakpoint (60px wide), text labels at `lg+` (220px wide)
- Active icon background: `var(--color-primary-subtle)`, icon color: `var(--color-primary)`
- Inactive icons: `var(--color-muted-foreground)`

### BottomNav (mobile)
- Background: `var(--color-surface-glass)` + `backdrop-filter: blur(8px)`
- Border-top: `1px solid var(--color-border)`
- Active icon + label: `var(--color-primary)` (peach)
- Center button: Peach circle for authenticated users (→ `/salon`), Search icon for guests (→ `/providers`)

---

## Component Specifications

### Cards (FeedCard, general cards)
- Background: `var(--color-surface)` (`#FFFFFF`)
- Border-radius: `16px` (rounded-2xl)
- Box-shadow: `0 2px 12px rgba(0,0,0,0.06)`

### Buttons

| Variant | Background | Text color | Hover |
|---|---|---|---|
| `default` | `var(--color-primary)` | `var(--color-primary-foreground)` | `var(--color-primary-hover)` |
| `outline` | transparent | `var(--color-primary)` | `var(--color-primary-subtle)` bg |
| `ghost` | transparent | `var(--color-muted-foreground)` | `var(--color-primary-subtle)` bg |
| `gradient` | `linear-gradient(135deg, var(--color-primary), var(--color-accent-warm))` | `#FFFFFF` | opacity 0.9 |

All buttons: `rounded-full` for pills (CTA, login), `rounded-xl` for standard form buttons.

### Chips & Badges (mint only)

- **Solid chip**: `background: var(--color-accent)` (`#8BBCB5`), `color: var(--color-accent-foreground)` (`#FFFFFF`), `border-radius: 20px`, `padding: 3px 10px`, `font-size: 11px`, `font-weight: 600`
- **Outline chip**: `background: rgba(139,188,181,0.15)` (alpha variant of `var(--color-accent)`), `color: var(--color-accent-dim)`, `border: 1px solid var(--color-accent)`, same sizing
- Usage: category filters, service type tags, specialty badges on provider cards

### Input Fields
- Background: `var(--color-surface)` (`#FFFFFF`)
- Border: `1px solid var(--color-input)` → `rgba(200,128,106,0.15)`
- Border-radius: `rounded-xl`
- Focus ring: `var(--color-ring)` → `#C87860`
- Placeholder color: `var(--color-muted-foreground)` → `#8C7B72`

### Dialogs / Modals
- Backdrop overlay: `rgba(28,26,25,0.4)` + `backdrop-filter: blur(4px)` (alpha variant of `var(--color-foreground)`; dark mode: use `rgba(0,0,0,0.6)`)
- Panel background: `var(--color-surface)` (`#FFFFFF`)
- Panel border: `1px solid var(--color-border)` (uses the shared `--color-border` token)
- Border-radius: `20px`

---

## Dark Mode Token Values

The `.dark` block in `globals.css` receives warm-palette dark equivalents. All violet values are replaced.

| CSS Variable | Dark Value | Notes |
|---|---|---|
| `--color-background` | `#1C1410` | Very dark warm brown |
| `--color-surface` | `#2A1E16` | Dark warm surface |
| `--color-surface-glass` | `rgba(42,30,22,0.85)` | Glass overlay for dark mode |
| `--color-foreground` | `#F4EDE8` | Warm off-white text |
| `--color-primary` | `#D48A72` | Lighter peach for dark bg |
| `--color-primary-hover` | `#E09A82` | Hover on dark |
| `--color-primary-foreground` | `#FFFFFF` | |
| `--color-secondary` | `#2A1E16` | |
| `--color-secondary-foreground` | `#F4EDE8` | |
| `--color-muted` | `#241810` | |
| `--color-muted-foreground` | `#A08070` | |
| `--color-accent` | `#6A9E98` | Slightly darker mint for dark bg |
| `--color-accent-foreground` | `#FFFFFF` | |
| `--color-accent-warm` | `#C07858` | Gradient endpoint, darker |
| `--color-border` | `rgba(200,128,106,0.2)` | |
| `--color-input` | `rgba(200,128,106,0.2)` | |
| `--color-ring` | `#D48A72` | |
| `--color-popover` | `#2A1E16` | |
| `--color-popover-foreground` | `#F4EDE8` | |
| `--color-primary-subtle` | `rgba(200,120,96,0.12)` | Outline/ghost button hover bg (stronger alpha on dark) |
| `--color-accent-dim` | `#4A8A84` | Outline chip text color on dark bg |

---

## Complete `globals.css` Implementation

The `@theme` block and `.dark` block are fully replaced. No other parts of `globals.css` change (the `.glass`, `.glass-solid`, media queries, and `body` rules are unchanged).

```css
@theme {
  --font-sans: var(--font-inter);

  /* Surfaces */
  --color-background: #FAF4F0;
  --color-surface: #FFFFFF;
  --color-surface-glass: rgba(250,244,240,0.88);
  --color-foreground: #1C1A19;

  /* Primary — Peach */
  --color-primary: #C87860;
  --color-primary-hover: #B56A52;
  --color-primary-foreground: #FFFFFF;

  /* shadcn tokens */
  --color-secondary: #F5EFEC;
  --color-secondary-foreground: #1C1A19;
  --color-muted: #F0E8E3;
  --color-muted-foreground: #8C7B72;
  --color-accent: #8BBCB5;
  --color-accent-foreground: #FFFFFF;
  --color-accent-warm: #E09070;
  --color-border: rgba(200,128,106,0.15);
  --color-input: rgba(200,128,106,0.15);
  --color-ring: #C87860;
  --color-popover: #FFFFFF;
  --color-popover-foreground: #1C1A19;
  --color-primary-subtle: rgba(200,120,96,0.08);
  --color-accent-dim: #5A9A94;

  /* Border radii */
  --radius-lg: 0.75rem;
  --radius-md: 0.5rem;
  --radius-sm: 0.25rem;

  /* Z-index scale */
  --z-bottom-nav: 40;
  --z-sidebar: 40;
  --z-topbar: 50;
  --z-overlay: 60;
  --z-modal: 70;
  --z-toast: 80;
}

/* Dark mode overrides */
.dark {
  --color-background: #1C1410;
  --color-surface: #2A1E16;
  --color-surface-glass: rgba(42,30,22,0.85);
  --color-foreground: #F4EDE8;
  --color-primary: #D48A72;
  --color-primary-hover: #E09A82;
  --color-primary-foreground: #FFFFFF;
  --color-secondary: #2A1E16;
  --color-secondary-foreground: #F4EDE8;
  --color-muted: #241810;
  --color-muted-foreground: #A08070;
  --color-accent: #6A9E98;
  --color-accent-foreground: #FFFFFF;
  --color-accent-warm: #C07858;
  --color-border: rgba(200,128,106,0.2);
  --color-input: rgba(200,128,106,0.2);
  --color-ring: #D48A72;
  --color-popover: #2A1E16;
  --color-popover-foreground: #F4EDE8;
  --color-primary-subtle: rgba(200,120,96,0.12);
  --color-accent-dim: #4A8A84;
}
```

---

## Files to Modify

| File | Change |
|---|---|
| `app/globals.css` | Replace `@theme` block and `.dark` block entirely (see above) |
| `components/ui/button.tsx` | (1) Update `gradient` variant: `from-primary to-accent-warm`. (2) Fix `outline`/`ghost` hover: replace `hover:bg-accent hover:text-accent-foreground` with `hover:bg-primary-subtle` so hover is a peach tint, not mint green. |
| `components/layout/top-bar.tsx` | Verify logo uses Georgia serif, font-weight 300 |
| `components/layout/sidebar.tsx` | Verify glass background uses `var(--color-surface-glass)` |
| `components/layout/bottom-nav.tsx` | Verify glass background uses `var(--color-surface-glass)` |

Most components use `var(--color-*)` tokens already; token replacement in `globals.css` will propagate automatically. Only `button.tsx` needs a code change for the gradient variant.

---

## What Does NOT Change

- Component file structure and JSX (except `button.tsx` gradient variant)
- Layout system (TopBar + Sidebar + BottomNav + main content)
- Responsive breakpoints (`md:`, `lg:`)
- Authentication logic
- Data fetching / API layer
- `.glass`, `.glass-solid` CSS utility classes (they already use `var(--color-surface-glass)` and `var(--color-border)`)

---

## Out of Scope

- New pages or features
- Animation overhaul
- Font loading infrastructure (Inter already loaded via Next.js)

---

## Success Criteria

1. `globals.css` `@theme` block has zero violet/purple hex values (`#9b8ec4`, `#2d1f3d`, `#f0ecf5`, etc.)
2. `globals.css` `.dark` block has zero violet/purple hex values
3. All peach tokens use `#C87860` as base in light mode
4. Mint (`#8BBCB5`) appears only on chips and badges — not on buttons or nav elements
5. TopBar and Sidebar render with warm glass effect on all breakpoints
6. Logo renders in Georgia serif with font-weight 300
7. `npm run build` passes with no TypeScript errors
8. Visual check: feed page, provider profile page, auth modal — no purple/violet visible
