import { db } from "@/db";
import { links, siteSettings } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { isLinkCurrentlyVisible } from "@/lib/campaign";
import { generateCssVariables } from "@/lib/theme";
import { ProfileHeader } from "@/components/public/ProfileHeader";
import { CampaignLinkCard } from "@/components/public/CampaignLinkCard";
import { EvergreenLinkCard } from "@/components/public/EvergreenLinkCard";
import { SocialIconRow } from "@/components/public/SocialIconRow";
import { LinkTracker } from "@/components/public/LinkTracker";
import type { Link, SiteSettings } from "@/types";

export const dynamic = "force-dynamic";

export default async function BioPage() {
  // Fetch settings
  const settings = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.id, 1),
  });

  // Fetch all links ordered by sort order
  const allLinks = await db.query.links.findMany({
    orderBy: [asc(links.sortOrder)],
  });

  // Filter to only currently visible links
  const visibleLinks = allLinks.filter(isLinkCurrentlyVisible);

  // Group by category
  const campaignLinks = visibleLinks.filter(
    (l: Link) => l.category === "campaign"
  );
  const evergreenLinks = visibleLinks.filter(
    (l: Link) => l.category === "evergreen"
  );
  const socialLinks = visibleLinks.filter(
    (l: Link) => l.category === "social"
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
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center px-5 py-10">
        {/* Profile Header */}
        <ProfileHeader settings={settings || defaultSettings} />

        {/* Campaign Links */}
        {campaignLinks.length > 0 && (
          <section className="flex w-full flex-col gap-3 pb-4">
            {campaignLinks.map((link: Link) => (
              <CampaignLinkCard key={link.id} link={link} />
            ))}
          </section>
        )}

        {/* Evergreen Links */}
        {evergreenLinks.length > 0 && (
          <section className="flex w-full flex-col gap-3 pb-4">
            {evergreenLinks.map((link: Link) => (
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
