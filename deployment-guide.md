# StudyGroups Deployment Guide

## Quick Local Setup

1. **Create new folder and copy these files:**
   - package.json
   - tsconfig.json
   - vite.config.ts
   - tailwind.config.ts
   - drizzle.config.ts
   - All folders: client/, server/, shared/

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   # Create .env file with:
   DATABASE_URL=postgresql://username:password@localhost:5432/studygroups
   ```

4. **Run database setup:**
   ```bash
   npm run db:push
   ```

5. **Start development:**
   ```bash
   npm run dev
   ```

## Alternative: Deploy Directly

### Deploy to Railway:
1. Connect GitHub repo to Railway
2. Set DATABASE_URL environment variable
3. Deploy automatically

### Deploy to Vercel:
1. Push to GitHub
2. Import project in Vercel
3. Add PostgreSQL database (Neon/Supabase)
4. Set environment variables

## Project Structure:
```
studygroups/
├── client/src/          # React frontend
├── server/              # Express backend
├── shared/              # Shared types/schemas
├── package.json         # Dependencies
└── configuration files
```