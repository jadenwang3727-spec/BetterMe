'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PixelButton } from '@/components/ui/PixelButton'
import { PixelCard } from '@/components/ui/PixelCard'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface SettingsFormProps {
  profile: Profile
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const [displayName, setDisplayName] = useState(profile.display_name)
  const [bio, setBio] = useState(profile.bio ?? '')
  const [publicProfile, setPublicProfile] = useState(profile.public_profile)
  const [notifications, setNotifications] = useState(profile.notifications_enabled)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSave() {
    setSaving(true)
    await supabase.from('profiles').update({
      display_name: displayName,
      bio,
      public_profile: publicProfile,
      notifications_enabled: notifications,
    }).eq('id', profile.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <PixelCard className="p-4 space-y-4">
        <h2 className="font-semibold text-white">Profile</h2>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            maxLength={50}
            className="w-full px-3 py-2 bg-[var(--color-bg-hover)] border border-[var(--color-border)]
              rounded text-white focus:outline-none focus:border-[var(--color-neon-purple)] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={280}
            rows={2}
            placeholder="Tell your party about yourself..."
            className="w-full px-3 py-2 bg-[var(--color-bg-hover)] border border-[var(--color-border)]
              rounded text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-neon-purple)]
              text-sm resize-none"
          />
          <p className="text-slate-500 text-xs mt-1 text-right">{bio.length}/280</p>
        </div>
      </PixelCard>

      <PixelCard className="p-4 space-y-3">
        <h2 className="font-semibold text-white">Privacy</h2>
        {[
          { key: 'public', label: 'Public Profile', desc: 'Let others find and view your profile', value: publicProfile, set: setPublicProfile },
          { key: 'notif', label: 'Notifications', desc: 'Receive streak reminders and party updates', value: notifications, set: setNotifications },
        ].map(({ key, label, desc, value, set }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
            <button
              onClick={() => set(!value)}
              className={`w-10 h-6 rounded-full transition-all duration-200 relative ${
                value ? 'bg-[var(--color-neon-purple)]' : 'bg-[var(--color-bg-hover)]'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                value ? 'left-5' : 'left-1'
              }`} />
            </button>
          </div>
        ))}
      </PixelCard>

      <PixelButton onClick={handleSave} disabled={saving} fullWidth>
        {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Settings'}
      </PixelButton>
    </div>
  )
}
