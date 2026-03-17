import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
