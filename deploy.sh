#!/bin/bash

echo "🚀 Deploying CrossNations Backend with PM2..."

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Create necessary directories
mkdir -p logs uploads

# Install dependencies
echo "Installing dependencies..."
npm install

# Build TypeScript
echo "Building TypeScript..."
npm run build

# Stop existing PM2 process if running
pm2 stop crossnations-backend 2>/dev/null || true
pm2 delete crossnations-backend 2>/dev/null || true

# Start application with PM2
echo "Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup

echo "✅ Deployment completed!"
echo "📊 Monitor with: pm2 monit"
echo "📋 View logs: pm2 logs crossnations-backend"
echo "🔄 Restart: pm2 restart crossnations-backend"