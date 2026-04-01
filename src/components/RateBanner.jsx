import { DollarSign, Euro, Gem } from 'lucide-react';
import { formatNumber } from '../utils/format';
import { getCurrencyColor } from '../constants';

const RATE_CARDS = [
  { key: 'usd', label: '1 USD', icon: DollarSign, getValue: r => formatNumber(r.usdToEgp, 2), accent: getCurrencyColor('usd') },
  { key: 'eur', label: '1 EUR', icon: Euro, getValue: r => formatNumber(r.eurToEgp, 2), accent: getCurrencyColor('eur') },
  { key: 'gold', label: '1 Gold Pound', icon: Gem, getValue: r => formatNumber(r.goldPoundEgp), accent: getCurrencyColor('gold') },
];


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
            <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-[var(--c-t3)]">
              {card.label}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight">
              {card.getValue(rates)}
            </span>
            <span className="text-[10px] font-bold text-[var(--c-t4)] uppercase">EGP</span>
          </div>
        </div>
      ))}
    </div>
  );
}
