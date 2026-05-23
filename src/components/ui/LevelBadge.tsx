import { cn } from '@/lib/utils/cn'
import { getLevelTitle } from '@/lib/constants/levels'

interface LevelBadgeProps {
  level: number
  className?: string
  showTitle?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function LevelBadge({ level, className, showTitle = false, size = 'md' }: LevelBadgeProps) {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  const glowColor = level >= 50 ? '#FFD700' : level >= 25 ? '#9C27B0' : level >= 10 ? '#2196F3' : '#4CAF50'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'font-bold rounded border inline-flex items-center justify-center',
          'pixel-font',
          sizeStyles[size]
        )}
        style={{
          color: glowColor,
          borderColor: glowColor,
          background: `${glowColor}15`,
          boxShadow: `0 0 8px ${glowColor}40`,
          textShadow: `0 0 8px ${glowColor}`,
        }}
      >
        Lv.{level}
      </span>
      {showTitle && (
        <span className="text-slate-400 text-sm">{getLevelTitle(level)}</span>
      )}
    </div>
  )
}
