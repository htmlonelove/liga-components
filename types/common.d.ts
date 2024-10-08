import type { FocusLock } from '../src/scripts/utils/focus-lock'
export type FocusLockType = ReturnType<typeof FocusLock>

declare global {
  export interface Window {
    initAccordions: () => void
    initTabs: () => void
    reInitTabs: () => void
    initCustomSelect: () => void
  }
}
