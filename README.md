# Project Template

A reusable Express application baseline with an MVC structure, EJS views,
PostgreSQL persistence, session-backed authentication, role-based access, form
validation, flash messages, and shared error handling.

## Create a project from this template

1. Copy this directory and rename the copy for the new project.
2. Change `name` in `package.json`.
3. Set `APP_NAME` and the other values in `.env`.
4. Replace the default home content, page metadata, styles, and routes as needed.
5. Remove authentication or database features if the new project does not need them.

## Setup

Install dependencies and create a local environment file:

```bash
npm install
cp .env.example .env
```

Create a PostgreSQL database, update `DB_URL`, and run `src/setup.sql` against
that database. Replace `SESSION_SECRET` with a long, random value.

Start the application:

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

The server uses `PORT` from `.env` and falls back to `3000`.

## Project structure

```text
app.js                 Express application configuration
server.js              Database check and HTTP server startup
public/                 Browser scripts, styles, and images
src/
  config/               Site, page metadata, and session configuration
  controllers/          Request handlers and form validation
  database/             PostgreSQL connection pool
  middleware/           Shared Express middleware
  migrations/           Incremental database migrations
  models/               Data access and domain logic
  views/                EJS pages and shared partials
  routes.js             Application routes
  setup.sql             Initial database schema
```

## Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `APP_NAME` | Name displayed in shared page elements | `Project Template` |
| `PORT` | HTTP port | `3000` |
| `HOST` | Development bind address | `127.0.0.1` |
| `NODE_ENV` | Runtime environment | `production` |
| `DB_URL` | PostgreSQL connection string | Required |
| `SESSION_SECRET` | Session-cookie signing secret | Required |
| `ENABLE_SQL_LOGGING` | Log database queries in development | `false` |
