#!/bin/sh
set -e

# Replace placeholder with actual backend URL
if [ -n "$BACKEND_URL" ]; then
    sed -i "s|BACKEND_URL_PLACEHOLDER|${BACKEND_URL}|g" /usr/share/nginx/html/js/config.js
fi

exec "$@"
