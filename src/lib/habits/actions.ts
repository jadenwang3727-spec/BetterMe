'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/actions'
import { XP_BY_DIFFICULTY } from '@/lib/constants/habits'
import type { HabitCategory, HabitDifficulty, HabitFrequency, Mood } from '@/lib/supabase/types'

interface CreateHabitInput {
  name: string
  description?: string
  category: HabitCategory
  frequency: HabitFrequency
  frequency_days?: number[]
  difficulty: HabitDifficulty
  icon: string
  color: string
  grace_days?: number
  biome_id?: string
}

export async function createHabit(input: CreateHabitInput) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id: user.id,
      name: input.name,
      description: input.description ?? '',
      category: input.category,
      frequency: input.frequency,
      frequency_days: input.frequency_days ?? [],
      difficulty: input.difficulty,
      xp_reward: XP_BY_DIFFICULTY[input.difficulty],
      icon: input.icon,
      color: input.color,
      grace_days: input.grace_days ?? 1,
      biome_id: input.biome_id ?? 'forest',
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/habits')
  return { data }
}

export async function updateHabit(habitId: string, input: Partial<CreateHabitInput>) {
  const user = await requireAuth()
  const supabase = await createClient()

  const updateData: Record<string, unknown> = { ...input }
  if (input.difficulty) {
    updateData.xp_reward = XP_BY_DIFFICULTY[input.difficulty]
  }

  const { error } = await supabase
    .from('habits')
    .update(updateData)
    .eq('id', habitId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath(`/habits/${habitId}`)
  return { success: true }
}

export async function archiveHabit(habitId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase
    .from('habits')
    .update({ is_archived: true })
    .eq('id', habitId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/habits')
  return { success: true }
}

export async function logHabit(habitId: string, mood?: Mood, note?: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]

  // Check if already logged today
  const { data: existing } = await supabase
    .from('habit_logs')
    .select('id')
    .eq('habit_id', habitId)
    .eq('log_date', today)
    .single()

  if (existing) return { error: 'Already logged today' }

  const { data, error } = await supabase
    .from('habit_logs')
    .insert({
      habit_id: habitId,
      user_id: user.id,
      log_date: today,
      completed: true,
      mood: mood ?? null,
      note: note ?? '',
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath(`/habits/${habitId}`)

  // Return the XP awarded (populated by DB trigger)
  const { data: logWithXP } = await supabase
    .from('habit_logs')
    .select('xp_awarded, streak_at_log')
    .eq('id', data.id)
    .single()

  return { data, xpAwarded: logWithXP?.xp_awarded ?? 0, streak: logWithXP?.streak_at_log ?? 1 }
}

export async function unlogHabit(habitId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]

  const { error } = await supabase
    .from('habit_logs')
    .delete()
    .eq('habit_id', habitId)
    .eq('user_id', user.id)
    .eq('log_date', today)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}
