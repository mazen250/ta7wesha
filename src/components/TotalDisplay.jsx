import { TrendingUp } from 'lucide-react';
import { formatNumber } from '../utils/format';
import { useLang } from '../hooks/useLang';

export default function TotalDisplay({ rates, isLoading }) {
  const { t } = useLang();

  if (isLoading && !rates) {
    return (
      <div className="rounded-2xl bg-[var(--c-card)] border border-[var(--c-border)] p-6 animate-pulse" aria-busy="true">
        <div className="h-4 bg-[var(--c-input)] rounded w-28 mb-3" />
        <div className="h-9 bg-[var(--c-input)] rounded w-52" />
      </div>
    );
  }
  if (!rates) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/15"
      role="region"
      aria-label={t('totalSavings')}
    >
      <div className="absolute top-4 end-4 opacity-[0.07]" aria-hidden="true">
        <TrendingUp size={64} />
      </div>
      <div className="relative">
        <p className="text-[11px] font-bold text-emerald-400/70 uppercase tracking-[0.15em] mb-2">{t('totalSavings')}</p>
        <p className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
          {formatNumber(rates.totalEgp, 2)}
          <span className="text-base font-bold text-[var(--c-t3)] ms-2">{t('egp')}</span>
        </p>
        <p className="text-[var(--c-t3)] text-sm font-semibold mt-2">
          ${formatNumber(rates.totalUsd, 2)} {t('usd')}
        </p>
      </div>
    </div>
  );
}
