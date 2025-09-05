#!/bin/bash
# This script is used by Vercel to build the frontend app

# Navigate to the ecotracker directory
cd ecotracker

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the app
echo "Building the app..."
npm run build

# Success message
echo "Build completed successfully!"
