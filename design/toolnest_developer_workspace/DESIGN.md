---
name: Toolnest Developer Workspace
colors:
  surface: '#121318'
  surface-dim: '#121318'
  surface-bright: '#38393f'
  surface-container-lowest: '#0d0e13'
  surface-container-low: '#1a1b20'
  surface-container: '#1e1f25'
  surface-container-high: '#292a2f'
  surface-container-highest: '#34343a'
  on-surface: '#e3e1e9'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#e3e1e9'
  inverse-on-surface: '#2f3036'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1d00a5'
  primary-container: '#635bff'
  on-primary-container: '#fefaff'
  inverse-primary: '#4c42e9'
  secondary: '#c3c1ff'
  on-secondary: '#1c00a6'
  secondary-container: '#3527ce'
  on-secondary-container: '#b2b1ff'
  tertiary: '#ffb68f'
  on-tertiary: '#542100'
  tertiary-container: '#be5400'
  on-tertiary-container: '#fffaf9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#321ed2'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c1ff'
  on-secondary-fixed: '#0e006a'
  on-secondary-fixed-variant: '#3223cc'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb68f'
  on-tertiary-fixed: '#331100'
  on-tertiary-fixed-variant: '#773200'
  background: '#121318'
  on-background: '#e3e1e9'
  surface-variant: '#34343a'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  kbd:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system expresses a high-velocity, precision-engineered developer aesthetic inspired by modern keyboard-first workflows. It prioritizes zero visual friction, operational transparency, and instant cognitive mapping. The visual character balances utilitarian restraint with exacting polish, emphasizing privacy-first offline operation where every byte remains purely client-side.

### Aesthetic Principles

- **Functional Density:** Information-dense arrangements balanced with disciplined 4px/8px micro-increments. Interfaces favor keyboard accelerators, clear visual hierarchy, and instant scannability.
- **Structural Clarity:** Separation via subtle 1px structural borders rather than heavy chromatic shifts or aggressive elevations.
- **Engineering Polish:** Crisp monospace accents, low-latency micro-interactions, deliberate focus rings, and predictable component affordances across split panes and command surfaces.

## Colors

The palette leverages deep neutral slate and zinc tones punctuated by an authoritative indigo-violet accent. The default mode is dark to cater to prolonged developer focus sessions, paired with a fully matched light mode counterpart.

### Mode Tiers

#### Dark Mode (Default)

- **Canvas / Background:** `#101116`
- **Default Surface:** `#181A22`
- **Elevated / Hover Surface:** `#20232D`
- **Subtle Borders & Separators:** `#303440`
- **High-Contrast Text:** `#F4F5F7`
- **Muted / Secondary Text:** `#A1A6B5`
- **Faint / Disabled Text:** `#62677B`

#### Light Mode

- **Canvas / Background:** `#F8F9FC`
- **Default Surface:** `#FFFFFF`
- **Elevated / Hover Surface:** `#F1F3F9`
- **Subtle Borders & Separators:** `#E5E7EB`
- **High-Contrast Text:** `#171923`
- **Muted / Secondary Text:** `#667085`
- **Faint / Disabled Text:** `#9CA3AF`

### Semantic Category Tokens

- **Developer / Core:** `#635BFF` (Indigo)
- **Encoders & Decoders:** `#0EA5E9` (Cyan)
- **Security & Cryptography:** `#10B981` (Emerald)
- **Design & Assets:** `#EC4899` (Pink)
- **Text & Markdown:** `#F59E0B` (Amber)
- **Date & Time:** `#8B5CF6` (Violet)
- **Data & Files:** `#14B8A6` (Teal)
- **Offline / Local Badge:** `#10B981` surface tint with `#059669` outline

Interactive states apply `#635BFF` for focus indicators, selection badges, and active tab borders.

## Typography

The type hierarchy pairs **Inter** for all prose, navigational labels, and tool definitions with **JetBrains Mono** for payload views, hex dumps, encoded strings, and keyboard shortcut tokens.

- Maintain strict vertical rhythm by standardizing input lines and editor viewports to multiples of 4px.
- Use tabular numbers (`font-variant-numeric: tabular-nums`) across table views, line counters, file size indicators, and benchmark runtimes.
- Monospace content inside split editors must strictly scale down without truncation, wrapping on word boundaries when split-mode width falls below `480px`.

## Layout & Spacing

The workspace uses a composite layout model: a fixed collapsible navigation rail (240px desktop, collapsed to 60px icons, hidden on mobile off-canvas), combined with a fluid dynamic workbench area.

### Grid & Breakpoints

- **Desktop (≥ 1280px):** Multi-column workbench allowing dual split-pane code editors side-by-side (50/50 or configurable ratio), tool parameters drawer, and 24px margins.
- **Tablet (768px – 1279px):** 16px margins, fluid grid dropping secondary drawers into overlays or vertically stacked split-panes.
- **Mobile (< 768px):** Single-column stacked layout, full-width tool cards, tab-based swapping between input and output panes instead of horizontal splits.

### Density & Rhythms

- Spacing strictly follows an 8px grid foundation with 4px sub-increments (`space-xs: 4px`, `space-sm: 8px`, `space-md: 12px`, `space-lg: 20px`, `space-xl: 32px`).
- Split-pane separators reserve an active hover zone of 8px with a visible central hairline of 1px.

## Elevation & Depth

Visual separation relies on crisp 1px borders complemented by low-opacity, controlled surface offsets rather than multi-layered ambient blurs.

### Surface Hierarchy

1. **Canvas Base (Level 0):** `#101116` (Dark) / `#F8F9FC` (Light). Used for outer application canvas and gutter regions.
2. **Surface Panels (Level 1):** `#181A22` (Dark) / `#FFFFFF` (Light) framed by a 1px solid `#303440` (Dark) or `#E5E7EB` (Light) border. Used for tool panels, sidebar items, and split editor canvases.
3. **Elevated & Hover (Level 2):** `#20232D` (Dark) / `#F1F3F9` (Light). Used for hovered tool cards, floating toolbars, dropdown popovers, and segmented controls.
4. **Overlay / Modal (Level 3 - Command Palette):** `#181A22` with a 1px border and a focused drop shadow: `0px 16px 40px rgba(0, 0, 0, 0.45), 0px 0px 0px 1px rgba(99, 91, 255, 0.2)`.

No heavy diffusion shadows on static elements; depth remains tactile and restrained.

## Shapes

The design system maintains a balanced geometry calibrated between 8px and 14px to retain an efficient workspace feel without sharp industrial corners.

- **Micro Elements (Tags, Badges, Kbd keys):** 4px to 6px corner radius.
- **Form Controls & Buttons:** 8px (`rounded-md` / level 2 base).
- **Cards, Command Palette, Panels:** 12px to 14px (`rounded-lg`).
- **Pill Badges:** Continuous curves reserved strictly for state indicators (e.g., "Offline", "Copied", semantic category pills).

## Components

### Buttons & Key Indicators

- **Primary:** Solid `#635BFF` background, `#FFFFFF` text, 8px border radius, 0 1px 2px rgba(0, 0, 0, 0.2) shadow. Active state scales down to `0.98`.
- **Secondary / Ghost:** Transparent base, 1px solid border (`#303440` in dark, `#E5E7EB` in light), background shifts to elevated tier on hover.
- **Kbd (Keyboard Shortcut Component):** JetBrains Mono font, 11px, inline padding of 4px 6px, subtle 1px border with a slightly darker inset shadow simulating a keycap.

### Command Palette

- Centered overlay (max-width: 640px) positioned at 15% from the top viewport.
- 1px border with high-contrast active input field, real-time fuzzy-search results, instant categorization, and right-aligned shortcut chips.

### Split-Pane Code Editors

- Dual input/output zones divided by a draggable 1px rule.
- Fixed header per pane containing: language badge, character/byte counters, 'Clear' action, 'Copy' feedback button, and formatting controls.
- Integrated line numbers utilizing `code-sm` JetBrains Mono in muted secondary text.

### Tool Cards

- 12px rounded container with 1px border.
- Structure: Leading category icon inside an elevated container, title in `headline-sm`, two-line description in `body-sm`, and trailing arrow or shortcut badge.
- Hover state: Background elevates to Level 2 (`#20232D` in dark), border transitions to `#635BFF` with a smooth 150ms ease.

### Privacy & Environment Badges

- Persistent local-only indicator ("Your data stays in your browser"): Subdued badge utilizing emerald green dot (`#10B981`) with 12px label text, verifying client-side isolation without external network transmission.

### Form Inputs & Selectors

- Background matches elevated surface tier with 1px solid borders.
- Focused state applies an unambiguous `#635BFF` border with a 2px outer ring at `rgba(99, 91, 255, 0.25)`.
