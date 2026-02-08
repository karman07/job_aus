#!/bin/bash

echo "🚀 Starting deployment..."

# Build TypeScript
echo "📦 Building TypeScript..."
npm run build

# Create logs directory if not exists
mkdir -p logs

# Restart PM2 application
echo "🔄 Restarting PM2 application..."
pm2 restart ecosystem.config.js --update-env

# Save PM2 process list
echo "💾 Saving PM2 process list..."
pm2 save

echo "✅ Deployment complete!"
echo "📊 View status: pm2 status"
echo "📝 View logs: pm2 logs crossnations-backend"
