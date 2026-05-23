'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createHabit } from '@/lib/habits/actions'
import { PixelButton } from '@/components/ui/PixelButton'
import { SUGGESTED_HABITS, HABIT_CATEGORIES } from '@/lib/constants/habits'
import { CheckCircle, ArrowRight, Zap } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

const STEPS = ['identity', 'habit', 'party'] as const
type Step = typeof STEPS[number]

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>('identity')
  const [identityStatement, setIdentityStatement] = useState('')
  const [selectedHabit, setSelectedHabit] = useState<typeof SUGGESTED_HABITS[0] | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user, refreshProfile } = useAuth()
  const supabase = createClient()

  const stepIndex = STEPS.indexOf(step)

  async function handleIdentityNext() {
    if (!user || !identityStatement.trim()) return
    await supabase.from('profiles').update({
      identity_statement: identityStatement,
      onboarding_step: 1,
    }).eq('id', user.id)
    setStep('habit')
  }

  async function handleHabitNext() {
    if (!selectedHabit) { setStep('party'); return }
    setLoading(true)
    await createHabit({
      name: selectedHabit.name,
      category: selectedHabit.category,
      frequency: 'daily',
      difficulty: selectedHabit.difficulty,
      icon: selectedHabit.icon,
      color: HABIT_CATEGORIES.find(c => c.value === selectedHabit.category)?.color ?? '#4CAF50',
    })
    if (user) {
      await supabase.from('profiles').update({ onboarding_step: 2 }).eq('id', user.id)
    }
    setLoading(false)
    setStep('party')
  }

  async function handleComplete() {
    if (!user) return
    setLoading(true)
    await supabase.from('profiles').update({ onboarding_completed: true, onboarding_step: 3 }).eq('id', user.id)
    await refreshProfile()
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-deep)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="text-[var(--color-neon-purple)]" />
            <span className="pixel-font text-sm text-[var(--color-neon-purple)]">HabitQuest</span>
          </div>
          {/* Step dots */}
          <div className="flex items-center justify-center gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i <= stepIndex
                    ? 'bg-[var(--color-neon-purple)]'
                    : 'bg-[var(--color-border)]'
                }`}
              />
            ))}
          </div>
          <p className="text-slate-500 text-sm mt-2">Step {stepIndex + 1} of {STEPS.length}</p>
        </div>

        {/* Step: Identity */}
        {step === 'identity' && (
          <div className="pixel-card rounded-lg border border-[var(--color-border-bright)] p-6 space-y-5"
            style={{ boxShadow: '0 0 40px rgba(191,95,255,0.1)' }}>
            <div className="text-center">
              <div className="text-4xl mb-3">🌱</div>
              <h1 className="text-xl font-bold text-white">Who are you becoming?</h1>
              <p className="text-slate-400 text-sm mt-1">
                Identity-based habits are 2x more likely to stick. Define your future self.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">
                Complete this statement:
              </label>
              <div className="flex items-center gap-2 bg-[var(--color-bg-hover)] border border-[var(--color-border)] rounded p-3">
                <span className="text-slate-400 text-sm whitespace-nowrap">I am someone who</span>
                <input
                  value={identityStatement}
                  onChange={e => setIdentityStatement(e.target.value)}
                  placeholder="wakes up early and exercises daily."
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-slate-600"
                  maxLength={200}
                  autoFocus
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'prioritizes health every day.',
                  'reads for 30 minutes before bed.',
                  'keeps commitments to themselves.',
                  'takes care of their mind and body.',
                ].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setIdentityStatement(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-border)]
                      text-slate-400 hover:text-white hover:border-[var(--color-neon-purple)] transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <PixelButton
              onClick={handleIdentityNext}
              disabled={!identityStatement.trim()}
              fullWidth
            >
              Next <ArrowRight size={16} className="ml-2" />
            </PixelButton>
          </div>
        )}

        {/* Step: First Habit */}
        {step === 'habit' && (
          <div className="pixel-card rounded-lg border border-[var(--color-border-bright)] p-6 space-y-5"
            style={{ boxShadow: '0 0 40px rgba(191,95,255,0.1)' }}>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h1 className="text-xl font-bold text-white">Plant your first habit</h1>
              <p className="text-slate-400 text-sm mt-1">Start tiny. One habit, every day. That&apos;s it.</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SUGGESTED_HABITS.map(habit => (
                <button
                  key={habit.name}
                  onClick={() => setSelectedHabit(habit)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedHabit?.name === habit.name
                      ? 'border-[var(--color-neon-purple)] bg-[var(--color-neon-purple)]/20'
                      : 'border-[var(--color-border)] hover:border-[var(--color-border-bright)]'
                  }`}
                >
                  <div className="text-2xl mb-1">{habit.icon}</div>
                  <p className="text-white text-sm font-medium">{habit.name}</p>
                  <p className="text-slate-500 text-xs capitalize">{habit.difficulty}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <PixelButton variant="ghost" onClick={() => setStep('party')} fullWidth>
                Skip for now
              </PixelButton>
              <PixelButton onClick={handleHabitNext} disabled={loading} fullWidth>
                {loading ? 'Adding...' : selectedHabit ? 'Add Habit →' : 'Skip →'}
              </PixelButton>
            </div>
          </div>
        )}

        {/* Step: Invite */}
        {step === 'party' && (
          <div className="pixel-card rounded-lg border border-[var(--color-border-bright)] p-6 space-y-5 text-center"
            style={{ boxShadow: '0 0 40px rgba(191,95,255,0.1)' }}>
            <div>
              <div className="text-4xl mb-3">🎉</div>
              <h1 className="text-xl font-bold text-white">You&apos;re all set!</h1>
              <p className="text-slate-400 text-sm mt-1">
                Accountability parties are up to 3x more effective. Invite a friend to join your journey.
              </p>
            </div>

            <div className="bg-[var(--color-bg-hover)] rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-[var(--color-neon-green)]">
                <CheckCircle size={16} />
                <span className="text-sm">Identity set</span>
              </div>
              {selectedHabit && (
                <div className="flex items-center gap-2 text-[var(--color-neon-green)]">
                  <CheckCircle size={16} />
                  <span className="text-sm">First habit: {selectedHabit.icon} {selectedHabit.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <PixelButton onClick={handleComplete} disabled={loading} fullWidth>
                {loading ? 'Setting up...' : 'Enter the Quest! ⚡'}
              </PixelButton>
              <p className="text-slate-500 text-xs">You can invite friends from the Parties page</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
