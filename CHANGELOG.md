# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
