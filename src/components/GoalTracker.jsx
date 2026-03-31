import { useId } from 'react';
import { Target, Plus, X, Trash2 } from 'lucide-react';
import { formatNumber, formatDuration } from '../utils/format';
import { CURRENCY_OPTIONS } from '../constants';
import NumberInput from './NumberInput';

export default function GoalTracker({
  goals, addGoal, removeGoal, updateGoal,
  incomes, addIncome, removeIncome, updateIncome,
  rates,
}) {
  const sectionId = useId();

  return (
    <div className="rounded-2xl bg-[var(--c-card)] border border-[var(--c-border)] p-5" role="region" aria-label="Goals and income">
      <h2 className="text-base font-bold mb-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center" aria-hidden="true">
          <Target size={16} className="text-violet-400" strokeWidth={2.5} />
        </div>
        Goals & Income
      </h2>

      {/* Monthly income */}
      <IncomeSection
        incomes={incomes}
        addIncome={addIncome}
        removeIncome={removeIncome}
        updateIncome={updateIncome}
        monthlyEgp={rates?.monthlyEgp}
      />

      <div className="h-px bg-[var(--c-border)] mb-5" role="separator" />

      {/* Goals list */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-[var(--c-t3)] uppercase tracking-[0.1em]" id={sectionId}>
          My Goals
        </span>
        <button
          onClick={addGoal}
          className="flex items-center gap-1 text-[11px] font-bold text-violet-400/70 hover:text-violet-300 transition-colors"
          aria-label="Add a new goal"
        >
          <Plus size={12} strokeWidth={3} aria-hidden="true" />
          Add goal
        </button>
      </div>

      <div className="space-y-3" role="list" aria-labelledby={sectionId}>
        {goals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            calc={rates?.goalsCalc?.find(gc => gc.id === goal.id)}
            onUpdate={updateGoal}
            onRemove={removeGoal}
            canRemove={goals.length > 1}
          />
        ))}
      </div>
    </div>
  );
}

function IncomeSection({ incomes, addIncome, removeIncome, updateIncome, monthlyEgp }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-[var(--c-t3)] uppercase tracking-[0.1em]">Monthly Income</span>
        <button
          onClick={addIncome}
          className="flex items-center gap-1 text-[11px] font-bold text-violet-400/70 hover:text-violet-300 transition-colors"
          aria-label="Add an income source"
        >
          <Plus size={12} strokeWidth={3} aria-hidden="true" />
          Add
        </button>
      </div>
      <div className="space-y-2">
        {incomes.map(income => (
          <IncomeRow
            key={income.id}
            income={income}
            onUpdate={updateIncome}
            onRemove={removeIncome}
            canRemove={incomes.length > 1}
          />
        ))}
      </div>
      {monthlyEgp > 0 && (
        <p className="text-[11px] font-semibold text-[var(--c-t3)] mt-2">
          Total: <span className="text-[var(--c-t2)]">EGP {formatNumber(monthlyEgp)}/mo</span>
        </p>
      )}
    </div>
  );
}

function IncomeRow({ income, onUpdate, onRemove, canRemove }) {
  const selectId = useId();
  const inputId = useId();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={selectId} className="sr-only">Currency</label>
      <select
        id={selectId}
        value={income.currency}
        onChange={e => onUpdate(income.id, 'currency', e.target.value)}
        className="bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-2.5 py-2 text-sm font-semibold text-[var(--c-t1)] focus:outline-none focus:ring-1 focus:ring-[var(--c-ring)] cursor-pointer"
        style={{ backgroundColor: 'var(--c-select)' }}
      >
        {CURRENCY_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <label htmlFor={inputId} className="sr-only">Amount</label>
      <NumberInput
        id={inputId}
        placeholder="Amount"
        value={income.amount}
        onChange={val => onUpdate(income.id, 'amount', val)}
        className="flex-1 bg-[var(--c-input)] border border-[var(--c-border)] rounded-lg px-3 py-2 text-sm font-semibold text-[var(--c-t1)] placeholder:text-[var(--c-ph)] focus:outline-none focus:ring-1 focus:ring-[var(--c-ring)] transition-all"
      />
      {canRemove && (
        <button
          onClick={() => onRemove(income.id)}
          className="text-[var(--c-t4)] hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-[var(--c-card-h)]"
          aria-label="Remove income source"
        >
          <X size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function GoalCard({ goal, calc, onUpdate, onRemove, canRemove }) {
  const nameId = useId();
  const targetId = useId();
  const reached = calc && calc.targetValue > 0 && calc.remaining <= 0;

  return (
    <div
      role="listitem"
      className={`rounded-xl p-3.5 border transition-colors ${
        reached ? 'bg-emerald-500/[0.07] border-emerald-500/10' : 'bg-[var(--c-input)] border-[var(--c-border)]'
      }`}
    >
      <div className="flex items-start gap-2 mb-2">
        <label htmlFor={nameId} className="sr-only">Goal name</label>
        <input
          id={nameId}
          type="text" placeholder="Goal name"
          value={goal.name}
          onChange={e => onUpdate(goal.id, 'name', e.target.value)}
          className="flex-1 bg-transparent text-sm font-bold text-[var(--c-t1)] placeholder:text-[var(--c-ph)] focus:outline-none"
        />
        {canRemove && (
          <button
            onClick={() => onRemove(goal.id)}
            className="text-[var(--c-t4)] hover:text-red-400 transition-colors p-0.5"
            aria-label={`Remove goal ${goal.name || 'unnamed'}`}
          >
            <Trash2 size={13} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>
      <label htmlFor={targetId} className="sr-only">Target amount in EGP</label>
      <NumberInput
        id={targetId}
        placeholder="Target in EGP"
        value={goal.target}
        onChange={val => onUpdate(goal.id, 'target', val)}
        className="w-full bg-[var(--c-card)] border border-[var(--c-border)] rounded-lg px-3 py-2 text-sm font-semibold text-[var(--c-t1)] placeholder:text-[var(--c-ph)] focus:outline-none focus:ring-1 focus:ring-[var(--c-ring)] transition-all mb-2"
      />
      {calc && calc.targetValue > 0 && (
        <>
          <div
            className="w-full bg-[var(--c-border)] rounded-full h-1.5 overflow-hidden mb-2"
            role="progressbar"
            aria-valuenow={Math.round(calc.progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Goal progress: ${calc.progress.toFixed(1)}%`}
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ${reached ? 'bg-emerald-400' : 'bg-violet-400'}`}
              style={{ width: `${calc.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-[var(--c-t3)]">
              {calc.progress.toFixed(1)}% &middot; EGP {formatNumber(calc.remaining)} left
            </span>
            <span className={`font-extrabold ${reached ? 'text-emerald-400' : 'text-violet-400'}`}>
              {formatDuration(calc.eta)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
