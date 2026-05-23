import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

export async function getUserHabits(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getTodaysLogs(userId: string) {
  const supabase = await createClient()
  const today = format(new Date(), 'yyyy-MM-dd')
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_date', today)
  if (error) throw error
  return data ?? []
}

export async function getStreaksForUser(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data ?? []
}

export async function getHabitWithStreak(habitId: string) {
  const supabase = await createClient()
  const [habitRes, streakRes] = await Promise.all([
    supabase.from('habits').select('*').eq('id', habitId).single(),
    supabase.from('streaks').select('*').eq('habit_id', habitId).single(),
  ])
  return {
    habit: habitRes.data,
    streak: streakRes.data,
  }
}

export async function getHabitLogsForRange(habitId: string, startDate: string, endDate: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habitId)
    .gte('log_date', startDate)
    .lte('log_date', endDate)
    .order('log_date', { ascending: true })
  if (error) throw error
  return data ?? []
}
