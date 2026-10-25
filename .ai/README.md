# Toolnest AI Operating System (.ai/)

This directory maintains persistent AI context, architectural memory, decision records, and operational session tracking for Toolnest.

## Principles

1. **Canonical Instructions**: The repository prompt and project specification serve as the canonical source of truth for requirements.
2. **Evidence Discipline**: Code and repository state determine current facts; prompt defines intended behavior.
3. **Continuity**: AI agents operating on this repository use `.ai/PROJECT_MEMORY.md` and `.ai/SESSION_STATE.md` to coordinate work across sessions.

## Structure

- `PROJECT_MEMORY.md`: Long-term stable facts, architectural conventions, verified constraints, and design tokens.
- `SESSION_STATE.md`: Active milestone status, tasks in progress, completed milestones, known limitations, and next steps.
- `DECISIONS/`: Architecture Decision Records (ADRs) capturing significant technical tradeoffs.
