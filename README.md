# LinkIt — Link-in-Bio Template

A fully custom, self-hosted link-in-bio page built with Next.js, Tailwind CSS, and Turso (cloud SQLite). Manage all your links, track analytics, and log earnings from a password-protected dashboard — no monthly SaaS fees.

**Live demo:** [rylie-frederick.vercel.app](https://rylie-frederick.vercel.app)

---

## Features

- **Campaign links** — Emoji-tagged links that auto-expire after a set number of days (perfect for sponsored posts and limited-time promos)
- **Evergreen links** — Permanent links like your Amazon Storefront, portfolio, and collab page
- **Social icons row** — TikTok, Instagram, YouTube, Pinterest, and more
- **Share buttons** — Every link has a built-in share menu (SMS, Email, WhatsApp, X, Facebook, Copy Link), plus a profile share button in the top corner
- **Analytics dashboard** — Track page visits and link clicks with charts
- **Earnings tracker** — Log and visualize income by platform
- **Drag-and-drop link reordering** — Rearrange links from the dashboard
- **Full theme customization** — Colors, fonts, and button styles via the dashboard
- **Password-protected dashboard** — Secure access to all management features
- **Self-hosted & free to run** — Deploy on Vercel + Turso free tier, no recurring SaaS costs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | Turso (cloud SQLite via libsql) |
| ORM | Drizzle ORM |
| Hosting | Vercel |
| Drag & Drop | @dnd-kit |
| Charts | Recharts |

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/ryliefrederick-collab/link-in-bio.git
cd link-in-bio
npm install
```

### 2. Create a Turso database

1. Sign up free at [turso.tech](https://turso.tech)
2. Install the Turso CLI: `curl -sSfL https://get.tur.so/install.sh | bash`
3. Create a database: `turso db create linkit`
4. Get your URL: `turso db show linkit --url`
5. Get your token: `turso db tokens create linkit`

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
# Turso (required for production)
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your-token-here

# Dashboard login password
DASHBOARD_PASSWORD=your-secure-password

# Any random 32+ character string for session signing
SESSION_SECRET=your-random-secret-here
```

### 4. Seed the database

```bash
npm run db:seed
```

This creates all tables and populates them with sample links. If `TURSO_DATABASE_URL` is not set, it falls back to a local SQLite file at `data/linkinbio.db` — useful for previewing locally before setting up Turso.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your link page.
Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to access the dashboard (use the password from `DASHBOARD_PASSWORD`).

---

## Customization

Everything is customizable from the dashboard at `/dashboard/customize`:

- **Profile** — Name, bio, and profile photo
- **Colors** — Background, button color, text colors, campaign card style
- **Fonts** — Heading and body font pairings
- **Button style** — Border radius, shadow, hover effect

To add or edit links, go to `/dashboard/links`.

---

## Deploying to Vercel

1. Push your repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add your environment variables in the Vercel project settings:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `DASHBOARD_PASSWORD`
   - `SESSION_SECRET`
4. Deploy — Vercel auto-deploys on every push to `main`

---

## Dashboard

| Page | URL | Description |
|---|---|---|
| Overview | `/dashboard` | Quick stats summary |
| Links | `/dashboard/links` | Add, edit, reorder, and toggle links |
| Analytics | `/dashboard/analytics` | Page visits and click charts |
| Earnings | `/dashboard/earnings` | Log and track income by platform |
| Customize | `/dashboard/customize` | Theme, colors, fonts, profile |

---

## License

This template is for personal use only. You may not resell or redistribute this code.
