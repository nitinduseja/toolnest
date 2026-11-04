# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Global Raycast-style Command Palette (`Ctrl+K` / `⌘K`).
- Triple responsive shells (Mobile bottom nav, Tablet icon rail, Desktop persistent sidebar).
- System, Light, and Dark mode theme engine with flash prevention.
- Safe local persistence for Favorites and Recent Tools.
- Automated 3-30-300 architectural linting.
- Static Netlify deployment configuration with client-side routing.
