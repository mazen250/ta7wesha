export function formatNumber(n, decimals = 0) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatSmart(n) {
  if (Math.abs(n) < 0.01) return '0';
  if (Math.abs(n) < 1) return n.toFixed(4);
  return formatNumber(n, 2);
}

export function formatDuration(months, t) {
  if (months === null) return t ? t('addIncomeForEta') : 'Add income';
  if (months <= 0) return t ? t('reached') : 'Reached!';
  const moLabel = t ? t('approxMo') : 'mo';
  const yLabel = t ? t('approxY') : 'y';
  const y = Math.floor(months / 12);
  const m = Math.ceil(months % 12);
  if (y === 0) return `~${m}${moLabel}`;
  if (m === 0) return `~${y}${yLabel}`;
  return `~${y}${yLabel} ${m}${moLabel}`;
}

export function timeAgo(iso, t) {
  if (!iso) return '';
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return t ? t('justNow') : 'just now';
  const minutes = Math.floor(seconds / 60);
  const mLabel = t ? t('mAgo') : 'm ago';
  if (minutes < 60) return `${minutes}${mLabel}`;
  const hLabel = t ? t('hAgo') : 'h ago';
  return `${Math.floor(minutes / 60)}${hLabel}`;
}
