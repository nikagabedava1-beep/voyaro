#!/bin/bash

# Voyaro Web Deploy Script
# Run this script from /var/www/voyaro/voyaro-web

set -e  # Exit on error

echo "🚀 Starting Voyaro Web deployment..."

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull

# Install dependencies (if any new ones)
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Copy static files to standalone folder (required for standalone mode)
echo "📁 Copying static files..."
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart voyaro-web

echo "✅ Deployment complete!"
echo "🌐 Website: https://voyaro.ge"
