# Toolnest Coding Standards

## 1. The 3-30-300 Architectural Standard

To preserve code legibility and maintainability across open-source contributions:

- **3 Parameters**: Functions accept a maximum of 3 positional parameters. When more arguments are needed, use a typed options object:
  ```typescript
  // Preferred
  interface DiffOptions {
    ignoreCase?: boolean;
    lineBreak?: string;
  }
  export function computeDiff(
    original: string,
    modified: string,
    options?: DiffOptions
  ): DiffResult;
  ```
- **30 Executable Lines**: Aim for functions of 30 lines or fewer. Break complex transformation steps into cohesive, named sub-routines.
- **300 File Lines**: Aim for files of 300 non-empty source lines or fewer. Extract models, helper algorithms, and child components into dedicated sibling files.

Enforced deterministically via ESLint rules (`max-lines`, `max-params`).

## 2. TypeScript Guidelines

- Enable strict mode (`noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`).
- Prefer `unknown` with narrowing type guards rather than `any`.
- Never use `@ts-ignore` or non-null assertions (`!`) without documented architectural justification.

## 3. Separation of Concerns

- Tool math and string manipulation logic resides in `*Logic.ts` or pure functions free of React hooks and JSX.
- Presentation components consume state and render semantic markup without heavy nested calculations.
