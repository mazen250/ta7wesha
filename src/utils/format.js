/**
 * Format number with fixed decimal places.
 * @param {number} n - Number to format
 * @param {number} decimals - Decimal places (default 0)
 */
export function formatNumber(n, decimals = 0) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Smart format for currency conversion results —
 * uses more precision for small numbers.
 */
export function formatSmart(n) {
  if (Math.abs(n) < 0.01) return '0';
  if (Math.abs(n) < 1) return n.toFixed(4);
  return formatNumber(n, 2);
}

/**
 * Format duration in months to human-readable string.
 */
export function formatDuration(months) {
  if (months === null) return 'Add income';
  if (months <= 0) return 'Reached!';
  const y = Math.floor(months / 12);
  const m = Math.ceil(months % 12);
  if (y === 0) return `~${m}mo`;
  if (m === 0) return `~${y}y`;
  return `~${y}y ${m}mo`;
}

/**
 * Format ISO timestamp as relative time string.
 */
export function timeAgo(iso) {
  if (!iso) return '';
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}
