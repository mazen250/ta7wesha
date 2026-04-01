import { useState, useId } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { formatSmart } from '../utils/format';
import { CURRENCY_OPTIONS } from '../constants';
import { convertToEgp, convertFromEgp } from '../hooks/useSavings';
import { useLang } from '../hooks/useLang';
import NumberInput from './NumberInput';

export default function CurrencyConverter({ rates }) {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('usd');
  const [toCurrency, setToCurrency] = useState('egp');

  const fromId = useId();
  const toId = useId();
  const amountId = useId();
  const { t } = useLang();

  if (!rates) return null;

  const parsedAmount = parseFloat(amount) || 0;
  const egpValue = convertToEgp(parsedAmount, fromCurrency, rates);
  const result = convertFromEgp(egpValue, toCurrency, rates);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="rounded-2xl bg-[var(--c-card)] border border-[var(--c-border)] p-5" role="region" aria-label={t('converter')}>
      <h2 className="text-base font-bold mb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/15 flex items-center justify-center" aria-hidden="true">
          <ArrowRightLeft size={16} className="text-cyan-400" strokeWidth={2.5} />
        </div>
        {t('converter')}
      </h2>

      <div className="space-y-3">
        {/* From */}
        <div className="flex gap-2">
          <label htmlFor={fromId} className="sr-only">{t('currency')}</label>
          <select
            id={fromId}
            value={fromCurrency}
            onChange={e => setFromCurrency(e.target.value)}
            className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-2.5 py-2.5 text-sm font-semibold text-[var(--c-t1)] focus:outline-none focus:ring-1 focus:ring-[var(--c-ring)] cursor-pointer"
            style={{ backgroundColor: 'var(--c-select)' }}
          >
            {CURRENCY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <label htmlFor={amountId} className="sr-only">{t('amount')}</label>
          <NumberInput
            id={amountId}
            placeholder={t('amount')}
            value={amount}
            onChange={setAmount}
            className="flex-1 bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--c-t1)] placeholder:text-[var(--c-ph)] focus:outline-none focus:ring-1 focus:ring-[var(--c-ring)] transition-all"
          />
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={swap}
            className="p-2 rounded-xl bg-[var(--c-input)] border border-[var(--c-border)] text-[var(--c-t3)] hover:text-cyan-400 hover:bg-[var(--c-card-h)] transition-all"
            aria-label={t('swapCurrencies')}
          >
            <ArrowRightLeft size={14} strokeWidth={2.5} className="rotate-90" aria-hidden="true" />
          </button>
        </div>

        {/* To */}
        <div className="flex gap-2">
          <label htmlFor={toId} className="sr-only">{t('currency')}</label>
          <select
            id={toId}
            value={toCurrency}
            onChange={e => setToCurrency(e.target.value)}
            className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-2.5 py-2.5 text-sm font-semibold text-[var(--c-t1)] focus:outline-none focus:ring-1 focus:ring-[var(--c-ring)] cursor-pointer"
            style={{ backgroundColor: 'var(--c-select)' }}
          >
            {CURRENCY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <div className="flex-1 bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-3 py-2.5 text-sm font-bold text-cyan-400" aria-live="polite">
            {parsedAmount > 0 ? formatSmart(result) : '\u2014'}
          </div>
        </div>
      </div>
    </div>
  );
}
