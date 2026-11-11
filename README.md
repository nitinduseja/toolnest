# Toolnest

> **Useful tools. One workspace.**

[![CI Quality Gate](https://github.com/nitinduseja/toolnest/actions/workflows/ci.yml/badge.svg)](https://github.com/nitinduseja/toolnest/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-2.8.0-blue.svg)](package.json)
[![Tools Count](https://img.shields.io/badge/tools-53%20production%20tools-emerald.svg)](src/registry/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Netlify Status](https://api.netlify.com/api/v1/badges/toolnest/deploy-status)](https://app.netlify.com)

Toolnest is an open-source, privacy-first developer workbench providing 53 essential utilities, converters, formatters, and generators in one distraction-free workspace. All data transformations run 100% inside your browser — zero analytics, zero server storage, zero third-party AI APIs.

---

## ⚡ Key Highlights

- 🔒 **Privacy-First & Local-Only**: Everything executes client-side via native Web Crypto API, Canvas, and Web Workers. Your sensitive payloads never leave your computer.
- ⌨️ **Universal Command Palette**: Press <kbd>Ctrl</kbd> + <kbd>K</kbd> (or <kbd>⌘</kbd> + <kbd>K</kbd>) to instantly search all 53 tools, categories, and system shortcuts.
- ⚡ **Progressive Web App (PWA)**: Full offline service worker caching. Install Toolnest as a standalone desktop or mobile application.
- 📱 **Adaptive Multi-Shell Layout**:
  - **Desktop (≥1024px)**: 240px persistent navigation rail, multi-column workspace, side-by-side split input/output editors.
  - **Tablet (640–1023px)**: Compact collapsible header, icon rail navigation, fluid grids.
  - **Mobile (<640px)**: Bottom floating navigation dock, stacked reactive panels, touch-optimized controls.
- 🎨 **First-Class Theme Engine**: Dark, Light, and System modes with zero-flicker CSS variable initialization.
- 📐 **3-30-300 Architectural Guardrails**: Strict limits on function complexity (≤30 lines), arguments (≤3 parameters), and module size (≤300 lines).

---

## 🛠️ The 53 Developer Tools by Category

Toolnest organizes its complete suite across **12 canonical categories**:

### 💻 Developer Tools (12 Tools)

- **JSON Formatter & Validator**: RFC 8259 prettifier, minifier, validator with detailed error syntax highlighting.
- **Regex Tester**: Real-time pattern evaluation, capture group inspection, and flag toggles.
- **SQL Formatter & Beautifier**: Format, indent, keyword capitalize, and minify standard SQL queries.
- **JSON to TypeScript / Zod Schema**: Recursively infer TypeScript types, interfaces, and Zod validation schemas.
- **cURL to Code Converter**: Translate cURL CLI commands into Fetch, Axios, Python Requests, and Go code.
- **HTML & CSS Beautifier / Minifier**: Clean, format, and compress HTML markup and CSS stylesheets.
- **REST API & Webhook Playground**: In-browser HTTP client to compose, test, and debug REST APIs and webhooks.
- **Chmod / Linux Permissions Calculator**: Octal and symbolic permissions calculator with security audit engine.
- **Docker Run to Compose Converter**: Transform `docker run` commands into production `compose.yaml` files.
- **Keycode & Keyboard Event Inspector**: Interactive virtual keypad, physical key inspector, and event listener snippets.
- **OpenAPI / Swagger Spec Inspector**: Inspect OpenAPI 3.0 / Swagger specs, browse parameters, and synthesize mocks.
- **SQL DDL to Schema Converter**: Convert SQL `CREATE TABLE` statements into TypeScript, Zod, and Prisma models.

### 🔐 Security & Cryptography (5 Tools)

- **SHA-256 Hash Generator**: Cryptographic digests using the native Web Crypto API.
- **JWT Decoder & Inspector**: Inspect header, payload, expiration claims, and signature structure.
- **JWT Studio & Signature Debugger**: Mint, sign, and verify JWTs with HMAC keys (`HS256`, `HS384`, `HS512`) and expiry helpers.
- **Security Headers & CSP Builder**: Design, audit (`A+` to `F`), and export CSP/HSTS headers for Nginx, Apache, Netlify, and Cloudflare.
- **Bcrypt & Password Hash Studio**: Salted bcrypt generation, credential verification, and cost-factor benchmarks.

### 🎨 Design & Colors (7 Tools)

- **Color Converter & Contrast Checker**: HEX, RGB, HSL conversions with WCAG 2.2 AA/AAA contrast ratios.
- **CSS Glassmorphism & Box-Shadow**: Glassmorphic blur, border, specular highlight, and CSS code generator.
- **Color Palette & Contrast Studio**: Color harmonies, extract palettes from images, and WCAG accessibility grid.
- **CSS Box Shadow & Glow Generator**: Multi-layer shadow and neon glow designer with CSS and Tailwind export.
- **CSS Flexbox & Grid Playground**: Visual interactive canvas for Flexbox and CSS Grid layouts.
- **CSS Gradient & Mesh Studio**: Linear, radial, conic, and multi-stop mesh gradient designer.
- **SVG Pattern & Background Generator**: Repeatable SVG backgrounds (Dots, Grid, Isometric, Chevrons, Hexagons, PCB).

### ✍️ Text & Writing (5 Tools)

- **Text Diff Checker**: Side-by-side and unified diff visualization with addition/deletion highlighting.
- **Markdown Previewer & Editor**: Real-time GitHub Flavored Markdown preview with sanitization.
- **Markdown Table Generator**: Visual WYSIWYG spreadsheet grid to Markdown table converter.
- **Lorem Ipsum & Dummy Text Generator**: Configurable placeholder generator for paragraphs, sentences, words, and lists.
- **Markdown to PDF & Printable HTML Exporter**: Clean printable PDF document and styled HTML export.

### 🖼️ Image & Media (6 Tools)

- **QR Code Generator**: High-resolution QR code synthesis with custom colors and PNG export.
- **Image Compressor & Converter**: Client-side canvas compression for JPEG, PNG, WebP, and AVIF.
- **SVG Optimizer & Minifier**: Strip metadata, editor artifacts, and round coordinates safely.
- **Favicon & App Icon Generator**: Multi-size favicon (`.ico`), Apple Touch, and PWA icon synthesis.
- **SVG to JSX / React Component Generator**: Turn raw SVG into production-grade React components.
- **Base64 Image / Data URI Studio**: Convert between image files and Data URI strings.

### 🌐 Web & Network Helpers (5 Tools)

- **URL Parser & Query Parameter Builder**: Break down URL components and edit query parameters in real time.
- **HTTP Status Code & Header Lookup**: Search RFC status codes (1xx-5xx) and essential HTTP headers.
- **User-Agent & Client Hints Parser**: Deconstruct browser, engine, OS, device architecture, and bots.
- **Meta Tags & Open Graph (OG) Previewer**: Social card previewer for Google, Twitter/X, Facebook, LinkedIn, Discord.
- **DNS over HTTPS (DoH) Inspector**: Query A, AAAA, CNAME, MX, TXT, and NS records via Cloudflare & Google DoH.

### 🔄 Encoders & Decoders (2 Tools)

- **Base64 Encoder / Decoder**: Full Unicode and UTF-8 byte conversion with explanation of encoding vs encryption.
- **URL Encoder / Decoder**: Percent-encoding and decoding for query strings and full URIs.

### 📅 Date & Time (2 Tools)

- **Unix Timestamp Converter**: Epoch seconds and milliseconds with ISO 8601, UTC, and local timezone breakdown.
- **Cron Expression Parser & Humanizer**: 5- and 6-field cron parser with natural language humanization.

### 🧮 Math & Converters (2 Tools)

- **Unit Converter**: Exact metric and imperial conversions for length, mass, temperature, and data storage.
- **Subnet & CIDR IP Calculator**: IPv4 subnet masks, usable host ranges, binary bitmasks, and VLSM splits.

### 📁 Data & Files (3 Tools)

- **CSV to JSON Converter**: RFC 4180 parsing with custom delimiters, quotes, and array output.
- **YAML ↔ JSON Converter**: Bidirectional translation with syntax validation and indentation controls.
- **PDF Page Merger & Splitter**: Merge multiple PDFs, extract page ranges, and reorder pages locally.

### ✨ Learning & Generators (2 Tools)

- **UUID Generator**: Cryptographically secure UUID v4 generation in individual or bulk batches.
- **Mock Data Generator**: Realistic synthetic JSON/CSV mock datasets with customizable field schemas.

### 💼 Everyday Productivity (2 Tools)

- **Secure Password & Passphrase Generator**: High-entropy passwords and memorable diceware passphrases.
- **Document Scanner & OCR Studio**: 4-point perspective warp, image filters, PDF export, and Tesseract OCR.

---

## 🚀 Quickstart

### Prerequisites

- **Node.js**: `v22.x` or later
- **pnpm**: `v10.x` / `v12.x` or later

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
# Run unit & component test suite (540+ Vitest tests)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run end-to-end browser tests (Playwright)
pnpm test:e2e

# Run ESLint & architectural constraints (3-30-300)
pnpm lint

# Check code formatting (Prettier)
pnpm format:check

# Type-check TypeScript codebase
pnpm exec tsc --noEmit

# Production build preview
pnpm build
pnpm preview
```

---

## 🌐 Static Netlify & Edge Deployment

Toolnest is designed for zero-config static hosting on Netlify, Cloudflare Pages, or Vercel:

1. Connect your repository to Netlify / Cloudflare Pages.
2. Set **Build command**: `pnpm build`.
3. Set **Publish directory**: `dist`.
4. Client-side SPA routes (`/tools/:slug`, `/categories/:slug`) are preserved via `public/_redirects` and `netlify.toml`.

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
