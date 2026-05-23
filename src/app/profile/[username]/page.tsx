import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { AppShell } from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase/server'
import { LevelBadge } from '@/components/ui/LevelBadge'
import { XPBar } from '@/components/ui/XPBar'
import { StreakCounter } from '@/components/ui/StreakCounter'
import { notFound } from 'next/navigation'
import { ACHIEVEMENTS } from '@/lib/constants/achievements'
import { Calendar, Trophy, Zap } from 'lucide-react'
import { format } from 'date-fns'

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  return { title: `@${username}` }
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id, earned_at')
    .eq('user_id', profile.id)

  const earnedIds = new Set(userAchievements?.map(a => a.achievement_id))
  const earnedAchievements = ACHIEVEMENTS.filter(a => earnedIds.has(a.id))

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile header */}
        <div className="pixel-card rounded-lg border border-[var(--color-border)] p-6">
          <div className="flex items-start gap-5">
            <div
              className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl font-bold shrink-0"
              style={{
                background: `linear-gradient(135deg, var(--color-neon-purple), var(--color-neon-blue))`,
                color: 'white',
                boxShadow: '0 0 20px rgba(191,95,255,0.4)',
              }}
            >
              {profile.display_name[0]?.toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 flex-wrap">
                <div>
                  <h1 className="text-xl font-bold text-white">{profile.display_name}</h1>
                  <p className="text-slate-400 text-sm">@{profile.username}</p>
                </div>
                <LevelBadge level={profile.level} size="md" showTitle />
              </div>

              {profile.identity_statement && (
                <p className="text-slate-300 text-sm mt-2 italic">
                  &quot;I am someone who {profile.identity_statement}&quot;
                </p>
              )}

              {profile.bio && <p className="text-slate-400 text-sm mt-2">{profile.bio}</p>}

              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <Zap size={14} className="text-[var(--color-xp)]" />
                  <span className="text-[var(--color-xp)] font-bold">{profile.xp.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy size={14} className="text-[var(--color-neon-yellow)]" />
                  <span className="text-slate-300">{profile.total_habits_completed} completions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="text-slate-400">
                    Joined {format(new Date(profile.created_at), 'MMM yyyy')}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <XPBar xp={profile.xp} className="max-w-xs" compact showNumbers />
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="pixel-card rounded-lg border border-[var(--color-border)] p-4">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-[var(--color-neon-yellow)]" />
            Achievements ({earnedAchievements.length}/{ACHIEVEMENTS.length})
          </h2>
          {earnedAchievements.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">No achievements yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {earnedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-[var(--color-bg-hover)] border border-[var(--color-border)] text-center"
                  title={achievement.description}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <p className="text-white text-xs font-semibold leading-tight">{achievement.name}</p>
                  <p className="text-[var(--color-xp)] text-[10px]">+{achievement.xpReward} XP</p>
                </div>
              ))}
              {/* Locked placeholders */}
              {ACHIEVEMENTS.filter(a => !earnedIds.has(a.id)).slice(0, 4).map(a => (
                <div key={a.id} className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-[var(--color-bg-dark)] border border-[var(--color-border)] text-center opacity-40">
                  <span className="text-2xl grayscale">{a.icon}</span>
                  <p className="text-slate-500 text-xs">???</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
