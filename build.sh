#!/bin/bash

echo "🚀 Starting MyAnime Build Process..."

# 1. Backend Setup
echo "📦 Optimizing Backend..."
cd backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
cd ..

# 2. Frontend Setup
echo "🎨 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Build Complete! Ready for deployment."
