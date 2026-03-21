# Warm Peach Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Soft Violet color system with the Warm Peach + Mint palette by rewriting `app/globals.css` (all color tokens) and updating every file that hardcodes the deleted `accent-rose` token or incorrectly uses `hover:bg-accent` / `bg-accent` on non-chip elements (now mint green instead of neutral).

**Architecture:** All color tokens live in `app/globals.css` under a Tailwind v4 `@theme {}` block. Most components reference tokens via `var(--color-*)` utility classes — so replacing the token values in globals.css propagates automatically. However, component files hardcode `accent-rose` (deleted token) or reference `bg-accent` on non-chip elements in JSX className strings. Mint (`--color-accent` = `#8BBCB5` teal) is used ONLY on category chips/badges per spec — those stay mint. All other hover states and icon backgrounds must change to `primary-subtle` (warm peach tint) or `primary/10`.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4, TypeScript. No new dependencies needed.

---

## File Map

| File | Change | Why |
|---|---|---|
| `app/globals.css` | Replace `@theme {}` and `.dark {}` blocks | All color tokens — source of truth |
| `components/ui/button.tsx` | `accent-rose` → `accent-warm` on gradient; `hover:bg-accent` → `hover:bg-primary-subtle` on outline/ghost | Deleted token + mint hover |
| `components/layout/top-bar.tsx` | `accent-rose` → `accent-warm` on avatar; `hover:bg-accent` → `hover:bg-primary-subtle` on 2 icon buttons | Deleted token + mint hover |
| `components/layout/sidebar.tsx` | `accent-rose` → `accent-warm` on avatar; `hover:bg-accent` → `hover:bg-primary-subtle` on nav | Deleted token + mint hover |
| `components/layout/bottom-nav.tsx` | `accent-rose` → `accent-warm` on 2 center button circles | Deleted token |
| `components/home/feed-card.tsx` | `accent-rose` → `accent-warm` on inline booking button | Deleted token |
| `app/dashboard/favorites/page.tsx` | `accent-rose` → `accent-warm` on icon avatar | Deleted token |
| `app/profile/me/page.tsx` | `accent-rose` → `accent-warm` on profile avatar | Deleted token |
| `components/ui/dialog.tsx` | `data-[state=open]:bg-accent` → `data-[state=open]:bg-primary-subtle` | Mint close button state |
| `components/layout/filter-modal.tsx` | `hover:bg-accent` → `hover:bg-primary-subtle` on unselected filter chips | Mint hover |
| `components/salons/create-salon-modal.tsx` | `hover:bg-accent` → `hover:bg-primary-subtle` on 2 upload drop zones | Mint hover |
| `components/salon/cards/ClosedDatesCard.tsx` | `hover:bg-accent` → `hover:bg-primary-subtle` on icon button | Mint hover |
| `components/salon/cards/HoursCard.tsx` | `hover:bg-accent` → `hover:bg-primary-subtle` on icon button | Mint hover |
| `components/salon/cards/PostsCard.tsx` | `hover:bg-accent/50` → `hover:bg-primary-subtle` on post list rows | Mint hover |
| `components/salon/FavoriteButton.tsx` | `bg-accent` → `bg-primary/10` on favorited state | Mint background |
| `components/salon/modals/PostModal.tsx` | `hover:bg-accent` → `hover:bg-primary-subtle` on upload area | Mint hover |
| `components/dashboard/portfolio-vibe-widget.tsx` | line ~40: `hover:bg-accent` → `hover:bg-primary-subtle`; line ~43: `bg-accent/50` → `bg-primary/10` | Mint hover + non-chip bg |
| `components/ui/command.tsx` | `data-[selected]:bg-accent` → `bg-primary-subtle` on selected item | Mint selected state |
| `components/ui/select.tsx` | `focus:bg-accent` → `focus:bg-primary-subtle` on focused item | Mint focus state |
| `app/dashboard/salons/page.tsx` | `bg-accent` → `bg-primary/10` on empty state icon | Non-chip bg |
| `app/dashboard/favorites/page.tsx` | line ~69: `bg-accent` → `bg-primary/10` empty state circle; line ~87: `accent-rose` → `accent-warm` | Both |
| `app/dashboard/messages/page.tsx` | 3 non-chip bg-accent occurrences (avatar, button, active thread) | Non-chip bg |
| `app/profile/me/page.tsx` | line ~38: `accent-rose` → `accent-warm`; line ~81: `bg-accent` → `bg-primary/10` | Both |
| `components/admin/CategoryManager.tsx` | `bg-accent` → `bg-primary/10` on active category icon | Non-chip bg |
| `components/layout/sidebar.tsx` | line ~85: hover fix; line ~126: `bg-accent/50` → `bg-secondary`; line ~127: `accent-rose` → `accent-warm` | All three |
| `components/salon/message-modal.tsx` | `bg-accent` → `bg-primary/10` on empty state avatar | Non-chip bg |
| `components/salon/modals/PostModal.tsx` | line ~164: hover fix; line ~185: `bg-accent` → `bg-primary/10` selected tab | Both |
| `components/wizard/SalonWizard.tsx` | `bg-accent` → `bg-primary/10` on info banner | Non-chip bg |
| `components/wizard/WizardStep.tsx` | `bg-accent` → `bg-primary/10` on info box | Non-chip bg |
| `components/layout/active-salon-indicator.tsx` | `bg-accent` → `bg-primary/10` on icon container | Non-chip bg |
| `components/dashboard/kpi-cards.tsx` | `bg-accent` → `bg-primary/10` on 3 KPI icon containers | Non-chip bg |

**Files with intentional mint chips — do NOT change:**
`components/home/provider-card.tsx`, `components/profile/profile-hero.tsx`, `components/dashboard/provider-dashboard.tsx`, `components/salon/cards/BasicInfoCard.tsx`, `components/dashboard/timeline-schedule.tsx`, `app/profile/[id]/page.tsx`, `components/admin/CategoryModal.tsx`, `app/dashboard/messages/page.tsx` (badge span only)

---

## Task 1: Replace the globals.css color tokens

**Files:**
- Modify: `app/globals.css` (lines 3–69 — the entire `@theme {}` and `.dark {}` blocks)

- [ ] **Step 1: Confirm old violet tokens are present**

```bash
grep -n "9b8ec4\|2d1f3d\|1a1428\|2a2240\|accent-rose\|accent-coral\|accent-peony" app/globals.css
```

Expected: several matching lines. If empty, skip to Step 4.

- [ ] **Step 2: Replace the `@theme {}` block**

Replace the entire `@theme { ... }` block (lines 3–47) with:

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
```

- [ ] **Step 3: Replace the `.dark {}` block**

Replace the `.dark { ... }` block (lines 50–69) with:

```css
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

- [ ] **Step 4: Confirm no violet values remain**

```bash
grep -n "9b8ec4\|2d1f3d\|1a1428\|2a2240\|accent-rose\|accent-coral\|accent-peony" app/globals.css
```

Expected: **no output**.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat: replace Soft Violet tokens with Warm Peach palette in globals.css"
```

---

## Task 2: Fix all `accent-rose` references (deleted token — gradient endpoints)

**Files:** `button.tsx`, `top-bar.tsx`, `sidebar.tsx`, `bottom-nav.tsx`, `feed-card.tsx`, `favorites/page.tsx`, `profile/me/page.tsx`

`--color-accent-rose` is deleted. Any Tailwind class using `accent-rose` will generate no CSS, silently breaking the gradient (renders as flat `from-primary` with no endpoint).

- [ ] **Step 1: Confirm all accent-rose occurrences**

```bash
grep -rn "accent-rose" components/ app/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Expected — 8 matches (after Task 1 removed it from globals.css):
```
components/ui/button.tsx:17
components/layout/top-bar.tsx:70
components/layout/sidebar.tsx:127
components/layout/bottom-nav.tsx:37
components/layout/bottom-nav.tsx:48
components/home/feed-card.tsx:277
app/dashboard/favorites/page.tsx:87
app/profile/me/page.tsx:38
```

- [ ] **Step 2: Fix `components/ui/button.tsx` line 17**

Before:
```
gradient: "bg-gradient-to-br from-primary to-accent-rose text-white hover:opacity-90 shadow-sm hover:scale-[1.02] transition-transform",
```

After:
```
gradient: "bg-gradient-to-br from-primary to-accent-warm text-white hover:opacity-90 shadow-sm hover:scale-[1.02] transition-transform",
```

- [ ] **Step 3: Fix `components/layout/top-bar.tsx` line ~70**

Find: `from-primary to-accent-rose` (the authenticated user avatar circle)

Replace `to-accent-rose` with `to-accent-warm`.

- [ ] **Step 4: Fix `components/layout/sidebar.tsx` line ~127**

Find: `from-primary/20 to-accent-rose/20` (the user card avatar initials circle)

Replace `to-accent-rose/20` with `to-accent-warm/20`.

- [ ] **Step 5: Fix `components/layout/bottom-nav.tsx` lines ~37 and ~48**

There are 2 occurrences — the center FAB button (authenticated version and guest version). Find both `from-primary to-accent-rose` and replace `to-accent-rose` with `to-accent-warm` in both.

- [ ] **Step 6: Fix `components/home/feed-card.tsx` line ~277**

Find: `from-primary to-accent-rose` (the inline booking CTA button inside the expanded feed card)

Replace `to-accent-rose` with `to-accent-warm`.

- [ ] **Step 7: Fix `app/dashboard/favorites/page.tsx` line ~87**

Find: `from-primary to-accent-rose` (the icon avatar on the favorites page)

Replace `to-accent-rose` with `to-accent-warm`.

- [ ] **Step 8: Fix `app/profile/me/page.tsx` line ~38**

Find: `from-primary to-accent-rose` (the profile avatar when no photo is set)

Replace `to-accent-rose` with `to-accent-warm`.

- [ ] **Step 9: Confirm all accent-rose occurrences are gone**

```bash
grep -rn "accent-rose" components/ app/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Expected: **no output**.

- [ ] **Step 10: Commit**

```bash
git add components/ui/button.tsx \
        components/layout/top-bar.tsx \
        components/layout/sidebar.tsx \
        components/layout/bottom-nav.tsx \
        components/home/feed-card.tsx \
        app/dashboard/favorites/page.tsx \
        app/profile/me/page.tsx
git commit -m "fix: replace accent-rose gradient endpoint with accent-warm across all components"
```

---

## Task 3: Fix all `hover:bg-accent` and `bg-accent` references (now mint green)

**Files:** `button.tsx`, `top-bar.tsx`, `sidebar.tsx`, `dialog.tsx`, `filter-modal.tsx`, `create-salon-modal.tsx`, `ClosedDatesCard.tsx`, `HoursCard.tsx`, `PostsCard.tsx`, `FavoriteButton.tsx`, `PostModal.tsx`, `portfolio-vibe-widget.tsx`

Under the new palette `--color-accent` is `#8BBCB5` teal-mint. Per spec, mint is for taxonomy chips/badges only. Every hover state and background on non-chip UI elements must use `primary-subtle` (warm peach tint) instead.

- [ ] **Step 1: Confirm all occurrences**

```bash
grep -rn "hover:bg-accent\|data-\[state=open\]:bg-accent\| bg-accent " \
  components/ app/ --include="*.tsx" --include="*.ts"
```

Expected — 15+ matches across 12 files. Verify the file list matches the File Map above.

- [ ] **Step 2: Fix `components/ui/button.tsx` lines 19 and 21**

Line 19 (`outline` variant), before:
```
outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
```
After:
```
outline: "border border-border bg-transparent hover:bg-primary-subtle",
```

Line 21 (`ghost` variant), before:
```
ghost: "hover:bg-accent hover:text-accent-foreground",
```
After:
```
ghost: "hover:bg-primary-subtle",
```

- [ ] **Step 3: Fix `components/layout/top-bar.tsx` lines ~47 and ~57**

Two icon buttons (mobile search button and messages icon button). In each, replace:
```
hover:bg-accent
```
With:
```
hover:bg-primary-subtle
```
(2 replacements total in this file)

- [ ] **Step 4: Fix `components/layout/sidebar.tsx` line ~85**

The inactive nav link className string. Replace:
```
hover:bg-accent hover:text-foreground
```
With:
```
hover:bg-primary-subtle hover:text-foreground
```

- [ ] **Step 5: Fix `components/ui/dialog.tsx` line ~47**

The close button. Replace:
```
data-[state=open]:bg-accent data-[state=open]:text-muted-foreground
```
With:
```
data-[state=open]:bg-primary-subtle data-[state=open]:text-muted-foreground
```

- [ ] **Step 6: Fix `components/layout/filter-modal.tsx` line ~267**

The unselected filter chip hover. Replace:
```
"hover:bg-accent"
```
With:
```
"hover:bg-primary-subtle"
```

- [ ] **Step 7: Fix `components/salons/create-salon-modal.tsx` lines ~177 and ~201**

Two upload drop zone labels. In each, replace:
```
hover:bg-accent
```
With:
```
hover:bg-primary-subtle
```
(2 replacements total)

- [ ] **Step 8: Fix `components/salon/cards/ClosedDatesCard.tsx` line ~30**

Icon button. Replace:
```
hover:bg-accent hover:text-primary
```
With:
```
hover:bg-primary-subtle hover:text-primary
```

- [ ] **Step 9: Fix `components/salon/cards/HoursCard.tsx` line ~28**

Icon button. Replace:
```
hover:bg-accent hover:text-primary
```
With:
```
hover:bg-primary-subtle hover:text-primary
```

- [ ] **Step 10: Fix `components/salon/cards/PostsCard.tsx` line ~39**

Post list row hover. Replace:
```
hover:bg-accent/50
```
With:
```
hover:bg-primary-subtle
```

- [ ] **Step 11: Fix `components/salon/FavoriteButton.tsx` line ~85**

The favorited state className. Replace:
```
isFavorite ? "text-primary bg-accent hover:bg-primary/10 hover:text-primary"
```
With:
```
isFavorite ? "text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary"
```

(`bg-accent` = mint background on favorited state → changed to a light peach tint `bg-primary/10`; hover becomes slightly stronger peach `bg-primary/20`)

- [ ] **Step 12: Fix `components/salon/modals/PostModal.tsx` line ~164**

Upload area label. Replace:
```
hover:bg-accent hover:border-primary/20
```
With:
```
hover:bg-primary-subtle hover:border-primary/20
```

- [ ] **Step 13: Fix `components/dashboard/portfolio-vibe-widget.tsx` line ~40**

Add-image button. Replace:
```
hover:bg-accent
```
With:
```
hover:bg-primary-subtle
```

- [ ] **Step 14: Fix `components/ui/command.tsx` line ~120**

The shadcn Command primitive item selected state. Replace:
```
data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground
```
With:
```
data-[selected='true']:bg-primary-subtle data-[selected=true]:text-foreground
```

- [ ] **Step 15: Fix `components/ui/select.tsx` line ~121**

The shadcn Select primitive item focus state. Replace:
```
focus:bg-accent focus:text-accent-foreground
```
With:
```
focus:bg-primary-subtle focus:text-foreground
```

- [ ] **Step 16: Confirm all stale hover/focus/data-state accent uses are gone**

```bash
grep -rn "hover:bg-accent\|focus:bg-accent\|data-\[state=open\]:bg-accent\|data-\[selected" \
  components/ app/ --include="*.tsx" --include="*.ts" | grep "bg-accent"
```

Expected: **no output**. If any lines remain, fix them before committing.

- [ ] **Step 17: Commit**

```bash
git add \
  components/ui/button.tsx \
  components/ui/command.tsx \
  components/ui/dialog.tsx \
  components/ui/select.tsx \
  components/layout/top-bar.tsx \
  components/layout/sidebar.tsx \
  components/layout/filter-modal.tsx \
  components/salons/create-salon-modal.tsx \
  components/salon/cards/ClosedDatesCard.tsx \
  components/salon/cards/HoursCard.tsx \
  components/salon/cards/PostsCard.tsx \
  components/salon/FavoriteButton.tsx \
  components/salon/modals/PostModal.tsx \
  components/dashboard/portfolio-vibe-widget.tsx
git commit -m "fix: replace hover:bg-accent and focus:bg-accent with primary-subtle across all components"
```

---

## Task 4: Fix remaining non-chip `bg-accent` occurrences

**Files:** `app/dashboard/salons/page.tsx`, `app/dashboard/messages/page.tsx`, `app/profile/me/page.tsx`, `components/wizard/SalonWizard.tsx`, `components/layout/active-salon-indicator.tsx`, `components/dashboard/kpi-cards.tsx`

**Important context:** Many files contain `bg-accent` on category chips, badges, and status pills — these are **intentional and must NOT be changed** (mint is the correct color for taxonomy chips per spec). The following files use `bg-accent` on non-chip UI elements (empty state icons, avatar circles, info boxes, icon containers) where warm peach is correct instead.

The following files/uses are intentional chips — **do not touch**:
- `components/home/provider-card.tsx:61` — category chip
- `components/profile/profile-hero.tsx:81` — specialty chips
- `components/dashboard/provider-dashboard.tsx:175` — category tags
- `components/salon/cards/BasicInfoCard.tsx:56` — category tags
- `components/dashboard/timeline-schedule.tsx:37` — "ONGOING" status badge
- `app/profile/[id]/page.tsx:206` — tag pill
- `components/admin/CategoryModal.tsx:140` — selected category chip state
- `app/dashboard/messages/page.tsx:342` — message category badge span

- [ ] **Step 1: Fix `app/dashboard/salons/page.tsx` line ~64**

Empty state icon container. Replace:
```
bg-accent rounded-2xl
```
With:
```
bg-primary/10 rounded-2xl
```

- [ ] **Step 2: Fix `app/dashboard/messages/page.tsx` — 3 occurrences**

**Line ~187** — large empty state avatar circle:
```
bg-accent rounded-full h-16 w-16
```
→ `bg-primary/10 rounded-full h-16 w-16`

**Line ~211** — button-like "new message" element:
```
bg-accent hover:bg-primary/10
```
→ `bg-primary/10 hover:bg-primary/20`

**Line ~245** — active thread background highlight:
```
bg-accent/50
```
→ `bg-primary-subtle`

- [ ] **Step 3: Fix `app/profile/me/page.tsx` line ~81**

Empty state icon container (the "add photo" or "no content" state — separate from the profile avatar on line 38 which was fixed in Task 2). Replace:
```
bg-accent flex items-center justify-center mb-4
```
With:
```
bg-primary/10 flex items-center justify-center mb-4
```

- [ ] **Step 4: Fix `components/wizard/SalonWizard.tsx` line ~695**

Informational banner/box. Replace:
```
p-4 bg-accent rounded-xl flex items-center gap-4
```
With:
```
p-4 bg-primary/10 rounded-xl flex items-center gap-4
```

- [ ] **Step 5: Fix `components/layout/active-salon-indicator.tsx` line ~40**

Icon container for the active salon indicator. Replace:
```
bg-accent flex items-center justify-center text-primary shadow-inner
```
With:
```
bg-primary/10 flex items-center justify-center text-primary shadow-inner
```

- [ ] **Step 6: Fix `components/dashboard/kpi-cards.tsx` lines ~12, ~32, ~52**

Three KPI card icon containers (each follows the same pattern). For each line, replace:
```
bg-accent text-primary
```
With:
```
bg-primary/10 text-primary
```
(3 replacements in this file)

- [ ] **Step 7: Fix `app/dashboard/favorites/page.tsx` line ~69**

Empty state avatar circle (different from line ~87 which was fixed in Task 2). Replace:
```
bg-accent w-20 h-20 rounded-full
```
With:
```
bg-primary/10 w-20 h-20 rounded-full
```

- [ ] **Step 8: Fix `components/admin/CategoryManager.tsx` line ~106**

Active category icon container. Replace:
```
category.isActive ? "bg-accent text-primary"
```
With:
```
category.isActive ? "bg-primary/10 text-primary"
```

- [ ] **Step 9: Fix `components/dashboard/portfolio-vibe-widget.tsx` line ~43**

Uploaded image placeholder button (static, different from the hover-only line ~40 fixed in Task 3). Replace:
```
bg-accent/50 hover:bg-primary/10
```
With:
```
bg-primary/10 hover:bg-primary/20
```

- [ ] **Step 10: Fix `components/layout/sidebar.tsx` line ~126**

User card container in the sidebar (different from line ~85 and ~127 fixed earlier). Replace:
```
rounded-xl bg-accent/50
```
With:
```
rounded-xl bg-secondary
```

- [ ] **Step 11: Fix `components/salon/message-modal.tsx` line ~73**

Empty state avatar circle. Replace:
```
bg-accent rounded-full h-16 w-16
```
With:
```
bg-primary/10 rounded-full h-16 w-16
```

- [ ] **Step 12: Fix `components/salon/modals/PostModal.tsx` line ~185**

Selected media type tab (different from the upload area hover on line ~164 fixed in Task 3). Replace:
```
"bg-accent border-primary/20 text-primary shadow-sm"
```
With:
```
"bg-primary/10 border-primary/20 text-primary shadow-sm"
```

- [ ] **Step 13: Fix `components/wizard/WizardStep.tsx` line ~34**

Info box component. Replace:
```
bg-accent rounded-xl p-4 border border-primary/10
```
With:
```
bg-primary/10 rounded-xl p-4 border border-primary/20
```

- [ ] **Step 14: Confirm all non-chip bg-accent uses are fixed**

Run the targeted verification — this checks only hover states and non-chip statics that should never be mint:
```bash
grep -rn "hover:bg-accent\|focus:bg-accent\|data-\[state=open\]:bg-accent\|accent-rose" \
  components/ app/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Expected: **no output**.

Note: plain `bg-accent` (without hover/focus) will still appear in the intentional chip files listed above — that is correct.

- [ ] **Step 15: Commit**

```bash
git add \
  app/dashboard/salons/page.tsx \
  app/dashboard/favorites/page.tsx \
  app/dashboard/messages/page.tsx \
  app/profile/me/page.tsx \
  components/admin/CategoryManager.tsx \
  components/dashboard/portfolio-vibe-widget.tsx \
  components/layout/sidebar.tsx \
  components/wizard/SalonWizard.tsx \
  components/wizard/WizardStep.tsx \
  components/layout/active-salon-indicator.tsx \
  components/dashboard/kpi-cards.tsx \
  components/salon/message-modal.tsx \
  components/salon/modals/PostModal.tsx
git commit -m "fix: replace non-chip bg-accent uses with primary/10 for Warm Peach palette"
```

---

## Task 5: Build verification and visual spot-check

No file changes — verification only.

- [ ] **Step 1: Run the TypeScript build**

```bash
npm run build
```

Expected: build completes with no errors.

If TypeScript errors appear, search for any remaining deleted token references:
```bash
grep -rn "accent-rose\|accent-coral\|accent-peony" app/ components/ --include="*.tsx" --include="*.ts" --include="*.css"
```

- [ ] **Step 2: Start the dev server**

```bash
npm run dev
```

Open `http://localhost:3000` (or whichever port Next.js assigns — check terminal output).

- [ ] **Step 3: Visual verification checklist**

| Page / element | What to check |
|---|---|
| Feed page | Warm cream background (`#FAF4F0`), no purple visible |
| "Foglalj" / "Belépés" buttons | Orange-peach (`#C87860`), not violet |
| Category chips | Teal-mint (`#8BBCB5`) — only these elements are mint |
| TopBar | Warm translucent glass background, Georgia serif logo |
| Sidebar | Warm glass, active icon highlighted peach (not mint) |
| BottomNav center button | Peach-to-warm gradient circle, no violet |
| Provider profile page | No purple/violet anywhere |
| Auth modal | Background, buttons, inputs are warm palette |
| FavoriteButton (favorited) | Light peach tint background, not mint |
| Button hover states | `outline`/`ghost` hover is a soft peach tint, not mint |

- [ ] **Step 4: Check dark mode**

Toggle dark mode (sun/moon icon in TopBar).

Expected: warm dark brown background (`#1C1410`), not dark purple. Primary buttons are lighter peach (`#D48A72`).

- [ ] **Step 5: Push**

```bash
git push
```
