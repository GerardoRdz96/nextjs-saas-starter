import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-medium",
        "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300",
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
