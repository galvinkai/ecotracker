#!/bin/bash
# Debug script for Vercel builds

# Show environment info
echo "===== ENVIRONMENT INFO ====="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Working directory: $(pwd)"
echo "Files in current directory:"
ls -la

# Navigate to ecotracker directory
echo "===== NAVIGATING TO ECOTRACKER DIRECTORY ====="
cd ecotracker
echo "Current directory: $(pwd)"
echo "Files in ecotracker directory:"
ls -la

# Install dependencies
echo "===== INSTALLING DEPENDENCIES ====="
npm install --production=false --verbose

# Check for errors in installation
if [ $? -ne 0 ]; then
    echo "===== ERROR: NPM INSTALL FAILED ====="
    exit 1
fi

# Build the app
echo "===== BUILDING THE APP ====="
npm run build --verbose

# Check for build errors
if [ $? -ne 0 ]; then
    echo "===== ERROR: BUILD FAILED ====="
    exit 1
fi

echo "===== BUILD COMPLETED SUCCESSFULLY ====="
echo "Files in dist directory:"
ls -la dist/

exit 0
