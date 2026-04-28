# In this Dockerfile we use node:alpine for a lightweight image.
# In case npm fails due to missing linux packages, try switching to node:lts
# To get a full Ubuntu release with more binaries.

# Stage 1: Install all dependencies and compile TypeScript
FROM node:24-alpine AS builder
ARG SENTRY_AUTH_TOKEN
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Install only production dependencies
FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --production && npm cache clean --force

# Stage 3: Assemble everything and run the server
FROM node:24-alpine
RUN mkdir -p /app
WORKDIR /app
COPY package*.json api.yaml ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 7777
CMD [ "npm", "start" ]
