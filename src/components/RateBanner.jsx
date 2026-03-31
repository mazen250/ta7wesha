import { DollarSign, Euro, Gem, TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber } from '../utils/format';
import { ASSET_COLORS } from '../constants';

const RATE_CARDS = [
  { key: 'usd', label: '1 USD', icon: DollarSign, getValue: r => formatNumber(r.usdToEgp, 2), accent: ASSET_COLORS.usd },
  { key: 'eur', label: '1 EUR', icon: Euro, getValue: r => formatNumber(r.eurToEgp, 2), accent: ASSET_COLORS.eur },
  { key: 'gold', label: 'Gold Pound', icon: Gem, getValue: r => formatNumber(r.goldPoundEgp), accent: ASSET_COLORS.gold },
];

function ChangeBadge({ value }) {
  if (value == null || Math.abs(value) < 0.01) return null;
  const isPositive = value > 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
        isPositive ? 'text-emerald-400 bg-emerald-500/15' : 'text-red-400 bg-red-500/15'
      }`}
      aria-label={`${isPositive ? 'Up' : 'Down'} ${Math.abs(value).toFixed(2)} percent`}
    >
      <Icon size={10} strokeWidth={3} aria-hidden="true" />
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

export default function RateBanner({ rates, isLoading }) {
  if (isLoading && !rates) {
    return (
      <div className="grid grid-cols-3 gap-3 mb-6" aria-busy="true" aria-label="Loading exchange rates">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl h-[88px] bg-[var(--c-card)] animate-pulse border border-[var(--c-border)]" />
        ))}
      </div>
    );
  }
  if (!rates) return null;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6" role="region" aria-label="Exchange rates">
      {RATE_CARDS.map(card => (
        <div
          key={card.key}
          className="rounded-2xl p-3.5 sm:p-4 bg-[var(--c-card)] border border-[var(--c-border)] hover:bg-[var(--c-card-h)] transition-all duration-300"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <card.icon size={14} style={{ color: card.accent }} strokeWidth={2.5} aria-hidden="true" />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-[var(--c-t3)]">
              {card.label}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight">
              {card.getValue(rates)}
            </span>
            <span className="text-[10px] font-bold text-[var(--c-t4)] uppercase">EGP</span>
          </div>
          {rates.changes && (
            <div className="mt-1.5">
              <ChangeBadge value={rates.changes[card.key]} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
