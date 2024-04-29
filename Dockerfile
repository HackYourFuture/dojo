FROM node:latest

# Vite environment variables must be defined in docker build time
ARG VITE_APP_CLIENTID
ARG PORT

RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm run setup
RUN npm run build
EXPOSE $PORT
CMD ["npm", "start"]