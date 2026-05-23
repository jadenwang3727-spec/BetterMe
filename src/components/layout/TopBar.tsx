'use client'

import Link from 'next/link'
import { Bell, Volume2, VolumeX, Zap } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useSound } from '@/components/providers/SoundProvider'
import { StreakCounter } from '@/components/ui/StreakCounter'

export function TopBar() {
  const { profile } = useAuth()
  const { soundEnabled, toggleSound } = useSound()

  return (
    <header className="h-14 bg-[var(--color-bg-dark)] border-b border-[var(--color-border)]
      flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Mobile logo */}
      <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
        <Zap size={18} className="text-[var(--color-neon-purple)]" />
        <span className="pixel-font text-xs text-[var(--color-neon-purple)]">HQ</span>
      </Link>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        {profile && (
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <StreakCounter streak={0} size="sm" />
            <div className="flex items-center gap-1 text-[var(--color-xp)]">
              <Zap size={14} />
              <span className="font-bold text-xs">{profile.xp} XP</span>
            </div>
          </div>
        )}

        <button
          onClick={toggleSound}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-[var(--color-bg-hover)] rounded transition-colors"
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        <button className="relative p-1.5 text-slate-400 hover:text-white hover:bg-[var(--color-bg-hover)] rounded transition-colors">
          <Bell size={16} />
        </button>

        {profile && (
          <Link
            href={`/profile/${profile.username}`}
            className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold
              bg-[var(--color-neon-purple)] text-white hover:brightness-110 transition-all"
          >
            {profile.display_name[0]?.toUpperCase()}
          </Link>
        )}
      </div>
    </header>
  )
}
