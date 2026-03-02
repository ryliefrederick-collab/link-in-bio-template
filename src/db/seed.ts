import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { links, siteSettings } from "./schema";
import path from "path";
import fs from "fs";

const dbDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.resolve(dbDir, "linkinbio.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle(sqlite);

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('campaign', 'evergreen', 'social')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible INTEGER NOT NULL DEFAULT 1,
    scheduled_start TEXT,
    auto_hide_days INTEGER,
    manual_override INTEGER,
    emoji TEXT,
    social_platform TEXT,
    thumbnail_url TEXT,
    campaign_tag TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS link_clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
    clicked_at TEXT NOT NULL DEFAULT (datetime('now')),
    referrer TEXT,
    user_agent TEXT,
    device_type TEXT,
    country TEXT,
    city TEXT,
    campaign_tag TEXT
  );

  CREATE TABLE IF NOT EXISTS page_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visited_at TEXT NOT NULL DEFAULT (datetime('now')),
    referrer TEXT,
    user_agent TEXT,
    device_type TEXT,
    country TEXT,
    city TEXT
  );

  CREATE TABLE IF NOT EXISTS earnings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,
    amount REAL NOT NULL,
    earned_date TEXT NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    profile_name TEXT NOT NULL DEFAULT '',
    profile_bio TEXT NOT NULL DEFAULT '',
    profile_image_url TEXT,
    color_palette TEXT NOT NULL DEFAULT '{}',
    font_pairing TEXT NOT NULL DEFAULT '{}',
    button_style TEXT NOT NULL DEFAULT '{}',
    theme_preset TEXT NOT NULL DEFAULT 'default',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Seed site settings
const existingSettings = sqlite
  .prepare("SELECT id FROM site_settings WHERE id = 1")
  .get();

if (!existingSettings) {
  db.insert(siteSettings)
    .values({
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
        heading: '"The Seasons", serif',
        body: '"Neue Montreal", sans-serif',
      }),
      buttonStyle: JSON.stringify({
        borderRadius: "9999px",
        shadow: "0 2px 8px rgba(0,0,0,0.06)",
        hoverEffect: "lift",
      }),
      themePreset: "default",
    })
    .run();
  console.log("✓ Seeded site settings");
}

// Seed sample links
const existingLinks = sqlite.prepare("SELECT COUNT(*) as count FROM links").get() as { count: number };

if (existingLinks.count === 0) {
  // Campaign links
  db.insert(links)
    .values([
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
    ])
    .run();

  // Evergreen links
  db.insert(links)
    .values([
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
    ])
    .run();

  // Social links
  db.insert(links)
    .values([
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
    ])
    .run();

  console.log("✓ Seeded sample links");
}

sqlite.close();
console.log("✓ Database seeded successfully");
