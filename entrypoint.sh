#!/bin/sh
set -e

# Default port to 80 if not set
export PORT=${PORT:-80}

echo "Starting Apache on port $PORT..."

# Use Apache's built-in env var support in the config files
sed -i "s/Listen 80/Listen \${PORT}/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:\${PORT}>/g" /etc/apache2/sites-available/000-default.conf

# Start Apache in the foreground
exec apache2-foreground
