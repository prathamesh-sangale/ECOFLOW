# ECOFlow

Engineering Change Order (ECO) and Version Management System for Furniture SMEs.

## Project Overview
ECOFlow is a comprehensive monorepo project structured to manage the lifecycle of Engineering Change Orders and BOM versions across a Web App, Mobile App, and a robust Backend API.

## Architecture Overview
- **apps/web**: React + Vite + TypeScript web application using TailwindCSS and React Router.
- **apps/mobile**: React Native + Expo + TypeScript mobile application using Expo Router.
- **apps/backend**: Express + Prisma + TypeScript backend REST API.
- **packages/shared-***: Reusable logic, constants, types, schemas, and UI components.

## Development Setup

1. Install Dependencies:
   ```bash
   npm install
   ```

2. Configure Environment:
   Copy `.env.example` to `.env` and fill in the required keys for Supabase, Database, and JWT.

3. Run Applications:
   - Web App: `npm run dev:web`
   - Mobile App: `npm run dev:mobile`
   - Backend API: `npm run dev:backend`

## Coding Standards
- TypeScript in Strict Mode for all projects.
- ESLint and Prettier used for linting and formatting.
- Husky + lint-staged configured to format code before commits.

## Database & Services
This project uses **PostgreSQL** hosted on **Supabase** with **Prisma ORM**.
To pull changes or generate client:
```bash
cd apps/backend
npx prisma db push
npx prisma generate
```
