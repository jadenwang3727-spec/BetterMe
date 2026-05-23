import type { HabitCategory, HabitDifficulty } from '@/lib/supabase/types'

export const HABIT_CATEGORIES: { value: HabitCategory; label: string; icon: string; color: string }[] = [
  { value: 'fitness',      label: 'Fitness',      icon: '🏃', color: '#4CAF50' },
  { value: 'nutrition',    label: 'Nutrition',    icon: '🥗', color: '#8BC34A' },
  { value: 'sleep',        label: 'Sleep',        icon: '😴', color: '#7C4DFF' },
  { value: 'mindfulness',  label: 'Mindfulness',  icon: '🧘', color: '#9C27B0' },
  { value: 'learning',     label: 'Learning',     icon: '📚', color: '#2196F3' },
  { value: 'creativity',   label: 'Creativity',   icon: '🎨', color: '#FF9800' },
  { value: 'social',       label: 'Social',       icon: '👥', color: '#E91E63' },
  { value: 'productivity', label: 'Productivity', icon: '⚡', color: '#FFC107' },
  { value: 'finance',      label: 'Finance',      icon: '💰', color: '#4CAF50' },
  { value: 'hygiene',      label: 'Hygiene',      icon: '🪥', color: '#00BCD4' },
  { value: 'nature',       label: 'Nature',       icon: '🌿', color: '#009688' },
  { value: 'custom',       label: 'Custom',       icon: '⭐', color: '#9E9E9E' },
]

export const HABIT_DIFFICULTIES: {
  value: HabitDifficulty
  label: string
  xp: number
  color: string
  description: string
}[] = [
  { value: 'easy',       label: 'Easy',       xp: 25,  color: '#4CAF50', description: 'Simple, takes under 5 min' },
  { value: 'medium',     label: 'Medium',     xp: 50,  color: '#FFC107', description: 'Moderate effort required' },
  { value: 'hard',       label: 'Hard',       xp: 100, color: '#FF5722', description: 'Challenging, significant willpower' },
  { value: 'legendary',  label: 'Legendary',  xp: 200, color: '#9C27B0', description: 'Elite commitment, life-changing' },
]

export const XP_BY_DIFFICULTY: Record<HabitDifficulty, number> = {
  easy: 25,
  medium: 50,
  hard: 100,
  legendary: 200,
}

export const HABIT_ICONS = [
  '🏃', '💪', '🧘', '📚', '🎨', '💧', '🥗', '😴',
  '⭐', '🔥', '⚡', '🌿', '🎵', '✍️', '🧹', '💻',
  '🚴', '🏊', '🎯', '📝', '🌅', '🍎', '💊', '🧠',
  '👥', '📱', '🎮', '📖', '🏋️', '🤸', '🧪', '🌱',
]

export const SUGGESTED_HABITS = [
  { name: 'Morning Run', category: 'fitness' as HabitCategory, icon: '🏃', difficulty: 'medium' as HabitDifficulty },
  { name: 'Drink 8 Glasses of Water', category: 'nutrition' as HabitCategory, icon: '💧', difficulty: 'easy' as HabitDifficulty },
  { name: 'Meditate 10 Minutes', category: 'mindfulness' as HabitCategory, icon: '🧘', difficulty: 'easy' as HabitDifficulty },
  { name: 'Read 20 Pages', category: 'learning' as HabitCategory, icon: '📚', difficulty: 'easy' as HabitDifficulty },
  { name: 'Strength Training', category: 'fitness' as HabitCategory, icon: '💪', difficulty: 'hard' as HabitDifficulty },
  { name: 'Journal Entry', category: 'mindfulness' as HabitCategory, icon: '✍️', difficulty: 'easy' as HabitDifficulty },
  { name: 'No Social Media Before Noon', category: 'productivity' as HabitCategory, icon: '📵', difficulty: 'medium' as HabitDifficulty },
  { name: 'Sleep by 11pm', category: 'sleep' as HabitCategory, icon: '😴', difficulty: 'medium' as HabitDifficulty },
]
