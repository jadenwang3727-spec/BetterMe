'use client'

import { useEffect } from 'react'
import { getLevelTitle } from '@/lib/constants/levels'
import { useGameState } from '@/components/providers/GameStateProvider'
import { useSound } from '@/components/providers/SoundProvider'
import { PixelButton } from '@/components/ui/PixelButton'

export function LevelUpModal() {
  const { showLevelUp, newLevel, clearLevelUp } = useGameState()
  const { play } = useSound()

  useEffect(() => {
    if (showLevelUp) play('levelup')
  }, [showLevelUp, play])

  if (!showLevelUp) return null

  const title = getLevelTitle(newLevel)

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Stars burst */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-twinkle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${0.8 + Math.random() * 0.6}s`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      <div
        className="relative z-10 text-center max-w-sm w-full px-8 py-10 rounded-lg
          bg-[var(--color-bg-card)] border-2 border-[var(--color-neon-yellow)]"
        style={{
          boxShadow: '0 0 60px rgba(255,224,0,0.3), inset 0 0 30px rgba(255,224,0,0.05)',
          animation: 'level-up-burst 0.4s ease-out',
        }}
      >
        <div
          className="pixel-font text-xs text-[var(--color-xp)] uppercase tracking-widest mb-4"
          style={{ textShadow: '0 0 10px var(--color-xp)' }}
        >
          ⚡ Level Up! ⚡
        </div>

        <div
          className="pixel-font text-5xl text-[var(--color-neon-yellow)] mb-2"
          style={{ textShadow: '0 0 30px var(--color-neon-yellow)' }}
        >
          {newLevel}
        </div>

        <p className="text-white text-xl font-bold mb-1">{title}</p>
        <p className="text-slate-400 text-sm mb-8">You&apos;ve reached Level {newLevel}!</p>

        <PixelButton onClick={clearLevelUp} fullWidth>
          Keep Going! 💪
        </PixelButton>
      </div>
    </div>
  )
}
