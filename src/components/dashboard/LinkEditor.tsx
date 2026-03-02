"use client";

import { useState, useEffect } from "react";
import type { Link, LinkCategory } from "@/types";
import { SOCIAL_PLATFORMS } from "@/lib/constants";

interface LinkEditorProps {
  link: Link | null;
  category: LinkCategory;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Link>) => void;
}

export function LinkEditor({
  link,
  category,
  isOpen,
  onClose,
  onSave,
}: LinkEditorProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [socialPlatform, setSocialPlatform] = useState("");
  const [scheduledStart, setScheduledStart] = useState("");
  const [autoHideDays, setAutoHideDays] = useState("");
  const [manualOverride, setManualOverride] = useState<boolean | null>(null);
  const [emoji, setEmoji] = useState("");

  // Populate form when editing an existing link
  useEffect(() => {
    if (link) {
      setTitle(link.title);
      setUrl(link.url);
      setSocialPlatform(link.socialPlatform || "");
      setScheduledStart(link.scheduledStart?.split("T")[0] || "");
      setAutoHideDays(link.autoHideDays?.toString() || "");
      setManualOverride(link.manualOverride);
      setEmoji(link.emoji || "");
    } else {
      setTitle("");
      setUrl("");
      setSocialPlatform("");
      setScheduledStart("");
      setAutoHideDays("");
      setManualOverride(null);
      setEmoji("");
    }
  }, [link, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(link ? { id: link.id } : {}),
      title: category === "social" && socialPlatform
        ? SOCIAL_PLATFORMS.find((p) => p.id === socialPlatform)?.name || title
        : title,
      url,
      category,
      socialPlatform: category === "social" ? socialPlatform : undefined,
      scheduledStart: category === "campaign" && scheduledStart
        ? new Date(scheduledStart).toISOString()
        : undefined,
      autoHideDays: category === "campaign" && autoHideDays
        ? Number(autoHideDays)
        : undefined,
      manualOverride: category === "campaign" ? manualOverride : undefined,
      emoji: category === "campaign" ? (emoji || null) : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">
          {link ? "Edit Link" : "Add Link"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {/* Social platform selector */}
          {category === "social" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Platform
              </label>
              <select
                value={socialPlatform}
                onChange={(e) => {
                  setSocialPlatform(e.target.value);
                  const p = SOCIAL_PLATFORMS.find((p) => p.id === e.target.value);
                  if (p) {
                    setTitle(p.name);
                    if (!url) setUrl(p.baseUrl);
                  }
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                required
              >
                <option value="">Select platform...</option>
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          {category !== "social" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Link title"
                required
              />
            </div>
          )}

          {/* URL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="https://..."
              required
            />
          </div>

          {/* Campaign emoji + scheduling fields */}
          {category === "campaign" && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Emoji (optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={emoji}
                    onChange={(e) => {
                      // Only keep the last entered emoji character
                      const val = e.target.value;
                      const segments = [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(val)];
                      setEmoji(segments.length > 0 ? segments[segments.length - 1].segment : "");
                    }}
                    className="w-16 rounded-lg border border-gray-300 px-3 py-2 text-center text-lg"
                    placeholder="✨"
                  />
                  {emoji && (
                    <button
                      type="button"
                      onClick={() => setEmoji("")}
                      className="rounded-md px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100"
                    >
                      Clear
                    </button>
                  )}
                  <span className="text-xs text-gray-400">
                    Paste or type any emoji
                  </span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={scheduledStart}
                  onChange={(e) => setScheduledStart(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Auto-hide after (days)
                </label>
                <input
                  type="number"
                  value={autoHideDays}
                  onChange={(e) => setAutoHideDays(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="e.g., 7"
                  min="1"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Visibility Override
                </label>
                <select
                  value={manualOverride === null ? "auto" : manualOverride ? "show" : "hide"}
                  onChange={(e) => {
                    const v = e.target.value;
                    setManualOverride(v === "auto" ? null : v === "show");
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="auto">Follow schedule</option>
                  <option value="show">Force visible</option>
                  <option value="hide">Force hidden</option>
                </select>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              {link ? "Save Changes" : "Add Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
