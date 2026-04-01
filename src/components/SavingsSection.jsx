import { useId } from 'react';
import { DollarSign, Plus, X } from 'lucide-react';
import { formatNumber } from '../utils/format';
import { CURRENCY_OPTIONS, KARAT_OPTIONS, getCurrencyColor } from '../constants';
import { convertToEgp } from '../hooks/useSavings';
import { useLang } from '../hooks/useLang';
import NumberInput from './NumberInput';

export default function SavingsSection({ savings, addSaving, removeSaving, updateSaving, rates }) {
  const { t } = useLang();
  return (
    <div className="rounded-2xl bg-[var(--c-card)] border border-[var(--c-border)] p-5" role="region" aria-label={t('mySavings')}>
      <h2 className="text-base font-bold mb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center" aria-hidden="true">
          <DollarSign size={16} className="text-emerald-400" strokeWidth={2.5} />
        </div>
        {t('mySavings')}
        <button
          onClick={addSaving}
          className="ms-auto flex items-center gap-1 text-[11px] font-bold text-emerald-400/70 hover:text-emerald-300 transition-colors"
          aria-label={t('add')}
        >
          <Plus size={12} strokeWidth={3} aria-hidden="true" />
          {t('add')}
        </button>
      </h2>
      <div className="space-y-2">
        {savings.map(s => (
          <SavingRow
            key={s.id}
            saving={s}
            onUpdate={updateSaving}
            onRemove={removeSaving}
            canRemove={savings.length > 1}
            rates={rates}
          />
        ))}
      </div>
    </div>
  );
}

function SavingRow({ saving, onUpdate, onRemove, canRemove, rates }) {
  const curId = useId();
  const amtId = useId();
  const karatId = useId();
  const { t } = useLang();

  const isGold = saving.currency === 'gold';
  const karat = saving.karat || 21;
  const parsed = parseFloat(saving.amount) || 0;
  const egpValue = rates && parsed > 0 ? convertToEgp(parsed, saving.currency, rates, karat) : null;
  const color = getCurrencyColor(saving.currency);

  return (
    <div className="group rounded-xl p-3 hover:bg-[var(--c-card-h)] transition-all duration-200">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-6 rounded-full shrink-0" style={{ background: color }} aria-hidden="true" />
        <label htmlFor={curId} className="sr-only">{t('currency')}</label>
        <select
          id={curId}
          value={saving.currency}
          onChange={e => onUpdate(saving.id, 'currency', e.target.value)}
          className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-2 py-1.5 text-xs font-bold text-[var(--c-t1)] focus:outline-none focus:ring-1 focus:ring-[var(--c-ring)] cursor-pointer"
          style={{ backgroundColor: 'var(--c-select)' }}
        >
          {CURRENCY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {isGold && (
          <>
            <label htmlFor={karatId} className="sr-only">{t('karat')}</label>
            <select
              id={karatId}
              value={karat}
              onChange={e => onUpdate(saving.id, 'karat', Number(e.target.value))}
              className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-2 py-1.5 text-xs font-bold text-[var(--c-t1)] focus:outline-none focus:ring-1 focus:ring-[var(--c-ring)] cursor-pointer"
              style={{ backgroundColor: 'var(--c-select)' }}
            >
              {KARAT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </>
        )}
        {canRemove && (
          <button
            onClick={() => onRemove(saving.id)}
            className="ms-auto text-[var(--c-t4)] hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-[var(--c-card-h)] shrink-0"
            aria-label={t('removeCurrency')}
          >
            <X size={14} strokeWidth={2.5} aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 ps-4">
        <label htmlFor={amtId} className="sr-only">{t('amount')}</label>
        <NumberInput
          id={amtId}
          placeholder="0"
          value={saving.amount}
          onChange={val => onUpdate(saving.id, 'amount', val)}
          className="flex-1 min-w-0 bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-3 py-2 text-[15px] font-semibold text-[var(--c-t1)] placeholder:text-[var(--c-ph)] focus:outline-none focus:ring-1 focus:ring-[var(--c-ring)] transition-all"
        />
        <div className={`text-right shrink-0 transition-opacity duration-300 ${egpValue != null ? 'opacity-100' : 'opacity-0'}`} aria-live="polite">
          <span className="text-[9px] font-bold text-[var(--c-t4)] block uppercase tracking-wider">{t('eqEgp')}</span>
          <span className="text-sm font-bold text-[var(--c-t2)]">
            {egpValue != null ? formatNumber(egpValue) : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}
