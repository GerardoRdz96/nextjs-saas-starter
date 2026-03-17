import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, FileText, Settings } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    label: "Create Organization",
    href: "/org/new",
    icon: Plus,
    description: "Set up a new team workspace",
  },
  {
    label: "Invite Members",
    href: "/org/invite",
    icon: UserPlus,
    description: "Add people to your team",
  },
  {
    label: "View Reports",
    href: "/dashboard",
    icon: FileText,
    description: "Check your analytics",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Configure your account",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950">
                <action.icon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {action.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
