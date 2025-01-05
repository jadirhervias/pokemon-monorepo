FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src ./src
COPY nest-cli.json tsconfig*.json .eslintrc.js ./

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* .npmrc* ./
# Omit --production flag for TypeScript devDependencies
# RUN npm ci --production
RUN npm ci --only=production

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG DB_URI
ENV DB_URI=${DB_URI}
ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET}
ARG JWT_EXPIRATION_TIME
ENV JWT_EXPIRATION_TIME=${JWT_EXPIRATION_TIME}

CMD ["node", "dist/main.js"]