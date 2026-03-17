import type { ReactNode } from "react";

interface DashboardShellProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function DashboardShell({
  title,
  description,
  action,
  children,
}: DashboardShellProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
}
