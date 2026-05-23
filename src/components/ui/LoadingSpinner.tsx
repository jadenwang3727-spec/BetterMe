import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div
        className={cn(
          'border-2 border-[var(--color-border)] border-t-[var(--color-neon-purple)] rounded-full',
          'animate-spin-pixel',
          sizes[size]
        )}
      />
      {label && <span className="text-slate-400 text-sm animate-blink">{label}</span>}
    </div>
  )
}

export function PixelLoadingScreen({ message }: { message?: string }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-deep)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="pixel-font text-[var(--color-neon-purple)] text-sm"
          style={{ textShadow: '0 0 20px var(--color-neon-purple)' }}>
          HabitQuest
        </div>
        <LoadingSpinner size="lg" />
        <p className="text-slate-500 text-sm">{message ?? 'Loading...'}</p>
      </div>
    </div>
  )
}
