import { QuestCard } from '@/components/gamification/QuestCard'
import { ScrollText } from 'lucide-react'

const MOCK_QUESTS = [
  { id: 'daily_complete_3', name: 'Triple Threat', description: 'Complete 3 habits today', icon: '📜', xpReward: 75, progress: 0, target: 3, completed: false, type: 'daily' as const },
  { id: 'daily_mood_log', name: 'Check In', description: 'Log your mood on a habit', icon: '😊', xpReward: 50, progress: 0, target: 1, completed: false, type: 'daily' as const },
]

export function DailyQuestWidget() {
  return (
    <div className="pixel-card rounded-lg border border-[var(--color-border)] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScrollText size={16} className="text-[var(--color-neon-blue)]" />
          <span className="font-semibold text-white text-sm">Daily Quests</span>
        </div>
        <span className="text-xs text-slate-500">Resets midnight UTC</span>
      </div>
      <div className="space-y-2">
        {MOCK_QUESTS.map(q => (
          <QuestCard key={q.id} quest={q} />
        ))}
      </div>
    </div>
  )
}
