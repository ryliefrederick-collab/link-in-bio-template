import type { Metadata } from "next";
import { DM_Sans, Pinyon_Script, Playfair_Display } from "next/font/google";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.id, 1),
    });
    const title = settings?.profileName?.trim() || "My Links";
    const description =
      settings?.profileBio?.trim() || "Links, socials, and things I love.";
    return { title, description };
  } catch {
    return { title: "My Links", description: "Links, socials, and things I love." };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${pinyonScript.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
