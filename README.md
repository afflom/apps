# TypeScript PWA Template with GitHub Pages Deployment

A fully-featured TypeScript PWA template that deploys to GitHub Pages using GitHub Actions. This template includes in-browser testing, PWA capabilities, and TypeScript support.

## Features

- 🚀 TypeScript support
- 📱 PWA ready with workbox
- 🧪 In-browser testing with Vitest
- 🔄 Automatic GitHub Pages deployment
- 🎨 Basic styling and counter example
- 📦 Uses `@uor-foundation/math-js` for demonstration

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

This template automatically deploys to GitHub Pages using GitHub Actions when changes are pushed to the `main` branch.

### GitHub Pages Setup

1. Go to your repository settings
2. Navigate to the Pages section
3. Set the source to "GitHub Actions"

## In-Browser Testing

All tests run in a browser environment to ensure accurate DOM testing. The tests are located in `src/*.test.ts` files and use Vitest with browser support.

## PWA Features

- Offline support
- App manifest for installability
- Service worker with automatic updates
- Icons for various platforms

## License

MIT
