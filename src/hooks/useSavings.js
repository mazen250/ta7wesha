import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TROY_OUNCE_GRAMS, GOLD_21K_PURITY, GOLD_POUND_GRAMS,
  API_CURRENCY, API_GOLD, RATES_REFRESH_MS,
  STORAGE_KEYS, ZAKAT_NISAB_GOLD_GRAMS, ZAKAT_RATE,
  getCurrencyColor,
} from '../constants';

// -- localStorage helpers --

function load(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded — ignore */ }
}

// -- Unique ID generator --

let idCounter = Date.now();
const uid = () => String(idCounter++);

// -- Migrate old amounts format to new savings array --

function loadSavings() {
  const saved = load(STORAGE_KEYS.savings, null);
  if (saved) return saved;

  // Migrate from legacy { gold: '', usd: '', ... } format
  const oldAmounts = load(STORAGE_KEYS.amounts, null);
  if (oldAmounts) {
    return Object.entries(oldAmounts).map(([currency, amount]) => ({
      id: uid(), currency, amount,
    }));
  }

  return [
    { id: uid(), currency: 'gold', amount: '', karat: 21 },
    { id: uid(), currency: 'usd', amount: '' },
    { id: uid(), currency: 'eur', amount: '' },
    { id: uid(), currency: 'egp', amount: '' },
  ];
}

// -- Convert any currency amount to EGP --

export function convertToEgp(amount, currency, rates, karat = 21) {
  if (currency === 'egp') return amount;
  if (currency === 'gold') {
    // goldGramEgp is 21k; scale for other karats
    const gold24k = rates.goldGramEgp / GOLD_21K_PURITY;
    return amount * gold24k * (karat / 24);
  }
  // Use full API rates if available
  if (rates.allRates) {
    const code = currency.toUpperCase();
    if (rates.allRates[code] && rates.allRates.EGP) {
      return amount * (rates.allRates.EGP / rates.allRates[code]);
    }
  }
  // Fallback for legacy cached rates
  if (currency === 'usd') return amount * rates.usdToEgp;
  if (currency === 'eur') return amount * rates.eurToEgp;
  return amount;
}

export function convertFromEgp(egpAmount, currency, rates, karat = 21) {
  if (currency === 'egp') return egpAmount;
  if (currency === 'gold') {
    const gold24k = rates.goldGramEgp / GOLD_21K_PURITY;
    return egpAmount / (gold24k * (karat / 24));
  }
  if (rates.allRates) {
    const code = currency.toUpperCase();
    if (rates.allRates[code] && rates.allRates.EGP) {
      return egpAmount / (rates.allRates.EGP / rates.allRates[code]);
    }
  }
  if (currency === 'usd') return egpAmount / rates.usdToEgp;
  if (currency === 'eur') return egpAmount / rates.eurToEgp;
  return egpAmount;
}

// -- Hook --

export function useSavings() {
  const [savings, setSavings] = useState(loadSavings);
  const [rawRates, setRawRates] = useState(() =>
    load(STORAGE_KEYS.rates, null)
  );
  const [prevRates, setPrevRates] = useState(() =>
    load(STORAGE_KEYS.prevRates, null)
  );
  const [goals, setGoals] = useState(() =>
    load(STORAGE_KEYS.goals, [{ id: uid(), name: 'My Goal', target: '' }])
  );
  const [incomes, setIncomes] = useState(() =>
    load(STORAGE_KEYS.incomes, [{ id: uid(), currency: 'egp', amount: '' }])
  );
  const [expenses, setExpenses] = useState(() =>
    load(STORAGE_KEYS.expenses, [{ id: uid(), name: '', currency: 'egp', amount: '' }])
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist to localStorage on changes
  useEffect(() => save(STORAGE_KEYS.savings, savings), [savings]);
  useEffect(() => save(STORAGE_KEYS.goals, goals), [goals]);
  useEffect(() => save(STORAGE_KEYS.incomes, incomes), [incomes]);
  useEffect(() => save(STORAGE_KEYS.expenses, expenses), [expenses]);

  // Fetch rates from APIs
  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [currencyRes, goldRes] = await Promise.all([
        fetch(API_CURRENCY),
        fetch(API_GOLD),
      ]);
      if (!currencyRes.ok || !goldRes.ok) throw new Error('API error');

      const currencyData = await currencyRes.json();
      const goldData = await goldRes.json();

      // AwesomeAPI returns { USDEGP: { bid, ... }, USDEUR: { bid, ... }, ... }
      // Build allRates as { USD: 1, EGP: rate, EUR: rate, ... } (how many per 1 USD)
      const allRates = { USD: 1 };
      for (const [key, val] of Object.entries(currencyData)) {
        // key is like "USDEGP", val.bid is the rate
        const target = key.replace('USD', '');
        allRates[target] = parseFloat(val.bid) || 0;
      }

      const newRates = {
        usdToEgp: allRates.EGP || 0,
        eurToUsd: allRates.EUR || 0,
        goldOunceUsd: goldData.price,
        allRates,
        lastUpdated: new Date().toISOString(),
      };

      // Save current rates as previous before overwriting
      setRawRates(current => {
        if (current) {
          setPrevRates(current);
          save(STORAGE_KEYS.prevRates, current);
        }
        save(STORAGE_KEYS.rates, newRates);
        return newRates;
      });
    } catch {
      setError('Failed to fetch rates. Using cached data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount + auto-refresh every 5 minutes
  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, RATES_REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchRates]);

  // Derived calculations (memoized)
  const derived = useMemo(() => {
    if (!rawRates) return null;
    const { usdToEgp, eurToUsd, goldOunceUsd, allRates } = rawRates;

    // Guard against invalid API data
    if (!eurToUsd || !usdToEgp) return null;

    // Exchange rates
    const eurToEgp = usdToEgp / eurToUsd;
    const gold24kGramEgp = (goldOunceUsd / TROY_OUNCE_GRAMS) * usdToEgp;
    const goldGramEgp = gold24kGramEgp * GOLD_21K_PURITY;
    const goldPoundEgp = GOLD_POUND_GRAMS * goldGramEgp;

    const rates = { usdToEgp, eurToEgp, goldGramEgp, goldPoundEgp, allRates };

    // Savings breakdown — aggregate by currency
    const currencyTotals = {};
    let totalEgp = 0;
    for (const s of savings) {
      const amt = parseFloat(s.amount) || 0;
      if (amt <= 0) continue;
      const egpValue = convertToEgp(amt, s.currency, rates, s.karat || 21);
      totalEgp += egpValue;
      if (!currencyTotals[s.currency]) currencyTotals[s.currency] = 0;
      currencyTotals[s.currency] += egpValue;
    }

    const totalUsd = usdToEgp > 0 ? totalEgp / usdToEgp : 0;

    // Monthly income (converted to EGP)
    const monthlyEgp = incomes.reduce((sum, income) => {
      const amount = parseFloat(income.amount) || 0;
      return sum + convertToEgp(amount, income.currency, rates);
    }, 0);

    // Monthly expenses (converted to EGP)
    const monthlyExpensesEgp = expenses.reduce((sum, expense) => {
      const amount = parseFloat(expense.amount) || 0;
      return sum + convertToEgp(amount, expense.currency, rates);
    }, 0);

    const monthlySurplus = monthlyEgp - monthlyExpensesEgp;
    const savingsRate = monthlyEgp > 0 ? ((monthlyEgp - monthlyExpensesEgp) / monthlyEgp) * 100 : 0;

    // Goals with progress calculations (use surplus if expenses exist)
    const goalsCalc = goals.map(goal => {
      const target = parseFloat(goal.target) || 0;
      const remaining = Math.max(0, target - totalEgp);
      const eta = monthlySurplus > 0 ? remaining / monthlySurplus : null;
      const progress = target > 0 ? Math.min(100, (totalEgp / target) * 100) : 0;
      return { ...goal, remaining, eta, progress, targetValue: target };
    });

    // Zakat calculations
    const gold24kPrice = goldGramEgp / GOLD_21K_PURITY;
    const nisabEgp = ZAKAT_NISAB_GOLD_GRAMS * gold24kPrice;
    const zakatEligible = totalEgp >= nisabEgp;
    const zakatAmount = zakatEligible ? totalEgp * ZAKAT_RATE : 0;

    // Price change indicators (vs previous fetch)
    let changes = null;
    if (prevRates && prevRates.eurToUsd) {
      const prevEurToEgp = prevRates.usdToEgp / prevRates.eurToUsd;
      const prevGoldGramEgp = (prevRates.goldOunceUsd / TROY_OUNCE_GRAMS) * prevRates.usdToEgp * GOLD_21K_PURITY;
      changes = {
        usd: ((usdToEgp - prevRates.usdToEgp) / prevRates.usdToEgp) * 100,
        eur: ((eurToEgp - prevEurToEgp) / prevEurToEgp) * 100,
        gold: ((goldGramEgp - prevGoldGramEgp) / prevGoldGramEgp) * 100,
      };
    }

    // Asset allocation breakdown (for pie chart)
    const breakdown = totalEgp > 0
      ? Object.entries(currencyTotals).map(([key, value]) => ({
          key,
          label: key === 'gold' ? 'Gold' : key.toUpperCase(),
          value,
          pct: (value / totalEgp) * 100,
          color: getCurrencyColor(key),
        }))
      : [];

    return {
      ...rates, totalEgp, totalUsd, monthlyEgp,
      monthlyExpensesEgp, monthlySurplus, savingsRate,
      goalsCalc, changes, breakdown,
      nisabEgp, zakatEligible, zakatAmount,
    };
  }, [rawRates, prevRates, savings, incomes, expenses, goals]);

  // -- Savings updaters --

  const addSaving = useCallback(() => {
    setSavings(prev => [...prev, { id: uid(), currency: 'egp', amount: '' }]);
  }, []);
  const removeSaving = useCallback((id) => {
    setSavings(prev => prev.filter(s => s.id !== id));
  }, []);
  const updateSaving = useCallback((id, field, value) => {
    setSavings(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }, []);

  // -- Goal updaters --

  const addGoal = useCallback(() => {
    setGoals(prev => [...prev, { id: uid(), name: '', target: '' }]);
  }, []);
  const removeGoal = useCallback((id) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  }, []);
  const updateGoal = useCallback((id, field, value) => {
    setGoals(prev => prev.map(goal => goal.id === id ? { ...goal, [field]: value } : goal));
  }, []);

  // -- Income updaters --

  const addIncome = useCallback(() => {
    setIncomes(prev => [...prev, { id: uid(), currency: 'egp', amount: '' }]);
  }, []);
  const removeIncome = useCallback((id) => {
    setIncomes(prev => prev.filter(income => income.id !== id));
  }, []);
  const updateIncome = useCallback((id, field, value) => {
    setIncomes(prev => prev.map(income => income.id === id ? { ...income, [field]: value } : income));
  }, []);

  // -- Expense updaters --

  const addExpense = useCallback(() => {
    setExpenses(prev => [...prev, { id: uid(), name: '', currency: 'egp', amount: '' }]);
  }, []);
  const removeExpense = useCallback((id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);
  const updateExpense = useCallback((id, field, value) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  }, []);

  // Export all data as JSON
  const exportData = useCallback(() => {
    const data = {
      version: 2,
      exportedAt: new Date().toISOString(),
      savings,
      goals,
      incomes,
      expenses,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ta7wesha-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [savings, goals, incomes, expenses]);

  // Import data from JSON
  const importData = useCallback((data) => {
    if (data.savings) setSavings(data.savings);
    else if (data.amounts) {
      // Support importing v1 backups
      setSavings(Object.entries(data.amounts).map(([currency, amount]) => ({
        id: uid(), currency, amount,
      })));
    }
    if (data.goals) setGoals(data.goals);
    if (data.incomes) setIncomes(data.incomes);
    if (data.expenses) setExpenses(data.expenses);
  }, []);

  return {
    savings, addSaving, removeSaving, updateSaving,
    rates: derived,
    isLoading, error,
    lastUpdated: rawRates?.lastUpdated,
    refreshRates: fetchRates,
    goals, addGoal, removeGoal, updateGoal,
    incomes, addIncome, removeIncome, updateIncome,
    expenses, addExpense, removeExpense, updateExpense,
    exportData, importData,
  };
}
