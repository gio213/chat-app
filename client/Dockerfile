# server/Dockerfile
FROM node:20-alpine3.22 AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# command comes from docker-compose (npm run dev)
