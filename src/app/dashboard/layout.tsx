import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { Sidebar } from "@/components/dashboard/Sidebar";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.id, 1),
    });
    const name = settings?.profileName?.trim();
    return { title: name ? `${name} Dashboard` : "Dashboard" };
  } catch {
    return { title: "Dashboard" };
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex h-screen"
      style={{
        fontFamily: 'var(--font-dm-sans), sans-serif',
        background: "#f9fafb",
      }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
