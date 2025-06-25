# StudyGroups - Student Productivity Dashboard

## Overview

StudyGroups is a full-stack web application designed to help students manage study groups, assign tasks, and boost productivity through collaboration. The application provides a comprehensive dashboard for creating groups, tracking task progress, and managing member activities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (PostgreSQL-compatible)
- **Session Management**: Connect-pg-simple for PostgreSQL session store
- **Development**: HMR (Hot Module Replacement) via Vite middleware

### Data Storage
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Centralized schema definition in `/shared/schema.ts`
- **Migrations**: Managed through Drizzle Kit

## Key Components

### Database Schema
The application uses three main entities:
1. **Groups**: Study groups with name, description, and creation timestamp
2. **Members**: Group participants with email and join date
3. **Tasks**: Assignable tasks with status, priority, due dates, and assignee relationships

### API Routes
RESTful API endpoints for:
- Groups CRUD operations with statistics
- Members management within groups
- Tasks with detailed information including assignee and group data
- Dashboard statistics aggregation

### Frontend Pages
- **Dashboard**: Overview with statistics cards and recent groups
- **Groups**: Full group listing with search functionality
- **Group Detail**: Individual group management with members and tasks
- **Tasks**: Global task management interface
- **404 Page**: Error handling for non-existent routes

## Data Flow

1. **Client Requests**: React components use TanStack Query for data fetching
2. **API Layer**: Express.js routes handle HTTP requests with Zod validation
3. **Business Logic**: Storage interface abstracts database operations
4. **Database**: Drizzle ORM executes type-safe SQL queries against PostgreSQL
5. **Response**: JSON data flows back through the same layers with error handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon Database connection driver
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Headless UI primitives for accessibility
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Frontend build tool and development server

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev` runs both frontend and backend with HMR
- **Port**: Application serves on port 5000
- **Database**: Uses DATABASE_URL environment variable for Neon connection

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Deployment**: Replit autoscale deployment with build and run commands
- **Database**: Drizzle migrations applied via `npm run db:push`

### Replit Configuration
- **Modules**: Node.js 20, web development, PostgreSQL 16
- **Build Process**: Automated via `npm run build`
- **Runtime**: Production server runs bundled code with `npm start`
- **Port Mapping**: Internal port 5000 mapped to external port 80

## Changelog

Changelog:
- June 25, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.