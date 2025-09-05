#!/usr/bin/env node

// This script prepares the project for GitHub Pages deployment

const fs = require('fs');
const path = require('path');

console.log('Preparing EcoTracker for GitHub Pages deployment...');

// 1. Modify vite.config.ts to add base path
const viteConfigPath = path.join(__dirname, 'vite.config.ts');
let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');

if (!viteConfig.includes('base:')) {
  viteConfig = viteConfig.replace(
    'export default defineConfig({',
    'export default defineConfig({\n  base: \'/ecotracker/\',',
  );

  fs.writeFileSync(viteConfigPath, viteConfig);
  console.log('✅ Updated vite.config.ts with base path');
} else {
  console.log('ℹ️ vite.config.ts already has base path configured');
}

// 2. Create or update .github/workflows/deploy.yml for GitHub Actions
const workflowsDir = path.join(__dirname, '.github/workflows');
if (!fs.existsSync(workflowsDir)) {
  fs.mkdirSync(workflowsDir, { recursive: true });
}

const deployWorkflowPath = path.join(workflowsDir, 'deploy.yml');
const deployWorkflow = `# Simple workflow for deploying EcoTracker to GitHub Pages
name: Deploy EcoTracker to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./ecotracker
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: 'npm'
          cache-dependency-path: './ecotracker/package-lock.json'
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./ecotracker/dist

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

fs.writeFileSync(deployWorkflowPath, deployWorkflow);
console.log('✅ Created GitHub Actions workflow for deployment');

// 3. Add a note about configuring GitHub Pages in repository settings
console.log('\n📝 NEXT STEPS:');
console.log('1. Commit and push these changes to your GitHub repository:');
console.log('   git add .');
console.log('   git commit -m "Configure for GitHub Pages deployment"');
console.log('   git push');
console.log('\n2. Go to your GitHub repository settings:');
console.log('   - Navigate to Settings > Pages');
console.log('   - Under "Source", select "GitHub Actions"');
console.log('\n3. Your app will be deployed to: https://[your-username].github.io/ecotracker/');
console.log('\nNote: Since the backend won\'t be deployed, the app will run in offline mode with mock data.');
