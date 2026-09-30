import assert from 'node:assert/strict'
import test from 'node:test'
import { breakEvenPosition } from './breakEvenPosition.ts'

test('marker crosses the return line at the investment line', () => {
  const returns = [10, 20, 30, 40, 50].map((cumulativeReturn, index) => ({ year: index + 1, cumulativeReturn }))
  const position = breakEvenPosition(returns, 35)
  assert.equal(position, 3.5)
  assert.equal(returns[2].cumulativeReturn + (returns[3].cumulativeReturn - returns[2].cumulativeReturn) * (position - returns[2].year), 35)
})

test('marker handles exact crossing and no crossing', () => {
  const returns = [10, 20, 30].map((cumulativeReturn, index) => ({ year: index + 1, cumulativeReturn }))
  assert.equal(breakEvenPosition(returns, 20), 2)
  assert.equal(breakEvenPosition(returns, 40), null)
})

test('marker uses years rather than array indices', () => {
  assert.equal(breakEvenPosition([{ year: 1, cumulativeReturn: 10 }, { year: 3, cumulativeReturn: 30 }], 20), 2)
})
