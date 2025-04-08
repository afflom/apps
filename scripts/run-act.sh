#!/bin/bash

# Ensure Act is installed
if ! command -v act &> /dev/null; then
  echo "⚙️ Act not found, installing..."
  bash "$(dirname "$0")/install-act.sh"
  
  # Re-check if installation was successful
  if ! command -v act &> /dev/null; then
    if [ -f "$HOME/.local/bin/act" ]; then
      export PATH="$HOME/.local/bin:$PATH"
    elif [ -f "$HOME/bin/act" ]; then
      export PATH="$HOME/bin:$PATH"
    else
      echo "❌ Failed to install Act"
      exit 1
    fi
  fi
fi

# Default workflow to run
WORKFLOW="deploy.yml"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --workflow)
      WORKFLOW="$2"
      shift 2
      ;;
    --list)
      echo "📋 Listing available workflows:"
      act -l
      exit 0
      ;;
    --help)
      echo "Usage: $0 [--workflow WORKFLOW_FILE] [--list] [--help]"
      echo ""
      echo "Options:"
      echo "  --workflow WORKFLOW_FILE  Specify the workflow file to run (default: deploy.yml)"
      echo "  --list                   List available workflows"
      echo "  --help                   Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Run '$0 --help' for usage information"
      exit 1
      ;;
  esac
done

echo "🚀 Running GitHub Actions workflow $WORKFLOW locally with Act..."

# Run the specified workflow
act -W ".github/workflows/$WORKFLOW" --artifact-server-path /tmp/artifacts

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ GitHub Actions workflow completed successfully!"
else
  echo "❌ GitHub Actions workflow failed with exit code $EXIT_CODE"
fi

exit $EXIT_CODE
