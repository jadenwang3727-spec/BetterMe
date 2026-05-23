import { LevelBadge } from '@/components/ui/LevelBadge'
import { XPBar } from '@/components/ui/XPBar'
import { xpProgressInCurrentLevel } from '@/lib/constants/levels'
import { formatXP } from '@/lib/utils/format'
import { Zap } from 'lucide-react'

interface XPWidgetProps {
  xp: number
  level: number
}

export function XPWidget({ xp, level }: XPWidgetProps) {
  const { current, needed, pct } = xpProgressInCurrentLevel(xp)

  return (
    <div className="pixel-card rounded-lg border border-[var(--color-border)] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-[var(--color-xp)]" />
          <span className="font-semibold text-white text-sm">Experience</span>
        </div>
        <LevelBadge level={level} size="sm" />
      </div>

      <XPBar xp={xp} showNumbers />

      <div className="flex justify-between text-xs text-slate-500">
        <span>Total: <span className="text-[var(--color-xp)] font-bold">{formatXP(xp)} XP</span></span>
        <span>{Math.round(pct)}% to Level {level + 1}</span>
      </div>
    </div>
  )
}
