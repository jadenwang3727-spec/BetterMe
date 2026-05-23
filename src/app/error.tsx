'use client'

import { useEffect } from 'react'
import { PixelButton } from '@/components/ui/PixelButton'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: 'var(--color-bg-deep)' }}>
      <div className="text-8xl mb-6">💥</div>
      <h1 className="font-['Press_Start_2P'] text-xl text-white mb-3">Critical Error</h1>
      <p className="text-slate-400 mb-2">The dungeon boss knocked out your connection.</p>
      <p className="text-slate-500 text-sm mb-8 font-mono">{error.message}</p>
      <div className="flex gap-3">
        <PixelButton onClick={reset} variant="primary">Try Again</PixelButton>
        <PixelButton onClick={() => (window.location.href = '/')} variant="ghost">Go Home</PixelButton>
      </div>
    </div>
  )
}
