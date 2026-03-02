import type { Link } from "@/types";

/**
 * Determines if a link should currently be visible on the public page.
 *
 * Logic:
 * 1. If manualOverride is true → force visible
 * 2. If manualOverride is false → force hidden
 * 3. If manualOverride is null → follow schedule / isVisible flag
 *
 * For campaign links with scheduling:
 * - Before scheduledStart → hidden
 * - After scheduledStart + autoHideDays → hidden
 * - Otherwise → visible
 */
export function isLinkCurrentlyVisible(link: Link): boolean {
  // Manual override takes absolute precedence
  if (link.manualOverride === true) return true;
  if (link.manualOverride === false) return false;

  // For non-campaign links, use the isVisible flag
  if (link.category !== "campaign") return link.isVisible;

  // Campaign scheduling logic
  if (!link.scheduledStart) return link.isVisible;

  const now = new Date();
  const start = new Date(link.scheduledStart);

  // Not yet started
  if (now < start) return false;

  // Check auto-hide
  if (link.autoHideDays) {
    const hideDate = new Date(start);
    hideDate.setDate(hideDate.getDate() + link.autoHideDays);
    if (now > hideDate) return false;
  }

  return true;
}
