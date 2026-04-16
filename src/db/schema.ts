import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  doublePrecision,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ─── LINKS TABLE ───────────────────────────────────────────────
export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  category: text("category", {
    enum: ["campaign", "evergreen", "social"],
  }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  // Campaign-specific fields (user-supplied ISO strings)
  scheduledStart: text("scheduled_start"),
  autoHideDays: integer("auto_hide_days"),
  // Manual override: null = follow schedule, true = force show, false = force hide
  manualOverride: boolean("manual_override"),
  // Campaign-specific emoji displayed beside the title
  emoji: text("emoji"),
  // Social-specific: platform identifier for icon lookup
  socialPlatform: text("social_platform"),
  thumbnailUrl: text("thumbnail_url"),
  // Internal campaign tag for analytics
  campaignTag: text("campaign_tag"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── LINK CLICKS TABLE ────────────────────────────────────────
export const linkClicks = pgTable("link_clicks", {
  id: serial("id").primaryKey(),
  linkId: integer("link_id")
    .notNull()
    .references(() => links.id, { onDelete: "cascade" }),
  clickedAt: timestamp("clicked_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  deviceType: text("device_type"),
  country: text("country"),
  city: text("city"),
  campaignTag: text("campaign_tag"),
});

// ─── PAGE VISITS TABLE ────────────────────────────────────────
export const pageVisits = pgTable("page_visits", {
  id: serial("id").primaryKey(),
  visitedAt: timestamp("visited_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  deviceType: text("device_type"),
  country: text("country"),
  city: text("city"),
});

// ─── EARNINGS TABLE ───────────────────────────────────────────
export const earnings = pgTable("earnings", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  amount: doublePrecision("amount").notNull(),
  earnedDate: text("earned_date").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// ─── SITE SETTINGS TABLE ──────────────────────────────────────
// id fixed to 1 (single-row settings). Not serial — callers insert id: 1.
export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  profileName: text("profile_name").notNull().default(""),
  profileBio: text("profile_bio").notNull().default(""),
  profileImageUrl: text("profile_image_url"),
  colorPalette: text("color_palette").notNull().default("{}"),
  fontPairing: text("font_pairing").notNull().default("{}"),
  buttonStyle: text("button_style").notNull().default("{}"),
  themePreset: text("theme_preset").notNull().default("default"),
  passwordHash: text("password_hash"),
  sessionSecret: text("session_secret"),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

// Keep sql import referenced for consumers that still use it via re-export patterns
export { sql };
