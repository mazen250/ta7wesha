// -- Conversion constants --
export const TROY_OUNCE_GRAMS = 31.1035;
export const GOLD_21K_PURITY = 21 / 24;
export const GOLD_POUND_GRAMS = 8;

// -- API endpoints --
export const API_CURRENCY = 'https://open.er-api.com/v6/latest/USD';
export const API_GOLD = 'https://api.gold-api.com/price/XAU';

// -- localStorage keys --
export const STORAGE_KEYS = {
  savings: 'ta7wesha-savings',
  amounts: 'ta7wesha-amounts', // legacy — used for migration
  rates: 'ta7wesha-rates',
  prevRates: 'ta7wesha-prev-rates',
  goals: 'ta7wesha-goals',
  incomes: 'ta7wesha-incomes',
  expenses: 'ta7wesha-expenses',
  theme: 'ta7wesha-theme',
};

// -- Currency colors --
export const CURRENCY_COLORS = {
  gold: '#f59e0b',
  usd: '#10b981',
  eur: '#6366f1',
  egp: '#ec4899',
  gbp: '#8b5cf6',
  sar: '#06b6d4',
  aed: '#14b8a6',
  kwd: '#f97316',
  bhd: '#e11d48',
  qar: '#7c3aed',
  omr: '#0ea5e9',
  jod: '#d946ef',
  try: '#ef4444',
  chf: '#64748b',
  cad: '#dc2626',
  aud: '#2563eb',
  gbp: '#a855f7',
  jpy: '#f43f5e',
  cny: '#ea580c',
  inr: '#0d9488',
};

const DEFAULT_COLOR = '#94a3b8';

export function getCurrencyColor(key) {
  return CURRENCY_COLORS[key] || DEFAULT_COLOR;
}

// -- Currency options (for all selects) --
export const CURRENCY_OPTIONS = [
  { value: 'gold', label: 'Gold (g)', name: 'Gold grams' },
  { value: 'egp', label: 'EGP', name: 'Egyptian Pound' },
  { value: 'usd', label: 'USD', name: 'US Dollar' },
  { value: 'eur', label: 'EUR', name: 'Euro' },
  { value: 'gbp', label: 'GBP', name: 'British Pound' },
  { value: 'sar', label: 'SAR', name: 'Saudi Riyal' },
  { value: 'aed', label: 'AED', name: 'UAE Dirham' },
  { value: 'kwd', label: 'KWD', name: 'Kuwaiti Dinar' },
  { value: 'bhd', label: 'BHD', name: 'Bahraini Dinar' },
  { value: 'qar', label: 'QAR', name: 'Qatari Riyal' },
  { value: 'omr', label: 'OMR', name: 'Omani Rial' },
  { value: 'jod', label: 'JOD', name: 'Jordanian Dinar' },
  { value: 'try', label: 'TRY', name: 'Turkish Lira' },
  { value: 'chf', label: 'CHF', name: 'Swiss Franc' },
  { value: 'cad', label: 'CAD', name: 'Canadian Dollar' },
  { value: 'aud', label: 'AUD', name: 'Australian Dollar' },
  { value: 'jpy', label: 'JPY', name: 'Japanese Yen' },
  { value: 'cny', label: 'CNY', name: 'Chinese Yuan' },
  { value: 'inr', label: 'INR', name: 'Indian Rupee' },
];

// -- Expense categories --
export const EXPENSE_CATEGORIES = [
  { value: 'rent', label: 'Rent' },
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'bills', label: 'Bills' },
  { value: 'other', label: 'Other' },
];

// -- Gold karat options --
export const KARAT_OPTIONS = [
  { value: 24, label: '24K' },
  { value: 21, label: '21K' },
  { value: 18, label: '18K' },
];

// -- Zakat --
export const ZAKAT_NISAB_GOLD_GRAMS = 85; // 85g of 24k gold
export const ZAKAT_RATE = 0.025; // 2.5%

// -- Tick interval for "Updated X ago" display (ms) --
export const TIME_AGO_TICK_MS = 60_000;
