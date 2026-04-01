import { useState } from 'react';
import { Scale, Info } from 'lucide-react';
import { formatNumber } from '../utils/format';
import { GOLD_21K_PURITY, KARAT_OPTIONS } from '../constants';
import { useLang } from '../hooks/useLang';
import NumberInput from './NumberInput';

export default function GoldCalc({ rates }) {
  const [weight, setWeight] = useState('');
  const [karat, setKarat] = useState(21);
  const { t } = useLang();

  if (!rates) return null;

  const grams = parseFloat(weight) || 0;
  // rates.goldGramEgp is for 21k; derive price for any karat
  const pricePerGram = (rates.goldGramEgp / GOLD_21K_PURITY) * (karat / 24);
  const meltValue = grams * pricePerGram;

  return (
    <div className="rounded-2xl bg-[var(--c-card)] border border-[var(--c-border)] p-5" role="region" aria-label={t('goldCalc')}>
      <h2 className="text-base font-bold mb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center" aria-hidden="true">
          <Scale size={16} className="text-amber-400" strokeWidth={2.5} />
        </div>
        {t('goldCalc')}
      </h2>

      <div className="space-y-3">
        <NumberInput
          placeholder={t('weightInGrams')}
          value={weight}
          onChange={setWeight}
          className="w-full bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--c-t1)] placeholder:text-[var(--c-ph)] focus:outline-none focus:ring-1 focus:ring-[var(--c-ring)] transition-all"
        />

        <div className="flex gap-1.5">
          {KARAT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setKarat(opt.value)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                karat === opt.value
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-[var(--c-input)] border-[var(--c-border)] text-[var(--c-t3)] hover:text-[var(--c-t1)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {grams > 0 && (
          <div className="pt-2 border-t border-[var(--c-border)]">
            <p className="text-[10px] font-bold text-[var(--c-t3)] uppercase tracking-[0.1em] mb-1">{t('meltValue')}</p>
            <p className="text-xl font-extrabold text-amber-400 tracking-tight">
              {formatNumber(meltValue, 2)} <span className="text-xs font-bold text-[var(--c-t3)]">{t('egp')}</span>
            </p>
            <p className="text-[11px] font-semibold text-[var(--c-t3)] mt-0.5">
              ${formatNumber(meltValue / rates.usdToEgp, 2)} {t('usd')}
            </p>
            <p className="text-[10px] text-[var(--c-t4)] mt-1">
              {karat}K {t('pricePerGram')}: {t('egp')} {formatNumber(pricePerGram, 2)}
            </p>
          </div>
        )}

        <div className="flex items-start gap-1.5 pt-2 border-t border-[var(--c-border)]">
          <Info size={11} className="text-[var(--c-t4)] mt-0.5 shrink-0" strokeWidth={2.5} />
          <p className="text-[10px] text-[var(--c-t4)] leading-relaxed">
            {t('goldDisclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}
