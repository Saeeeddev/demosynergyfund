import { DEMO_STORAGE_KEY } from './config'
import { initialDemoState, type DemoState } from './fixtures'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

let memoryState = clone(initialDemoState)

export function loadDemoState(): DemoState {
  if (typeof window === 'undefined') return clone(memoryState)

  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY)
    if (!raw) {
      saveDemoState(initialDemoState)
      return clone(initialDemoState)
    }
    const parsed = JSON.parse(raw) as Partial<DemoState>
    if (parsed.version !== 1 || !Array.isArray(parsed.projects) || !parsed.user) {
      throw new Error('Unsupported demo state')
    }
    return parsed as DemoState
  } catch {
    // Storage can be unavailable or contain stale/corrupt data. A demo must
    // recover on its own instead of leaving the dashboard blank.
    saveDemoState(initialDemoState)
    return clone(initialDemoState)
  }
}

export function saveDemoState(state: DemoState): void {
  memoryState = clone(state)
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private browsing/storage quotas should not break the current session.
  }
}

export function updateDemoState(mutator: (state: DemoState) => void): DemoState {
  const state = loadDemoState()
  mutator(state)
  saveDemoState(state)
  return clone(state)
}

export function resetDemoState(): void {
  saveDemoState(initialDemoState)
}
