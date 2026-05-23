'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createHabit } from '@/lib/habits/actions'
import { HABIT_CATEGORIES, HABIT_DIFFICULTIES, HABIT_ICONS } from '@/lib/constants/habits'
import { PixelButton } from '@/components/ui/PixelButton'
import { PixelModal } from '@/components/ui/PixelModal'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  category: z.enum(['fitness','nutrition','sleep','mindfulness','learning','creativity','social','productivity','finance','hygiene','nature','custom']),
  frequency: z.enum(['daily','weekly','custom']),
  difficulty: z.enum(['easy','medium','hard','legendary']),
  icon: z.string(),
  color: z.string(),
  grace_days: z.number().min(0).max(3),
})

type FormValues = z.infer<typeof schema>

interface HabitFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function HabitForm({ isOpen, onClose, onSuccess }: HabitFormProps) {
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: 'fitness',
      frequency: 'daily',
      difficulty: 'medium',
      icon: '⭐',
      color: '#4CAF50',
      grace_days: 1,
    },
  })

  const selectedIcon = watch('icon')
  const selectedColor = watch('color')
  const selectedDifficulty = watch('difficulty')

  async function onSubmit(values: FormValues) {
    setServerError('')
    const result = await createHabit(values)
    if (result?.error) { setServerError(result.error); return }
    onSuccess?.()
    onClose()
  }

  return (
    <PixelModal isOpen={isOpen} onClose={onClose} title="Create New Habit" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Habit Name</label>
          <input
            {...register('name')}
            placeholder="e.g. Morning Run"
            className="w-full px-3 py-2 bg-[var(--color-bg-hover)] border border-[var(--color-border)]
              rounded text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-neon-purple)]
              focus:ring-1 focus:ring-[var(--color-neon-purple)] text-sm"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Icon picker */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Icon</label>
          <div className="flex flex-wrap gap-2">
            {HABIT_ICONS.slice(0, 16).map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => setValue('icon', icon)}
                className={`w-9 h-9 text-lg rounded border transition-colors ${
                  selectedIcon === icon
                    ? 'border-[var(--color-neon-purple)] bg-[var(--color-neon-purple)]/20'
                    : 'border-[var(--color-border)] hover:border-[var(--color-border-bright)]'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 bg-[var(--color-bg-hover)] border border-[var(--color-border)]
                rounded text-white focus:outline-none focus:border-[var(--color-neon-purple)] text-sm"
            >
              {HABIT_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Difficulty</label>
            <div className="grid grid-cols-2 gap-1">
              {HABIT_DIFFICULTIES.map(d => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setValue('difficulty', d.value)}
                  className={`py-1.5 px-2 rounded text-xs font-semibold border transition-all ${
                    selectedDifficulty === d.value
                      ? 'border-current'
                      : 'border-[var(--color-border)] text-slate-400 hover:border-[var(--color-border-bright)]'
                  }`}
                  style={selectedDifficulty === d.value ? { color: d.color, borderColor: d.color, background: `${d.color}20` } : {}}
                >
                  {d.label} (+{d.xp} XP)
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Frequency</label>
          <div className="flex gap-2">
            {(['daily', 'weekly'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setValue('frequency', f)}
                className={`flex-1 py-2 rounded text-sm font-medium border transition-all capitalize ${
                  watch('frequency') === f
                    ? 'border-[var(--color-neon-purple)] bg-[var(--color-neon-purple)]/20 text-[var(--color-neon-purple)]'
                    : 'border-[var(--color-border)] text-slate-400 hover:border-[var(--color-border-bright)]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {serverError && (
          <p className="text-red-400 text-sm">{serverError}</p>
        )}

        <div className="flex gap-3 pt-2">
          <PixelButton type="button" variant="secondary" onClick={onClose} fullWidth>
            Cancel
          </PixelButton>
          <PixelButton type="submit" disabled={isSubmitting} fullWidth>
            {isSubmitting ? 'Creating...' : `Create Habit (+${HABIT_DIFFICULTIES.find(d => d.value === selectedDifficulty)?.xp ?? 50} XP/day)`}
          </PixelButton>
        </div>
      </form>
    </PixelModal>
  )
}
