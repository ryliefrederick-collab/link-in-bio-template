import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type {
  links,
  linkClicks,
  pageVisits,
  earnings,
  siteSettings,
} from "@/db/schema";

// Select types (reading from DB)
export type Link = InferSelectModel<typeof links>;
export type LinkClick = InferSelectModel<typeof linkClicks>;
export type PageVisit = InferSelectModel<typeof pageVisits>;
export type Earning = InferSelectModel<typeof earnings>;
export type SiteSettings = InferSelectModel<typeof siteSettings>;

// Insert types (writing to DB)
export type NewLink = InferInsertModel<typeof links>;
export type NewLinkClick = InferInsertModel<typeof linkClicks>;
export type NewPageVisit = InferInsertModel<typeof pageVisits>;
export type NewEarning = InferInsertModel<typeof earnings>;

// Link categories
export type LinkCategory = "campaign" | "evergreen" | "social";

// Theme types
export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  buttonBg: string;
  buttonText: string;
  campaignBg: string;
  campaignBorder: string;
  nameColor: string;
  subtitleColor: string;
}

export interface FontPairing {
  heading: string;
  body: string;
}

export interface ButtonStyle {
  borderRadius: string;
  shadow: string;
  hoverEffect: string;
}

// Social platform definition
export interface SocialPlatform {
  id: string;
  name: string;
  iconPath: string;
  baseUrl: string;
}
