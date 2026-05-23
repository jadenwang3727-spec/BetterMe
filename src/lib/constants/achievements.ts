export interface AchievementDef {
  id: string
  name: string
  description: string
  icon: string
  category: string
  xpReward: number
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_habit',      name: 'First Step',          description: 'Complete your first habit',                icon: '👣', category: 'completion', xpReward: 50 },
  { id: 'streak_3',         name: 'On a Roll',           description: 'Maintain a 3-day streak',                 icon: '🔥', category: 'streak',     xpReward: 75 },
  { id: 'streak_7',         name: 'Week Warrior',        description: 'Maintain a 7-day streak',                 icon: '⚡', category: 'streak',     xpReward: 150 },
  { id: 'streak_30',        name: 'Monthly Legend',      description: 'Maintain a 30-day streak',                icon: '💎', category: 'streak',     xpReward: 500 },
  { id: 'streak_100',       name: 'Centurion',           description: 'Maintain a 100-day streak',               icon: '👑', category: 'streak',     xpReward: 2000 },
  { id: 'level_5',          name: 'Rising Hero',         description: 'Reach Level 5',                           icon: '🌟', category: 'level',      xpReward: 100 },
  { id: 'level_10',         name: 'Seasoned Adventurer', description: 'Reach Level 10',                          icon: '🏅', category: 'level',      xpReward: 200 },
  { id: 'level_25',         name: 'Veteran',             description: 'Reach Level 25',                          icon: '🥇', category: 'level',      xpReward: 500 },
  { id: 'party_joiner',     name: 'Team Player',         description: 'Join your first accountability party',    icon: '🤝', category: 'social',     xpReward: 100 },
  { id: 'invite_friend',    name: 'Recruiter',           description: 'Invite a friend to join',                 icon: '📨', category: 'social',     xpReward: 75 },
  { id: 'habit_variety',    name: 'Explorer',            description: 'Create habits in 5 different categories', icon: '🗺️', category: 'exploration', xpReward: 200 },
  { id: 'completions_50',   name: 'Half Century',        description: 'Complete habits 50 times total',          icon: '🌈', category: 'completion', xpReward: 200 },
  { id: 'completions_500',  name: 'Iron Will',           description: 'Complete habits 500 times total',         icon: '⚔️', category: 'completion', xpReward: 1000 },
  { id: 'forest_complete',  name: "Nature's Keeper",     description: 'Complete the Forest biome',               icon: '🌲', category: 'exploration', xpReward: 300 },
  { id: 'desert_complete',  name: 'Sand Wanderer',       description: 'Complete the Desert biome',               icon: '🌵', category: 'exploration', xpReward: 300 },
  { id: 'cyber_complete',   name: 'Digital Native',      description: 'Complete the Cyber City biome',           icon: '🤖', category: 'exploration', xpReward: 300 },
  { id: 'all_biomes',       name: 'World Traveler',      description: 'Complete all 5 biomes',                   icon: '🌍', category: 'exploration', xpReward: 2000 },
  { id: 'mood_tracker',     name: 'Self Aware',          description: 'Track mood 30 times',                     icon: '🧠', category: 'completion', xpReward: 150 },
  { id: 'night_owl',        name: 'Night Owl',           description: 'Complete a habit after midnight',         icon: '🦉', category: 'special',    xpReward: 100 },
  { id: 'early_bird',       name: 'Early Bird',          description: 'Complete a habit before 7am',             icon: '🐦', category: 'special',    xpReward: 100 },
]
