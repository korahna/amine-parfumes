'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  theme: 'dark' | 'light'
  toggle: () => void
  setTheme: (t: 'dark' | 'light') => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggle: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', next)
        }
      },
      setTheme: (t) => {
        set({ theme: t })
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', t)
        }
      },
    }),
    {
      name: 'amine-theme',
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', state.theme)
        }
      },
    }
  )
)
