import { levelFromXP, xpProgressInCurrentLevel } from '@/lib/constants/levels'

export { levelFromXP, xpProgressInCurrentLevel }

export function calculateStreakBonus(baseXP: number, streakDays: number): number {
  const tierBonus = Math.floor(streakDays / 7) * 0.1
  const cappedBonus = Math.min(1.0, tierBonus)
  return Math.floor(baseXP * cappedBonus)
}

export function getTotalXPWithBonus(baseXP: number, streakDays: number): number {
  return baseXP + calculateStreakBonus(baseXP, streakDays)
}
