# Toolnest — Project Memory

## Verified Baseline

- **Application Type**: Client-only React single-page application built with Vite and TypeScript.
- **Node Environment**: Node v22.23.2, pnpm 12.8.1 (VERIFIED).
- **Hosting**: Netlify static deployment (`dist` publish directory, SPA rewrite rule `/* -> /index.html 200`).
- **Core Technology Stack**:
  - React 19 + TypeScript (strict mode)
  - Vite for development and bundling
  - Tailwind CSS with semantic CSS variables
  - React Router (client-side routing)
  - Lucide React (accessible, consistent icons)
  - cmdk for command palette
  - Vitest + React Testing Library for unit and component testing
  - Playwright for end-to-end browser testing
- **Design Tokens & Visual Language**:
  - Primary Accent: Indigo/Violet `#635BFF`
  - Typography: Inter (UI/prose) + JetBrains Mono (code, tokens, keybindings)
  - Surface Hierarchy: 4-tier dark/light elevation system with 1px hairline borders
  - Mobile, Tablet, Desktop responsive shells with dedicated navigation patterns
- **Engineering Standard (3-30-300)**:
  - Max 3 positional parameters per function
  - Target max 30 executable lines per function
  - Target max 300 lines of source content per file
- **Security & Privacy Boundaries**:
  - Local-first, in-browser processing only
  - Zero external analytics, tracking, or AI APIs
  - Cryptographically secure randomness for security tokens (UUIDs)
  - Untrusted user input is never evaluated via `eval` or `Function`
- **Canonical Categories (12)**:
  1. Developer Tools
  2. Encoders & Decoders
  3. Security & Cryptography
  4. Design & Colors
  5. Text & Writing
  6. Date & Time
  7. Math & Converters
  8. Data & Files
  9. Image & Media
  10. Web & Network Helpers
  11. Learning & Generators
  12. Everyday Productivity
- **Initial 12 Tools**:
  1. JSON Formatter and Validator (`json-formatter`)
  2. Base64 Encoder/Decoder (`base64`)
  3. URL Encoder/Decoder (`url-encoder`)
  4. UUID Generator (`uuid-generator`)
  5. SHA-256 Hash Generator (`hash-generator`)
  6. Regex Tester (`regex-tester`)
  7. Text Diff Checker (`text-diff`)
  8. Unix Timestamp Converter (`timestamp-converter`)
  9. Color Converter (`color-converter`)
  10. QR Code Generator (`qr-generator`)
  11. Unit Converter (`unit-converter`)
  12. CSV to JSON Converter (`csv-json`)
