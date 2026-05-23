import { cn } from '@/lib/utils/cn'

interface Quest {
  id: string
  name: string
  description: string
  icon: string
  xpReward: number
  progress: number
  target: number
  completed: boolean
  type: 'daily' | 'weekly'
}

interface QuestCardProps {
  quest: Quest
  className?: string
}

export function QuestCard({ quest, className }: QuestCardProps) {
  const pct = Math.min(100, (quest.progress / quest.target) * 100)

  return (
    <div
      className={cn(
        'p-3 rounded-lg border transition-all duration-200',
        'bg-[var(--color-bg-card)]',
        quest.completed
          ? 'border-[var(--color-neon-green)]/40 opacity-70'
          : 'border-[var(--color-border)] hover:border-[var(--color-border-bright)]',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
          style={{
            background: quest.completed ? 'rgba(57,255,20,0.1)' : 'rgba(191,95,255,0.1)',
            border: `1px solid ${quest.completed ? 'rgba(57,255,20,0.3)' : 'rgba(191,95,255,0.3)'}`,
          }}
        >
          {quest.completed ? '✅' : quest.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={cn('font-semibold text-sm', quest.completed ? 'text-slate-400 line-through' : 'text-white')}>
              {quest.name}
            </p>
            <span className="text-[var(--color-xp)] text-xs font-bold shrink-0">+{quest.xpReward} XP</span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">{quest.description}</p>

          {quest.target > 1 && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>{quest.progress}/{quest.target}</span>
                <span>{Math.round(pct)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--color-bg-hover)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: quest.completed ? 'var(--color-neon-green)' : 'var(--color-neon-purple)',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
