import { Heart, Info } from 'lucide-react';
import { formatNumber } from '../utils/format';
import { useLang } from '../hooks/useLang';

export default function ZakatCalc({ rates }) {
  const { t } = useLang();
  if (!rates) return null;

  const { totalEgp, nisabEgp, zakatEligible, zakatAmount, usdToEgp } = rates;

  return (
    <div className="rounded-2xl bg-[var(--c-card)] border border-[var(--c-border)] p-5" role="region" aria-label={t('zakat')}>
      <h2 className="text-base font-bold mb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-teal-500/15 flex items-center justify-center" aria-hidden="true">
          <Heart size={16} className="text-teal-400" strokeWidth={2.5} />
        </div>
        {t('zakat')}
      </h2>

      <div className="space-y-3">
        {/* Nisab threshold */}
        <div>
          <p className="text-[10px] font-bold text-[var(--c-t3)] uppercase tracking-[0.1em] mb-0.5">{t('nisab')}</p>
          <p className="text-sm font-bold text-[var(--c-t2)]">
            {t('egp')} {formatNumber(nisabEgp, 2)}
          </p>
        </div>

        {/* Eligibility */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            zakatEligible
              ? 'text-teal-400 bg-teal-500/15'
              : 'text-[var(--c-t4)] bg-[var(--c-input)]'
          }`}>
            {zakatEligible ? t('aboveNisab') : t('belowNisab')}
          </span>
        </div>

        {/* Zakat amount */}
        {zakatEligible ? (
          <div className="pt-2 border-t border-[var(--c-border)]">
            <p className="text-[10px] font-bold text-[var(--c-t3)] uppercase tracking-[0.1em] mb-1">{t('yearlyZakat')}</p>
            <p className="text-xl font-extrabold text-teal-400 tracking-tight">
              {formatNumber(zakatAmount, 2)} <span className="text-xs font-bold text-[var(--c-t3)]">{t('egp')}</span>
            </p>
            <p className="text-[11px] font-semibold text-[var(--c-t3)] mt-0.5">
              ${formatNumber(zakatAmount / usdToEgp, 2)} {t('usd')}
            </p>
          </div>
        ) : (
          totalEgp > 0 && (
            <p className="text-[11px] text-[var(--c-t4)]">
              {t('egp')} {formatNumber(nisabEgp - totalEgp, 2)} {t('needMoreForNisab')}
            </p>
          )
        )}

        {/* Disclaimers */}
        <div className="pt-2 border-t border-[var(--c-border)] space-y-1.5">
          <div className="flex items-start gap-1.5">
            <Info size={11} className="text-[var(--c-t4)] mt-0.5 shrink-0" strokeWidth={2.5} />
            <p className="text-[10px] text-[var(--c-t4)] leading-relaxed">
              {t('zakatDisclaimer1')}
            </p>
          </div>
          <div className="flex items-start gap-1.5">
            <Info size={11} className="text-[var(--c-t4)] mt-0.5 shrink-0" strokeWidth={2.5} />
            <p className="text-[10px] text-[var(--c-t4)] leading-relaxed">
              {t('zakatDisclaimer2')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
