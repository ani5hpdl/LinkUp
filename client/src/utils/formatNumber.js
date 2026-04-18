/**
 * Formats a number into a compact representation.
 * 1234 → "1.2k",  1_200_000 → "1.2M"
 */
export const formatNumber = (n) => {
  if (n == null) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
};
