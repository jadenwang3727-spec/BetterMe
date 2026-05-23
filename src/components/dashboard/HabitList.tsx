'use client'

import { useState } from 'react'
import { HabitCard } from '@/components/habits/HabitCard'
import { HabitForm } from '@/components/habits/HabitForm'
import { PixelButton } from '@/components/ui/PixelButton'
import { Plus, CheckCircle } from 'lucide-react'
import type { Database } from '@/lib/supabase/types'
import { useRouter } from 'next/navigation'

type Habit = Database['public']['Tables']['habits']['Row']
type Streak = Database['public']['Tables']['streaks']['Row']
type HabitLog = Database['public']['Tables']['habit_logs']['Row']

interface HabitListProps {
  habits: Habit[]
  streaks: Streak[]
  todaysLogs: HabitLog[]
}

export function HabitList({ habits, streaks, todaysLogs }: HabitListProps) {
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  const completedCount = todaysLogs.filter(l => l.completed).length
  const totalCount = habits.length

  const streakMap = new Map(streaks.map(s => [s.habit_id, s]))
  const completedSet = new Set(todaysLogs.filter(l => l.completed).map(l => l.habit_id))

  const pending = habits.filter(h => !completedSet.has(h.id))
  const completed = habits.filter(h => completedSet.has(h.id))

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-4xl">🌱</div>
        <p className="text-slate-400">Your habit garden is empty.</p>
        <p className="text-slate-500 text-sm">Plant your first habit to begin your journey.</p>
        <PixelButton onClick={() => setShowForm(true)}>
          <Plus size={16} className="mr-2" />
          Create First Habit
        </PixelButton>
        <HabitForm isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={() => router.refresh()} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-[var(--color-neon-green)]" />
          <span className="text-sm text-slate-300">
            <span className="font-bold text-white">{completedCount}</span>
            <span className="text-slate-500">/{totalCount}</span>
            <span className="ml-1">completed today</span>
          </span>
        </div>
        <PixelButton size="sm" onClick={() => setShowForm(true)}>
          <Plus size={14} className="mr-1" />
          New
        </PixelButton>
      </div>

      {/* Pending habits */}
      {pending.length > 0 && (
        <div className="space-y-2">
          {pending.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              streak={streakMap.get(habit.id)}
              isCompletedToday={false}
            />
          ))}
        </div>
      )}

      {/* Completed habits */}
      {completed.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Done ✓</p>
          {completed.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              streak={streakMap.get(habit.id)}
              isCompletedToday={true}
            />
          ))}
        </div>
      )}

      {completedCount === totalCount && totalCount > 0 && (
        <div className="text-center py-4">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-[var(--color-neon-green)] font-bold">Perfect Day!</p>
          <p className="text-slate-400 text-sm">All habits completed. You&apos;re unstoppable.</p>
        </div>
      )}

      <HabitForm isOpen={showForm} onClose={() => setShowForm(false)} onSuccess={() => router.refresh()} />
    </div>
  )
}
