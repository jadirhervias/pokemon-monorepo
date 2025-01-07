# Pokemon Monorepo

## Features

- [Node/NPM](https://nodejs.org/es) (22.12.0/10.9.0)
- [TypeScript](https://www.typescriptlang.org/) (v5)
- [Docker Compose](https://docs.docker.com/compose/gettingstarted/) (v3)
- [Next.js/React](https://nextjs.org/) (v15)
- [NestJS](https://docs.nestjs.com/) (v10)
- [MongoDB](https://hub.docker.com/_/mongo)

## Local address
 - Frontend: http://localhost:3000
 - Backend: http://localhost:4000

## Files(.csv) for test

See [CSV examples](backend/etc).

## Using Docker Compose

### 👉 Run all at once
```bash
npm run start
```

### Re-build services
```bash
npm run re-build
```

### Stop all services (attached)
```bash
npm run stop
```

### Run all services (dettached)
```bash
npm run start:watch
```

## Running only mongo database
```bash
docker-compose up mongo
```

## Running backend locally
```bash
cd backend
npm i
npm run start:dev
```

## Running frontend locally
```bash
cd frontend
npm i
npm run dev
```