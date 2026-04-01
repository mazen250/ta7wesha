import { Heart, Info } from 'lucide-react';
import { formatNumber } from '../utils/format';

export default function ZakatCalc({ rates }) {
  if (!rates) return null;

  const { totalEgp, nisabEgp, zakatEligible, zakatAmount, usdToEgp } = rates;

  return (
    <div className="rounded-2xl bg-[var(--c-card)] border border-[var(--c-border)] p-5" role="region" aria-label="Zakat calculator">
      <h2 className="text-base font-bold mb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-teal-500/15 flex items-center justify-center" aria-hidden="true">
          <Heart size={16} className="text-teal-400" strokeWidth={2.5} />
        </div>
        Zakat
      </h2>

      <div className="space-y-3">
        {/* Nisab threshold */}
        <div>
          <p className="text-[10px] font-bold text-[var(--c-t3)] uppercase tracking-[0.1em] mb-0.5">Nisab (85g gold 24K)</p>
          <p className="text-sm font-bold text-[var(--c-t2)]">
            EGP {formatNumber(nisabEgp, 2)}
          </p>
        </div>

        {/* Eligibility */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            zakatEligible
              ? 'text-teal-400 bg-teal-500/15'
              : 'text-[var(--c-t4)] bg-[var(--c-input)]'
          }`}>
            {zakatEligible ? 'Above Nisab' : 'Below Nisab'}
          </span>
        </div>

        {/* Zakat amount */}
        {zakatEligible ? (
          <div className="pt-2 border-t border-[var(--c-border)]">
            <p className="text-[10px] font-bold text-[var(--c-t3)] uppercase tracking-[0.1em] mb-1">Yearly Zakat (2.5%)</p>
            <p className="text-xl font-extrabold text-teal-400 tracking-tight">
              {formatNumber(zakatAmount, 2)} <span className="text-xs font-bold text-[var(--c-t3)]">EGP</span>
            </p>
            <p className="text-[11px] font-semibold text-[var(--c-t3)] mt-0.5">
              ${formatNumber(zakatAmount / usdToEgp, 2)} USD
            </p>
          </div>
        ) : (
          totalEgp > 0 && (
            <p className="text-[11px] text-[var(--c-t4)]">
              Need EGP {formatNumber(nisabEgp - totalEgp, 2)} more to reach nisab
            </p>
          )
        )}

        {/* Disclaimers */}
        <div className="pt-2 border-t border-[var(--c-border)] space-y-1.5">
          <div className="flex items-start gap-1.5">
            <Info size={11} className="text-[var(--c-t4)] mt-0.5 shrink-0" strokeWidth={2.5} />
            <p className="text-[10px] text-[var(--c-t4)] leading-relaxed">
              Zakat is due only if wealth is held for a full lunar year (Hawl). This is an estimate based on your current savings — consult a scholar for your specific situation.
            </p>
          </div>
          <div className="flex items-start gap-1.5">
            <Info size={11} className="text-[var(--c-t4)] mt-0.5 shrink-0" strokeWidth={2.5} />
            <p className="text-[10px] text-[var(--c-t4)] leading-relaxed">
              Personal-use items (jewelry, home, car) may be exempt. Debts may also be deductible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
