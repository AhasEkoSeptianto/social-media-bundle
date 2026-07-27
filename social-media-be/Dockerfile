#############################
# Base
#############################
FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

#############################
# Development
#############################
FROM base AS dev

EXPOSE 3001

CMD ["npm","run","dev"]

#############################
# Test
#############################
FROM base AS test

RUN npm test

#############################
# Production
#############################
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3001

CMD ["npm","start"]