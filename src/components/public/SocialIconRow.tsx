import type { Link } from "@/types";
import { SOCIAL_PLATFORMS } from "@/lib/constants";

interface SocialIconRowProps {
  links: Link[];
}

export function SocialIconRow({ links }: SocialIconRowProps) {
  if (links.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-4 pt-4">
      {links.map((link) => {
        const platform = SOCIAL_PLATFORMS.find(
          (p) => p.id === link.socialPlatform
        );
        const iconPath = platform?.iconPath || "/social-icons/tiktok.svg";

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            data-link-id={link.id}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-70"
            aria-label={link.title}
            style={{ color: "var(--color-subtitle)" }}
          >
            {/* Using inline SVG color via CSS filter to tint icons wine red */}
            <img
              src={iconPath}
              alt={link.title}
              width={22}
              height={22}
              style={{
                filter: "brightness(0) saturate(100%) invert(15%) sepia(50%) saturate(1200%) hue-rotate(345deg) brightness(60%) contrast(100%)",
              }}
            />
          </a>
        );
      })}
    </div>
  );
}
