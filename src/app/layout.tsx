import type { Metadata } from "next";
import { Pinyon_Script } from "next/font/google";
import "./globals.css";

const pinyonScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rylie Frederick",
  description: "Links",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pinyonScript.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
