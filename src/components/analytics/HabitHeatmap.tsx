'use client'

import { format, eachDayOfInterval, subDays } from 'date-fns'
import { cn } from '@/lib/utils/cn'

function getIntensity(value: number): string {
  if (value === 0) return 'bg-[var(--color-bg-hover)]'
  if (value === 1) return 'bg-[var(--color-neon-purple)]/30'
  if (value === 2) return 'bg-[var(--color-neon-purple)]/55'
  if (value === 3) return 'bg-[var(--color-neon-purple)]/80'
  return 'bg-[var(--color-neon-purple)]'
}

// Generate mock 90-day data
function generateMockData() {
  const days = eachDayOfInterval({ start: subDays(new Date(), 89), end: new Date() })
  return days.map(day => ({
    date: format(day, 'yyyy-MM-dd'),
    count: Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0,
  }))
}

export function HabitHeatmap() {
  const data = generateMockData()
  const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  // Group into weeks of 7
  const weeks: typeof data[] = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  return (
    <div className="pixel-card rounded-lg border border-[var(--color-border)] p-4">
      <h3 className="font-semibold text-white mb-4">90-Day Habit Heatmap</h3>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {DAYS.map((d, i) => (
            <div key={i} className="w-3 h-3 text-[9px] text-slate-600 flex items-center justify-center">
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-1 flex-1 overflow-x-auto">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1 shrink-0">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={cn('w-3 h-3 rounded-sm transition-colors', getIntensity(day.count))}
                  title={`${day.date}: ${day.count} habits`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-xs text-slate-500">Less</span>
        {[0,1,2,3,4].map(i => (
          <div key={i} className={cn('w-3 h-3 rounded-sm', getIntensity(i))} />
        ))}
        <span className="text-xs text-slate-500">More</span>
      </div>
    </div>
  )
}
