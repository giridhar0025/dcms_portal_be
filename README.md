# DCMS Portal Backend Boilerplate

This project provides a production-ready boilerplate using **Node.js**, **Express**, **Prisma** with MongoDB, **JWT** authentication and **Swagger** documentation.

## Features
- Modular folder structure
- Prisma MongoDB setup
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

### Environment variables

Create a `.env` file with the following keys:

```
PORT=3000
DATABASE_URL=<your MongoDB connection string>
JWT_SECRET=<secret used to sign tokens>
```

These values should also be configured in your Render service settings.

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

## Deployment

The project deploys to **Render**. Deployment runs automatically when a pull
request is merged into the `main` branch or when the *Deploy to Render* workflow
is manually triggered from the Actions tab. The workflow uses a deploy hook URL
stored in the `RENDER_DEPLOY_HOOK` secret.

