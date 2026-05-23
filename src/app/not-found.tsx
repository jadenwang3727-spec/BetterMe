import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '404 — Page Not Found' }

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: 'var(--color-bg-deep)' }}>
      <div className="text-8xl mb-6 animate-pixel-bounce">🗺️</div>
      <h1 className="font-['Press_Start_2P'] text-2xl sm:text-3xl text-white mb-4"
        style={{ textShadow: '0 0 20px rgba(191,95,255,0.5)' }}>
        404
      </h1>
      <p className="text-slate-400 text-lg mb-2">This area is still uncharted territory.</p>
      <p className="text-slate-500 text-sm mb-8">The biome you&apos;re looking for doesn&apos;t exist — yet.</p>
      <Link
        href="/"
        className="pixel-button inline-flex items-center gap-2 px-6 py-3 rounded text-white font-semibold text-sm"
        style={{
          background: 'var(--color-neon-purple)',
          boxShadow: '0 6px 0 0 #7b2fbe',
        }}
      >
        ← Return to Base Camp
      </Link>
    </div>
  )
}
