import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isToday, isTomorrow, formatDistanceToNow, differenceInCalendarDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(d: string | Date | undefined | null) {
  if (!d) return "N/A";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDueDateRelative(date: string | Date | undefined | null) {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  const diff = differenceInCalendarDays(d, new Date());
  if (diff > 1 && diff <= 7) return "This Week";
  if (diff > 7 && diff <= 14) return "Next Week";
  if (diff < 0) return formatDistanceToNow(d, { addSuffix: true }); // e.g. "2 days ago"
  return formatDistanceToNow(d, { addSuffix: true }); // e.g. "in 3 days"
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return "1 week ago";
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
  
  return formatDate(d);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-amber-100 text-amber-800";
    case "pending":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-blue-100 text-blue-800";
    case "low":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
