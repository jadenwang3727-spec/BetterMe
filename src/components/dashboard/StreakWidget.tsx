import { StreakCounter } from '@/components/ui/StreakCounter'
import { Flame } from 'lucide-react'
import type { Database } from '@/lib/supabase/types'

type Streak = Database['public']['Tables']['streaks']['Row']
type Habit = Database['public']['Tables']['habits']['Row']

interface StreakWidgetProps {
  habits: Habit[]
  streaks: Streak[]
}

export function StreakWidget({ habits, streaks }: StreakWidgetProps) {
  const streakMap = new Map(streaks.map(s => [s.habit_id, s]))
  const topStreaks = habits
    .map(h => ({ habit: h, streak: streakMap.get(h.id)?.current_streak ?? 0 }))
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 4)

  const bestStreak = Math.max(0, ...streaks.map(s => s.current_streak))
  const longestEver = Math.max(0, ...streaks.map(s => s.longest_streak))

  return (
    <div className="pixel-card rounded-lg border border-[var(--color-border)] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Flame size={16} className="text-[var(--color-streak)]" />
        <span className="font-semibold text-white text-sm">Streaks</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--color-bg-hover)] rounded p-2 text-center">
          <StreakCounter streak={bestStreak} size="lg" className="justify-center" />
          <p className="text-slate-500 text-xs mt-1">Best active</p>
        </div>
        <div className="bg-[var(--color-bg-hover)] rounded p-2 text-center">
          <span className="text-[var(--color-neon-yellow)] font-bold text-xl">
            {longestEver}
          </span>
          <p className="text-slate-500 text-xs mt-1">Longest ever</p>
        </div>
      </div>

      {topStreaks.length > 0 && (
        <div className="space-y-2">
          {topStreaks.map(({ habit, streak }) => (
            <div key={habit.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span>{habit.icon}</span>
                <span className="text-slate-300 truncate">{habit.name}</span>
              </div>
              <StreakCounter streak={streak} size="sm" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
