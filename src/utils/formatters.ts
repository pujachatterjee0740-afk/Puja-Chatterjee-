import { Currency, Language } from '../types';

export const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number; prefix: boolean }> = {
  BDT: { symbol: '৳', rate: 1, prefix: true },
  INR: { symbol: '₹', rate: 0.72, prefix: true },
  USD: { symbol: '$', rate: 0.0085, prefix: true },
};

// Convert English numbers to Bengali numerals
export function toBanglaNumber(num: number | string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit, 10)]);
}

// Format price with currency symbol and locale digits
export function formatPrice(amount: number, currency: Currency = 'BDT', lang: Language = 'bn'): string {
  const info = CURRENCY_RATES[currency] || CURRENCY_RATES.BDT;
  const converted = Math.round(amount * info.rate);
  const formattedNum = converted.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US');
  
  if (lang === 'bn' && currency === 'BDT') {
    return `${info.symbol}${toBanglaNumber(converted.toLocaleString('en-US'))}`;
  }
  
  return `${info.symbol}${formattedNum}`;
}
