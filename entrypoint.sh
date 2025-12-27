#!/bin/sh
set -e

# Use the port provided by Railway or fallback to 80
PORT_NUMBER=${PORT:-80}

echo "Starting Apache on port $PORT_NUMBER..."

# Update Apache configuration to use the dynamic port
sed -i "s/Listen 80/Listen $PORT_NUMBER/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:$PORT_NUMBER>/g" /etc/apache2/sites-available/000-default.conf

# Start Apache in the foreground
exec apache2-foreground
