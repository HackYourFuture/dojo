# Stage 1: Install all dependencies and build the React app
FROM node:24-alpine AS builder
ARG VITE_APP_CLIENTID
ENV VITE_APP_CLIENTID=$VITE_APP_CLIENTID

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
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
