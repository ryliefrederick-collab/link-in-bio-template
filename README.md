# Link in Bio Template

A beautiful, customizable link-in-bio page with a built-in dashboard for managing links, tracking analytics, and customizing your theme. Built with Next.js, Tailwind CSS, and Turso.

**Features:**
- Drag-and-drop link management (campaigns, evergreen, social)
- Real-time analytics (page visits, link clicks)
- Fully customizable theme (colors, fonts, button styles)
- Profile image upload
- Earnings tracker
- Password-protected dashboard
- One-click deploy to Vercel

---

## Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fryliefrederick-collab%2Flink-in-bio-template&project-name=linkbio&repository-name=linkbio&stores=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22tursocloud%22%2C%22productSlug%22%3A%22database%22%2C%22protocol%22%3A%22storage%22%7D%5D)

Click the button. Vercel walks you through:

1. **Sign in** (or sign up — free)
2. **Authorize GitHub** — Vercel forks the repo into your account
3. **Add Turso database** — Vercel auto-provisions a free Turso database and injects the credentials for you. No separate Turso account, no tokens to copy.
4. **Deploy** — wait ~60 seconds.
5. **Visit your site** → you'll land on `/setup` to pick your dashboard password. Done.

No environment variables to type. No `openssl` commands. No database setup.

---

## What's included

- `/` — your public link-in-bio page
- `/setup` — first-run password setup (auto-redirected on first visit)
- `/login` — dashboard sign-in
- `/dashboard` — manage links, customize theme, view analytics, track earnings

---

## Power User: Claude Code Setup

If you have [Claude Code](https://claude.ai/claude-code) installed, you can use the interactive setup prompt for a guided experience:

1. Clone this repo locally
2. Open the project in your terminal
3. Run `claude` to start Claude Code
4. Copy and paste the contents of `SETUP_PROMPT.md`
5. Claude will walk you through everything: database setup, configuration, and deployment

---

## Local Development

```bash
# Install dependencies
npm install

# Copy env template and fill in your values
cp .env.example .env.local

# Push database schema to Turso
npm run db:push

# Start dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the public page and [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the admin dashboard.

---

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + [Turso](https://turso.tech/) (cloud SQLite)
- [Recharts](https://recharts.org/) (analytics charts)
- [@dnd-kit](https://dndkit.com/) (drag-and-drop)
