import { useEffect, useState } from 'react';
import { RefreshCw, Sun, Moon } from 'lucide-react';
import { FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';
import { useSavings } from './hooks/useSavings';
import { useTheme } from './hooks/useTheme';
import { useLang } from './hooks/useLang';
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
  const { t, isRtl, toggleLang } = useLang();

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(k => k + 1), TIME_AGO_TICK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-dvh px-4 py-6 sm:py-10" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <header className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">{t('appName')}</h1>
            <p className="text-[13px] text-[var(--c-t3)] mt-1 font-medium">{t('subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-[11px] text-[var(--c-t3)] font-medium">
                {t('updated')} {timeAgo(lastUpdated, t)}
              </span>
            )}
            {/* Desktop: all buttons inline */}
            <div className="hidden sm:contents">
              <DataManager exportData={exportData} importData={importData} />
              <button
                onClick={toggleLang}
                className="p-2 rounded-xl bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-t3)] hover:text-[var(--c-t1)] transition-all text-[11px] font-bold"
              >
                {t('language')}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-[var(--c-card)] border border-[var(--c-border)] text-[var(--c-t3)] hover:text-[var(--c-t1)] transition-all"
                aria-label={isDark ? t('lightMode') : t('darkMode')}
              >
                {isDark ? <Sun size={14} strokeWidth={2.5} /> : <Moon size={14} strokeWidth={2.5} />}
              </button>
            </div>
            <button
              onClick={refreshRates}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--c-t2)] hover:text-[var(--c-t1)] bg-[var(--c-card)] border border-[var(--c-border)] rounded-xl px-3 py-2 transition-all disabled:opacity-30"
              aria-label={t('refresh')}
              aria-busy={isLoading}
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} strokeWidth={2.5} aria-hidden="true" />
              <span className="hidden sm:inline">{t('refresh')}</span>
            </button>
            {/* Mobile: dropdown menu */}
            <HeaderMenu
              isDark={isDark}
              toggleTheme={toggleTheme}
              toggleLang={toggleLang}
              exportData={exportData}
              importData={importData}
            />
          </div>
        </header>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 text-xs font-semibold" role="alert">
            {error}
          </div>
        )}

        <RateBanner rates={rates} isLoading={isLoading} />

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <TotalDisplay rates={rates} isLoading={isLoading} />
          <ExpenseTracker
            expenses={expenses} addExpense={addExpense} removeExpense={removeExpense} updateExpense={updateExpense}
            rates={rates}
          />
        </div>

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

        <footer className="mt-10 pb-6 text-center space-y-2">
          <p className="text-[10px] text-[var(--c-t4)] font-medium tracking-wide">{t('footer')}</p>
          <p className="text-[11px] font-semibold text-[var(--c-t3)]">{t('builtBy')}</p>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[10px] text-[var(--c-t4)] font-medium">{t('connectWithMe')}</span>
            <a href="https://www.linkedin.com/in/mazen-alahwani-31b693152/" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-[var(--c-t4)] hover:text-[#0A66C2] hover:bg-[var(--c-card-h)] transition-all" aria-label="LinkedIn">
              <FaLinkedin size={14} />
            </a>
            <a href="https://www.instagram.com/mazenfayez/" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-[var(--c-t4)] hover:text-[#E4405F] hover:bg-[var(--c-card-h)] transition-all" aria-label="Instagram">
              <FaInstagram size={14} />
            </a>
            <a href="https://www.facebook.com/mazen.fayezmano" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-[var(--c-t4)] hover:text-[#1877F2] hover:bg-[var(--c-card-h)] transition-all" aria-label="Facebook">
              <FaFacebook size={14} />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
