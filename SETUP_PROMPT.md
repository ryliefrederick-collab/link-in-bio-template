# Setup Prompt for Claude Code

Copy everything below this line into Claude Code to get guided, automated setup. Claude will check your environment, help you fork the repo, connect Neon Postgres via Vercel, deploy the site, and walk you through the first-run password setup.

---

You are helping me set up a link-in-bio template I just bought. I am not technical. Walk me through it one step at a time, wait for me to confirm each step before moving on, and explain what each step does in plain language.

Here is the full setup. Please help me complete every step:

1. **Check my environment.** Confirm I have:
   - A GitHub account (if not, tell me to sign up at github.com and come back)
   - A Vercel account (if not, tell me to sign up at vercel.com — free plan is fine — using my GitHub account to sign in)
   - Node.js installed locally if I want to customize the code offline (optional — I can skip this and do everything through Vercel's web UI)

2. **Fork the template repo to my GitHub.** Either:
   - Use the "Deploy with Vercel" button in this repo's README, which will fork it automatically for me, OR
   - Manually fork `ryliefrederick-collab/link-in-bio-template` into my GitHub account

3. **Deploy to Vercel with Neon Postgres.** Open the Vercel deploy URL from the README. In the Vercel setup flow:
   - Authorize GitHub so Vercel can read my fork
   - Add the Neon Postgres integration when prompted — this auto-provisions a free database and sets `DATABASE_URL` for me. I do not need to visit neon.tech or copy anything.
   - Click Deploy and wait ~60 seconds

4. **Open my new site.** The Vercel dashboard will show the URL (like `mybio-xyz.vercel.app`). Click it. I should land on a page asking me to pick a dashboard password.

5. **Pick my password at `/setup`.** Use a password I will actually remember. Tell me to write it down somewhere safe — there is no automatic "forgot password" button. If I lose it, the only recovery path is running a SQL command in the Neon dashboard (the README explains how).

6. **Log in to my dashboard** at `/dashboard`. Walk me through:
   - Settings: my name, bio, profile picture
   - Links: adding my first campaign, evergreen, and social links
   - Customize: picking my theme colors

7. **(Optional) Connect my custom domain.** If I own a domain like `myname.com`, show me how to attach it in Vercel → Settings → Domains.

8. **(Optional) Pull the code locally** if I want to edit things that aren't exposed in the dashboard (like SEO metadata or additional pages). Walk me through `git clone`, `npm install`, creating `.env.local` with my `DATABASE_URL` copied from Vercel, and `npm run dev`.

For every step, if I hit an error, help me read it and figure out what went wrong. Do not run any destructive commands (like `git push --force`, `rm -rf`, or anything that deletes data) without asking me first.

When we are done, summarize what I have set up, where my dashboard lives, and what to do if I forget my password.
