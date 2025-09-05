#!/bin/bash
# This script is used specifically for Vercel builds

# Print Node.js and npm versions
echo "Node.js version:"
node -v
echo "npm version:"
npm -v

# Install dependencies with specific flags to avoid issues
echo "Installing dependencies..."
npm install --no-audit --no-fund --legacy-peer-deps

# Build the application
echo "Building the application..."
npm run build

echo "Build completed successfully!"
