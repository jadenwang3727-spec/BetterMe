import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { requireAuth } from '@/lib/auth/actions'
import { AppShell } from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase/server'
import { getUserHabits, getTodaysLogs, getStreaksForUser } from '@/lib/habits/queries'
import { HabitList } from '@/components/dashboard/HabitList'
import { XPFloatingText } from '@/components/gamification/XPFloatingText'

export const metadata: Metadata = { title: 'Habits' }

export default async function HabitsPage() {
  const user = await requireAuth()
  const [habits, todaysLogs, streaks] = await Promise.all([
    getUserHabits(user.id),
    getTodaysLogs(user.id),
    getStreaksForUser(user.id),
  ])

  return (
    <AppShell>
      <XPFloatingText />
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-white">My Habits</h1>
        <HabitList habits={habits} streaks={streaks} todaysLogs={todaysLogs} />
      </div>
    </AppShell>
  )
}
