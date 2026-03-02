import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ─── LINKS TABLE ───────────────────────────────────────────────
export const links = sqliteTable("links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  category: text("category", {
    enum: ["campaign", "evergreen", "social"],
  }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  // Campaign-specific fields
  scheduledStart: text("scheduled_start"),
  autoHideDays: integer("auto_hide_days"),
  // Manual override: null = follow schedule, true = force show, false = force hide
  manualOverride: integer("manual_override", { mode: "boolean" }),
  // Campaign-specific emoji displayed beside the title
  emoji: text("emoji"),
  // Social-specific: platform identifier for icon lookup
  socialPlatform: text("social_platform"),
  thumbnailUrl: text("thumbnail_url"),
  // Internal campaign tag for analytics
  campaignTag: text("campaign_tag"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── LINK CLICKS TABLE ────────────────────────────────────────
export const linkClicks = sqliteTable("link_clicks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  linkId: integer("link_id")
    .notNull()
    .references(() => links.id, { onDelete: "cascade" }),
  clickedAt: text("clicked_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  deviceType: text("device_type"),
  country: text("country"),
  city: text("city"),
  campaignTag: text("campaign_tag"),
});

// ─── PAGE VISITS TABLE ────────────────────────────────────────
export const pageVisits = sqliteTable("page_visits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  visitedAt: text("visited_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  deviceType: text("device_type"),
  country: text("country"),
  city: text("city"),
});

// ─── EARNINGS TABLE ───────────────────────────────────────────
export const earnings = sqliteTable("earnings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  platform: text("platform").notNull(),
  amount: real("amount").notNull(),
  earnedDate: text("earned_date").notNull(),
  note: text("note"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── SITE SETTINGS TABLE ──────────────────────────────────────
export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  profileName: text("profile_name").notNull().default(""),
  profileBio: text("profile_bio").notNull().default(""),
  profileImageUrl: text("profile_image_url"),
  colorPalette: text("color_palette").notNull().default("{}"),
  fontPairing: text("font_pairing").notNull().default("{}"),
  buttonStyle: text("button_style").notNull().default("{}"),
  themePreset: text("theme_preset").notNull().default("default"),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
