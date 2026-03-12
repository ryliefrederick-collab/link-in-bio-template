import type { Link } from "@/types";
import { ShareMenu } from "@/components/public/ShareMenu";

interface CampaignLinkCardProps {
  link: Link;
}

export function CampaignLinkCard({ link }: CampaignLinkCardProps) {
  return (
    <div className="relative w-full">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        data-link-id={link.id}
        data-campaign-tag={link.campaignTag}
        className="link-card block w-full rounded-2xl border-2 border-[var(--color-campaign-border)] bg-[var(--color-campaign-bg)] px-5 py-4 text-center"
      >
        <div className="flex items-center justify-center gap-2">
          {link.emoji && (
            <span className="text-sm">{link.emoji}</span>
          )}
          <span
            className="text-base font-bold text-[var(--color-name)]"
            style={{ fontFamily: "var(--font-buttons)" }}
          >
            {link.title}
          </span>
        </div>
      </a>

      {/* Three-dot share button — overlaid on the right side of the card, no transform */}
      <div className="absolute right-2.5 inset-y-0 z-10 flex items-center">
        <ShareMenu url={link.url} title={link.title} variant="dots" />
      </div>
    </div>
  );
}
