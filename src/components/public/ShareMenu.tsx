"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

interface ShareMenuProps {
  url: string;
  title: string;
  variant?: "dots" | "profile";
}

// Order: SMS, Email, WhatsApp, X, Facebook — Copy Link is appended separately
const SHARE_OPTIONS = [
  {
    id: "sms",
    label: "SMS",
    bgColor: "#34C759",
    getHref: (url: string, title: string) =>
      `sms:?body=${encodeURIComponent(title + " " + url)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="18" height="18" aria-hidden="true">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email",
    bgColor: "#EA4335",
    getHref: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="18" height="18" aria-hidden="true">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    bgColor: "#25D366",
    getHref: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="18" height="18" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    id: "x",
    label: "X",
    bgColor: "#000000",
    getHref: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="18" height="18" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    bgColor: "#1877F2",
    getHref: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="18" height="18" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export function ShareMenu({ url, title, variant = "dots" }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  // Track whether we're mounted on the client so createPortal can safely target document.body
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const handleOpen = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1500);
    } catch {
      // fallback for browsers that don't support clipboard API
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1500);
    }
  }, [url]);

  const trigger =
    variant === "profile" ? (
      <button
        onClick={handleOpen}
        className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-70"
        aria-label="Share profile"
      >
        {/* Share / connected-nodes icon — ghost style matching social icons */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="22"
          height="22"
          className="text-[var(--color-name)]"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>
    ) : (
      <button
        onClick={handleOpen}
        className="flex h-8 w-8 items-center justify-center rounded-full opacity-50 transition-all hover:opacity-90 hover:bg-black/10"
        aria-label="Share link"
      >
        {/* Three vertical dots */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          width="18"
          height="18"
          className="text-[var(--color-button-text)]"
          aria-hidden="true"
        >
          <circle cx="12" cy="5" r="2.2" />
          <circle cx="12" cy="12" r="2.2" />
          <circle cx="12" cy="19" r="2.2" />
        </svg>
      </button>
    );

  return (
    <>
      {trigger}

      {/* Portal: renders directly into document.body so CSS transforms on
          parent cards never break position:fixed for the backdrop/sheet */}
      {open && mounted && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Centered dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="w-full max-w-sm rounded-2xl bg-white px-6 pb-6 pt-5 shadow-2xl">

              {/* Header row */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                  Share
                </h3>
                <button
                  onClick={handleClose}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
                  aria-label="Close"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Platform grid — 3 columns, 2 rows */}
              <div className="grid grid-cols-3 gap-x-3 gap-y-5">
                {SHARE_OPTIONS.map((opt) => (
                  <a
                    key={opt.id}
                    href={opt.getHref(url, title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full"
                      style={{ backgroundColor: opt.bgColor }}
                    >
                      {opt.icon}
                    </div>
                    <span className="text-xs text-gray-600 leading-tight text-center">
                      {opt.label}
                    </span>
                  </a>
                ))}

                {/* Copy Link */}
                <button
                  onClick={handleCopy}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                    {copied ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="22"
                        height="22"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#555"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="20"
                        height="20"
                        aria-hidden="true"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 leading-tight text-center">
                    {copied ? "Copied!" : "Copy Link"}
                  </span>
                </button>
              </div>

            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
