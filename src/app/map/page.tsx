import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { requireAuth } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/AppShell'
import { WorldMap } from '@/components/map/WorldMap'

export const metadata: Metadata = { title: 'World Map' }

export default async function MapPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: profileRaw } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', user.id)
    .single()

  const profile = profileRaw as { xp: number; level: number } | null
  const xp = profile?.xp ?? 0

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">World Map</h1>
          <p className="text-slate-400 text-sm mt-1">
            Your habit journey across {5} biomes — {xp.toLocaleString()} XP earned
          </p>
        </div>
        <WorldMap userXP={xp} />
      </div>
    </AppShell>
  )
}
