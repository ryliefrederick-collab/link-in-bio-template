import type { SiteSettings, ColorPalette, FontPairing, ButtonStyle } from "@/types";
import { DEFAULT_COLORS, DEFAULT_FONTS, DEFAULT_BUTTON_STYLE } from "./constants";

function parseJson<T>(json: string, fallback: T): T {
  try {
    const parsed = JSON.parse(json);
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

export function getThemeFromSettings(settings: SiteSettings) {
  const colors = parseJson<ColorPalette>(settings.colorPalette, DEFAULT_COLORS);
  const fonts = parseJson<FontPairing>(settings.fontPairing, DEFAULT_FONTS);
  const buttonStyle = parseJson<ButtonStyle>(settings.buttonStyle, DEFAULT_BUTTON_STYLE);
  return { colors, fonts, buttonStyle };
}

export function generateCssVariables(settings: SiteSettings): string {
  const { colors, fonts, buttonStyle } = getThemeFromSettings(settings);

  return [
    `--color-primary: ${colors.primary}`,
    `--color-secondary: ${colors.secondary}`,
    `--color-background: ${colors.background}`,
    `--color-surface: ${colors.surface}`,
    `--color-text: ${colors.text}`,
    `--color-text-muted: ${colors.textMuted}`,
    `--color-accent: ${colors.accent}`,
    `--color-button-bg: ${colors.buttonBg}`,
    `--color-button-text: ${colors.buttonText}`,
    `--color-campaign-bg: ${colors.campaignBg}`,
    `--color-campaign-border: ${colors.campaignBorder}`,
    `--color-name: ${colors.nameColor || colors.text}`,
    `--color-subtitle: ${colors.subtitleColor || colors.textMuted}`,
    `--font-heading: ${fonts.heading}`,
    `--font-body: ${fonts.body}`,
    `--font-name: ${fonts.heading}`,
    `--font-buttons: ${fonts.body}`,
    `--button-radius: ${buttonStyle.borderRadius}`,
  ].join("; ");
}
