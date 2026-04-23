import { cookies } from "next/headers";
import Link from "next/link";
import { db } from "@/db";
import { links, siteSettings } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { isLinkCurrentlyVisible } from "@/lib/campaign";
import { generateCssVariables } from "@/lib/theme";
import { getAuthState, verifyToken } from "@/lib/auth";
import { ProfileHeader } from "@/components/public/ProfileHeader";
import { CampaignLinkCard } from "@/components/public/CampaignLinkCard";
import { EvergreenLinkCard } from "@/components/public/EvergreenLinkCard";
import { SocialIconRow } from "@/components/public/SocialIconRow";
import { LinkTracker } from "@/components/public/LinkTracker";
import type { Link as LinkType, SiteSettings } from "@/types";

export const dynamic = "force-dynamic";

export default async function BioPage() {
  // Fetch settings
  const settings = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.id, 1),
  });

  // Check if creator is logged in (for showing Dashboard button)
  let isLoggedIn = false;
  try {
    const { sessionSecret } = await getAuthState();
    if (sessionSecret) {
      const cookieStore = await cookies();
      const token = cookieStore.get("auth-session")?.value;
      isLoggedIn = token ? await verifyToken(token, sessionSecret) : false;
    }
  } catch {
    isLoggedIn = false;
  }

  // Fetch all links ordered by sort order
  const allLinks = await db.query.links.findMany({
    orderBy: [asc(links.sortOrder)],
  });

  // Filter to only currently visible links
  const visibleLinks = allLinks.filter(isLinkCurrentlyVisible);

  // Group by category
  const campaignLinks = visibleLinks.filter(
    (l: LinkType) => l.category === "campaign"
  );
  const evergreenLinks = visibleLinks.filter(
    (l: LinkType) => l.category === "evergreen"
  );
  const socialLinks = visibleLinks.filter(
    (l: LinkType) => l.category === "social"
  );

  // Generate theme CSS variables from settings, scoped to :root so
  // they override the globals.css defaults (including `body` background).
  const themeCss = settings
    ? `:root { ${generateCssVariables(settings)} }`
    : null;

  const defaultSettings: SiteSettings = {
    id: 1,
    profileName: "Your Name",
    profileBio: "Creator, storyteller, link curator.",
    profileImageUrl: null,
    colorPalette: "{}",
    fontPairing: "{}",
    buttonStyle: "{}",
    themePreset: "default",
    passwordHash: null,
    sessionSecret: null,
    updatedAt: new Date().toISOString(),
  };

  return (
    <LinkTracker>
      {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
      {isLoggedIn && (
        <Link
          href="/dashboard"
          className="fixed right-4 top-4 z-50 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white shadow-md backdrop-blur transition hover:bg-black"
        >
          Dashboard
        </Link>
      )}
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center px-5 py-10">
        {/* Profile Header */}
        <ProfileHeader settings={settings || defaultSettings} />

        {/* Campaign Links */}
        {campaignLinks.length > 0 && (
          <section className="flex w-full flex-col gap-3 pb-4">
            {campaignLinks.map((link: LinkType) => (
              <CampaignLinkCard key={link.id} link={link} />
            ))}
          </section>
        )}

        {/* Evergreen Links */}
        {evergreenLinks.length > 0 && (
          <section className="flex w-full flex-col gap-3 pb-4">
            {evergreenLinks.map((link: LinkType) => (
              <EvergreenLinkCard key={link.id} link={link} />
            ))}
          </section>
        )}

        {/* Social Icons */}
        <SocialIconRow links={socialLinks} />
      </main>
    </LinkTracker>
  );
}
