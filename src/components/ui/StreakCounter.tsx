import { cn } from '@/lib/utils/cn'

interface StreakCounterProps {
  streak: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

export function StreakCounter({ streak, className, size = 'md', animate = false }: StreakCounterProps) {
  const sizeStyles = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-1.5',
    lg: 'text-xl gap-2',
  }

  if (streak === 0) {
    return (
      <span className={cn('flex items-center text-slate-500', sizeStyles[size], className)}>
        <span className="opacity-40">🔥</span>
        <span className="font-bold">0</span>
      </span>
    )
  }

  return (
    <span
      className={cn(
        'streak-flame flex items-center font-bold',
        sizeStyles[size],
        animate && streak >= 7 && 'animate-streak-pulse',
        className
      )}
    >
      <span className={cn(
        streak >= 30 ? 'animate-torch' : streak >= 7 ? '' : ''
      )}>
        🔥
      </span>
      <span>{streak}</span>
      {streak >= 100 && <span className="text-[var(--color-neon-yellow)] ml-0.5 text-xs">🔥</span>}
    </span>
  )
}
