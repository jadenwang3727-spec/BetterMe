import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`
  return xp.toString()
}

export function formatStreak(days: number): string {
  if (days === 1) return '1 day'
  return `${days} days`
}

export function formatLevel(level: number): string {
  return `Lv.${level}`
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  if (isToday(date)) return formatDistanceToNow(date, { addSuffix: true })
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMM d')
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'MMM d, yyyy')
}

export function formatDifficulty(difficulty: string): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
}

export function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}
