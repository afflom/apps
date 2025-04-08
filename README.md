# TypeScript PWA Template with GitHub Pages Deployment

[![Open in GitHub Codespaces](https://img.shields.io/badge/Open%20in-GitHub%20Codespaces-blue?logo=github)](https://github.com/codespaces/new?hide_repo_select=true&ref=main)

A fully-featured TypeScript PWA template that deploys to GitHub Pages using GitHub Actions. This template includes in-browser testing, PWA capabilities, TypeScript support, and is configured for development with DevContainers and GitHub Codespaces.

## Features

- 🚀 TypeScript support
- 📱 PWA ready with workbox
- 🧪 In-browser testing with Vitest
- 🔄 Automatic GitHub Pages deployment
- 🎨 Basic styling and counter example
- 🐳 DevContainer and GitHub Codespaces ready
- 🤖 Claude Code integration for AI-assisted development
- 🔧 Automated issue implementation by Claude AI

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

## Development with DevContainer and GitHub Codespaces

This template is fully configured for development with VS Code DevContainers and GitHub Codespaces.

### GitHub Codespaces

To start developing with GitHub Codespaces:

1. Click the "Code" button on your repository
2. Select the "Codespaces" tab
3. Click "Create codespace on main"

The environment will be automatically set up with all dependencies installed and the development server running.

### VS Code DevContainer

To use the DevContainer locally:

1. Install Docker and the VS Code Remote - Containers extension
2. Open the project in VS Code
3. Click the notification to reopen in container, or use the Command Palette (F1) to run "Remote-Containers: Reopen in Container"

The DevContainer includes:

- Node.js LTS
- Chrome for headless browser testing
- Git and GitHub CLI
- Common development tools and utilities
- Pre-configured VS Code settings and extensions
- Claude Code CLI and VS Code extension

### Features

- Automatic port forwarding for the development server
- Pre-configured linting and formatting
- Git authentication and credential helpers
- Convenient aliases for common commands
- Isolated, reproducible development environment

### Claude Code Integration

The DevContainer and Codespaces environments include Claude Code for AI-assisted development:

1. **Authentication** (two options):
   - **Interactive Login**: Simply run `claude` to start the login wizard
   - **API Key**: Alternatively, create an API key at [Anthropic Console](https://console.anthropic.com/settings/keys)
     and set it as the `ANTHROPIC_API_KEY` environment variable or Codespaces secret

2. **Using Claude Code**:
   - In VS Code: Use the Claude Code extension (pre-installed)
   - In terminal: Use these commands:
     - `claude` - Run Claude Code CLI
     - `claude-chat` - Start interactive chat
     - `claude-init` - Initialize with project context
     - `claude-on` - Run on specific file or directory

3. **Features**:
   - In-editor context-aware assistance
   - Full codebase knowledge for more accurate help
   - Improved troubleshooting and debugging assistance
   - Automatic IDE integration
   
See `.github/CLAUDE_CODE_GUIDE.md` for detailed usage instructions.

## Automated Issue Implementation with Claude

This repository includes an automated GitHub Actions workflow that uses Claude AI to implement solutions for GitHub issues labeled with "claude".

### How It Works

1. An issue is created with detailed requirements
2. A repository maintainer adds the "claude" label
3. Claude automatically:
   - Analyzes the issue
   - Implements the requested changes
   - Creates a pull request
   - Links the PR back to the issue

### Usage for Contributors

- Create detailed issues using our templates
- Include specific acceptance criteria
- Maintainers will evaluate if the issue is suitable for Claude
- If appropriate, a maintainer will add the "claude" label

### For Maintainers

Only repository maintainers can add the "claude" label, which triggers the automation. 

```
⚠️ Important: The repository must have the ANTHROPIC_API_KEY secret configured.
```

See `.github/CLAUDE_AUTOMATION.md` for complete documentation.

## License

MIT
