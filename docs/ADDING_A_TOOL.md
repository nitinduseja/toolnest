# Adding a New Tool to Toolnest

Follow this guide to add a new client-side tool to Toolnest.

## Step 1: Create Tool Directory

Create a directory under `src/tools/<tool-slug>/`:

```
src/tools/my-new-tool/
├── index.tsx         # Lazy-loaded page component
├── myNewToolLogic.ts # Pure TypeScript calculation / conversion logic
└── myNewTool.test.ts # Unit tests for domain logic
```

## Step 2: Implement Domain Logic

Create pure functions in `myNewToolLogic.ts`:

- Accept inputs (max 3 parameters or an options object).
- Validate bounds and handle errors cleanly with descriptive messages.
- Avoid any React dependencies or stateful browser side-effects.

## Step 3: Write Comprehensive Unit Tests

Test boundary conditions, empty inputs, malformed data, and edge cases in `myNewTool.test.ts`.

## Step 4: Implement UI Component

In `index.tsx`:

- Use `ToolLayout` or shared UI primitives.
- Wire up inputs, validation errors, and output actions (Copy, Download, Clear).
- Ensure mobile stacked layout and desktop side-by-side layout are responsive.

## Step 5: Register Tool in the Canonical Registry

Open `src/registry/tools.ts`:

- Add entry with `id`, `slug`, `name`, `description`, `category`, `icon`, `keywords`, and `component: React.lazy(...)`.
- The homepage, all-tools grid, category navigation, command palette, and router will automatically discover and integrate your tool!

## Step 6: Verify Quality Gates

```bash
pnpm lint
pnpm test
pnpm build
```
