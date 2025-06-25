# StudyGroups - Student Productivity Dashboard

A full-stack web application for managing study groups, tracking tasks, and boosting student productivity through collaboration.

## Features

- **Dashboard Overview**: Statistics and recent activity
- **Group Management**: Create and manage study groups
- **Member Management**: Add members to groups
- **Task Assignment**: Create tasks and assign to group members
- **Progress Tracking**: Monitor task completion and status
- **Database Persistence**: PostgreSQL integration

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: Tailwind CSS, shadcn/ui components
- **State Management**: TanStack Query

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   ```bash
   # Set DATABASE_URL environment variable
   npm run db:push
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Deployment

- **Development**: `npm run dev`
- **Production**: `npm run build && npm start`
- **Database**: `npm run db:push`

## Environment Variables

```
DATABASE_URL=postgresql://username:password@host:port/database
```

## Project Structure

```
studygroups/
├── client/src/          # React frontend application
├── server/              # Express.js backend API
├── shared/              # Shared TypeScript schemas
└── package.json         # Project dependencies
```