#!/bin/bash

# Variables
PROJECT_DIR="/var/www/getMeOut"
BACKEND_DIR="$PROJECT_DIR/backend"
PM2_PROCESS_NAME="getMeOut"

# Navigate to the project directory
echo "Navigating to project directory..."
cd "$PROJECT_DIR" || exit

# Pull the latest changes from Git
echo "Pulling latest changes from GitHub..."
git reset --hard origin/main
git pull origin main

# Navigate to the backend directory
echo "Navigating to backend directory..."
cd "$BACKEND_DIR" || exit

# Install or update dependencies
echo "Installing/updating dependencies..."
npm install

# Restart the server with PM2
echo "Restarting the server with PM2..."
pm2 restart "$PM2_PROCESS_NAME" || pm2 start src/server.js --name "$PM2_PROCESS_NAME"

# Save the PM2 process list for reboot persistence
pm2 save

echo "Deployment complete!"