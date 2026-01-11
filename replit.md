# Bally Up Gang (BuG) Community Website

## Overview

This is a community website for "Bally Up Gang" (BuG), a gaming/streaming community. The application serves as a hub for merchandise sales, event announcements, media gallery, team member profiles, and community rules. It features a bold black and gold cyberpunk/gaming aesthetic with neon effects and modern UI components.

The project follows a full-stack TypeScript architecture with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom cyberpunk/gaming theme (black/gold palette)
- **UI Components**: shadcn/ui component library (Radix primitives + Tailwind)
- **Animations**: Framer Motion for page transitions and complex animations
- **Build Tool**: Vite with HMR support

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Authentication**: Replit Auth integration with OpenID Connect and Passport.js
- **Session Management**: PostgreSQL-backed sessions via `connect-pg-simple`

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Zod schema generation
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit with `db:push` command

### Key Data Models
- Users (authentication)
- Teams (community members/streamers)
- Merchandise (shop items with prices in cents)
- Events (community events and giveaways)
- Gallery (images and video links)
- Social Links
- Streams
- Suggestions (community feedback)

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components including shadcn/ui
    pages/        # Route pages (Home, Merchandise, Events, Gallery, Rules)
    hooks/        # Custom React hooks (use-auth, use-data, use-toast)
    lib/          # Utilities (queryClient, auth-utils)
server/           # Express backend
  replit_integrations/auth/  # Replit Auth setup
shared/           # Shared code between client/server
  schema.ts       # Drizzle database schema
  routes.ts       # API route definitions with Zod schemas
  models/         # Shared TypeScript models
```

### API Structure
Routes are defined declaratively in `shared/routes.ts` with:
- HTTP method and path
- Input validation schemas (Zod)
- Response type definitions

Endpoints include:
- `/api/merchandise` - CRUD for shop items
- `/api/events` - Event management
- `/api/gallery` - Media gallery
- `/api/socials` - Social media links
- `/api/teams` - Team member profiles
- `/api/streams` - Stream information
- `/api/suggestions` - Community suggestions
- `/api/auth/*` - Authentication endpoints

## External Dependencies

### Database
- PostgreSQL (required, provisioned via Replit)
- Connection via `DATABASE_URL` environment variable

### Authentication
- Replit Auth (OpenID Connect)
- Requires `REPL_ID`, `ISSUER_URL`, and `SESSION_SECRET` environment variables

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations
- `@tanstack/react-query` - Server state management
- `framer-motion` - Animations
- `zod` - Schema validation
- `passport` / `openid-client` - Authentication
- `express-session` / `connect-pg-simple` - Session management

### Development Tools
- Vite with Replit-specific plugins (`@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`)
- esbuild for production server bundling