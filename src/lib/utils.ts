import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Simple cn utility without adding clsx/tailwind-merge as deps
// For production, consider adding clsx + tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getURL() {
  let url =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000";

  // Make sure to include https:// for non-localhost URLs
  url = url.startsWith("http") ? url : `https://${url}`;
  // Remove trailing slash
  url = url.replace(/\/+$/, "");

  return url;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
