/**
 * Parse a user-agent string into a device type category.
 */
export function parseDeviceType(
  ua: string | null | undefined
): "mobile" | "tablet" | "desktop" {
  if (!ua) return "desktop";
  const lower = ua.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(lower)) return "tablet";
  if (
    /mobile|iphone|ipod|android.*mobile|windows phone|blackberry|opera mini|opera mobi/i.test(
      lower
    )
  )
    return "mobile";
  return "desktop";
}

/**
 * Extract geo info from request headers (Vercel provides these).
 */
export function extractGeoFromHeaders(headers: Headers) {
  return {
    country: headers.get("x-vercel-ip-country") || null,
    city: headers.get("x-vercel-ip-city") || null,
  };
}

/**
 * Generate a campaign tag from a link title.
 * e.g., "Skillet from my latest video" → "skillet-from-my-latest-video"
 */
export function generateCampaignTag(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}
