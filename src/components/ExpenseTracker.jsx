import { useId } from 'react';
import { Receipt, Plus, X } from 'lucide-react';
import { formatNumber } from '../utils/format';
import { CURRENCY_OPTIONS } from '../constants';
import { useLang } from '../hooks/useLang';
import NumberInput from './NumberInput';

export default function ExpenseTracker({
  expenses, addExpense, removeExpense, updateExpense, rates,
}) {
  const { t } = useLang();

  return (
    <div className="rounded-2xl bg-[var(--c-card)] border border-[var(--c-border)] p-5" role="region" aria-label={t('expenses')}>
      <h2 className="text-base font-bold mb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center" aria-hidden="true">
          <Receipt size={16} className="text-rose-400" strokeWidth={2.5} />
        </div>
        {t('expenses')}
        <button
          onClick={addExpense}
          className="ms-auto flex items-center gap-1 text-[11px] font-bold text-rose-400/70 hover:text-rose-300 transition-colors"
          aria-label={t('addExpense')}
        >
          <Plus size={12} strokeWidth={3} aria-hidden="true" />
          {t('add')}
        </button>
      </h2>

      <div className="space-y-2">
        {expenses.map(expense => (
          <ExpenseRow key={expense.id} expense={expense} onUpdate={updateExpense} onRemove={removeExpense} canRemove={expenses.length > 1} />
        ))}
      </div>

      {rates && (
        <div className="mt-4 pt-3 border-t border-[var(--c-border)] space-y-1.5">
          {rates.monthlyExpensesEgp > 0 && (
            <p className="text-[11px] font-semibold text-[var(--c-t3)]">
              {t('total')}: <span className="text-rose-400">{t('egp')} {formatNumber(rates.monthlyExpensesEgp)}{t('perMonth')}</span>
            </p>
          )}
          {rates.monthlyEgp > 0 && (
            <>
              <p className="text-[11px] font-semibold text-[var(--c-t3)]">
                {t('surplus')}: <span className={rates.monthlySurplus >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {t('egp')} {formatNumber(rates.monthlySurplus)}{t('perMonth')}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[var(--c-t3)] uppercase">{t('savingsRate')}</span>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                  rates.savingsRate >= 50 ? 'text-emerald-400 bg-emerald-500/15' :
                  rates.savingsRate >= 20 ? 'text-yellow-400 bg-yellow-500/15' :
                  'text-red-400 bg-red-500/15'
                }`}>
                  {rates.savingsRate.toFixed(1)}%
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ExpenseRow({ expense, onUpdate, onRemove, canRemove }) {
  const nameId = useId();
  const curId = useId();
  const amtId = useId();
  const { t } = useLang();

  return (
    <div className="rounded-xl p-2 hover:bg-[var(--c-card-h)] transition-all">
      <div className="flex items-center gap-2 mb-2">
        <label htmlFor={nameId} className="sr-only">{t('expenseName')}</label>
        <input
          id={nameId}
          type="text"
          placeholder={t('expenseName')}
          value={expense.name || ''}
          onChange={e => onUpdate(expense.id, 'name', e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-sm font-bold text-[var(--c-t1)] placeholder:text-[var(--c-ph)] focus:outline-none"
        />
        {canRemove && (
          <button
            onClick={() => onRemove(expense.id)}
            className="ms-auto text-[var(--c-t4)] hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-[var(--c-card-h)] shrink-0"
            aria-label={t('removeExpense')}
          >
            <X size={14} strokeWidth={2.5} aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor={curId} className="sr-only">{t('currency')}</label>
        <select
          id={curId}
          value={expense.currency}
          onChange={e => onUpdate(expense.id, 'currency', e.target.value)}
          className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-2 py-2 text-[11px] font-semibold text-[var(--c-t1)] focus:outline-none focus:ring-1 focus:ring-[var(--c-ring)] cursor-pointer"
          style={{ backgroundColor: 'var(--c-select)' }}
        >
          {CURRENCY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <label htmlFor={amtId} className="sr-only">{t('amount')}</label>
        <NumberInput
          id={amtId}
          placeholder={t('amount')}
          value={expense.amount}
          onChange={val => onUpdate(expense.id, 'amount', val)}
          className="flex-1 min-w-0 bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-3 py-2 text-sm font-semibold text-[var(--c-t1)] placeholder:text-[var(--c-ph)] focus:outline-none focus:ring-1 focus:ring-[var(--c-ring)] transition-all"
        />
      </div>
    </div>
  );
}
