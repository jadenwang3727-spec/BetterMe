import { cn } from '@/lib/utils/cn'

interface PixelCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: 'purple' | 'blue' | 'green' | 'none'
  onClick?: () => void
}

const GLOW_STYLES = {
  none:   '',
  purple: 'hover:shadow-[0_0_20px_rgba(191,95,255,0.2)]',
  blue:   'hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]',
  green:  'hover:shadow-[0_0_20px_rgba(57,255,20,0.2)]',
}

export function PixelCard({ children, className, hover = false, glow = 'none', onClick }: PixelCardProps) {
  return (
    <div
      className={cn(
        'pixel-card rounded-lg border border-[var(--color-border)] transition-all duration-200',
        hover && 'cursor-pointer hover:border-[var(--color-border-bright)] hover:-translate-y-0.5',
        GLOW_STYLES[glow],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
