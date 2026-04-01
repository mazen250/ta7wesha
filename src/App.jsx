import { useEffect, useState } from 'react';
import { RefreshCw, Sun, Moon } from 'lucide-react';
import { useSavings } from './hooks/useSavings';
import { useTheme } from './hooks/useTheme';
import { TIME_AGO_TICK_MS } from './constants';
import { timeAgo } from './utils/format';
import RateBanner from './components/RateBanner';
import SavingsSection from './components/SavingsSection';
import TotalDisplay from './components/TotalDisplay';
import GoalTracker from './components/GoalTracker';
import ExpenseTracker from './components/ExpenseTracker';
import NetWorthChart from './components/NetWorthChart';
import CurrencyConverter from './components/CurrencyConverter';
import WhatIfCalc from './components/WhatIfCalc';
import GoldCalc from './components/GoldCalc';
import ZakatCalc from './components/ZakatCalc';
import DataManager from './components/DataManager';
import HeaderMenu from './components/HeaderMenu';

export default function App() {
  const {
    savings, addSaving, removeSaving, updateSaving,
    rates, isLoading, error,
    lastUpdated, refreshRates,
    goals, addGoal, removeGoal, updateGoal,
    incomes, addIncome, removeIncome, updateIncome,
    expenses, addExpense, removeExpense, updateExpense,
    exportData, importData,
  } = useSavings();

  const { isDark, toggle: toggleTheme } = useTheme();

  // Re-render every minute to keep "Updated X ago" fresh
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), TIME_AGO_TICK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-dvh px-4 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <header className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">Ta7wesha</h1>
            <p className="text-[13px] text-[var(--c-t3)] mt-1 font-medium">Your savings, one glance.</p>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-[11px] text-[var(--c-t3)] font-medium">
                Updated {timeAgo(lastUpdated)}
              </span>
            )}
            {/* Desktop: all buttons inline */}
            <div className="hidden sm:contents">
              <DataManager exportData={exportData} importData={importData} />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-t3)] hover:text-[var(--c-t1)] transition-all"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={14} strokeWidth={2.5} /> : <Moon size={14} strokeWidth={2.5} />}
              </button>
            </div>
            <button
              onClick={refreshRates}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--c-t2)] hover:text-[var(--c-t1)] bg-[var(--c-card)] border border-[var(--c-border)] rounded-xl px-3 py-2 transition-all disabled:opacity-30"
              aria-label="Refresh exchange rates"
              aria-busy={isLoading}
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} strokeWidth={2.5} aria-hidden="true" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            {/* Mobile: dropdown menu */}
            <HeaderMenu
              isDark={isDark}
              toggleTheme={toggleTheme}
              exportData={exportData}
              importData={importData}
            />
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 text-xs font-semibold" role="alert">
            {error}
          </div>
        )}

        {/* Rate cards */}
        <RateBanner rates={rates} isLoading={isLoading} />

        {/* Main grid: Savings | Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <SavingsSection
            savings={savings} addSaving={addSaving} removeSaving={removeSaving} updateSaving={updateSaving}
            rates={rates}
          />
          <GoalTracker
            goals={goals} addGoal={addGoal} removeGoal={removeGoal} updateGoal={updateGoal}
            incomes={incomes} addIncome={addIncome} removeIncome={removeIncome} updateIncome={updateIncome}
            rates={rates}
          />
        </div>

        {/* Total + Expenses row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <TotalDisplay rates={rates} isLoading={isLoading} />
          <ExpenseTracker
            expenses={expenses} addExpense={addExpense} removeExpense={removeExpense} updateExpense={updateExpense}
            rates={rates}
          />
        </div>

        {/* Bottom grid: tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-2">
            <NetWorthChart breakdown={rates?.breakdown} />
          </div>
          <div className="lg:col-span-2">
            <CurrencyConverter rates={rates} />
          </div>
          <div className="lg:col-span-2">
            <WhatIfCalc rates={rates} savings={savings} />
          </div>
          <div className="lg:col-span-2">
            <GoldCalc rates={rates} />
          </div>
          <div className="lg:col-span-2">
            <ZakatCalc rates={rates} />
          </div>
        </div>

        <footer className="text-center text-[10px] text-[var(--c-t4)] mt-10 pb-4 font-medium tracking-wide">
          Rates from open.er-api.com & gold-api.com — 100% free, no API keys.
        </footer>
      </div>
    </div>
  );
}
