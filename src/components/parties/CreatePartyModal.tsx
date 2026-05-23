'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PixelModal } from '@/components/ui/PixelModal'
import { PixelButton } from '@/components/ui/PixelButton'
import { createParty } from '@/lib/parties/actions'

const PARTY_ICONS = ['🏰', '⚔️', '🌟', '🔥', '⚡', '🏆', '🎯', '🛡️', '🗡️', '🌙']

interface CreatePartyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreatePartyModal({ isOpen, onClose }: CreatePartyModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('🏰')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await createParty(name, description, icon)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    router.push(`/parties/${result.data?.id}`)
    onClose()
  }

  return (
    <PixelModal isOpen={isOpen} onClose={onClose} title="Create Accountability Party">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Party Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            minLength={2}
            maxLength={50}
            placeholder="e.g. Morning Grind Squad"
            className="w-full px-3 py-2 bg-[var(--color-bg-hover)] border border-[var(--color-border)]
              rounded text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-neon-purple)] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Icon</label>
          <div className="flex flex-wrap gap-2">
            {PARTY_ICONS.map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                className={`w-9 h-9 text-xl rounded border transition-colors ${
                  icon === i
                    ? 'border-[var(--color-neon-purple)] bg-[var(--color-neon-purple)]/20'
                    : 'border-[var(--color-border)] hover:border-[var(--color-border-bright)]'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description (optional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="What's your crew about?"
            className="w-full px-3 py-2 bg-[var(--color-bg-hover)] border border-[var(--color-border)]
              rounded text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-neon-purple)]
              text-sm resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <PixelButton type="button" variant="secondary" onClick={onClose} fullWidth>Cancel</PixelButton>
          <PixelButton type="submit" disabled={loading || !name} fullWidth>
            {loading ? 'Creating...' : 'Create Party 🏰'}
          </PixelButton>
        </div>
      </form>
    </PixelModal>
  )
}
