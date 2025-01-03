# FROM node:20-alpine as builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --production
# COPY . .
# RUN npm run build

# FROM node:20-alpine
# WORKDIR /app
# COPY package*.json ./
# ENV PORT=4000
# ENV NODE_ENV=Production
# RUN npm install --production
# COPY --from=builder /app/dist ./dist
# EXPOSE ${PORT}
# CMD ["npm", "run", "start:prod"]


FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json ./
COPY .env ./
COPY dist ./dist
RUN npm install --production