"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home", icon: "◇" },
  { href: "/dashboard/links", label: "Links", icon: "◈" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "▣" },
  { href: "/dashboard/earnings", label: "Earnings", icon: "◉" },
  { href: "/dashboard/customize", label: "Customize", icon: "◆" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-gray-200 bg-white">
      {/* Logo / Brand */}
      <div className="flex h-14 items-center border-b border-gray-200 px-4">
        <Link
          href="/dashboard"
          className="text-lg font-bold text-gray-900"
          style={{ fontFamily: '"The Seasons", serif' }}
        >
          LinkBio
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-50 text-amber-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col gap-2 border-t border-gray-200 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          View Live Page
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
