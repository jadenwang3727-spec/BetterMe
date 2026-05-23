import { cn } from '@/lib/utils/cn'
import type { ButtonHTMLAttributes } from 'react'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const VARIANT_STYLES = {
  primary:   'bg-[var(--color-neon-purple)] text-white hover:brightness-110',
  secondary: 'bg-[var(--color-bg-hover)] text-slate-200 border border-[var(--color-border-bright)] hover:border-[var(--color-neon-purple)]',
  danger:    'bg-red-700 text-white hover:bg-red-600',
  ghost:     'bg-transparent text-slate-300 hover:text-white hover:bg-[var(--color-bg-hover)]',
  success:   'bg-[var(--color-neon-green)] text-black hover:brightness-110',
}

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function PixelButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}: PixelButtonProps) {
  return (
    <button
      className={cn(
        'pixel-button font-semibold rounded transition-all duration-100',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-neon-purple)]',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
