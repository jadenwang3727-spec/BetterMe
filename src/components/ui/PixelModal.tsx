'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import { X } from 'lucide-react'

interface PixelModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function PixelModal({ isOpen, onClose, title, children, className, size = 'md' }: PixelModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'relative w-full pixel-card rounded-lg border border-[var(--color-border-bright)]',
          'shadow-2xl shadow-black/50',
          sizeStyles[size],
          className
        )}
        style={{
          animation: 'level-up-burst 0.2s ease-out',
          boxShadow: '0 0 40px rgba(191,95,255,0.15)',
        }}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
            <h2 className="font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white hover:bg-[var(--color-bg-hover)] rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
