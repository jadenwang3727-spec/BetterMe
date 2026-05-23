import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { requireAuth } from '@/lib/auth/actions'
import { AppShell } from '@/components/layout/AppShell'
import { PartyChat } from '@/components/parties/PartyChat'
import { PixelCard } from '@/components/ui/PixelCard'
import { Users, Copy, Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPartyWithMembers, getPartyMessages } from '@/lib/parties/queries'

export const metadata: Metadata = { title: 'Party' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PartyPage({ params }: PageProps) {
  const { id } = await params
  const user = await requireAuth()

  let party = null
  let members: unknown[] = []
  let messages: unknown[] = []

  if (id !== 'demo') {
    try {
      const res = await getPartyWithMembers(id)
      party = res.party
      members = res.members
      messages = await getPartyMessages(id)
    } catch {
      // Party not found
    }
  }

  // Demo mode
  if (!party) {
    party = {
      id: 'demo',
      name: '⚡ Grind Squad',
      description: 'We wake up at 5am and conquer the day.',
      invite_code: 'GRND2026',
      owner_id: user.id,
      icon: '⚡',
      color: '#6C5CE7',
    }
    members = [
      { role: 'owner', profiles: { id: user.id, display_name: 'You', avatar_skin_tone: '#F5CBA7' } },
    ]
    messages = []
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{party.icon}</span>
                {party.name}
              </h1>
              {party.description && <p className="text-slate-400 text-sm mt-1">{party.description}</p>}
            </div>

            <PixelCard className="overflow-hidden">
              <div className="p-3 border-b border-[var(--color-border)] flex items-center justify-between">
                <span className="text-sm font-medium text-white">Party Chat</span>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <Users size={12} />
                  <span>{(members as { role: string }[]).length} members</span>
                </div>
              </div>
              <PartyChat
                partyId={party.id}
                currentUserId={user.id}
                initialMessages={messages as Parameters<typeof PartyChat>[0]['initialMessages']}
              />
            </PixelCard>
          </div>

          {/* Sidebar: invite + members */}
          <div className="space-y-4">
            <PixelCard className="p-4">
              <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                <Copy size={14} className="text-[var(--color-neon-blue)]" />
                Invite Code
              </h3>
              <div className="bg-[var(--color-bg-hover)] rounded p-3 text-center">
                <p className="pixel-font text-[var(--color-neon-blue)] text-lg tracking-widest">
                  {party.invite_code}
                </p>
                <p className="text-slate-500 text-xs mt-1">Share this with friends</p>
              </div>
            </PixelCard>

            <PixelCard className="p-4">
              <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                <Users size={14} className="text-[var(--color-neon-purple)]" />
                Members
              </h3>
              <div className="space-y-2">
                {(members as { role: string; profiles: { id: string; display_name: string; avatar_skin_tone: string } | null }[]).map((member, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: member.profiles?.avatar_skin_tone ?? '#F5CBA7', color: '#000' }}
                    >
                      {member.profiles?.display_name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm text-slate-300 flex-1 truncate">
                      {member.profiles?.display_name}
                    </span>
                    {member.role === 'owner' && <Crown size={12} className="text-[var(--color-xp)]" />}
                  </div>
                ))}
              </div>
            </PixelCard>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
