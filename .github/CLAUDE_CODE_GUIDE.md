# Using Claude Code with This Template

This TypeScript PWA template includes built-in support for Claude Code, Anthropic's AI coding assistant. This guide explains how to set up and use Claude Code effectively in this project.

## Setup

You have two ways to authenticate with Claude Code:

### Option 1: Interactive Login Wizard (Recommended for First-Time Setup)

When you first run `claude`, an interactive login wizard will guide you through the authentication process:

1. Run the Claude Code CLI:
   ```bash
   claude
   ```

2. Follow the on-screen instructions to authenticate:
   - You'll be prompted to open a browser and log in to your Anthropic account
   - After authentication, Claude Code will store your credentials locally
   - This login is persistent across sessions

### Option 2: API Key Environment Variable

If you prefer direct API key configuration (useful for CI/CD or automation):

1. Create an API key at the [Anthropic Console](https://console.anthropic.com/settings/keys)
2. Set up the API key in your environment:

   **Local Development:**
   ```bash
   export ANTHROPIC_API_KEY=your_api_key_here
   ```

   **GitHub Codespaces:**
   Add the API key as a secret:
   1. Go to your GitHub repository
   2. Navigate to Settings > Secrets and variables > Codespaces
   3. Add a new secret named `ANTHROPIC_API_KEY` with your API key

### VS Code Extension

The DevContainer and Codespaces configurations automatically install the Claude Code VS Code extension. If you're developing outside a container, install it manually:

1. Open VS Code Extensions panel (Ctrl+Shift+X / Cmd+Shift+X)
2. Search for "Claude Code"
3. Install "Claude Code" by Anthropic

## Using Claude Code

### In VS Code

1. **Chat with Claude Code:**
   - Open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Type "Claude Code: Start Chat" and select it
   - A chat panel will open where you can ask questions and get assistance

2. **Highlight Code and Ask:**
   - Select some code in your editor
   - Right-click and choose "Ask Claude Code about selection"
   - Ask a question about the selected code

3. **Contextual Understanding:**
   - Claude Code has access to your open files and project structure
   - It can provide more accurate answers by understanding the context

### From the Terminal (CLI)

The Claude Code CLI is pre-installed in the DevContainer. Use it as follows:

```bash
# General help with file or directory context
claude path/to/file/or/directory "Your question here"

# Start an interactive chat session
claude chat

# Get JSON formatted responses
claude path/to/file --format=json "Generate a plan for refactoring this code"
```

## Example Use Cases

1. **Understanding Code:**
   - "Explain what this component does"
   - "How does the PWA registration work in this project?"

2. **Debugging:**
   - "Why is this test failing?"
   - "Help me debug this function"

3. **Adding Features:**
   - "Help me add dark mode to this application"
   - "How can I implement a caching system for API responses?"

4. **Optimizing Code:**
   - "Suggest ways to optimize this function"
   - "Review this code for performance issues"

5. **Learning the Codebase:**
   - "Give me an overview of this project architecture"
   - "Explain how the routing works in this application"

## Tips for Best Results

1. **Be Specific:** Clearly describe what you're trying to accomplish
2. **Provide Context:** Tell Claude Code about relevant design decisions or constraints
3. **Iterate:** If the initial response isn't helpful, refine your question
4. **Use IDE Integration:** Let Claude Code see your code directly through the extension
5. **Check Results:** Always verify suggestions and explanations for accuracy

## Troubleshooting

- **Authentication Issues:** Ensure your `ANTHROPIC_API_KEY` is correctly set
- **Extension Not Working:** Check if the extension is properly installed and activated
- **CLI Issues:** Make sure the CLI is installed (`which claude` should return a path)

For more help, visit the [Claude Code documentation](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)