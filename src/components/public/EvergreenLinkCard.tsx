import type { Link } from "@/types";
import { ShareMenu } from "@/components/public/ShareMenu";

interface EvergreenLinkCardProps {
  link: Link;
}

export function EvergreenLinkCard({ link }: EvergreenLinkCardProps) {
  return (
    <div className="relative w-full">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        data-link-id={link.id}
        className="link-card block w-full bg-[var(--color-button-bg)] px-5 py-3.5 text-center shadow-sm"
        style={{ borderRadius: "var(--button-radius)" }}
      >
        <span
          className="text-base font-bold text-[var(--color-button-text)]"
          style={{ fontFamily: "var(--font-buttons)" }}
        >
          {link.title}
        </span>
      </a>

      {/* Three-dot share button — overlaid on the right side of the card, no transform */}
      <div className="absolute right-2.5 inset-y-0 z-10 flex items-center">
        <ShareMenu url={link.url} title={link.title} variant="dots" />
      </div>
    </div>
  );
}
