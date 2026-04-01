import { useState, useMemo, useId } from 'react';
import { FlaskConical } from 'lucide-react';
import { formatNumber } from '../utils/format';
import { convertToEgp } from '../hooks/useSavings';
import NumberInput from './NumberInput';

function Slider({ label, value, onChange, min, max, unit }) {
  const sliderId = useId();
  const isPositive = value > 0;
  const isNegative = value < 0;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={sliderId} className="text-[11px] font-semibold text-[var(--c-t3)]">{label}</label>
        <span className={`text-xs font-bold ${isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-[var(--c-t3)]'}`}>
          {value > 0 ? '+' : ''}{value}{unit}
        </span>
      </div>
      <input
        id={sliderId}
        type="range"
        min={min} max={max} step="1"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

export default function WhatIfCalc({ rates, savings }) {
  const [goldChange, setGoldChange] = useState(0);
  const [usdChange, setUsdChange] = useState(0);
  const [extraSavings, setExtraSavings] = useState('');
  const extraInputId = useId();

  const projection = useMemo(() => {
    if (!rates) return null;

    // Aggregate savings by currency
    const byCurrency = {};
    for (const s of savings) {
      const amt = parseFloat(s.amount) || 0;
      if (amt <= 0) continue;
      byCurrency[s.currency] = (byCurrency[s.currency] || 0) + amt;
    }

    // Gold price change is independent of USD rate change
    const projectedGoldGramEgp = rates.goldGramEgp * (1 + goldChange / 100);
    // USD/EGP rate change only affects USD holdings
    const projectedUsdToEgp = rates.usdToEgp * (1 + usdChange / 100);

    let projectedTotal = 0;
    for (const [currency, amt] of Object.entries(byCurrency)) {
      if (currency === 'gold') projectedTotal += amt * projectedGoldGramEgp;
      else if (currency === 'usd') projectedTotal += amt * projectedUsdToEgp;
      else projectedTotal += convertToEgp(amt, currency, rates);
    }

    const difference = projectedTotal - rates.totalEgp;

    const extra = parseFloat(extraSavings) || 0;
    const projectedMonthlyIncome = rates.monthlyEgp + extra;

    const firstGoal = rates.goalsCalc?.[0];
    let projectedEta = null;
    if (firstGoal?.targetValue > 0 && projectedMonthlyIncome > 0) {
      const remaining = Math.max(0, firstGoal.targetValue - projectedTotal);
      projectedEta = remaining / projectedMonthlyIncome;
    }

    return { total: projectedTotal, difference, eta: projectedEta };
  }, [rates, savings, goldChange, usdChange, extraSavings]);

  if (!rates) return null;

  const hasChanges = goldChange !== 0 || usdChange !== 0 || (parseFloat(extraSavings) || 0) > 0;

  return (
    <div className="rounded-2xl bg-[var(--c-card)] border border-[var(--c-border)] p-5" role="region" aria-label="What-if calculator">
      <h2 className="text-base font-bold mb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center" aria-hidden="true">
          <FlaskConical size={16} className="text-amber-400" strokeWidth={2.5} />
        </div>
        What If
      </h2>

      <Slider label="Gold price change" value={goldChange} onChange={setGoldChange} min={-50} max={50} unit="%" />
      <Slider label="USD/EGP rate change" value={usdChange} onChange={setUsdChange} min={-50} max={50} unit="%" />

      <div className="mb-4">
        <label htmlFor={extraInputId} className="text-[11px] font-semibold text-[var(--c-t3)] block mb-1.5">
          Extra monthly savings (EGP)
        </label>
        <NumberInput
          id={extraInputId}
          placeholder="0"
          value={extraSavings}
          onChange={setExtraSavings}
          className="w-full bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-3 py-2 text-sm font-semibold text-[var(--c-t1)] placeholder:text-[var(--c-ph)] focus:outline-none focus:ring-1 focus:ring-[var(--c-ring)] transition-all"
        />
      </div>

      {projection && hasChanges && (
        <div className="rounded-xl p-3.5 bg-amber-500/[0.07] border border-amber-500/10" aria-live="polite">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[var(--c-t3)] font-medium">Projected total</span>
            <span className="text-sm font-extrabold">EGP {formatNumber(projection.total, 2)}</span>
          </div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[var(--c-t3)] font-medium">Difference</span>
            <span className={`text-xs font-bold ${projection.difference >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {projection.difference >= 0 ? '+' : ''}{formatNumber(projection.difference, 2)} EGP
            </span>
          </div>
          {projection.eta !== null && (
            <div className="flex items-center justify-between pt-1.5 border-t border-[var(--c-border)]">
              <span className="text-xs text-[var(--c-t3)] font-medium">Time to first goal</span>
              <span className="text-xs font-extrabold text-amber-400">
                {projection.eta <= 0 ? 'Reached!' : `~${Math.ceil(projection.eta)}mo`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
