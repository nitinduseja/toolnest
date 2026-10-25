# Toolnest

> **Useful tools. One workspace.**

[![CI Quality Gate](https://github.com/nitinduseja/toolnest/actions/workflows/ci.yml/badge.svg)](https://github.com/nitinduseja/toolnest/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Netlify Status](https://api.netlify.com/api/v1/badges/toolnest/deploy-status)](https://app.netlify.com)

Toolnest is an open-source, privacy-first developer workbench providing essential utilities, converters, formatters, and generators in one distraction-free workspace. All data transformations run 100% inside your browser — zero analytics, zero server storage, zero third-party AI APIs.

---

## ⚡ Key Highlights

- 🔒 **Privacy-First & Local-Only**: Everything executes client-side via native browser APIs and Web Crypto. Your sensitive payloads never leave your computer.
- ⌨️ **Raycast-Style Command Palette**: Press <kbd>Ctrl</kbd> + <kbd>K</kbd> (or <kbd>⌘</kbd> + <kbd>K</kbd>) to instantly search all tools, categories, and system commands.
- 📱 **Adaptive Multi-Shell Layout**:
  - **Desktop (≥1024px)**: 240px persistent navigation rail, multi-column workspace, side-by-side split input/output editors.
  - **Tablet (640–1023px)**: Compact collapsible header, icon rail navigation, fluid grids.
  - **Mobile (<640px)**: Bottom floating navigation dock, stacked reactive panels, touch-optimized controls.
- 🎨 **First-Class Theme Engine**: Dark, Light, and System modes with zero-flicker CSS variable initialization.
- 📐 **3-30-300 Architectural Guardrails**: Strict limits on function complexity, argument counts, and module size.

---

## 🛠️ The 12 Initial Tools

1. **JSON Formatter & Validator**: RFC 8259 prettifier, minifier, validator with detailed error syntax highlighting.
2. **Base64 Encoder / Decoder**: Full Unicode and UTF-8 byte conversion with explanation of encoding vs encryption.
3. **URL Encoder / Decoder**: Component and full-URI safe percent-encoding/decoding.
4. **UUID Generator**: Cryptographically secure UUID v4 generation with configurable batch sizes.
5. **SHA-256 Hash Generator**: Asynchronous Web Crypto API digests with hexadecimal representations.
6. **Regex Tester**: Real-time pattern evaluation, capture group inspection, and flag toggles.
7. **Text Diff Checker**: Side-by-side and unified diff visualization with addition/deletion highlighting.
8. **Unix Timestamp Converter**: Epoch seconds and milliseconds with ISO 8601, UTC, and local timezone breakdown.
9. **Color Converter & Contrast Checker**: HEX, RGB, HSL conversions with WCAG 2.2 AA contrast ratio preview.
10. **QR Code Generator**: Local high-resolution QR synthesis with PNG image export.
11. **Unit Converter**: Exact metric and imperial conversions across length, mass, temperature, and data storage (decimal and binary).
12. **CSV to JSON Converter**: RFC 4180 parsing supporting quoted delimiters, custom line breaks, and array output.

---

## 🚀 Quickstart

### Prerequisites

- **Node.js**: `v22.x` or later
- **pnpm**: `v12.x` or later

### Installation

```bash
# Clone the repository
git clone https://github.com/nitinduseja/toolnest.git
cd toolnest

# Install dependencies
pnpm install

# Start local development server
pnpm dev
```

Visit `http://localhost:5173` to explore Toolnest.

---

## 🧪 Testing & Verification

```bash
# Unit & component test suite (Vitest)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run ESLint & architectural constraints (3-30-300)
pnpm lint

# Type-check TypeScript codebase
pnpm exec tsc --noEmit

# Production build preview
pnpm build
pnpm preview
```

---

## 🌐 Static Netlify Deployment

Toolnest is designed for zero-config static hosting on Netlify.

1. Connect your repository to Netlify.
2. Set **Build command**: `pnpm build`.
3. Set **Publish directory**: `dist`.
4. Client-side routes (`/tools/:slug`, `/categories/:slug`, etc.) are preserved via `public/_redirects` and `netlify.toml`.

---

## 📖 Documentation

- [Architecture & Modular Boundaries](docs/ARCHITECTURE.md)
- [Coding Standards & 3-30-300](docs/CODING_STANDARDS.md)
- [Guide to Adding a Tool](docs/ADDING_A_TOOL.md)
- [Security & Privacy Model](SECURITY.md)
- [Contribution Guidelines](CONTRIBUTING.md)

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
