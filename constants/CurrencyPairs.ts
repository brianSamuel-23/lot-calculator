export interface CurrencyPair {
  symbol: string;        // e.g. "EUR/USD"
  base: string;
  quote: string;
  pipSize: number;       // 0.0001 or 0.01 for JPY pairs
  pipValuePerLot: number; // USD pip value per standard lot (approx)
  category: 'Major' | 'Minor' | 'Exotic';
}

export const CURRENCY_PAIRS: CurrencyPair[] = [
  // Majors
  { symbol: 'EUR/USD', base: 'EUR', quote: 'USD', pipSize: 0.0001, pipValuePerLot: 10.00, category: 'Major' },
  { symbol: 'GBP/USD', base: 'GBP', quote: 'USD', pipSize: 0.0001, pipValuePerLot: 10.00, category: 'Major' },
  { symbol: 'AUD/USD', base: 'AUD', quote: 'USD', pipSize: 0.0001, pipValuePerLot: 10.00, category: 'Major' },
  { symbol: 'NZD/USD', base: 'NZD', quote: 'USD', pipSize: 0.0001, pipValuePerLot: 10.00, category: 'Major' },
  { symbol: 'USD/JPY', base: 'USD', quote: 'JPY', pipSize: 0.01,   pipValuePerLot: 6.85,  category: 'Major' },
  { symbol: 'USD/CAD', base: 'USD', quote: 'CAD', pipSize: 0.0001, pipValuePerLot: 7.52,  category: 'Major' },
  { symbol: 'USD/CHF', base: 'USD', quote: 'CHF', pipSize: 0.0001, pipValuePerLot: 10.50, category: 'Major' },
  // Minors (Crosses)
  { symbol: 'EUR/GBP', base: 'EUR', quote: 'GBP', pipSize: 0.0001, pipValuePerLot: 12.80, category: 'Minor' },
  { symbol: 'EUR/JPY', base: 'EUR', quote: 'JPY', pipSize: 0.01,   pipValuePerLot: 6.85,  category: 'Minor' },
  { symbol: 'EUR/CAD', base: 'EUR', quote: 'CAD', pipSize: 0.0001, pipValuePerLot: 7.52,  category: 'Minor' },
  { symbol: 'EUR/AUD', base: 'EUR', quote: 'AUD', pipSize: 0.0001, pipValuePerLot: 6.55,  category: 'Minor' },
  { symbol: 'EUR/CHF', base: 'EUR', quote: 'CHF', pipSize: 0.0001, pipValuePerLot: 10.50, category: 'Minor' },
  { symbol: 'GBP/JPY', base: 'GBP', quote: 'JPY', pipSize: 0.01,   pipValuePerLot: 6.85,  category: 'Minor' },
  { symbol: 'GBP/CAD', base: 'GBP', quote: 'CAD', pipSize: 0.0001, pipValuePerLot: 7.52,  category: 'Minor' },
  { symbol: 'GBP/AUD', base: 'GBP', quote: 'AUD', pipSize: 0.0001, pipValuePerLot: 6.55,  category: 'Minor' },
  { symbol: 'GBP/CHF', base: 'GBP', quote: 'CHF', pipSize: 0.0001, pipValuePerLot: 10.50, category: 'Minor' },
  { symbol: 'AUD/JPY', base: 'AUD', quote: 'JPY', pipSize: 0.01,   pipValuePerLot: 6.85,  category: 'Minor' },
  { symbol: 'AUD/CAD', base: 'AUD', quote: 'CAD', pipSize: 0.0001, pipValuePerLot: 7.52,  category: 'Minor' },
  { symbol: 'AUD/NZD', base: 'AUD', quote: 'NZD', pipSize: 0.0001, pipValuePerLot: 6.05,  category: 'Minor' },
  { symbol: 'NZD/JPY', base: 'NZD', quote: 'JPY', pipSize: 0.01,   pipValuePerLot: 6.85,  category: 'Minor' },
  { symbol: 'CAD/JPY', base: 'CAD', quote: 'JPY', pipSize: 0.01,   pipValuePerLot: 6.85,  category: 'Minor' },
  { symbol: 'CHF/JPY', base: 'CHF', quote: 'JPY', pipSize: 0.01,   pipValuePerLot: 6.85,  category: 'Minor' },
  // Exotics
  { symbol: 'USD/SGD', base: 'USD', quote: 'SGD', pipSize: 0.0001, pipValuePerLot: 7.35,  category: 'Exotic' },
  { symbol: 'USD/MXN', base: 'USD', quote: 'MXN', pipSize: 0.0001, pipValuePerLot: 0.55,  category: 'Exotic' },
  { symbol: 'USD/ZAR', base: 'USD', quote: 'ZAR', pipSize: 0.0001, pipValuePerLot: 0.53,  category: 'Exotic' },
  { symbol: 'USD/THB', base: 'USD', quote: 'THB', pipSize: 0.01,   pipValuePerLot: 0.29,  category: 'Exotic' },
  { symbol: 'XAU/USD', base: 'XAU', quote: 'USD', pipSize: 0.01,   pipValuePerLot: 10.00, category: 'Exotic' },
  { symbol: 'XAG/USD', base: 'XAG', quote: 'USD', pipSize: 0.001,  pipValuePerLot: 50.00, category: 'Exotic' },
];

export const LOT_SIZES = [
  { label: 'Standard (1.0)', value: 1.0, units: 100_000 },
  { label: 'Mini (0.1)',     value: 0.1, units: 10_000  },
  { label: 'Micro (0.01)',   value: 0.01, units: 1_000  },
  { label: 'Nano (0.001)',   value: 0.001, units: 100   },
];

export const DEFAULT_PAIR = CURRENCY_PAIRS[0]; // EUR/USD
