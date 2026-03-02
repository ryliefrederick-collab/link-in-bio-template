"use client";

import { useEffect, useCallback } from "react";

/**
 * Client-side wrapper that:
 * 1. Fires a page visit event on mount
 * 2. Intercepts clicks on link elements (identified by data-link-id)
 *    and fires click tracking events via sendBeacon
 */
export function LinkTracker({ children }: { children: React.ReactNode }) {
  // Track page visit on mount
  useEffect(() => {
    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon("/api/track/visit");
    } else {
      fetch("/api/track/visit", { method: "POST", keepalive: true });
    }
  }, []);

  // Intercept link clicks via event delegation
  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest("[data-link-id]");
    if (!target) return;

    const linkId = Number(target.getAttribute("data-link-id"));
    const campaignTag = target.getAttribute("data-campaign-tag") || undefined;

    if (!linkId) return;

    const payload = JSON.stringify({ linkId, campaignTag });

    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(
        "/api/track/click",
        new Blob([payload], { type: "application/json" })
      );
    } else {
      fetch("/api/track/click", {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      });
    }
  }, []);

  return <div onClick={handleClick}>{children}</div>;
}
