# Link in Bio

A beautiful, customizable link-in-bio page with a built-in dashboard for managing links, tracking analytics, and customizing your theme.

**What you get:**
- A public page at your own URL where fans can see all your links
- A private dashboard where you add/edit links, upload your photo, pick colors, and track clicks
- Drag-and-drop reordering, campaign links that auto-expire, social icons
- Works on phones, tablets, and desktops
- Runs on free tiers (Vercel + Neon Postgres) — no monthly fees

---

# For Non-Technical Users

No terminal required. No code to edit. ~5 minutes start to finish.

## Step 1 — Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fryliefrederick-collab%2Flink-in-bio-template&project-name=linkbio&repository-name=linkbio&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22neon%22%2C%22productSlug%22%3A%22neon%22%2C%22protocol%22%3A%22storage%22%7D%5D)

Click that button. Vercel will walk you through:

1. **Sign in or sign up** (Vercel's free Hobby plan is fine, no credit card)
2. **Authorize GitHub** so Vercel can copy the code into your account (it'll ask you to sign up for GitHub too if you don't have one — also free)
3. **Add Neon Postgres** when prompted — this is your database. Free, auto-configured, nothing to set up yourself
4. **Click "Deploy"** and wait about a minute

## Step 2 — Pick Your Password

When the deploy finishes, Vercel will show you a link to your new site (something like `linkbio-abc123.vercel.app`). Click it.

You'll land on a page asking you to pick a dashboard password. **Write this password down somewhere safe.** There's no "forgot password" button — if you lose it, see the recovery steps below.

## Step 3 — Customize Your Page

Go to `/dashboard` on your new site (e.g., `linkbio-abc123.vercel.app/dashboard`) and log in.

From there you can:
- Set your name, bio, and profile picture
- Add links (campaigns with auto-expiration dates, evergreen links, social icons)
- Change colors and button styles
- See how many people visited your page and clicked your links
- Track earnings by platform

Every change saves automatically.

## Step 4 — Use Your Own Domain (Optional)

If you own a domain like `mynamebio.com` and want to use that instead of `linkbio-abc123.vercel.app`:

1. Go to [vercel.com](https://vercel.com) and open your project
2. Click **Settings** → **Domains**
3. Type your domain name and click **Add**
4. Vercel shows you DNS records — copy those into your domain registrar (Namecheap, GoDaddy, Google Domains, etc.)
5. Wait a few minutes for it to propagate

Vercel has [full instructions](https://vercel.com/docs/projects/domains/add-a-domain) if you get stuck.

## Forgot Your Password?

There's no email-based reset. If you lose your dashboard password, here's how to reset it manually:

1. Go to [console.neon.tech](https://console.neon.tech) and sign in (you'll sign in with the same GitHub account you used for Vercel)
2. Open the project Vercel created (it'll have a name like `linkbio-abc123`)
3. Click **SQL Editor** in the sidebar
4. Paste this and click **Run**:
   ```sql
   UPDATE site_settings SET password_hash = NULL, session_secret = NULL WHERE id = 1;
   ```
5. Go back to your site — it will automatically redirect you to `/setup` so you can pick a new password

That's it. Your links, settings, and analytics are untouched.

## Something Isn't Working

**The page shows an error.** Open your Vercel dashboard → click your project → click **Deployments** → click the latest one → look at the logs. Most errors are because Neon disconnected. Try: Settings → Integrations → reconnect Neon, then click **Redeploy** in the Deployments tab.

**My site is slow on first visit.** Neon's free tier sleeps the database after a few minutes of no traffic. The first visit after a quiet period takes 1–2 seconds to wake it up. This is normal.

**I hit a usage limit.** Vercel's free Hobby plan gives you 100 GB bandwidth a month. Neon's free tier gives you half a gigabyte of storage and 5 compute hours a month. If you're getting a ton of traffic, you may need to upgrade one or both. Both upgrades are cheap.

**I want to change something that isn't in the dashboard.** Scroll down to the "For Developers" section below.

---

# For Developers

Everything above also applies to you, but you have more options. You can clone this locally, make code changes, and redeploy.

## Local Development

```bash
# 1. Clone your fork
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# 2. Install dependencies
npm install

# 3. Copy the env template and paste your Neon connection string
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL from the Neon dashboard
# (or from Vercel → Settings → Environment Variables)

# 4. Create tables and seed starter data
npm run db:seed

# 5. Start the dev server
npm run dev
```

Then visit:
- `http://localhost:3000` — public link-in-bio page
- `http://localhost:3000/setup` — first-run password setup
- `http://localhost:3000/dashboard` — admin dashboard

## Power User: Claude Code Setup

If you have [Claude Code](https://claude.ai/claude-code) installed, you can hand the whole setup off to it:

1. Clone this repo locally
2. Open the project in your terminal
3. Run `claude` to start Claude Code
4. Copy and paste the contents of `SETUP_PROMPT.md`
5. Claude will walk you through everything: forking, connecting Neon, deploying, and the first-run password setup — one step at a time

## Project Layout

- `src/app/page.tsx` — public link-in-bio page (server component, pulls from DB)
- `src/app/dashboard/*` — admin UI (client components)
- `src/app/setup/page.tsx` — first-run password setup
- `src/app/api/*` — route handlers for links, settings, analytics, earnings, auth
- `src/proxy.ts` — Next.js 16 middleware (protects `/dashboard` and `/api/*` except public tracking)
- `src/db/schema.ts` — Drizzle schema (Postgres)
- `src/db/seed.ts` — idempotent DB setup; runs on every deploy via the `vercel-build` script
- `src/lib/auth.ts` — PBKDF2 password hashing + HMAC session tokens
- `src/components/public/*` — public page components
- `src/components/dashboard/*` — dashboard components

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + [Neon](https://neon.tech/) (serverless Postgres)
- [Recharts](https://recharts.org/) (analytics charts)
- [@dnd-kit](https://dndkit.com/) (drag-and-drop)

## Deploy Changes

Push to your fork's main branch. Vercel redeploys automatically. The `vercel-build` script re-runs `db:seed` on every deploy — it's idempotent (uses `CREATE TABLE IF NOT EXISTS`, checks for existing rows before inserting sample data), so your data is safe.

## License

See [LICENSE.md](./LICENSE.md) — this is a commercial single-buyer template. You may deploy it to your own sites and modify it; you may not resell or redistribute it.
