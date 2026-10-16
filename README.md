# Internflare Frontend

Internflare is a career platform frontend for discovering internships and jobs, building evidence-based profiles, and exploring learning and career pathways. It includes talent and employer experiences such as onboarding, skills assessments, applications, portfolio management, mentoring, billing, and listing management.

## Technology

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Better Auth React client

## Requirements

- Node.js 20.11 or later
- npm

## Installation

From this directory, install the frontend dependencies:

```sh
npm install
```

## Configuration

Create a local environment file from the example:

```powershell
Copy-Item .env.example .env
```

Set `VITE_BETTER_AUTH_URL` in `.env` to the URL of the authentication API. For local development, the default is:

```dotenv
VITE_BETTER_AUTH_URL=http://localhost:3001
```

The authentication API must be available at that URL for sign-in, sign-up, social authentication, session, and sign-out features to work. The frontend does not contain provider secrets; OAuth credentials should never be placed in `VITE_` variables.

## Development

Start the Vite development server:

```sh
npm run dev
```

Vite prints the local URL in the terminal, normally `http://localhost:5173`.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run type-check` | Run the TypeScript check |
| `npm run lint` | Lint the frontend source |
| `npm run lint:fix` | Automatically fix supported lint issues |
| `npm run format` | Format source and documentation files |

## Authentication features

The frontend integrates Better Auth's React client for email/password sign-up and sign-in, social sign-in, session display, and sign-out. Employer account selection currently routes users to employer onboarding; employer-specific account details are not yet collected by the authentication flow.
