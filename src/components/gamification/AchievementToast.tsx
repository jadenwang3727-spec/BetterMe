'use client'

import { useEffect, useState } from 'react'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  xpReward: number
}

interface AchievementToastProps {
  achievement: Achievement | null
  onDismiss: () => void
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!achievement) { setVisible(false); return }
    setVisible(true)
    const timer = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300) }, 4000)
    return () => clearTimeout(timer)
  }, [achievement, onDismiss])

  if (!achievement) return null

  return (
    <div
      className={`fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-80 z-[150]
        bg-[var(--color-bg-card)] border border-[var(--color-neon-yellow)]
        rounded-lg p-4 flex items-center gap-3
        transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ boxShadow: '0 0 30px rgba(255,224,0,0.2)' }}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
        style={{ background: 'rgba(255,224,0,0.1)', border: '1px solid rgba(255,224,0,0.3)' }}
      >
        {achievement.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[var(--color-neon-yellow)] text-xs font-semibold uppercase tracking-wider">
          Achievement Unlocked!
        </p>
        <p className="text-white font-bold text-sm truncate">{achievement.name}</p>
        <p className="text-slate-400 text-xs truncate">{achievement.description}</p>
      </div>
      <div className="shrink-0 text-right">
        <span className="text-[var(--color-xp)] text-sm font-bold">+{achievement.xpReward}</span>
        <p className="text-xs text-slate-500">XP</p>
      </div>
    </div>
  )
}
