import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Wraps a value in bidi isolates so LTR numerals sit correctly inside RTL text. */
export function bidiIsolate(value: string): string {
  return `⁦${value}⁩`;
}

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function formatNumber(value: number, fractionDigits = 0): string {
  return toPersianDigits(
    value.toLocaleString('en-US', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }),
  );
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${formatNumber(value, fractionDigits)}٪`;
}

/** Formats a Toman amount with thousands separators + unit. */
export function formatToman(value: number): string {
  return `${formatNumber(value)} تومان`;
}

/** Compact Toman for large project totals (میلیارد / میلیون). */
export function formatTomanCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `${formatNumber(value / 1_000_000_000, 1)} میلیارد تومان`;
  }
  if (value >= 1_000_000) {
    return `${formatNumber(value / 1_000_000, 1)} میلیون تومان`;
  }
  return formatToman(value);
}
