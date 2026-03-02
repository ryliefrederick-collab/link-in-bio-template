import type { Link } from "@/types";

interface EvergreenLinkCardProps {
  link: Link;
}

export function EvergreenLinkCard({ link }: EvergreenLinkCardProps) {
  return (
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
  );
}
