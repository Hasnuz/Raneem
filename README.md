# Raneem Businessmen Services

Production-oriented monorepo for Raneem's UAE business-services website.

## Architecture

- `frontend`: Next.js App Router, React, TypeScript and Tailwind CSS
- `backend`: Express REST API, TypeScript, MongoDB and Mongoose
- `docs`: discovery, SEO architecture and launch notes

## Setup

1. Install Node.js 20+ and MongoDB 7+ (or create a MongoDB Atlas cluster).
2. Run `npm install` from this directory.
3. Copy `frontend/.env.example` to `frontend/.env.local`.
4. Copy `backend/.env.example` to `backend/.env` and use a 32+ character random JWT secret.
5. Run `npm run dev`. Frontend defaults to `http://localhost:3000`; API defaults to `http://localhost:4000`.

## Commands

- `npm run dev`: run both applications
- `npm run typecheck`: check both TypeScript projects
- `npm run build`: create production builds
- `npm run lint`: lint both workspaces

## Production

Deploy `frontend` to Vercel and `backend` to a Node host such as Railway, Render, AWS or DigitalOcean. Use MongoDB Atlas, set exact `CORS_ORIGIN`, and configure HTTPS URLs. Secrets must be stored in the hosting provider, never committed.

Create the first admin user with the provided one-time script, which hashes the password with bcrypt. Never insert a plaintext password directly into MongoDB.

### Admin dashboard

1. Configure `MONGODB_URI`, a random 32+ character `JWT_SECRET`, `ADMIN_EMAIL`, and an `ADMIN_PASSWORD` of at least 12 characters in `backend/.env`.
2. Run `npm run create-admin -w backend` once to create or update the administrator securely.
3. Start both applications and open `/admin`.

The dashboard provides 30-day page views, unique browser sessions, tracked CTA/contact clicks, enquiries, top pages and recent activity. It also provides blog draft/review/publish management and enquiry status management. Analytics are first-party and stored in MongoDB; add an appropriate disclosure and consent handling where required by the deployment's applicable privacy rules.

The frontend and API should use compatible origins. In production, set `CORS_ORIGIN` to the exact frontend origin. Admin authentication uses an HTTP-only cookie; HTTPS is required when the frontend and API are on different production domains.

## SEO and launch

Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin. Verify the sitemap, robots file, canonical host redirect and Search Console ownership after deployment. Inventory legacy URLs in analytics/Search Console and expand `next.config.ts` redirects to the closest matching pages.

Content about regulations, fees, processing periods, eligibility and required documents must be reviewed against current UAE authority sources before publication. Legal placeholders require professional review. Confirm email, office address, statistics, client logos and review permissions with Raneem before launch.

## Backups

Enable Atlas automated backups, test restoration quarterly, and export content before major migrations. Keep media in versioned object storage with lifecycle and access controls.
