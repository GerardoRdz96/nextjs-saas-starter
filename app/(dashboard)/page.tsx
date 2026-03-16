import { createClient } from "@/lib/supabase/server";
import { Users, TrendingUp, Activity, DollarSign } from "lucide-react";

const KPI_CARDS = [
  {
    label: "Total Users",
    value: "1,284",
    change: "+12% from last month",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    label: "Monthly Revenue",
    value: "$4,320",
    change: "+8% from last month",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    label: "Active Projects",
    value: "42",
    change: "+3 this week",
    icon: Activity,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    label: "Growth Rate",
    value: "18%",
    change: "+2% from last month",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-900/20",
  },
];

const ACTIVITY = [
  { user: "Alice Johnson", action: "created a new project", time: "2 min ago" },
  { user: "Bob Chen", action: "upgraded to Pro", time: "15 min ago" },
  { user: "Carol Davis", action: "invited 3 team members", time: "1 hr ago" },
  { user: "Dan Wilson", action: "completed onboarding", time: "2 hr ago" },
  { user: "Eva Martinez", action: "enabled billing", time: "3 hr ago" },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
          Good morning, {firstName}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Here&apos;s what&apos;s happening with your workspace today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPI_CARDS.map(({ label, value, change, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{change}</p>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Recent activity</h2>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {ACTIVITY.map(({ user: name, action, time }) => (
            <li key={name} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-400 shrink-0">
                  {name[0]}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-medium text-slate-900 dark:text-white">{name}</span>{" "}
                  {action}
                </p>
              </div>
              <span className="text-xs text-slate-400 shrink-0 ml-4">{time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
