# Security Policy

## Privacy-First Security Architecture

Toolnest is engineered with a strict local-first, zero-telemetry, zero-remote-API paradigm:

1. **Zero Server Communication**: All data inputs, transformations, decodings, and cryptographic hash computations run 100% locally in your browser.
2. **No Persistent Sensitive Storage**: Toolnest does not persist inputs, outputs, credentials, tokens, or files into persistent browser storage. Only local preferences (theme, UI states, favorites list of tool IDs) are stored.
3. **No Unsafe Execution**: Dynamic code evaluation (`eval()`, `new Function()`) is strictly prohibited throughout the codebase.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability or potential privacy breach within Toolnest, please do not disclose it in a public GitHub issue.

Instead, please send an advisory report to the maintainers with:

- Description of the issue and potential impact
- Detailed reproduction steps or Proof of Concept
- Browser environment and OS details

We will acknowledge receipt within 48 hours and work with you on a responsible disclosure timeline.
