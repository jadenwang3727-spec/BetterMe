'use client'

import { useEffect } from 'react'
import { useGameState } from '@/components/providers/GameStateProvider'

export function XPFloatingText() {
  const { xpGains, removeXPGain } = useGameState()

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {xpGains.map(gain => (
        <FloatingXP
          key={gain.id}
          id={gain.id}
          amount={gain.amount}
          x={gain.x}
          y={gain.y}
          onComplete={removeXPGain}
        />
      ))}
    </div>
  )
}

function FloatingXP({
  id, amount, x, y, onComplete,
}: { id: string; amount: number; x: number; y: number; onComplete: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(id), 1500)
    return () => clearTimeout(timer)
  }, [id, onComplete])

  return (
    <div
      className="absolute text-[var(--color-xp)] font-bold text-sm pointer-events-none select-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        animation: 'xp-float-up 1.5s ease-out forwards',
        textShadow: '0 0 10px var(--color-xp)',
        fontFamily: 'var(--font-pixel)',
        fontSize: '11px',
        transform: 'translateX(-50%)',
      }}
    >
      +{amount} XP
    </div>
  )
}
