'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { LayoutDashboard, Flame, Map, Users, BarChart2 } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/habits',    icon: Flame,           label: 'Habits' },
  { href: '/map',       icon: Map,             label: 'Map' },
  { href: '/parties',   icon: Users,           label: 'Party' },
  { href: '/analytics', icon: BarChart2,       label: 'Stats' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-bg-dark)]
      border-t border-[var(--color-border)] safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded transition-colors min-w-[44px] min-h-[44px] justify-center',
                active
                  ? 'text-[var(--color-neon-purple)]'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
