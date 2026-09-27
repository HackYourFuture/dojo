# Stage 1: Install all dependencies and build the React app
FROM node:24-alpine AS builder
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the built React app with nginx
FROM nginx:alpine
# Default BACKEND_URL for typical container networking; override at runtime if needed
# Set the BACKEND_URL without /api
ENV BACKEND_URL=http://dojo-server:7777
# Exposes the container's DNS servers as NGINX_LOCAL_RESOLVERS for the nginx template
ENV NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1
# VITE_GOOGLE_CLIENTID (Google OAuth client ID) must be provided at runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
