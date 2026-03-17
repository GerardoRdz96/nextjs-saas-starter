import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, BarChart3 } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: "users" | "revenue" | "activity" | "chart";
}

const icons = {
  users: Users,
  revenue: DollarSign,
  activity: Activity,
  chart: BarChart3,
};

function KPICard({ title, value, change, trend, icon }: KPICardProps) {
  const Icon = icons[icon];

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          <div className="flex items-center gap-1">
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : trend === "down" ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : null}
            <span
              className={cn(
                "text-sm font-medium",
                trend === "up" && "text-emerald-600 dark:text-emerald-400",
                trend === "down" && "text-red-600 dark:text-red-400",
                trend === "neutral" && "text-slate-500"
              )}
            >
              {change}
            </span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950">
          <Icon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
        </div>
      </div>
    </Card>
  );
}

export function KPICards() {
  const kpis: KPICardProps[] = [
    {
      title: "Total Users",
      value: "2,420",
      change: "+12.5% from last month",
      trend: "up",
      icon: "users",
    },
    {
      title: "Revenue",
      value: "$45,231",
      change: "+8.2% from last month",
      trend: "up",
      icon: "revenue",
    },
    {
      title: "Active Sessions",
      value: "1,210",
      change: "-3.1% from last month",
      trend: "down",
      icon: "activity",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.4% from last month",
      trend: "up",
      icon: "chart",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
}
