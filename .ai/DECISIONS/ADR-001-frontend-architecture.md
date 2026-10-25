# ADR-001: Frontend Architecture and Technology Selection

## Status

Accepted

## Context

Toolnest requires an open-source, privacy-first, zero-backend collection of developer tools and utilities suitable for static hosting on Netlify. It must run 100% in-browser, provide desktop/tablet/mobile shells, offer instant command-palette discovery (Ctrl+K), and enforce high code quality standards (3-30-300).

## Decision

1. **Framework & Bundler**: React 19 with Vite and TypeScript strict mode. Next.js is explicitly ruled out due to static client-side requirements and unnecessary SSR complexity.
2. **Routing**: `react-router-dom` v7 with client-side hash or HTML5 pushState routing (supported by Netlify `/* -> /index.html 200` rewrite).
3. **Styling**: Tailwind CSS with CSS custom variables for semantic token definition, ensuring seamless switching between System, Light, and Dark modes.
4. **Icons**: `lucide-react` for accessible, tree-shakeable SVG icons.
5. **Command Palette**: `cmdk` for an accessible, keyboard-first modal dialog with grouped commands, tools, and categories.
6. **Testing**: Vitest + React Testing Library + JSDOM for unit and component testing; Playwright for end-to-end multi-browser tests.
7. **Storage**: Safe abstraction over `localStorage` with JSON schema parsing, fallback handling, quota error catching, and zero persistence of sensitive user payloads.
8. **Tool Dependencies**:
   - `qrcode` for client-side QR generation
   - `papaparse` for standard RFC 4180 CSV parsing
   - `diff` for text diffing algorithm
   - Native Web Crypto API for SHA-256 and cryptographically secure UUID v4

## Consequences

- Fast initial load and isolated chunks via dynamic `React.lazy()` for tool routes.
- Fully offline and local-first execution; no external API key requirements.
- Clean separation between tool computation algorithms and React UI components.
