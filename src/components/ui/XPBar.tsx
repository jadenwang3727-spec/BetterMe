'use client'

import { cn } from '@/lib/utils/cn'
import { xpProgressInCurrentLevel } from '@/lib/constants/levels'
import { formatXP } from '@/lib/utils/format'

interface XPBarProps {
  xp: number
  className?: string
  showNumbers?: boolean
  compact?: boolean
}

export function XPBar({ xp, className, showNumbers = false, compact = false }: XPBarProps) {
  const { current, needed, pct, level } = xpProgressInCurrentLevel(xp)

  return (
    <div className={cn('w-full', className)}>
      {showNumbers && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[var(--color-xp)] font-semibold">
            Lv.{level}
          </span>
          <span className="text-xs text-slate-400">
            {formatXP(current)} / {formatXP(needed)} XP
          </span>
        </div>
      )}
      <div
        className={cn(
          'xp-bar-track rounded-full overflow-hidden',
          compact ? 'h-2' : 'h-3'
        )}
      >
        <div
          className="xp-bar-fill h-full rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
