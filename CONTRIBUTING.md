# Contributing to Toolnest

Thank you for your interest in contributing to Toolnest!

## Core Tenets

- **Local-First & Zero-Telemetry**: Never add remote API calls, network tracking, analytics, or backend services. All utility computations must execute inside the browser.
- **3-30-300 Architectural Standard**:
  - Max 3 positional arguments per function (use options objects for more).
  - Target max 30 executable lines per function.
  - Target max 300 source lines per file.
- **Type Safety**: TypeScript strict mode enabled with no untyped `any`, unhandled promises, or unsafe casts.

## Development Setup

1. **Prerequisites**:
   - Node.js `v22` or later
   - pnpm `v12` or later

2. **Clone and Install**:

   ```bash
   git clone https://github.com/nitinduseja/toolnest.git
   cd toolnest
   pnpm install
   ```

3. **Development Server**:

   ```bash
   pnpm dev
   ```

4. **Run Checks**:
   ```bash
   pnpm format:check
   pnpm lint
   pnpm test
   pnpm build
   ```

## Adding a Tool

Please review [docs/ADDING_A_TOOL.md](./docs/ADDING_A_TOOL.md) for full instructions on structuring domain logic, UI, and registry metadata.
