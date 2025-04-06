#!/bin/bash

# Script to ensure Claude Code is properly installed and set up

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
  echo "Claude Code CLI not found, installing..."
  npm install -g @anthropic-ai/claude-code
  
  if [ $? -ne 0 ]; then
    echo "❌ Failed to install Claude Code CLI. Please install it manually:"
    echo "npm install -g @anthropic-ai/claude-code"
    exit 1
  fi
  
  echo "✅ Claude Code CLI installed successfully."
else
  echo "✅ Claude Code CLI is already installed."
fi

# Give instructions for authentication
if [ -n "$ANTHROPIC_API_KEY" ]; then
  echo "✅ ANTHROPIC_API_KEY environment variable is set."
  echo "Claude Code will use this API key for authentication."
else
  echo "ℹ️ No ANTHROPIC_API_KEY environment variable found."
  echo "You have two options for authentication:"
  echo ""
  echo "Option 1: Use the interactive login wizard (recommended):"
  echo "  Run: claude"
  echo "  Follow the on-screen instructions to log in with your Anthropic account."
  echo ""
  echo "Option 2: Set an API key environment variable:"
  echo "  1. Create an API key at https://console.anthropic.com/settings/keys"
  echo "  2. Set it in your environment: export ANTHROPIC_API_KEY=your_key_here"
  echo "  3. For persistent setup, add this to your .bashrc or .profile"
  echo ""
fi

# Inform about VS Code extension
echo "ℹ️ To use Claude Code in VS Code, make sure the extension is installed:"
echo "  Extension ID: anthropic.claude-code-vscode"
echo ""
echo "For more information, see: .github/CLAUDE_CODE_GUIDE.md"

# Check if running in non-interactive mode
if [ "$1" == "--no-interactive" ]; then
  echo "Running in non-interactive mode. Setup complete."
  exit 0
fi

# Offer to start Claude Code
echo ""
echo "Would you like to start Claude Code now? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  claude
fi