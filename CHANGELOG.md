# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.8.0] - 2026-11-10

### Added

- **50 Tools Major Milestone**: Toolnest now includes 50 privacy-preserving, client-side tools across 12 canonical categories.
- **SVG Pattern & Background Generator (`svg-patterns`)**:
  - Repeatable SVG pattern designer supporting Polka Dots, Grid, Isometric 3D, Chevron / Herringbone, Diagonals, Hexagons, and Circuit PCB.
  - Granular pattern controls for scale, stroke width, opacity, foreground color, and background color with transparency toggle.
  - Interactive live repeating canvas with UI mockup overlay card toggle.
  - Export to CSS `background-image`, pure SVG code, SVG Data URIs, and Tailwind CSS arbitrary classes.
  - 13 unit and component tests passing.
- **JWT Studio & Signature Debugger (`jwt-studio`)**:
  - Interactive JSON Web Token studio for creating, signing, and debugging JWTs.
  - Algorithms supported: `HS256`, `HS384`, `HS512`, and `none` using Web Crypto Subtle API.
  - Header and Payload JSON editors with quick expiry helpers (+15m, +1h, +24h, +7d).
  - 3-part color-coded token breakdown (Header in red, Payload in purple, Signature in cyan) with copy buttons.
  - Real-time cryptographic signature verification and expiration status detection.
  - 12 unit and component tests passing.
- **Security Headers & CSP Builder (`security-headers`)**:
  - Interactive configuration studio for modern HTTP security headers: Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, and X-Content-Type-Options.
  - Automated security audit scoring (A+, A, B, C, F) with warnings for insecure directives (such as `'unsafe-inline'` and `'unsafe-eval'`).
  - One-click configuration export for Nginx, Apache `.htaccess`, Netlify `_headers`, Cloudflare Workers, and raw HTTP response headers.
  - 11 unit and component tests passing.
- **UI & Discoverability Enhancements**:
  - Quick Feature Filter Pills on `AllToolsPage` allowing one-click filtering by "All Tools (50)", "⚡ Offline Ready", and "✨ New in v2.8".
  - Dynamic `New` badge on tool cards highlighting newly published tools in the directory.

## [2.7.0] - 2026-11-09

### Added

- **CSS Gradient & Mesh Studio (`gradient-generator`)**:
  - Interactive multi-stop linear, radial, and conic gradient designer.
  - Multi-stop color controls with hex input, position sliders, dynamic add/remove up to 8 stops.
  - Angle controls with quick +45° nudges for linear/conic, and radial geometry options (circle, ellipse).
  - Multi-aspect live canvas (Card, Banner, Square) and randomizer generator.
  - Export to standard CSS, Tailwind CSS arbitrary classes, and CSS custom property blocks.
  - 15 unit and component tests passing.
- **SQL DDL to TypeScript / Zod / Prisma Converter (`sql-to-schema`)**:
  - Pure client-side SQL `CREATE TABLE` DDL parser handling identifiers, primary keys, nullability flags, and data types across Postgres, MySQL, and SQLite.
  - Code generators for strongly-typed TypeScript interfaces, Zod validation schemas (`z.object`), and Prisma models (`model`).
  - Preloaded schema templates (Users & Authentication, E-commerce Products & Orders).
  - 14 unit and component tests passing.
- **DNS over HTTPS (DoH) Inspector (`dns-lookup`)**:
  - Query live DNS records directly from browser memory via standard public DoH endpoints (Cloudflare and Google).
  - Record type filters for `A`, `AAAA`, `CNAME`, `MX`, `TXT`, `NS`, `SOA`, and `CAA`.
  - Human-friendly TTL formatting, formatted answers table, and raw JSON response inspector.
  - 13 unit and component tests passing.
- **Markdown to PDF & Printable HTML Exporter (`markdown-exporter`)**:
  - Client-side Markdown publishing studio with themes (Modern Sans, Academic Serif, Minimal Clean, Compact Mono).
  - Print stylesheet engine with `@page` sizing (A4, Letter), orientation (portrait, landscape), and optional cover page generation.
  - One-click browser print / PDF export, standalone offline HTML file download, and full HTML copying.
  - 13 unit and component tests passing.

## [2.6.0] - 2026-11-08

### Added

- **Meta Tags & Open Graph (OG) Previewer (`open-graph-preview`)**:
  - Live, real-time social card preview tabs for Google SERP, Twitter / X (Summary Large Image & Summary), Facebook feed, LinkedIn feed, Discord rich embed, and Slack message attachment.
  - Form controls with real-time SEO character length health meters for Page Title (30-60 chars) and Description (50-160 chars).
  - Local image file upload previewing graphics via client-side FileReader Data URIs.
  - Complete HTML `<head>` snippet generator including standard meta, canonical, Open Graph (`og:`), Twitter (`twitter:`), and JSON-LD Schema.org structured data.
  - 12 unit and component tests passing.
- **CSS Flexbox & Grid Playground (`css-layout-builder`)**:
  - Interactive multi-mode visual canvas for modern CSS Flexbox and CSS Grid layout design.
  - Flexbox mode with controls for flex-direction, justify-content, align-items, flex-wrap, and gap.
  - Grid mode with controls for columns, gap, justify-items, and align-items.
  - Interactive canvas item manager with dynamic item insertion, removal, and sizing.
  - Instant code generator exporting pure CSS and Tailwind utility classes.
  - 9 unit and component tests passing.
- **Bcrypt & Password Hash Studio (`bcrypt-generator`)**:
  - Pure client-side salted bcrypt password hashing and verification powered by `bcryptjs`.
  - Configurable cost factor / rounds (4 to 12) with security level indicators.
  - Candidate credential verifier testing plain text passwords against existing `$2a$` and `$2b$` hashes with instant match/mismatch status and algorithm/salt inspector.
  - Work factor CPU benchmark comparing computation duration and iterations ($2^N$).
  - 9 unit and component tests passing.
- **OpenAPI / Swagger Spec Inspector (`openapi-inspector`)**:
  - 100% offline OpenAPI 3.0 & Swagger 2.0 parser supporting both YAML and JSON syntax via `js-yaml`.
  - Filterable endpoints browser by path, tag, and HTTP method badges (GET, POST, PUT, DELETE, PATCH).
  - Interactive parameter schema inspector (query, path, header, required).
  - Realistic mock JSON response generator synthesizing dummy payloads based on schema types and formats (email, uuid, date-time, uri, arrays, objects).
  - Ready-to-use cURL command generator with copy button.
  - 7 unit and component tests passing.

## [2.5.0] - 2026-11-07

### Added

- **Docker Run to Compose Converter (`docker-compose-converter`)**:
  - Transform complex CLI `docker run` commands into clean, formatted `docker-compose.yml` configurations.
  - Automatically parses ports (`-p`, `--publish`), volumes & binds (`-v`, `--volume`), environment variables (`-e`, `--env`, `--env-file`), container names (`--name`), network modes (`--network`), restart policies (`--restart`), working directories (`-w`), user context (`-u`), privileged flags (`--privileged`), and entrypoint arguments.
  - Interactive presets for Nginx Web Server, PostgreSQL DB, Redis Cache, and Node.js Microservice.
  - One-click copy, download as `.yml`, and parsed metadata attribute chips.
- **Keycode & Keyboard Event Inspector (`keycode-inspector`)**:
  - Full-screen interactive keyboard diagnostic stage capturing physical key events in real-time.
  - Large hero display of JavaScript `event.keyCode` / `event.which`, `event.key`, `event.code`, location descriptions (Standard, Left, Right, Numpad), and active modifier flags (Ctrl, Alt, Shift, Meta, Repeat).
  - Virtual interactive keypad enabling mobile/touch users to simulate keypress events without a physical keyboard.
  - Event listener code generator for React (TypeScript), Vanilla JS, and keyboard shortcut conditional guards.
  - Interactive history drawer with recent keystrokes, event timestamps, and re-inspection.
- **User-Agent & Client Hints Parser (`user-agent-parser`)**:
  - 100% client-side deterministic User-Agent and Client Hints analyzer.
  - Deconstructs browser (Chrome, Safari, Firefox, Edge, Samsung Internet, Opera), major and minor version numbers, rendering engine (Blink, WebKit, Gecko), operating system (Windows 11/10, macOS, iOS, Android, Linux), device form factor (Desktop, Mobile, Tablet, Bot), and CPU architecture (x86_64, arm64, arm).
  - Search engine bot & crawler detection with dedicated advisory banners (Googlebot, Bingbot, DuckDuckBot, Baiduspider, YandexBot, Twitterbot).
  - One-click "Detect My Browser" button, device presets, and JSON export.
- **CSS Box Shadow & Glow Generator (`box-shadow-generator`)**:
  - Interactive multi-layer box shadow and neon glow studio.
  - Individual layer controls for X offset, Y offset, blur radius, spread, hex color, opacity percentage, inset toggle, and layer visibility.
  - Multi-backdrop interactive preview stage (Light, Slate, Dark Obsidian, Gradient) with customizable preview card radius and surface color.
  - Curated presets: Soft Elevation, Floating 3D, Neon Cyberpunk, Sharp Retro, and Inner Inset.
  - Instant code generator exporting to standard CSS (`box-shadow:`), Tailwind CSS arbitrary classes (`shadow-[...]`), and CSS custom variables (`--custom-box-shadow`).
- **Tool Registry Expansion**:
  - Created modular `src/registry/studio-tools.ts` adhering strictly to the 3-30-300 lines limit rule.

## [2.4.0] - 2026-11-06

### Added

- **Color Palette & Contrast Studio (`color-palette`)**:
  - 100% client-side HTML5 Canvas pixel quantization and color extraction from uploaded images (`.png`, `.jpg`, `.webp`, `.svg`).
  - Configurable palette sizing (4, 6, 8, 10 colors) with percentage usage calculation and color distance deduplication.
  - Interactive harmonic palette generator: Complementary (180°), Analogous (±30°), Triadic (120°), Tetradic (90°), Split-Complementary, and Monochromatic shades/tints.
  - WCAG 2.1 contrast ratio calculations with real-time AA / AAA compliance rating against light and dark backgrounds.
  - Export modal supporting CSS custom properties (`:root`), Tailwind CSS theme config, JSON, and SVG swatch download.
  - 16 dedicated unit and component tests.
- **RegEx Visualizer & Syntax Explainer (`regex-tester`)**:
  - Interactive Syntax Visualizer tab rendering an end-to-end token flow rail for regular expressions.
  - Grammatical token decomposition: Anchors (`^`, `$`, `\b`), Character Sets (`[...]`, `[^...]`), Escaped classes (`\d`, `\w`, `\s`), Quantifiers (`+`, `*`, `?`, `{n,m}`), Groups (capturing, non-capturing, lookaheads), and Alternations (`|`).
  - Interactive Token Breakdown table and selected token inspector card with plain-English descriptions.
  - Regex Quick Reference & Cheat Sheet drawer with one-click token insertion and clipboard copy.
- **Diff Checker Enhancements (`text-diff`)**:
  - Word-level intra-line diff highlighting for modified rows in side-by-side view.
  - One-click "Swap Texts" button to invert original and modified inputs.
  - Direct file upload support for both original and modified panes.
  - Downloadable git-compatible `.patch` / `.diff` unified export file.
  - Collapse unchanged lines toggle to fold long identical code blocks into expandable markers.
  - Extracted modular `DiffToolbar` and added dedicated component tests.

## [2.3.0] - 2026-11-05

### Added

- **Chmod / Linux Permissions Calculator (`chmod-calculator`)**:
  - Full-screen standalone tool for calculating octal permissions, symbolic flags (`rwxrwxrwx`), and generating POSIX terminal commands.
  - Interactive 3-role permission matrix: Owner (`u`), Group (`g`), and Others (`o`) with individual Read (`4`), Write (`2`), and Execute (`1`) toggles and live role octals.
  - Special Linux permissions support: Setuid (`4000`), Setgid (`2000`), and Sticky Bit (`1000`) with POSIX symbolic notation rendering (`s`, `S`, `t`, `T`).
  - File vs Directory mode toggle (`-` vs `d`).
  - Direct 2-way synchronized interactive input fields for typing octal numbers (e.g. `755`, `1777`) or symbolic strings (e.g. `-rwxr-xr-x`, `drwxrwxrwt`).
  - Linux permission presets: Standard File (`644`), Standard Executable/Directory (`755`), SSH Key / Private File (`600`), Private Folder (`700`), Read-Only Sensitive File (`400`), Group Shared File (`664`), Group Shared Dir (`775`), Sticky Temp Dir (`1777`), and Public Access (`777`).
  - Terminal Command Generator with modifiers: Recursive (`-R`), Verbose (`-v`), Changes only (`-c`), Silent (`-f`), `sudo` prefix, and bulk tree `find` commands.
  - Real-time Permission Explanation and Security Advisory audit: automated detection of world-writable hazards, dangerous 777 exposure, and setuid privilege escalation warnings.
  - 100% offline client-side calculation with zero network dependencies.
  - Added 23 unit and component tests (18 in `chmodLogic.test.ts`, 5 in `ChmodCalculator.test.tsx`). Total test suite expanded to 348 tests across 50 test files.

## [2.2.0] - 2026-11-04

### Changed

- **Mobile Bottom Navigation Overhaul**:
  - Replaced the direct Favorites tab in `MobileFloatingNav` with a `More` (three-dot) menu icon opening a floating popover menu with direct links to both Favorites and Recent Tools, including real-time item count badges.
  - Elevated the center Search button (`-mt-5 -translate-y-1`) with a floating button appearance, primary gradient, and tactile glow ring.
  - Added click-outside and Escape key dismissal for full accessibility across mobile viewports.
- **Standalone Tool Header Mobile Responsiveness**:
  - Optimized `StandaloneToolHeader` layout for mobile screens:
    - Added a compact mobile search icon button, keeping the Command Palette accessible without cluttering the screen width.
    - Streamlined mobile header controls by keeping essential actions (Hub, Tool Identity, Search, Favorites, and Theme Toggle) and hiding desktop-specific controls (Split View, Fullscreen, Shortcuts) on narrow screens.
    - Applied responsive max-width truncation to tool titles, preventing line-wrapping and header overflow on 360px+ devices.
- **Command Palette Theme Synchronization**:
  - Fixed root cause of Command Palette appearing dark in Light Theme: corrected `--color-primary-container` in `:root` from dark indigo (`#635bff`) to soft indigo tint (`#eeedfe`) with deep indigo text (`#261c8a`), conforming to Material Design 3 and Stitch token specifications.
  - Adapted backdrop from static `bg-black/65` to responsive `bg-black/35 dark:bg-black/75 backdrop-blur-xs dark:backdrop-blur-md`.
  - Replaced invalid Tailwind opacity classes with dynamic theme colors across header, tabs, empty state, and footer for immediate theme reaction without reload.
- **Homepage Headline and Subtitle Overlapping Fix**:
  - Eliminated text clipping and visual collisions between the headline and subtitle in `HeroSection.tsx`.
  - Increased line height (`leading-tight sm:leading-[1.18] lg:leading-[1.15]`), added gradient descender padding (`pb-1 sm:pb-2`), and expanded vertical spacing (`space-y-4 sm:space-y-5`, `pt-1`) for clean responsiveness across mobile, tablet, and desktop.
- **Standardized Brand Icon (`BrandLogo`)**:
  - Created standardized `BrandLogo` component reproducing the exact 4-quadrant rounded geometry and colors from `public/favicon.svg`.
  - Replaced mismatched generic sparkle icons in `DesktopFloatingNav`, `TabletFloatingNav`, `StandaloneToolHeader`, and `HomeFooter` with `BrandLogo` for 100% brand consistency throughout the application.
- **Homepage Top Spacing on Mobile**:
  - Resolved excessive empty top spacing on mobile screens where bottom navigation is used instead of a top header.
  - Reduced mobile top padding in `PortalShell.tsx` from `pt-20` to `pt-4 sm:pt-6 md:pt-20 lg:pt-24` and in `HeroSection.tsx` from `pt-8` to `pt-2 sm:pt-8 md:pt-12 lg:pt-14`.
  - Mobile layout now starts immediately with balanced vertical rhythm while desktop and tablet retain required clearance for top floating navigation headers.
- **Explore Page Search Experience**:
  - Unified search on the Explore page by utilizing the global header search bar (`DesktopFloatingNav` & `TabletFloatingNav`), eliminating the separate in-page search input to prevent duplicate search interfaces.
  - Added responsive active search query pill indicators (`Query: "..." [X]`) when navigating with query parameters.
- **Home Page Search Results Stacking & Layout Fix**:
  - Resolved root cause of search results dropdown being partially obscured behind sections below the search bar:
    - Structured strict multi-tier stacking contexts (`HeroSection` at `z-30`, subsequent sections at `z-10`, and `HeroSearchBar` dropdown at `z-50`).
    - Eliminated invalid Tailwind color opacity classes (`/98`, `/95`) that left dropdowns semi-transparent, replacing them with solid, crisp backgrounds (`bg-surface dark:bg-surface-container-lowest`) with `backdrop-blur-2xl` and elevation shadow.
    - Set explicit internal stacking contexts between the search bar (`z-30`/`z-50`), Quick Launch chips (`z-10`), and the Trust & Performance Metrics Strip (`z-0`).
    - Fixed container clipping and isolated ambient background glow containers with dedicated overflow bounds so the main section never clips dropdown elements.
    - Added responsive height constraints (`max-h-[360px] sm:max-h-[420px] overflow-y-auto overscroll-contain`) ensuring full visibility and smooth scrolling across mobile, tablet, and desktop viewports.
  - Eliminated duplicate native browser cross (`X`) button in WebKit/Blink by disabling native search cancel pseudo-elements and utilizing a single React clear button.
- **Original Branding Enforcement**:
  - Removed all third-party brand and product references (e.g., Raycast) across the application UI, Bento grid, documentation, and design assets in full alignment with Toolnest's original identity.
- **Version Bump**:
  - Updated application version to 2.2.0 across `package.json`, `SettingsPage.tsx`, and documentation.

## [2.1.0] - 2026-11-04

### Added

- **Interactive Home Page Search Experience (`HeroSearchBar`)**:
  - Purpose-built focal search container with tactile glowing border, ambient focus ring, and clear button (`X`).
  - Real-time dropdown search suggestions: typing directly previews top matching tools with categories, descriptions, and quick-launch arrows.
  - Full keyboard navigation (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`) for instant tool execution.
  - Direct integration with Command Palette (`⌘K`) shortcut badge.
- **Complete Command Palette UI/UX Overhaul**:
  - Restructured architecture into modular subcomponents: `CommandPaletteHeader`, `CommandPaletteTabs`, `CommandPaletteItem`, `CommandPaletteEmpty`, and `CommandPaletteFooter`.
  - Unified search input header with responsive ESC badge and clear action.
  - Rich result item presentation with icon containers, matched subtitles, category badges, and launch action indicators.
  - Helpful illustrated empty state with keyword guidance and quick catalog discovery.
  - Tactile status footer with keyboard navigation pill badges and air-gapped privacy indicator.

### Changed

- **Eliminated Competing Search Bars**:
  - Removed duplicate search triggers from the global floating navigation header (`DesktopFloatingNav` and `TabletFloatingNav`) on the Home Page and on screens with their own primary search bar.
  - Established a strict single-primary-search paradigm across all screens in the portal.

## [2.0.0] - 2026-11-04

### Added

- **Responsive Floating Navigation Architecture**:
  - Desktop floating top-center pill dock with glassmorphism backdrop blur.
  - Tablet floating island bar with quick category popover sheet and live badges.
  - Mobile bottom floating navigation dock with elevated quick search trigger.
  - Category drawer sheet for rapid access to all 12 discipline matrices.
- **Full-Screen Standalone Tool Experience**:
  - Independent desktop-grade application view for all 36 tools (`h-screen overflow-hidden`).
  - Total isolation from global portal chrome (sidebar, global navigation, and header automatically hidden).
  - Dedicated `StandaloneToolHeader` featuring Back-to-Hub navigator, quick tool switcher (`⌘K`), split-view toggle (`Alt+S`), favorite bookmarking, and fullscreen toggle.
  - Dual Split-View workspace canvas supporting side-by-side secondary utilities without leaving the active tool.
- **Stunning Landing Page Revamp**:
  - Ambient hero glow with dynamic color mesh and live local-engine privacy status badge.
  - Command launchpad with instant `⌘K` palette integration and quick suggestion pills.
  - Interactive featured tools showcase with category filtering tabs.
  - Visual 12-category matrix grid with real-time tool counts.
  - Modern architecture Bento grid highlighting air-gapped privacy, dual split-view, hotkeys, and PWA capabilities.
  - Clean open-source footer with quick shortcuts, GitHub link, and MIT license badge.
- **Modern Glassmorphism Design Tokens**:
  - Added `.glass-dock`, `.glass-card`, `.ambient-hero-mesh`, and `.ambient-dot-grid` utility tokens in Tailwind/CSS.

### Removed

- Removed legacy fixed sidebar, legacy top header, legacy bottom nav, and legacy embedded tool layout wrappers (`AppShell`, `Header`, `Sidebar`, `BottomNav`, `ToolLayout`) to eliminate redundant duplicate search bars and navigation chrome.

### Changed

- Refactored `HomePage` into modular, single-responsibility components compliant with the strict 3-30-300 architectural standard.
- Upgraded `ToolCard` design with subtle hover lift micro-interactions and launch indicators.
- Normalized outer container padding across Hub pages (`AllToolsPage`, `CategoryPage`, `FavoritesPage`, `RecentPage`, `SettingsPage`).

## [1.0.0] - 2026-10-25

### Added

- Initial release of Toolnest developer workbench.
- 12 core client-side tools:
  - JSON Formatter & Validator
  - Base64 Encoder/Decoder
  - URL Encoder/Decoder
  - UUID Generator (v4, batching, cryptographically secure)
  - SHA-256 Hash Generator (Web Crypto API)
  - Regex Tester with flags & match details
  - Text Diff Checker (side-by-side & unified)
  - Unix Timestamp Converter (seconds/ms, UTC/Local)
  - Color Converter (HEX, RGB, HSL with contrast check)
  - QR Code Generator (SVG & PNG client-side download)
  - Unit Converter (Length, Mass, Temperature, Data Storage)
  - CSV to JSON Converter with quote & line break support
- Global Universal Command Palette (`Ctrl+K` / `⌘K`).
- Triple responsive shells (Mobile bottom nav, Tablet icon rail, Desktop persistent sidebar).
- System, Light, and Dark mode theme engine with flash prevention.
- Safe local persistence for Favorites and Recent Tools.
- Automated 3-30-300 architectural linting.
- Static Netlify deployment configuration with client-side routing.
