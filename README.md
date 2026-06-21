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

## Workflow Rules & Roles
ECOFlow uses a strict role-based access control (RBAC) system to manage the lifecycle of an Engineering Change Order (ECO).

### 1. Engineer
- **Role**: Creates and manages the initial draft of an ECO.
- **Workflow**: When an Engineer creates an ECO, it starts in **"Draft"** status. *Draft ECOs are completely invisible to Approvers.* The Engineer must add at least one "Proposed Change" record to the ECO, and then explicitly click the **"Submit ECO"** button to send it to the Approvers.

### 2. Approver
- **Role**: Reviews and approves/rejects submitted ECOs.
- **Workflow**: Approvers monitor their Dashboard for ECOs that have been **"Submitted"**. They can review the requested changes, add comments, and choose to Approve, Reject, or Request Changes. Approving an ECO automatically triggers the generation of a new Product/BOM Version.

### 3. Production Manager / Production
- **Role**: Monitors approved changes and manages releases.
- **Workflow**: Only sees ECOs *after* they have been approved and new versions have been generated.

### 4. Admin
- **Role**: Has access to audit logs, user management, and system configuration.
