// DESIGN.md §6.3 — Jalali (Shamsi) calendar formatting.
// Uses jalaali-js for Gregorian ↔ Jalali conversion.
// Output always uses Persian digits (per numbers.ts T0.9 decision).
// Never output Gregorian dates to the user.

import { toJalaali } from "jalaali-js";
import { toPersianDigits } from "./numbers";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// Full date: e.g. new Date("2025-06-26") → "۱۴۰۴/۰۴/۰۵"
export function formatJalali(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const { jy, jm, jd } = toJalaali(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()
  );
  return toPersianDigits(`${jy}/${pad(jm)}/${pad(jd)}`);
}

// Month only: e.g. "۱۴۰۴/۰۴"
export function formatJalaliMonth(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const { jy, jm } = toJalaali(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()
  );
  return toPersianDigits(`${jy}/${pad(jm)}`);
}

// Year only: e.g. "۱۴۰۴"
export function formatJalaliYear(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const { jy } = toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return toPersianDigits(String(jy));
}

// Relative: "امروز", "دیروز", or formatted date
export function formatJalaliRelative(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "امروز";
  if (diffDays === 1) return "دیروز";
  return formatJalali(d);
}
