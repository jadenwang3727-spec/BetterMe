// XP to reach level N = 100 * N^2
// Level 1: 0 XP, Level 2: 400 XP, Level 5: 2500 XP, Level 10: 10000 XP

export const MAX_LEVEL = 100

export function xpForLevel(level: number): number {
  return 100 * Math.pow(level, 2)
}

export function levelFromXP(xp: number): number {
  return Math.min(MAX_LEVEL, Math.floor(Math.sqrt(xp / 100)) + 1)
}

export function xpProgressInCurrentLevel(xp: number): {
  current: number
  needed: number
  pct: number
  level: number
} {
  const level = levelFromXP(xp)
  if (level >= MAX_LEVEL) {
    return { current: xp, needed: xp, pct: 100, level }
  }
  const currentLevelXP = xpForLevel(level - 1)
  const nextLevelXP = xpForLevel(level)
  const current = xp - currentLevelXP
  const needed = nextLevelXP - currentLevelXP
  return { current, needed, pct: Math.min(100, (current / needed) * 100), level }
}

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Novice',
  5: 'Apprentice',
  10: 'Adventurer',
  15: 'Journeyman',
  20: 'Veteran',
  25: 'Expert',
  30: 'Master',
  40: 'Grandmaster',
  50: 'Champion',
  60: 'Legend',
  75: 'Mythic',
  90: 'Transcendent',
  100: 'Ascendant',
}

export function getLevelTitle(level: number): string {
  const thresholds = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a)
  for (const threshold of thresholds) {
    if (level >= threshold) return LEVEL_TITLES[threshold]
  }
  return 'Novice'
}
