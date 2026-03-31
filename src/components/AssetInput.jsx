import { useId } from 'react';
import { formatNumber } from '../utils/format';
import NumberInput from './NumberInput';

export default function AssetInput({ icon: Icon, iconColor, label, unit, value, onChange, valueInEgp }) {
  const inputId = useId();

  return (
    <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--c-card-h)] transition-all duration-200">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${iconColor}18` }}
      >
        <Icon size={18} style={{ color: iconColor }} strokeWidth={2.5} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <label
          htmlFor={inputId}
          className="text-[10px] font-bold text-[var(--c-t3)] uppercase tracking-[0.1em] block mb-1"
        >
          {label}
        </label>
        <div className="flex items-center gap-2">
          <NumberInput
            id={inputId}
            placeholder="0"
            value={value}
            onChange={onChange}
            className="w-full bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-3 py-2 text-[15px] font-semibold text-[var(--c-t1)] placeholder:text-[var(--c-ph)] focus:outline-none focus:ring-1 focus:ring-[var(--c-ring)] transition-all"
          />
          <span className="text-[10px] font-bold text-[var(--c-t4)] shrink-0 w-10 text-right uppercase tracking-wider" aria-hidden="true">
            {unit}
          </span>
        </div>
      </div>
      <div
        className={`text-right shrink-0 w-20 transition-opacity duration-300 ${valueInEgp != null ? 'opacity-100' : 'opacity-0'}`}
        aria-live="polite"
      >
        <span className="text-[9px] font-bold text-[var(--c-t4)] block uppercase tracking-wider">= EGP</span>
        <span className="text-sm font-bold text-[var(--c-t2)]">
          {valueInEgp != null ? formatNumber(valueInEgp) : '-'}
        </span>
      </div>
    </div>
  );
}
