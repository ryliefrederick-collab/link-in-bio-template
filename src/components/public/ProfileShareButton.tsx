"use client";

import { useState, useEffect } from "react";
import { ShareMenu } from "@/components/public/ShareMenu";

interface ProfileShareButtonProps {
  profileName: string;
}

export function ProfileShareButton({ profileName }: ProfileShareButtonProps) {
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  if (!pageUrl) return null;

  return (
    <ShareMenu
      url={pageUrl}
      title={`Check out ${profileName} on LinkIt`}
      variant="profile"
    />
  );
}
