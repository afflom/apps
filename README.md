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

This template uses a multi-environment deployment approach with GitHub Pages:

- **Dev Environment**: For local testing and development
- **Staging Environment**: Automatically deployed for Pull Requests
- **Production Environment**: Deployed from the main branch

### Environment Setup

1. Go to your repository settings
2. Navigate to the Pages section
3. Set the source to "GitHub Actions"
4. Go to Settings > Environments and create three environments:
   - `dev`
   - `staging`
   - `production`

### Deployment Methods

#### Dev Environment

There are two ways to deploy to the dev environment:

1. **With Git Push**: 
   - When pushing changes, the pre-push hook will ask if you want to deploy to dev
   - Requires a GitHub token exported as `GITHUB_TOKEN` in your environment

2. **Manual Deployment**:
   ```bash
   # Export your GitHub token first
   export GITHUB_TOKEN=your_github_token
   
   # Run the deployment script
   npm run deploy:dev
   ```

#### Staging Environment

Automatically deployed when a Pull Request is created or updated. A comment with a preview link will be added to the PR.

#### Production Environment

Automatically deployed when changes are pushed to the `main` branch.

## In-Browser Testing

All tests run in a browser environment to ensure accurate DOM testing. The tests are located in `src/*.test.ts` files and use Vitest with browser support.

## PWA Features

- Offline support
- App manifest for installability
- Service worker with automatic updates
- Icons for various platforms

## License

MIT
