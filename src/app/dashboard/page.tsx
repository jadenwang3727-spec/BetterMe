import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { requireAuth } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']
import { getUserHabits, getTodaysLogs, getStreaksForUser } from '@/lib/habits/queries'
import { HabitList } from '@/components/dashboard/HabitList'
import { XPWidget } from '@/components/dashboard/XPWidget'
import { StreakWidget } from '@/components/dashboard/StreakWidget'
import { DailyQuestWidget } from '@/components/dashboard/DailyQuestWidget'
import { XPFloatingText } from '@/components/gamification/XPFloatingText'
import { LevelUpModal } from '@/components/gamification/LevelUpModal'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  const [profileRes, habits, todaysLogs, streaks] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    getUserHabits(user.id),
    getTodaysLogs(user.id),
    getStreaksForUser(user.id),
  ])

  const profile = profileRes.data as Profile | null
  if (!profile) return null

  const today = format(new Date(), 'EEEE, MMMM d')

  return (
    <>
      <XPFloatingText />
      <LevelUpModal />

      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-sm">{today}</p>
            <h1 className="text-2xl font-bold text-white">
              Hey, {profile.display_name.split(' ')[0]} 👋
            </h1>
            {profile.identity_statement && (
              <p className="text-slate-400 text-sm mt-1 italic">&quot;{profile.identity_statement}&quot;</p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <XPWidget xp={profile.xp} level={profile.level} />
          <StreakWidget habits={habits} streaks={streaks} />
          <DailyQuestWidget />
        </div>

        {/* Today's habits */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Today&apos;s Habits</h2>
          <HabitList habits={habits} streaks={streaks} todaysLogs={todaysLogs} />
        </div>
      </div>
    </>
  )
}
