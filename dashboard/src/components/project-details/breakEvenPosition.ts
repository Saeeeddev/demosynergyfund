/** Actual year where the line between yearly returns meets the principal. */
export function breakEvenPosition(
  returns: { year: number; cumulativeReturn: number }[],
  investedAmount: number,
): number | null {
  if (investedAmount <= 0) return null

  const index = returns.findIndex(({ cumulativeReturn }) => cumulativeReturn >= investedAmount)
  if (index < 0) return null
  if (index === 0) return returns[0].year

  const previous = returns[index - 1]
  const current = returns[index]
  const fraction = (investedAmount - previous.cumulativeReturn) /
    (current.cumulativeReturn - previous.cumulativeReturn)
  return previous.year + fraction * (current.year - previous.year)
}
