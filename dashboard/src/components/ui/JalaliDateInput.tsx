'use client'

import { useMemo } from 'react'
import { toJalaali, toGregorian, jalaaliMonthLength, isValidJalaaliDate } from 'jalaali-js'
import { Dropdown } from '@/components/ui/Dropdown'
import { toPersianDigits } from '@/lib/utils/numbers'

// Persian-calendar date picker — three dropdowns (روز/ماه/سال), since a
// native <input type="date"> only ever renders the Gregorian calendar,
// which clashes with the rest of this RTL/Jalali UI (see ReportsFilter.tsx's
// note on why that input was removed rather than kept half-Persian).
//
// The value on the wire is always Gregorian ISO ("YYYY-MM-DD", what Django's
// DateField expects) — only the picker's own labels are Jalali.

const MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
]

interface JalaliDateInputProps {
  /** Gregorian ISO date ("YYYY-MM-DD") or empty string for no selection. */
  value: string
  onChange: (isoDate: string) => void
  /** Oldest selectable Jalali year — defaults to 100 years back from today. */
  minJalaliYear?: number
  /** Newest selectable Jalali year — defaults to today's Jalali year. */
  maxJalaliYear?: number
}

export function JalaliDateInput({ value, onChange, minJalaliYear, maxJalaliYear }: JalaliDateInputProps) {
  const todayJalali = useMemo(() => toJalaali(new Date()), [])
  const maxYear = maxJalaliYear ?? todayJalali.jy
  const minYear = minJalaliYear ?? maxYear - 100

  const parsed = useMemo(() => {
    if (!value) return null
    const [gy, gm, gd] = value.split('-').map(Number)
    if (!gy || !gm || !gd) return null
    return toJalaali(gy, gm, gd)
  }, [value])

  const years = useMemo(
    () =>
      Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i).map((y) => ({
        value: String(y),
        label: toPersianDigits(String(y)),
      })),
    [minYear, maxYear],
  )
  const months = MONTH_NAMES.map((name, i) => ({ value: String(i + 1), label: name }))
  const dayCount = parsed ? jalaaliMonthLength(parsed.jy, parsed.jm) : 31
  const days = Array.from({ length: dayCount }, (_, i) => i + 1).map((d) => ({
    value: String(d),
    label: toPersianDigits(String(d)),
  }))

  function setPart(part: 'jy' | 'jm' | 'jd', next: number) {
    const jy = part === 'jy' ? next : (parsed?.jy ?? maxYear)
    const jm = part === 'jm' ? next : (parsed?.jm ?? 1)
    const maxDay = jalaaliMonthLength(jy, jm)
    const jd = part === 'jd' ? next : Math.min(parsed?.jd ?? 1, maxDay)
    if (!isValidJalaaliDate(jy, jm, jd)) return
    const { gy, gm, gd } = toGregorian(jy, jm, jd)
    onChange(`${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`)
  }

  return (
    <div className="grid grid-cols-3 gap-2" dir="rtl">
      <Dropdown
        placeholder="روز"
        options={days}
        value={parsed ? String(parsed.jd) : undefined}
        onChange={(v) => setPart('jd', Number(v))}
        fullWidth
      />
      <Dropdown
        placeholder="ماه"
        options={months}
        value={parsed ? String(parsed.jm) : undefined}
        onChange={(v) => setPart('jm', Number(v))}
        fullWidth
      />
      <Dropdown
        placeholder="سال"
        options={years}
        value={parsed ? String(parsed.jy) : undefined}
        onChange={(v) => setPart('jy', Number(v))}
        fullWidth
      />
    </div>
  )
}
