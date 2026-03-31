import { Gem, DollarSign, Euro, Landmark } from 'lucide-react';

// -- Conversion constants --
export const TROY_OUNCE_GRAMS = 31.1035;
export const GOLD_21K_PURITY = 21 / 24;
export const GOLD_POUND_GRAMS = 8;

// -- API endpoints --
export const API_CURRENCY = 'https://open.er-api.com/v6/latest/USD';
export const API_GOLD = 'https://api.gold-api.com/price/XAU';

// -- localStorage keys --
export const STORAGE_KEYS = {
  amounts: 'ta7wesha-amounts',
  rates: 'ta7wesha-rates',
  prevRates: 'ta7wesha-prev-rates',
  goals: 'ta7wesha-goals',
  incomes: 'ta7wesha-incomes',
  theme: 'ta7wesha-theme',
};

// -- Shared asset/currency colors --
export const ASSET_COLORS = {
  gold: '#f59e0b',
  usd: '#10b981',
  eur: '#6366f1',
  egp: '#ec4899',
};

// -- Asset definitions for the savings inputs --
export const ASSETS = [
  { key: 'gold', icon: Gem, color: ASSET_COLORS.gold, label: 'Gold (21k)', unit: 'grams' },
  { key: 'usd', icon: DollarSign, color: ASSET_COLORS.usd, label: 'US Dollar', unit: 'USD' },
  { key: 'eur', icon: Euro, color: ASSET_COLORS.eur, label: 'Euro', unit: 'EUR' },
  { key: 'egp', icon: Landmark, color: ASSET_COLORS.egp, label: 'Egyptian Pound', unit: 'EGP' },
];

// -- Currency options for selects (goals, converter) --
export const CURRENCY_OPTIONS = [
  { value: 'egp', label: 'EGP' },
  { value: 'usd', label: 'USD' },
  { value: 'eur', label: 'EUR' },
  { value: 'gold', label: 'Gold (g)' },
];

// -- Default state values --
export const DEFAULT_AMOUNTS = { gold: '', usd: '', eur: '', egp: '' };

// -- Tick interval for "Updated X ago" display (ms) --
export const TIME_AGO_TICK_MS = 60_000;
