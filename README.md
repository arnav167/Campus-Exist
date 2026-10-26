# CampusExist

CampusExist is a student campus utility platform for IILM University. It supports a marketplace for buying, selling, renting and lending items; lost-and-found reports; borrowing requests; and private belongings management.

## Tech stack

- React 19, TypeScript and TanStack Start
- Vite and Tailwind CSS v4
- Supabase for authentication, PostgreSQL and image storage

## Run locally

1. Install Node.js LTS.
2. Install dependencies: `npm install`
3. Create `.env.local` in the project root with your Supabase project URL and publishable key:

   ```dotenv
   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
   ```

4. Start the development server: `npm run dev`
5. Open the local URL printed in the terminal.

Never place a Supabase secret/service-role key in a `VITE_*` variable or commit `.env.local`.

## Supabase setup

The `supabase/migrations/` directory contains the initial database schema. Any follow-up SQL changes are in `supabase/patches/`. Review and apply SQL in the Supabase SQL Editor for your project.

## Main routes

- `/` — Home dashboard
- `/marketplace` — Listings
- `/lost-found` — Lost and found reports
- `/borrowing` — Borrowing requests
- `/belongings` — Private inventory
- `/auth` — Sign in and sign up
- `/profile` — User profile
- `/help` — Help and safety

Some functionality may still need end-to-end testing against your Supabase project. Do not treat a feature as complete until it has been tested.
