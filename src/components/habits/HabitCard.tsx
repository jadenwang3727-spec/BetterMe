'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { logHabit, unlogHabit } from '@/lib/habits/actions'
import { useGameState } from '@/components/providers/GameStateProvider'
import { useSound } from '@/components/providers/SoundProvider'
import { ParticleCanvas } from '@/components/gamification/ParticleCanvas'
import { StreakCounter } from '@/components/ui/StreakCounter'
import type { Database } from '@/lib/supabase/types'
import { Check, ChevronRight } from 'lucide-react'
import Link from 'next/link'

type Habit = Database['public']['Tables']['habits']['Row']
type Streak = Database['public']['Tables']['streaks']['Row']

interface HabitCardProps {
  habit: Habit
  streak?: Streak
  isCompletedToday: boolean
}

export function HabitCard({ habit, streak, isCompletedToday }: HabitCardProps) {
  const [completed, setCompleted] = useState(isCompletedToday)
  const [loading, setLoading] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [particleOrigin, setParticleOrigin] = useState({ x: 0, y: 0 })
  const checkRef = useRef<HTMLButtonElement>(null)
  const { addXPGain, setXP, xp } = useGameState()
  const { play } = useSound()

  async function handleToggle() {
    if (loading) return
    setLoading(true)

    if (!completed) {
      // Get button position for particle origin
      const rect = checkRef.current?.getBoundingClientRect()
      const ox = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
      const oy = rect ? rect.top : window.innerHeight / 2

      setCompleted(true)
      setParticleOrigin({ x: ox, y: oy })
      setShowParticles(true)
      play('complete')

      const result = await logHabit(habit.id)
      if (result.error) {
        setCompleted(false)
      } else {
        const earned = result.xpAwarded ?? 0
        addXPGain(earned, ox, oy)
        setXP(xp + earned)
      }
    } else {
      setCompleted(false)
      await unlogHabit(habit.id)
    }
    setLoading(false)
  }

  const currentStreak = streak?.current_streak ?? 0

  return (
    <>
      {showParticles && (
        <ParticleCanvas
          trigger={showParticles}
          originX={particleOrigin.x}
          originY={particleOrigin.y}
          color={habit.color}
          onComplete={() => setShowParticles(false)}
        />
      )}

      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
          'bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-hover)]',
          completed
            ? 'border-[var(--color-border)] opacity-70'
            : 'border-[var(--color-border)] hover:border-[var(--color-border-bright)]',
        )}
      >
        {/* Check button */}
        <button
          ref={checkRef}
          onClick={handleToggle}
          disabled={loading}
          className={cn(
            'w-8 h-8 rounded border-2 flex items-center justify-center transition-all duration-150 shrink-0',
            'pixel-button',
            completed
              ? 'border-[var(--color-neon-green)] bg-[var(--color-neon-green)]'
              : 'border-[var(--color-border-bright)] hover:border-[var(--color-neon-green)]',
          )}
          style={completed ? { boxShadow: `0 0 10px ${habit.color}60` } : {}}
          aria-label={`${completed ? 'Uncheck' : 'Check'} ${habit.name}`}
        >
          {completed && <Check size={14} className="text-black" strokeWidth={3} />}
        </button>

        {/* Icon + Name */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl shrink-0">{habit.icon}</span>
          <div className="min-w-0">
            <p className={cn(
              'font-semibold text-sm truncate',
              completed ? 'line-through text-slate-500' : 'text-white'
            )}>
              {habit.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-xs px-1.5 py-0.5 rounded font-medium capitalize"
                style={{ background: `${habit.color}20`, color: habit.color }}
              >
                {habit.category}
              </span>
              {currentStreak > 0 && <StreakCounter streak={currentStreak} size="sm" />}
            </div>
          </div>
        </div>

        {/* XP reward + link */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-[var(--color-xp)] font-semibold">+{habit.xp_reward} XP</span>
          <Link
            href={`/habits/${habit.id}`}
            className="text-slate-500 hover:text-slate-300 transition-colors"
            onClick={e => e.stopPropagation()}
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </>
  )
}
