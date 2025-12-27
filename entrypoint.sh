#!/bin/sh

# Replace the port in Apache config with the one provided by Railway
sed -i "s/80/${PORT:-80}/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Start Apache in the foreground
exec apache2-foreground
