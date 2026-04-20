# Stage 1: Install all dependencies and compile TypeScript
FROM node:alpine AS builder
ARG SENTRY_AUTH_TOKEN
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

# Stage 2: Install only production dependencies
FROM node:alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --production && npm cache clean --force

# Stage 3: Assemble everything and run the server
FROM node:alpine
RUN mkdir -p /app
WORKDIR /app
COPY package*.json api.yaml ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 7777
CMD [ "npm", "start" ]
