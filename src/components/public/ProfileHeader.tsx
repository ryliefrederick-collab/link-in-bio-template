import type { SiteSettings } from "@/types";

interface ProfileHeaderProps {
  settings: SiteSettings;
}

export function ProfileHeader({ settings }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-3 pb-6">
      {/* Profile Image */}
      <div className="h-24 w-24 overflow-hidden rounded-full bg-[var(--color-secondary)] shadow-sm">
        {settings.profileImageUrl ? (
          <img
            src={settings.profileImageUrl}
            alt={settings.profileName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[var(--color-name)]">
            {settings.profileName?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      {/* Name — dark chocolate brown, The Seasons font (when available) */}
      <h1
        className="text-2xl font-bold text-[var(--color-name)]"
        style={{ fontFamily: "var(--font-name)" }}
      >
        {settings.profileName || "Your Name"}
      </h1>

      {/* Bio/Subtitle — wine red, Neue Montreal font (when available) */}
      {settings.profileBio && (
        <p
          className="max-w-xs text-center text-sm text-[var(--color-subtitle)]"
          style={{ fontFamily: "var(--font-buttons)" }}
        >
          {settings.profileBio}
        </p>
      )}
    </div>
  );
}
