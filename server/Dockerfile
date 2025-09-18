# server/Dockerfile
FROM node:20-alpine3.22 AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Generate Prisma client for dev; ignore failure if DB not up yet
RUN npx prisma generate || true
EXPOSE 4000
# Command comes from docker-compose (npm run dev)
