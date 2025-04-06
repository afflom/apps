# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Dev server: `npm run dev`
- Preview: `npm run preview`
- Lint: `npm run lint` or fix with `npm run lint:fix`
- Format: `npm run format` or check with `npm run format:check`
- Typecheck: `npm run typecheck`
- Test: `npm run test`
- Single test: `npm run test -- -t "test name pattern"`
- Test with coverage: `npm run test:coverage`
- Validate all: `npm run validate`

## Code Style
- **Imports**: Group by type (external, internal, utils), alphabetize
- **Types**: Explicit return types on public functions, avoid `any`
- **Formatting**: Prettier enforced, 2 space indent, 100 chars width, semi, singleQuote
- **Naming**: camelCase for variables/methods, PascalCase for classes/components
- **Error handling**: Promise rejections must be caught, errors should be typed
- **Component structure**: Place services in `/services`, utilities in `/utils`
- **Testing**: All components must have browser-based tests with high coverage

The codebase is a TypeScript PWA with GitHub Pages deployment via GitHub Actions and enforces in-browser testing.