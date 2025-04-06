#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const https = require('https');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

console.log(`${COLORS.blue}=== Dev Environment Deployment Tool ===${COLORS.reset}`);
console.log('This script will build and deploy your app to the dev environment.\n');

// Run tests first
try {
  console.log(`${COLORS.yellow}Running tests...${COLORS.reset}`);
  execSync('npm test', { stdio: 'inherit' });
} catch (error) {
  console.error(`${COLORS.red}Tests failed. Fix the issues before deploying.${COLORS.reset}`);
  process.exit(1);
}

// Check for GitHub token
const githubToken = process.env.GITHUB_TOKEN;
if (!githubToken) {
  console.error(`${COLORS.red}Error: GITHUB_TOKEN environment variable is not set.${COLORS.reset}`);
  console.log('To deploy to dev environment:');
  console.log('1. Create a personal access token with "workflow" scope at https://github.com/settings/tokens');
  console.log('2. Export it as GITHUB_TOKEN in your shell: export GITHUB_TOKEN=your_token_here');
  process.exit(1);
}

// Get repo details
let repoPath;
try {
  const remoteUrl = execSync('git remote get-url origin').toString().trim();
  
  if (remoteUrl.startsWith('https://github.com/')) {
    repoPath = remoteUrl.replace('https://github.com/', '').replace('.git', '');
  } else if (remoteUrl.startsWith('git@github.com:')) {
    repoPath = remoteUrl.replace('git@github.com:', '').replace('.git', '');
  } else {
    throw new Error('Unsupported git remote format');
  }
} catch (error) {
  console.error(`${COLORS.red}Error: Failed to get repository information.${COLORS.reset}`);
  console.error(error.message);
  process.exit(1);
}

rl.question(`${COLORS.yellow}Do you want to deploy to the dev environment? (y/n) ${COLORS.reset}`, (answer) => {
  if (answer.toLowerCase() !== 'y') {
    console.log('Deployment canceled.');
    rl.close();
    return;
  }

  // Get current branch
  const currentBranch = execSync('git symbolic-ref --short HEAD').toString().trim();
  
  console.log(`${COLORS.green}Triggering deployment to dev environment from branch ${currentBranch}...${COLORS.reset}`);
  
  // Prepare the request data
  const data = JSON.stringify({
    ref: currentBranch,
    inputs: {
      environment: 'dev'
    }
  });
  
  // Setup the request options
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${repoPath}/actions/workflows/deploy.yml/dispatches`,
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${githubToken}`,
      'User-Agent': 'Node.js',
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  
  // Send the request
  const req = https.request(options, (res) => {
    if (res.statusCode === 204) {
      console.log(`${COLORS.green}Deployment triggered successfully!${COLORS.reset}`);
      console.log(`${COLORS.blue}Check your GitHub Actions workflow status at: https://github.com/${repoPath}/actions${COLORS.reset}`);
      console.log(`${COLORS.blue}Your app will be available at: https://<username>.github.io/${repoPath.split('/')[1]}/dev${COLORS.reset}`);
    } else {
      console.error(`${COLORS.red}Error: Received status code ${res.statusCode}${COLORS.reset}`);
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        console.error(`${COLORS.red}Response: ${responseData}${COLORS.reset}`);
      });
    }
  });
  
  req.on('error', (error) => {
    console.error(`${COLORS.red}Error: ${error.message}${COLORS.reset}`);
  });
  
  req.write(data);
  req.end();
  
  rl.close();
});

rl.on('close', () => {
  console.log(`${COLORS.blue}=== Deployment script completed ===${COLORS.reset}`);
});