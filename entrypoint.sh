#!/bin/sh
set -e

# Link storage
php artisan storage:link --force || true

# Run database migrations
echo "Running migrations..."
php artisan migrate --force

echo "Checking loaded Apache modules..."
apache2ctl -M | grep mpm || true

# Use the port provided by Railway (e.g. 8080) or default to 80
PORT_NUMBER=${PORT:-80}
echo "Starting Apache on port $PORT_NUMBER..."

# Update Apache to listen on the correct port
sed -i "s/Listen 80/Listen $PORT_NUMBER/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:$PORT_NUMBER>/g" /etc/apache2/sites-available/000-default.conf

# Start Apache
exec apache2-foreground
