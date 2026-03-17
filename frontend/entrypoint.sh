#!/bin/sh
set -e

# Replace placeholder with actual backend URL
if [ -n "$BACKEND_URL" ]; then
    sed -i "s|BACKEND_URL_PLACEHOLDER|${BACKEND_URL}|g" /usr/share/nginx/html/js/config.js
fi

# Substitute ${PORT} in nginx config template (Railway sets PORT dynamically)
export PORT="${PORT:-3000}"
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
