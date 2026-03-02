"use client";

import { useEffect, useState, useCallback } from "react";
import type { SiteSettings, ColorPalette } from "@/types";
import { THEME_PRESETS, DEFAULT_COLORS } from "@/lib/constants";

const COLOR_FIELDS: { key: keyof ColorPalette; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "background", label: "Background" },
  { key: "surface", label: "Surface" },
  { key: "text", label: "Text" },
  { key: "textMuted", label: "Text Muted" },
  { key: "accent", label: "Accent" },
  { key: "buttonBg", label: "Button BG" },
  { key: "buttonText", label: "Button Text" },
  { key: "campaignBg", label: "Campaign BG" },
  { key: "campaignBorder", label: "Campaign Border" },
  { key: "nameColor", label: "Name" },
  { key: "subtitleColor", label: "Subtitle" },
];

export default function CustomizePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [colors, setColors] = useState<ColorPalette>(DEFAULT_COLORS);
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [buttonRadius, setButtonRadius] = useState("9999px");
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings");
    const data: SiteSettings = await res.json();
    setSettings(data);
    setProfileName(data.profileName);
    setProfileBio(data.profileBio);

    try {
      const parsed = JSON.parse(data.colorPalette);
      setColors({ ...DEFAULT_COLORS, ...parsed });
    } catch {
      setColors(DEFAULT_COLORS);
    }

    try {
      const btnStyle = JSON.parse(data.buttonStyle);
      setButtonRadius(btnStyle.borderRadius || "9999px");
    } catch {
      setButtonRadius("9999px");
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileName,
        profileBio,
        colorPalette: JSON.stringify(colors),
        buttonStyle: JSON.stringify({
          borderRadius: buttonRadius,
          shadow: "0 2px 8px rgba(0,0,0,0.06)",
          hoverEffect: "lift",
        }),
        themePreset: "custom",
      }),
    });
    setSaving(false);
  };

  const applyPreset = (presetKey: keyof typeof THEME_PRESETS) => {
    const preset = THEME_PRESETS[presetKey];
    setColors({ ...DEFAULT_COLORS, ...preset.colors });
    setButtonRadius(preset.buttonStyle.borderRadius);
  };

  const updateColor = (key: keyof ColorPalette, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  if (!settings) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"The Seasons", serif' }}>Customize</h1>
          <p className="mt-1 text-sm text-gray-500">
            Edit your profile and theme settings.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Settings */}
        <div className="flex flex-col gap-6">
          {/* Profile Section */}
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-medium text-gray-700">Profile</h3>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Bio
                </label>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  rows={2}
                />
              </div>
            </div>
          </section>

          {/* Theme Presets */}
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-medium text-gray-700">Theme Presets</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(Object.keys(THEME_PRESETS) as (keyof typeof THEME_PRESETS)[]).map(
                (key) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium capitalize text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
                  >
                    <div className="mb-1 flex gap-1">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: THEME_PRESETS[key].colors.primary }}
                      />
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: THEME_PRESETS[key].colors.secondary }}
                      />
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: THEME_PRESETS[key].colors.accent }}
                      />
                    </div>
                    {key}
                  </button>
                )
              )}
            </div>
          </section>

          {/* Color Palette */}
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-medium text-gray-700">Colors</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {COLOR_FIELDS.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colors[key]}
                    onChange={(e) => updateColor(key, e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border border-gray-300"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-600">{label}</p>
                    <p className="text-xs text-gray-400">{colors[key]}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Button Style */}
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-medium text-gray-700">Button Style</h3>
            <div className="mt-3 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Border Radius
                </label>
                <div className="flex gap-2">
                  {["4px", "8px", "12px", "9999px"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setButtonRadius(r)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        buttonRadius === r
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {r === "9999px" ? "Pill" : r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-medium text-gray-700">Preview</h3>
            <div
              className="mt-3 mx-auto max-w-xs rounded-2xl p-6"
              style={{
                backgroundColor: colors.background,
                color: colors.text,
              }}
            >
              {/* Preview Profile */}
              <div className="flex flex-col items-center gap-2 pb-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
                  style={{ backgroundColor: colors.secondary, color: colors.nameColor }}
                >
                  {profileName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <p
                  className="text-sm font-bold"
                  style={{ fontFamily: '"The Seasons", serif', color: colors.nameColor }}
                >
                  {profileName || "Your Name"}
                </p>
                <p
                  className="text-xs"
                  style={{ fontFamily: '"Neue Montreal", sans-serif', color: colors.subtitleColor }}
                >
                  {profileBio || "Your bio here"}
                </p>
              </div>

              {/* Preview Campaign Link */}
              <div
                className="mb-2 rounded-xl border-2 px-4 py-3 text-center text-xs font-bold"
                style={{
                  backgroundColor: colors.campaignBg,
                  borderColor: colors.campaignBorder,
                  color: colors.nameColor,
                  fontFamily: '"Neue Montreal", sans-serif',
                }}
              >
                Campaign Link
              </div>

              {/* Preview Evergreen Links */}
              {["Evergreen Link 1", "Evergreen Link 2"].map((label) => (
                <div
                  key={label}
                  className="mb-2 px-4 py-2.5 text-center text-xs font-bold"
                  style={{
                    backgroundColor: colors.buttonBg,
                    color: colors.buttonText,
                    borderRadius: buttonRadius,
                    fontFamily: '"Neue Montreal", sans-serif',
                  }}
                >
                  {label}
                </div>
              ))}

              {/* Preview Social Icons */}
              <div className="flex justify-center gap-3 pt-2">
                {["T", "I", "Y"].map((icon) => (
                  <div
                    key={icon}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs"
                    style={{
                      backgroundColor: colors.surface,
                      color: colors.accent,
                    }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
