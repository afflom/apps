# Claude Automation for Issue Implementation

This repository includes an automated workflow that uses Claude AI to implement solutions for GitHub issues. When a repository maintainer adds the "claude" label to an issue, Claude will automatically attempt to implement a solution and create a pull request.

## How It Works

1. A GitHub issue is created with detailed requirements
2. A repository maintainer adds the "claude" label to the issue
3. The GitHub Actions workflow is triggered:
   - Checks if the issue has enough information
   - Uses Claude AI to analyze the issue and implement changes
   - Verifies the changes with linting and tests
   - Creates a pull request with the changes
   - Links the PR back to the original issue

## Requirements for Claude-ready Issues

For Claude to successfully implement an issue:

- The issue must contain detailed requirements and clear acceptance criteria
- The implementation should be relatively focused and well-defined
- Where relevant, examples or specific files to modify should be included
- The issue description should be at least 100 characters long (basic validation)

## Example Issue Template

We provide issue templates with a "Claude-ready?" section that can help contributors create issues that Claude can implement. These templates include:

- Feature request template
- Bug report template

## Security and Permissions

- Only repository maintainers can add the "claude" label to issues
- Claude AI's access is controlled through a GitHub secret (`ANTHROPIC_API_KEY`)
- The workflow runs with limited GitHub token permissions to minimize security risks
- Claude is instructed not to modify pre-commit or pre-push hooks

## Setup Requirements

For this automation to work, the repository needs:

1. The `ANTHROPIC_API_KEY` secret configured in repository settings
2. Branch protection rules on the main branch, requiring PR reviews
3. GitHub Actions enabled for the repository

## Implementation Methods

There are two implementation options available:

### 1. Standard Implementation (Default)

This method runs Claude directly in the GitHub Actions runner environment. It's triggered when an issue is labeled with "claude".

### 2. Docker Implementation (Optional)

This method runs Claude inside a Docker container for more isolation. It's only triggered when an issue has both the "claude" AND "use-docker" labels.

To use the Docker implementation:
1. Add the "claude" label to the issue
2. Add the "use-docker" label to the issue

## Workflow Details

Both implementation methods follow these steps:

1. **Issue Validation**: Checks if the issue has enough detail
2. **Implementation**: Claude analyzes the issue and implements changes
3. **Verification**: Changes are validated with typecheck, linting, and tests
4. **Pull Request**: A PR is created with Claude's changes
5. **Notification**: The issue is updated with a link to the PR

All Claude output is captured in the GitHub Actions logs for troubleshooting.

## Limitations

There are some limitations to what Claude can implement:

- Very complex architectural changes might be challenging
- Issues requiring external integrations or services might need human assistance
- Claude works best with well-defined, focused tasks
- Sensitive security changes should always be human-reviewed

## For Repository Maintainers

If you're a maintainer, you can trigger Claude by:

1. Reviewing an issue to ensure it's well-defined
2. Adding the "claude" label to the issue
3. Monitoring the resulting pull request and providing feedback

Remember that you should review PRs as thoroughly as you would human-authored ones.