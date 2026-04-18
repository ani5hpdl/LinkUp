import { formatDistanceToNow, format, isThisYear } from "date-fns";

/**
 * Smart date formatter:
 * - < 1 hour  → "5 minutes ago"
 * - < 24 hrs  → "3 hours ago"
 * - this year → "Apr 12"
 * - older     → "Apr 12, 2023"
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now - date;
  const diffHrs = diffMs / (1000 * 60 * 60);

  if (diffHrs < 24) return formatDistanceToNow(date, { addSuffix: true });
  if (isThisYear(date)) return format(date, "MMM d");
  return format(date, "MMM d, yyyy");
};
