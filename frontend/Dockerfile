FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx config template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy static files
COPY . /usr/share/nginx/html

# Entrypoint: inject BACKEND_URL into config.js, then start nginx
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
