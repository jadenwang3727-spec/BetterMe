import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { requireAuth } from '@/lib/auth/actions'
import { AppShell } from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { StreakCounter } from '@/components/ui/StreakCounter'
import { subDays, format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Database } from '@/lib/supabase/types'

type Habit = Database['public']['Tables']['habits']['Row']
type Streak = Database['public']['Tables']['streaks']['Row']

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Habit Detail' }

export default async function HabitDetailPage({ params }: PageProps) {
  const { id } = await params
  const user = await requireAuth()
  const supabase = await createClient()

  const [habitRes, streakRes] = await Promise.all([
    supabase.from('habits').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('streaks').select('*').eq('habit_id', id).single(),
  ])

  const habit = habitRes.data as Habit | null
  const streak = streakRes.data as Streak | null
  if (!habit) notFound()

  // Last 30 days of logs
  type LogEntry = Pick<Database['public']['Tables']['habit_logs']['Row'], 'log_date' | 'completed' | 'mood' | 'note' | 'xp_awarded'>
  const thirtyDaysAgo = format(subDays(new Date(), 29), 'yyyy-MM-dd')
  const { data: logsRaw } = await supabase
    .from('habit_logs')
    .select('log_date, completed, mood, note, xp_awarded')
    .eq('habit_id', id)
    .gte('log_date', thirtyDaysAgo)
    .order('log_date', { ascending: false })
  const logs = logsRaw as LogEntry[] | null

  const logsMap = new Map((logs ?? []).map(l => [l.log_date, l]))
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
    return { date, log: logsMap.get(date) }
  }).reverse()

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/habits" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={16} />
          Back to Habits
        </Link>

        {/* Header */}
        <div className="pixel-card rounded-lg border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
              style={{ background: `${habit.color}20`, border: `2px solid ${habit.color}` }}
            >
              {habit.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{habit.name}</h1>
              <p className="text-slate-400 text-sm capitalize">{habit.category} • {habit.difficulty} • +{habit.xp_reward} XP/day</p>
              {habit.description && <p className="text-slate-300 text-sm mt-1">{habit.description}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-[var(--color-bg-hover)] rounded p-3 text-center">
              <StreakCounter streak={streak?.current_streak ?? 0} size="lg" className="justify-center" />
              <p className="text-slate-500 text-xs mt-1">Current</p>
            </div>
            <div className="bg-[var(--color-bg-hover)] rounded p-3 text-center">
              <p className="text-xl font-bold text-[var(--color-neon-yellow)]">{streak?.longest_streak ?? 0}</p>
              <p className="text-slate-500 text-xs mt-1">Best</p>
            </div>
            <div className="bg-[var(--color-bg-hover)] rounded p-3 text-center">
              <p className="text-xl font-bold text-[var(--color-neon-blue)]">{streak?.total_completions ?? 0}</p>
              <p className="text-slate-500 text-xs mt-1">Total</p>
            </div>
          </div>
        </div>

        {/* 30-day calendar */}
        <div className="pixel-card rounded-lg border border-[var(--color-border)] p-4">
          <h2 className="font-semibold text-white mb-3">Last 30 Days</h2>
          <div className="grid grid-cols-10 gap-1">
            {last30.map(({ date, log }) => (
              <div
                key={date}
                className="aspect-square rounded-sm transition-colors"
                style={{
                  background: log?.completed
                    ? habit.color
                    : 'var(--color-bg-hover)',
                  opacity: log?.completed ? 1 : 0.4,
                }}
                title={`${date}${log?.completed ? ` • +${log.xp_awarded} XP` : ' • Not done'}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Recent logs */}
        {logs && logs.length > 0 && (
          <div className="pixel-card rounded-lg border border-[var(--color-border)] p-4">
            <h2 className="font-semibold text-white mb-3">Recent Logs</h2>
            <div className="space-y-2">
              {logs.slice(0, 10).map(log => (
                <div key={log.log_date} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={log.completed ? 'text-[var(--color-neon-green)]' : 'text-red-400'}>
                      {log.completed ? '✓' : '✗'}
                    </span>
                    <span className="text-slate-300">{log.log_date}</span>
                    {log.mood && <span className="text-xs text-slate-500 capitalize">{log.mood}</span>}
                  </div>
                  {log.completed && (
                    <span className="text-[var(--color-xp)] font-semibold">+{log.xp_awarded} XP</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
