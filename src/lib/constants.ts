import type { SocialPlatform, ColorPalette, FontPairing, ButtonStyle } from "@/types";

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: "tiktok", name: "TikTok", iconPath: "/social-icons/tiktok.svg", baseUrl: "https://tiktok.com/@" },
  { id: "instagram", name: "Instagram", iconPath: "/social-icons/instagram.svg", baseUrl: "https://instagram.com/" },
  { id: "youtube", name: "YouTube", iconPath: "/social-icons/youtube.svg", baseUrl: "https://youtube.com/@" },
  { id: "twitter", name: "X / Twitter", iconPath: "/social-icons/twitter.svg", baseUrl: "https://x.com/" },
  { id: "pinterest", name: "Pinterest", iconPath: "/social-icons/pinterest.svg", baseUrl: "https://pinterest.com/" },
  { id: "facebook", name: "Facebook", iconPath: "/social-icons/facebook.svg", baseUrl: "https://facebook.com/" },
  { id: "snapchat", name: "Snapchat", iconPath: "/social-icons/snapchat.svg", baseUrl: "https://snapchat.com/add/" },
  { id: "threads", name: "Threads", iconPath: "/social-icons/threads.svg", baseUrl: "https://threads.net/@" },
];

export const EARNINGS_PLATFORMS = [
  "shopmy",
  "amazon",
  "ltk",
  "direct",
  "other",
] as const;

export type EarningsPlatform = (typeof EARNINGS_PLATFORMS)[number];

export const DEFAULT_COLORS: ColorPalette = {
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
};

export const DEFAULT_FONTS: FontPairing = {
  heading: '"Neue Montreal", sans-serif',
  body: '"Neue Montreal", sans-serif',
};

export const DEFAULT_BUTTON_STYLE: ButtonStyle = {
  borderRadius: "9999px",
  shadow: "0 2px 8px rgba(0,0,0,0.06)",
  hoverEffect: "lift",
};

export const THEME_PRESETS = {
  default: {
    colors: DEFAULT_COLORS,
    fonts: DEFAULT_FONTS,
    buttonStyle: DEFAULT_BUTTON_STYLE,
  },
  dark: {
    colors: {
      primary: "#2d2d2d",
      secondary: "#3d3d3d",
      background: "#1a1a1a",
      surface: "#262626",
      text: "#f5f5f5",
      textMuted: "#a0a0a0",
      accent: "#ff8a80",
      buttonBg: "#3d3d3d",
      buttonText: "#f5f5f5",
      campaignBg: "#333333",
      campaignBorder: "#555555",
      nameColor: "#f5f5f5",
      subtitleColor: "#a0a0a0",
    } satisfies ColorPalette,
    fonts: DEFAULT_FONTS,
    buttonStyle: DEFAULT_BUTTON_STYLE,
  },
  bold: {
    colors: {
      primary: "#ff6b6b",
      secondary: "#ffd93d",
      background: "#ffffff",
      surface: "#ffffff",
      text: "#1a1a2e",
      textMuted: "#666666",
      accent: "#6c5ce7",
      buttonBg: "#ff6b6b",
      buttonText: "#ffffff",
      campaignBg: "#fff0f0",
      campaignBorder: "#ff6b6b",
      nameColor: "#1a1a2e",
      subtitleColor: "#6c5ce7",
    } satisfies ColorPalette,
    fonts: DEFAULT_FONTS,
    buttonStyle: {
      borderRadius: "12px",
      shadow: "0 4px 12px rgba(0,0,0,0.1)",
      hoverEffect: "lift",
    } satisfies ButtonStyle,
  },
  minimal: {
    colors: {
      primary: "#f0f0f0",
      secondary: "#e8e8e8",
      background: "#ffffff",
      surface: "#ffffff",
      text: "#111111",
      textMuted: "#888888",
      accent: "#111111",
      buttonBg: "#f0f0f0",
      buttonText: "#111111",
      campaignBg: "#f8f8f8",
      campaignBorder: "#e0e0e0",
      nameColor: "#111111",
      subtitleColor: "#888888",
    } satisfies ColorPalette,
    fonts: DEFAULT_FONTS,
    buttonStyle: {
      borderRadius: "4px",
      shadow: "none",
      hoverEffect: "lift",
    } satisfies ButtonStyle,
  },
} as const;
