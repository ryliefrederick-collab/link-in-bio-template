import { Sidebar } from "@/components/dashboard/Sidebar";

// TODO: Add auth middleware here in V2

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex h-screen"
      style={{
        fontFamily: '"Neue Montreal", sans-serif',
        background: "#f9fafb",
      }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
