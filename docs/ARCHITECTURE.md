# Toolnest Architecture

Toolnest is designed as an ultra-fast, offline-capable developer toolbox deployed as a static Single Page Application (SPA).

## Core Principles

1. **Local-First & Client-Only Execution**:
   - Every tool runs 100% inside the browser runtime.
   - Zero telemetry, analytics, cookies, or remote compute servers.
   - Uses native browser APIs (`Web Crypto API`, `Canvas API`, `TextEncoder`, `Intl`).

2. **Feature-Oriented Layering**:
   - `src/tools/<tool-name>`: Houses self-contained tool components and pure domain functions.
   - `src/registry`: Canonical metadata definitions (categories, tools, search keywords).
   - `src/lib`: Common browser helpers (clipboard, download, validation, storage).
   - `src/components`: Atomic UI components, shared tool shells, layouts.
   - `src/features`: Cross-cutting features (command palette, theme provider, search).

3. **Strict Domain Separation**:
   - Tool domain logic (e.g. `formatJson`, `convertColor`, `diffText`) must be pure TypeScript functions with zero React dependency.
   - Pure domain logic allows high-performance execution, zero mock requirements in unit tests, and seamless refactoring.

4. **Lazy-Loaded Route Architecture**:
   - Tool pages are loaded asynchronously using `React.lazy()`.
   - The initial bundle contains only the application shell and registry index.

5. **Design System & Semantic Tokens**:
   - Built on Tailwind CSS and CSS custom properties (`tokens.css`).
   - Seamlessly supports `system`, `light`, and `dark` themes.
