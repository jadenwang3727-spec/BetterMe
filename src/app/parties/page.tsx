'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { CreatePartyModal } from '@/components/parties/CreatePartyModal'
import { PixelButton } from '@/components/ui/PixelButton'
import { PixelCard } from '@/components/ui/PixelCard'
import { Users, Plus, Hash } from 'lucide-react'
import { joinParty } from '@/lib/parties/actions'
import { useRouter } from 'next/navigation'

export default function PartiesPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [joinError, setJoinError] = useState('')
  const [joining, setJoining] = useState(false)
  const router = useRouter()

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    setJoinError('')
    setJoining(true)
    const result = await joinParty(inviteCode)
    setJoining(false)
    if (result.error) { setJoinError(result.error); return }
    router.push(`/parties/${result.data?.partyId}`)
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Accountability Parties</h1>
            <p className="text-slate-400 text-sm mt-1">Build habits together. Stay accountable.</p>
          </div>
          <PixelButton onClick={() => setShowCreate(true)}>
            <Plus size={16} className="mr-2" />
            Create Party
          </PixelButton>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Join party */}
          <PixelCard className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Hash size={16} className="text-[var(--color-neon-blue)]" />
              <h2 className="font-semibold text-white">Join with Code</h2>
            </div>
            <form onSubmit={handleJoin} className="space-y-3">
              <input
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Enter 8-letter code (e.g. GRND2026)"
                maxLength={8}
                className="w-full px-3 py-2 bg-[var(--color-bg-hover)] border border-[var(--color-border)]
                  rounded text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-neon-blue)]
                  text-sm uppercase tracking-widest font-mono"
              />
              {joinError && <p className="text-red-400 text-xs">{joinError}</p>}
              <PixelButton type="submit" variant="secondary" disabled={inviteCode.length < 4 || joining} fullWidth>
                {joining ? 'Joining...' : 'Join Party →'}
              </PixelButton>
            </form>
          </PixelCard>

          {/* Create party CTA */}
          <PixelCard
            className="p-5 border-dashed"
            hover
            onClick={() => setShowCreate(true)}
          >
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-neon-purple)]/20 flex items-center justify-center">
                <Users size={20} className="text-[var(--color-neon-purple)]" />
              </div>
              <div>
                <p className="font-semibold text-white">Start a Party</p>
                <p className="text-slate-400 text-sm">Invite friends and build habits together</p>
              </div>
            </div>
          </PixelCard>
        </div>

        {/* Demo party */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Your Parties</h2>
          <PixelCard className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-semibold text-white">Grind Squad</p>
                  <p className="text-slate-400 text-sm">3 members • 5 day party streak</p>
                </div>
              </div>
              <PixelButton
                size="sm"
                variant="secondary"
                onClick={() => router.push('/parties/demo')}
              >
                Open →
              </PixelButton>
            </div>
          </PixelCard>
        </div>
      </div>

      <CreatePartyModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </AppShell>
  )
}
