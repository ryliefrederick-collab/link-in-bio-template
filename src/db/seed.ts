import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { links, siteSettings } from "./schema";
import fs from "fs";
import path from "path";

// Load .env.local for local development
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed
      .slice(eqIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

const connectionString =
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!connectionString) {
  console.error(
    "❌ DATABASE_URL is not set. Add it to .env.local (or run via Vercel env).",
  );
  process.exit(1);
}

console.log("☁️  Connecting to Neon Postgres…");

const client = neon(connectionString);
const db = drizzle(client);

async function main() {
  // Create tables (idempotent — safe to rerun)
  await client.query(`
    CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT NOT NULL CHECK (category IN ('campaign', 'evergreen', 'social')),
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_visible BOOLEAN NOT NULL DEFAULT TRUE,
      scheduled_start TEXT,
      auto_hide_days INTEGER,
      manual_override BOOLEAN,
      emoji TEXT,
      social_platform TEXT,
      thumbnail_url TEXT,
      campaign_tag TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS link_clicks (
      id SERIAL PRIMARY KEY,
      link_id INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
      clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      referrer TEXT,
      user_agent TEXT,
      device_type TEXT,
      country TEXT,
      city TEXT,
      campaign_tag TEXT
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS page_visits (
      id SERIAL PRIMARY KEY,
      visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      referrer TEXT,
      user_agent TEXT,
      device_type TEXT,
      country TEXT,
      city TEXT
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS earnings (
      id SERIAL PRIMARY KEY,
      platform TEXT NOT NULL,
      amount DOUBLE PRECISION NOT NULL,
      earned_date TEXT NOT NULL,
      note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      profile_name TEXT NOT NULL DEFAULT '',
      profile_bio TEXT NOT NULL DEFAULT '',
      profile_image_url TEXT,
      color_palette TEXT NOT NULL DEFAULT '{}',
      font_pairing TEXT NOT NULL DEFAULT '{}',
      button_style TEXT NOT NULL DEFAULT '{}',
      theme_preset TEXT NOT NULL DEFAULT 'default',
      password_hash TEXT,
      session_secret TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Seed site settings
  const existingSettings = await db.select().from(siteSettings).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(siteSettings).values({
      id: 1,
      profileName: "Your Name",
      profileBio: "Creator, storyteller, link curator.",
      profileImageUrl: null,
      colorPalette: JSON.stringify({
        primary: "#fff4b8",
        secondary: "#ffd6e0",
        background: "#e8eec9",
        surface: "#ffffff",
        text: "#2d2d2d",
        textMuted: "#6b6b6b",
        accent: "#a01717",
        buttonBg: "#a01717",
        buttonText: "#e8eec9",
        campaignBg: "#f6f3e8",
        campaignBorder: "#4a2c1d",
        nameColor: "#4a2c1d",
        subtitleColor: "#a01717",
      }),
      fontPairing: JSON.stringify({
        heading: "var(--font-playfair), serif",
        body: "var(--font-dm-sans), sans-serif",
      }),
      buttonStyle: JSON.stringify({
        borderRadius: "9999px",
        shadow: "0 2px 8px rgba(0,0,0,0.06)",
        hoverEffect: "lift",
      }),
      themePreset: "default",
    });
    console.log("✓ Seeded site settings");
  }

  // Seed sample links
  const existingLinks = await db.select().from(links).limit(1);
  if (existingLinks.length === 0) {
    // Campaign links (auto-expiring)
    await db.insert(links).values([
      {
        title: "My Favorite Skillet",
        url: "https://example.com/skillet",
        category: "campaign",
        sortOrder: 0,
        isVisible: true,
        scheduledStart: new Date().toISOString(),
        autoHideDays: 7,
        emoji: "✨",
        campaignTag: "my-favorite-skillet",
      },
      {
        title: "Summer Skincare Routine",
        url: "https://example.com/skincare",
        category: "campaign",
        sortOrder: 1,
        isVisible: true,
        scheduledStart: new Date().toISOString(),
        autoHideDays: 14,
        emoji: "🌿",
        campaignTag: "summer-skincare-routine",
      },
    ]);

    // Evergreen links
    await db.insert(links).values([
      {
        title: "Shop My Favorites",
        url: "https://example.com/favorites",
        category: "evergreen",
        sortOrder: 0,
        isVisible: true,
      },
      {
        title: "Amazon Storefront",
        url: "https://example.com/amazon",
        category: "evergreen",
        sortOrder: 1,
        isVisible: true,
      },
      {
        title: "Discount Codes",
        url: "https://example.com/discounts",
        category: "evergreen",
        sortOrder: 2,
        isVisible: true,
      },
    ]);

    // Social icons
    await db.insert(links).values([
      {
        title: "TikTok",
        url: "https://tiktok.com/@yourname",
        category: "social",
        sortOrder: 0,
        isVisible: true,
        socialPlatform: "tiktok",
      },
      {
        title: "Instagram",
        url: "https://instagram.com/yourname",
        category: "social",
        sortOrder: 1,
        isVisible: true,
        socialPlatform: "instagram",
      },
      {
        title: "YouTube",
        url: "https://youtube.com/@yourname",
        category: "social",
        sortOrder: 2,
        isVisible: true,
        socialPlatform: "youtube",
      },
      {
        title: "Pinterest",
        url: "https://pinterest.com/yourname",
        category: "social",
        sortOrder: 3,
        isVisible: true,
        socialPlatform: "pinterest",
      },
    ]);

    console.log("✓ Seeded sample links");
  }

  console.log("✓ Database seeded successfully");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
