'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { levelFromXP, xpProgressInCurrentLevel } from '@/lib/constants/levels'

interface XPGain {
  id: string
  amount: number
  x: number
  y: number
}

interface GameStateContextValue {
  xp: number
  level: number
  xpProgress: { current: number; needed: number; pct: number }
  xpGains: XPGain[]
  setXP: (xp: number) => void
  addXPGain: (amount: number, x?: number, y?: number) => void
  removeXPGain: (id: string) => void
  showLevelUp: boolean
  triggerLevelUp: (newLevel: number) => void
  clearLevelUp: () => void
  newLevel: number
}

const GameStateContext = createContext<GameStateContextValue>({
  xp: 0,
  level: 1,
  xpProgress: { current: 0, needed: 400, pct: 0 },
  xpGains: [],
  setXP: () => {},
  addXPGain: () => {},
  removeXPGain: () => {},
  showLevelUp: false,
  triggerLevelUp: () => {},
  clearLevelUp: () => {},
  newLevel: 1,
})

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXPRaw] = useState(0)
  const [xpGains, setXPGains] = useState<XPGain[]>([])
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [newLevel, setNewLevel] = useState(1)

  const level = levelFromXP(xp)
  const { current, needed, pct } = xpProgressInCurrentLevel(xp)

  const setXP = useCallback((newXP: number) => {
    const oldLevel = levelFromXP(xp)
    const nextLevel = levelFromXP(newXP)
    setXPRaw(newXP)
    if (nextLevel > oldLevel) {
      setNewLevel(nextLevel)
      setShowLevelUp(true)
    }
  }, [xp])

  const addXPGain = useCallback((amount: number, x = 50, y = 50) => {
    const id = Math.random().toString(36).slice(2)
    setXPGains(prev => [...prev, { id, amount, x, y }])
  }, [])

  const removeXPGain = useCallback((id: string) => {
    setXPGains(prev => prev.filter(g => g.id !== id))
  }, [])

  const triggerLevelUp = useCallback((lvl: number) => {
    setNewLevel(lvl)
    setShowLevelUp(true)
  }, [])

  const clearLevelUp = useCallback(() => {
    setShowLevelUp(false)
  }, [])

  return (
    <GameStateContext.Provider value={{
      xp, level, xpProgress: { current, needed, pct },
      xpGains, setXP, addXPGain, removeXPGain,
      showLevelUp, triggerLevelUp, clearLevelUp, newLevel,
    }}>
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameState() {
  return useContext(GameStateContext)
}
