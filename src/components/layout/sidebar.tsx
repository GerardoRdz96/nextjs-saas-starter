"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  Building2,
  Users,
  CreditCard,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Organization", href: "/org/new", icon: Building2 },
  { name: "Members", href: "/org/invite", icon: Users },
  { name: "Billing", href: "/settings?tab=billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <span className="font-semibold text-slate-900 dark:text-white">
          SaaS Starter
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href.split("?")[0]));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <button
          onClick={() => {
            const next = resolvedTheme === "dark" ? "light" : "dark";
            setTheme(next);
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
        {sidebarContent}
      </aside>
    </>
  );
}
