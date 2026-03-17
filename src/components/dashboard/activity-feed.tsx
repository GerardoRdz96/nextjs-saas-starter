import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "create" | "update" | "delete" | "invite";
}

const recentActivity: ActivityItem[] = [
  {
    id: "1",
    user: "Sarah Chen",
    action: "created",
    target: "New marketing campaign",
    time: "2 minutes ago",
    type: "create",
  },
  {
    id: "2",
    user: "Marcus Johnson",
    action: "updated",
    target: "Q4 Financial Report",
    time: "15 minutes ago",
    type: "update",
  },
  {
    id: "3",
    user: "Elena Rodriguez",
    action: "invited",
    target: "alex@example.com",
    time: "1 hour ago",
    type: "invite",
  },
  {
    id: "4",
    user: "David Kim",
    action: "deleted",
    target: "Archived project files",
    time: "3 hours ago",
    type: "delete",
  },
  {
    id: "5",
    user: "Aisha Patel",
    action: "created",
    target: "Customer onboarding flow",
    time: "5 hours ago",
    type: "create",
  },
];

const typeBadgeVariant = {
  create: "success" as const,
  update: "default" as const,
  delete: "danger" as const,
  invite: "warning" as const,
};

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        {recentActivity.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <Avatar name={item.user} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-900 dark:text-slate-100">
                <span className="font-medium">{item.user}</span>{" "}
                <Badge variant={typeBadgeVariant[item.type]}>
                  {item.action}
                </Badge>{" "}
                <span className="text-slate-600 dark:text-slate-400">
                  {item.target}
                </span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
