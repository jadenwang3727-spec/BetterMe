import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { requireAuth } from '@/lib/auth/actions'
import { AppShell } from '@/components/layout/AppShell'
import { ConsistencyChart } from '@/components/analytics/ConsistencyChart'
import { HabitHeatmap } from '@/components/analytics/HabitHeatmap'
import { CategoryBreakdown } from '@/components/analytics/CategoryBreakdown'
import { createClient } from '@/lib/supabase/server'
import { BarChart2 } from 'lucide-react'

export const metadata: Metadata = { title: 'Analytics' }

export default async function AnalyticsPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: profileData } = await supabase
    .from('profiles')
    .select('xp, level, total_habits_completed')
    .eq('id', user.id)
    .single()

  const profile = profileData as { xp: number; level: number; total_habits_completed: number } | null

  const stats = [
    { label: 'Total Completions', value: profile?.total_habits_completed ?? 0, color: '#39ff14' },
    { label: 'Total XP Earned',   value: (profile?.xp ?? 0).toLocaleString(), color: '#ffe000' },
    { label: 'Current Level',     value: `Lv.${profile?.level ?? 1}`, color: '#bf5fff' },
    { label: 'Avg. per Week',     value: Math.round((profile?.total_habits_completed ?? 0) / 13), color: '#00d4ff' },
  ]

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <BarChart2 size={24} className="text-[var(--color-neon-purple)]" />
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-slate-400 text-sm">Your habit journey in numbers</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className="pixel-card rounded-lg border border-[var(--color-border)] p-3 text-center">
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <HabitHeatmap />
        <ConsistencyChart />

        <div className="grid md:grid-cols-2 gap-4">
          <CategoryBreakdown />
          <div className="pixel-card rounded-lg border border-[var(--color-border)] p-4">
            <h3 className="font-semibold text-white mb-4">Best Days</h3>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const pct = Math.floor(40 + Math.random() * 60)
              return (
                <div key={day} className="flex items-center gap-3 mb-2">
                  <span className="text-slate-400 text-xs w-7">{day}</span>
                  <div className="flex-1 h-4 bg-[var(--color-bg-hover)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: 'var(--color-neon-purple)',
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  </div>
                  <span className="text-slate-400 text-xs w-8 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
