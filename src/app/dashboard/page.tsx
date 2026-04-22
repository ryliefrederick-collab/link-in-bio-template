"use client";

import { useEffect, useState } from "react";

interface QuickStats {
  totalLinks: number;
  campaignLinks: number;
  evergreenLinks: number;
  socialLinks: number;
}

export default function DashboardHome() {
  const [stats, setStats] = useState<QuickStats | null>(null);

  useEffect(() => {
    fetch("/api/links")
      .then((res) => res.json())
      .then((links) => {
        setStats({
          totalLinks: links.length,
          campaignLinks: links.filter((l: { category: string }) => l.category === "campaign").length,
          evergreenLinks: links.filter((l: { category: string }) => l.category === "evergreen").length,
          socialLinks: links.filter((l: { category: string }) => l.category === "social").length,
        });
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair), serif' }}>Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Overview of your link-in-bio page.
      </p>

      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Links" value={stats.totalLinks} />
          <StatCard label="Campaign" value={stats.campaignLinks} />
          <StatCard label="Evergreen" value={stats.evergreenLinks} />
          <StatCard label="Social" value={stats.socialLinks} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
