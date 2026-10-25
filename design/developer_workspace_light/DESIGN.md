---
name: Developer Workspace Light
colors:
  surface: '#f9f9ff'
  surface-dim: '#d9d9e1'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fa'
  surface-container: '#ededf5'
  surface-container-high: '#e8e7ef'
  surface-container-highest: '#e2e2e9'
  on-surface: '#1a1b21'
  on-surface-variant: '#464555'
  inverse-surface: '#2e3036'
  inverse-on-surface: '#f0f0f7'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4c42e9'
  primary: '#493ee5'
  on-primary: '#ffffff'
  primary-container: '#635bff'
  on-primary-container: '#fefaff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#815100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffaf9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#321ed2'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f9f9ff'
  on-background: '#1a1b21'
  surface-variant: '#e2e2e9'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.01em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
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
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.25rem
  margin: 1rem
  margin-desktop: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

This design system targets software engineers, technical leads, and systems architects who demand an ultra-responsive, ergonomic, and distraction-free developer workbench. Merging the keyboard-first utility of Raycast, the structural rhythm of Linear, and the neutral clarity of GitHub, the interface establishes a high-density, low-friction environment.

### Design Principles

- **Utilitarian Elegance**: Visuals exist strictly to organize logic and data. Superfluous chrome is eliminated in favor of subtle boundaries and razor-sharp typographic hierarchy.
- **Micro-Precision**: Every icon, hairline border, keyboard shortcut badge, and monospaced metric aligns strictly to an uncompromising grid.
- **Engineered Restraint**: Calm, daylight-neutral surfaces prevent eye strain during extended development sessions, allowing high-contrast code snippets and contextual syntax tokens to take immediate precedence.
- **Tactile Feedback**: Hover and focus states mimic the responsiveness of native operating system primitives—immediate, crisp, and predictable.

## Colors

The palette is engineered for pure clarity under daylight conditions. It relies on a layered white-to-slate neutral scale paired with a precise indigo accent and purposeful semantic signals.

### Surface Hierarchy & Canvas

- **Base Canvas (`#F8F9FC`)**: The ambient workspace background underlying all floating modules and panels.
- **Surface Primary (`#FFFFFF`)**: High-focus interactive zones, command palettes, main workbench cards, and active editors.
- **Surface Secondary / Recessed (`#F0F2F7`)**: Sidebars, toolbars, inactive tabs, gutter counters, and grouped property containers.
- **Surface Code (`#F1F3F9`)**: Dedicated code blocks, JSON viewers, regex inspectors, and terminal panels.
- **Border Default (`#E2E4EB`)**: Standard 1px boundary across cards, inputs, and split views.
- **Border Subtle (`#ECEEF4`)**: Inner dividers, table row hairlines, and nested list separators.

### Typography & Content Tokens

- **Text Primary (`#111318`)**: Primary headlines, values, active tabs, and dominant code text.
- **Text Secondary / Muted (`#64748B`)**: Field labels, metadata, keybindings, placeholder tokens, and timestamps.
- **Text Inverse (`#FFFFFF`)**: Content resting on accent fills.

### Accents & Semantics

- **Brand Accent (`#635BFF`)**: Key actions, active indicator bars, focused focus rings, and selection highlights.
- **Success (`#10B981`)**: Passing tests, healthy build states, synced repositories, and git additions.
- **Warning (`#F59E0B`)**: Deprecations, rate-limit warnings, uncommitted changes, and memory alerts.
- **Error (`#EF4444`)**: Syntax exceptions, broken pipelines, merge conflicts, and git deletions.

## Typography

The type scale combines **Inter** for all prose, structural headings, inputs, and UI navigation with **JetBrains Mono** for all code blocks, diffs, metrics, hash signatures, and keyboard shortcuts.

- **Legibility at Scale**: Inter provides crisp hinting and neutral letterforms that keep dense multi-pane interfaces organized without visual fatigue.
- **Monospace Alignment**: JetBrains Mono enforces strict horizontal and vertical tabular alignment across line numbers, stack traces, and hex values.
- **Tracking Discipline**: Negative tracking is applied solely to large headlines (`-0.025em`) to tighten display presence, while small technical labels and shortcuts receive slight positive tracking (`+0.02em`) to guarantee legibility at small point sizes.

## Layout & Spacing

This design system uses a flexible 12-column layout coupled with multi-pane dock architectures typical of native IDEs and developer utilities.

### Layout Mechanics

- **Desktop (>= 1200px)**: Multi-panel split views (fixed 240px navigation sidebar, fluid main editor / inspector pane, optional 320px contextual panel). Outer margins: `1.5rem` (`margin-desktop`), grid gutters: `1.25rem` (`gutter-desktop`).
- **Tablet (768px – 1199px)**: Left navigation collapses to an icon bar (56px) or overlay rail. Primary workspaces adopt stacked 2-column or full-width tabbed cards. Outer margins: `1rem` (`margin`), grid gutters: `1rem` (`gutter`).
- **Mobile (< 768px)**: Single column reflow. Horizontal tabs convert to scrollable selector strips or segmented controls. Sidebars convert into modal bottom-sheets. Margins: `1rem`.

### Spatial Rhythm

- **Micro-gaps (`space-xs` = 4px, `space-sm` = 8px)**: Applied to toolbar button groupings, tag clusters, and badge interiors.
- **Component Padding (`space-md` = 12px, `space-lg` = 16px)**: Applied inside list items, input fields, code containers, and modal dialogs.
- **Structural Separation (`space-xl` = 24px, `space-2xl` = 32px)**: Used between distinct workspace widgets, summary dashboard sections, and major tool modules.

## Elevation & Depth

Visual hierarchy uses a refined hybrid approach: **subtle, low-contrast hairline borders** establish structure, while **delicate ambient drop shadows** elevate floating command panels and dropdown menus above the baseline grid.

### Layering Levels

1. **Level 0 (Flat / Canvas)**: Background `#F8F9FC`. No border, no shadow.
2. **Level 1 (Docked Containers & Tool Panels)**: `#FFFFFF` surface with a continuous 1px `#E2E4EB` border. Shadows are intentionally omitted to maintain clean alignment and preserve screen real estate.
3. **Level 2 (Interactive Floating Surfaces / Cards)**: `#FFFFFF` surface, 1px `#E2E4EB` border, paired with an ambient shadow: `box-shadow: 0 1px 3px rgba(17, 19, 24, 0.04), 0 4px 12px rgba(17, 19, 24, 0.02)`.
4. **Level 3 (Command Palette, Popovers, & Dropdowns)**: `#FFFFFF` surface, 1px `#E2E4EB` border, elevated by a deeper shadow: `box-shadow: 0 4px 16px rgba(17, 19, 24, 0.08), 0 12px 32px rgba(17, 19, 24, 0.04)`.
5. **Backdrop Veil**: Heavy blurs are avoided. Modal backdrops utilize `rgba(17, 19, 24, 0.24)` with a minimal `backdrop-filter: blur(2px)` to maintain context while focusing user attention.

## Shapes

The geometric framework balances human software design with technical discipline using medium roundedness:

- **Base Roundness (0.5rem / 8px)**: Standard controls, buttons, text fields, chips, command palette rows, and code preview insets.
- **Large Roundness (`rounded-lg`, 1rem / 16px)**: Canvas cards, split-screen panels, workspace viewports, and modal dialogs.
- **Extra Large Roundness (`rounded-xl`, 1.5rem / 24px)**: Outer sheet panels and command overlays.
- **Pill (Fully Rounded)**: Reserved strictly for status badges (e.g., `Active`, `Synced`, `Beta`) and keyboard indicator tokens (`⌘K`).

## Components

### Buttons

- **Primary**: Background `#635BFF`, label `#FFFFFF`, height 36px, radius 8px (`0.5rem`). Hover: `#534AE6`. Active: `#453DC9`. Focus ring: 2px offset with `rgba(99, 91, 255, 0.3)`.
- **Secondary / Subtle**: Background `#FFFFFF`, border 1px solid `#E2E4EB`, text `#111318`. Hover: Background `#F0F2F7`, border `#D4D7E2`.
- **Ghost**: Background transparent, text `#64748B`. Hover: Background `#F0F2F7`, text `#111318`.
- **Destructive**: Background `#FFFFFF`, border 1px solid `#FCA5A5`, text `#EF4444`. Hover: Background `#FEF2F2`.

### Inputs & Search Bars

- **Height & Style**: 36px height (or 44px for the global command palette). Background `#FFFFFF`, border 1px solid `#E2E4EB`, text `#111318`, font `Inter 13px`.
- **Focus**: Border `#635BFF`, box-shadow `0 0 0 3px rgba(99, 91, 255, 0.15)`.
- **Keybinding Cue**: Right-aligned monospace badge (`JetBrains Mono`, 11px) with background `#F0F2F7`, border `#E2E4EB`, text `#64748B`.

### Command Palette (Raycast-Style)

- **Container**: Max width 640px, elevated surface with Level 3 elevation, radius 12px, border 1px solid `#E2E4EB`.
- **Item Row**: 40px height, radius 6px, padding horizontal 12px. Active/hovered item receives background `#F0F2F7` with primary accent icon `#635BFF`.
- **Breadcrumbs & Footers**: Footer bar colored in `#F8F9FC` with border-top 1px `#E2E4EB`, displaying keyboard shortcuts (`Enter` to select, `Esc` to close, `⌘P` for actions).

### Code Blocks & Insets

- **Container**: Background `#F1F3F9`, border 1px solid `#E2E4EB`, radius 8px. Font `JetBrains Mono 12px`.
- **Syntax Tokens**:
  - Keywords / Declarations: `#7C3AED` (Purple)
  - Strings / Values: `#059669` (Emerald)
  - Functions / Methods: `#0284C7` (Cyan)
  - Numbers / Constants: `#D97706` (Amber)
  - Comments: `#94A3B8` (Muted Slate Italic)

### Chips & Badges

- **Status Badges**: Fully rounded pills, height 22px, padding 0 8px, font `JetBrains Mono 11px font-weight 500`.
  - Neutral: Background `#F0F2F7`, text `#64748B`, border 1px solid `#E2E4EB`.
  - Success: Background `#ECFDF5`, text `#059669`, border 1px solid `#A7F3D0`.
  - Warning: Background `#FFFBEB`, text `#D97706`, border 1px solid `#FDE68A`.
  - Error: Background `#FEF2F2`, text `#DC2626`, border 1px solid `#FECACA`.

### Cards & Panels

- **Container**: Background `#FFFFFF`, border 1px solid `#E2E4EB`, radius 8px or 12px.
- **Card Header**: Border-bottom 1px solid `#ECEEF4`, height 44px, padding 0 16px, displaying action icons and section status.

### Checkboxes & Toggle Controls

- **Checkbox**: 16x16px, radius 4px, border 1.5px solid `#E2E4EB`. Checked state fills `#635BFF` with a white checkmark.
- **Switch / Toggle**: 36x20px capsule, track `#E2E4EB`, thumb `#FFFFFF` (16px). Active track transitions to `#635BFF`.
