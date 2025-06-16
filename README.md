# DCMS Portal Backend Boilerplate

This project provides a production-ready boilerplate using **Node.js**, **Express**, **Prisma** with MongoDB, **BullMQ**, **Redis**, **JWT** authentication and **Swagger** documentation.

## Features
- Modular folder structure
- Prisma MongoDB setup
- Job queue using BullMQ
- Centralized validation with Zod
- Swagger documentation
- Jest + Supertest test setup

## Setup

1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project (generates the Prisma client):
   ```bash
   npm run build
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Build

Generate the Prisma client:
```bash
npm run build
```

## Run

Start the development server:
```bash
npm run dev
```

Start the production server:
```bash
npm start
```

## Tests

Run tests with:
```bash
npm test
```

