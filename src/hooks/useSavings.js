import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TROY_OUNCE_GRAMS, GOLD_21K_PURITY, GOLD_POUND_GRAMS,
  API_CURRENCY, API_GOLD,
  STORAGE_KEYS, DEFAULT_AMOUNTS, ASSET_COLORS,
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

// -- Convert any currency amount to EGP --

export function convertToEgp(amount, currency, rates) {
  switch (currency) {
    case 'usd': return amount * rates.usdToEgp;
    case 'eur': return amount * rates.eurToEgp;
    case 'gold': return amount * rates.goldGramEgp;
    default: return amount;
  }
}

export function convertFromEgp(egpAmount, currency, rates) {
  switch (currency) {
    case 'usd': return egpAmount / rates.usdToEgp;
    case 'eur': return egpAmount / rates.eurToEgp;
    case 'gold': return egpAmount / rates.goldGramEgp;
    default: return egpAmount;
  }
}

// -- Hook --

export function useSavings() {
  const [amounts, setAmounts] = useState(() =>
    load(STORAGE_KEYS.amounts, DEFAULT_AMOUNTS)
  );
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist to localStorage on changes
  useEffect(() => save(STORAGE_KEYS.amounts, amounts), [amounts]);
  useEffect(() => save(STORAGE_KEYS.goals, goals), [goals]);
  useEffect(() => save(STORAGE_KEYS.incomes, incomes), [incomes]);

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

      const newRates = {
        usdToEgp: currencyData.rates.EGP,
        eurToUsd: currencyData.rates.EUR,
        goldOunceUsd: goldData.price,
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

  useEffect(() => { fetchRates(); }, [fetchRates]);

  // Derived calculations (memoized)
  const derived = useMemo(() => {
    if (!rawRates) return null;
    const { usdToEgp, eurToUsd, goldOunceUsd } = rawRates;

    // Guard against invalid API data
    if (!eurToUsd || !usdToEgp) return null;

    // Exchange rates
    const eurToEgp = usdToEgp / eurToUsd;
    const gold24kGramEgp = (goldOunceUsd / TROY_OUNCE_GRAMS) * usdToEgp;
    const goldGramEgp = gold24kGramEgp * GOLD_21K_PURITY;
    const goldPoundEgp = GOLD_POUND_GRAMS * goldGramEgp;

    const rates = { usdToEgp, eurToEgp, goldGramEgp, goldPoundEgp };

    // Savings breakdown
    const goldValue = (parseFloat(amounts.gold) || 0) * goldGramEgp;
    const usdValue = (parseFloat(amounts.usd) || 0) * usdToEgp;
    const eurValue = (parseFloat(amounts.eur) || 0) * eurToEgp;
    const egpValue = parseFloat(amounts.egp) || 0;

    const totalEgp = goldValue + usdValue + eurValue + egpValue;
    const totalUsd = usdToEgp > 0 ? totalEgp / usdToEgp : 0;

    // Monthly income (converted to EGP)
    const monthlyEgp = incomes.reduce((sum, income) => {
      const amount = parseFloat(income.amount) || 0;
      return sum + convertToEgp(amount, income.currency, rates);
    }, 0);

    // Goals with progress calculations
    const goalsCalc = goals.map(goal => {
      const target = parseFloat(goal.target) || 0;
      const remaining = Math.max(0, target - totalEgp);
      const eta = monthlyEgp > 0 ? remaining / monthlyEgp : null;
      const progress = target > 0 ? Math.min(100, (totalEgp / target) * 100) : 0;
      return { ...goal, remaining, eta, progress, targetValue: target };
    });

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
      ? [
          { key: 'gold', label: 'Gold', value: goldValue, pct: (goldValue / totalEgp) * 100, color: ASSET_COLORS.gold },
          { key: 'usd', label: 'USD', value: usdValue, pct: (usdValue / totalEgp) * 100, color: ASSET_COLORS.usd },
          { key: 'eur', label: 'EUR', value: eurValue, pct: (eurValue / totalEgp) * 100, color: ASSET_COLORS.eur },
          { key: 'egp', label: 'EGP', value: egpValue, pct: (egpValue / totalEgp) * 100, color: ASSET_COLORS.egp },
        ].filter(item => item.value > 0)
      : [];

    return {
      ...rates, totalEgp, totalUsd, monthlyEgp,
      goalsCalc, changes, breakdown,
    };
  }, [rawRates, prevRates, amounts, incomes, goals]);

  // -- State updaters --

  const setAmount = useCallback((key, value) => {
    setAmounts(prev => ({ ...prev, [key]: value }));
  }, []);

  const addGoal = useCallback(() => {
    setGoals(prev => [...prev, { id: uid(), name: '', target: '' }]);
  }, []);
  const removeGoal = useCallback((id) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  }, []);
  const updateGoal = useCallback((id, field, value) => {
    setGoals(prev => prev.map(goal => goal.id === id ? { ...goal, [field]: value } : goal));
  }, []);

  const addIncome = useCallback(() => {
    setIncomes(prev => [...prev, { id: uid(), currency: 'egp', amount: '' }]);
  }, []);
  const removeIncome = useCallback((id) => {
    setIncomes(prev => prev.filter(income => income.id !== id));
  }, []);
  const updateIncome = useCallback((id, field, value) => {
    setIncomes(prev => prev.map(income => income.id === id ? { ...income, [field]: value } : income));
  }, []);

  return {
    amounts, setAmount,
    rates: derived,
    isLoading, error,
    lastUpdated: rawRates?.lastUpdated,
    refreshRates: fetchRates,
    goals, addGoal, removeGoal, updateGoal,
    incomes, addIncome, removeIncome, updateIncome,
  };
}
