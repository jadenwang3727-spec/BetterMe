'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { useAuth } from '@/components/providers/AuthProvider'
import { LevelBadge } from '@/components/ui/LevelBadge'
import { XPBar } from '@/components/ui/XPBar'
import {
  LayoutDashboard, Flame, Map, Users, BarChart2,
  User, Settings, LogOut, Zap
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/habits',    icon: Flame,           label: 'Habits' },
  { href: '/map',       icon: Map,             label: 'World Map' },
  { href: '/parties',   icon: Users,           label: 'Parties' },
  { href: '/analytics', icon: BarChart2,       label: 'Analytics' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-[var(--color-bg-dark)] border-r border-[var(--color-border)] fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-5 border-b border-[var(--color-border)]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Zap size={20} className="text-[var(--color-neon-purple)]" />
          <span
            className="pixel-font text-sm text-[var(--color-neon-purple)]"
            style={{ textShadow: '0 0 10px var(--color-neon-purple)' }}
          >
            HabitQuest
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-[var(--color-neon-purple)]/15 text-[var(--color-neon-purple)] border-l-2 border-[var(--color-neon-purple)]'
                  : 'text-slate-400 hover:text-white hover:bg-[var(--color-bg-hover)]'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Profile section */}
      {profile && (
        <div className="p-4 border-t border-[var(--color-border)] space-y-3">
          <XPBar xp={profile.xp} compact showNumbers />

          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded shrink-0 flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--color-neon-purple)', color: 'white' }}
            >
              {profile.display_name[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{profile.display_name}</p>
              <LevelBadge level={profile.level} size="sm" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href={`/profile/${profile.username}`}
              className="flex-1 flex items-center gap-2 px-2 py-1.5 text-slate-400 hover:text-white
                hover:bg-[var(--color-bg-hover)] rounded text-xs transition-colors"
            >
              <User size={14} />
              Profile
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-2 py-1.5 text-slate-400 hover:text-white
                hover:bg-[var(--color-bg-hover)] rounded text-xs transition-colors"
            >
              <Settings size={14} />
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-2 py-1.5 text-slate-400 hover:text-red-400
                hover:bg-[var(--color-bg-hover)] rounded text-xs transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
