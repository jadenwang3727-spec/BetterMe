export interface PathNode {
  x: number // 0-1 relative position
  y: number // 0-1 relative position
}

export interface Biome {
  id: string
  name: string
  description: string
  xpThreshold: number
  completionXP: number
  color: string
  bgClass: string
  accentColor: string
  icon: string
  emoji: string
  path: PathNode[]
  bounds: { x: number; y: number; w: number; h: number }
}

export const BIOMES: Biome[] = [
  {
    id: 'forest',
    name: 'Whispering Forest',
    description: 'A peaceful woodland where every habit planted grows into a mighty tree.',
    xpThreshold: 0,
    completionXP: 1000,
    color: '#2d7a3e',
    bgClass: 'biome-forest',
    accentColor: '#39ff14',
    icon: '🌲',
    emoji: '🌲',
    bounds: { x: 0, y: 0.1, w: 0.2, h: 0.8 },
    path: [
      { x: 0.02, y: 0.5 }, { x: 0.06, y: 0.45 }, { x: 0.10, y: 0.5 },
      { x: 0.14, y: 0.55 }, { x: 0.18, y: 0.48 }, { x: 0.22, y: 0.5 },
    ],
  },
  {
    id: 'desert',
    name: 'Scorching Sands',
    description: 'Only the disciplined can survive the relentless heat of the desert.',
    xpThreshold: 1000,
    completionXP: 3000,
    color: '#c8853a',
    bgClass: 'biome-desert',
    accentColor: '#ffe000',
    icon: '🌵',
    emoji: '🌵',
    bounds: { x: 0.2, y: 0.1, w: 0.2, h: 0.8 },
    path: [
      { x: 0.22, y: 0.5 }, { x: 0.26, y: 0.55 }, { x: 0.30, y: 0.48 },
      { x: 0.34, y: 0.52 }, { x: 0.38, y: 0.45 }, { x: 0.42, y: 0.5 },
    ],
  },
  {
    id: 'cyber',
    name: 'Neon City',
    description: 'A digital metropolis where habits power the city grid.',
    xpThreshold: 3000,
    completionXP: 7500,
    color: '#00d4ff',
    bgClass: 'biome-cyber',
    accentColor: '#00d4ff',
    icon: '🤖',
    emoji: '🤖',
    bounds: { x: 0.4, y: 0.1, w: 0.2, h: 0.8 },
    path: [
      { x: 0.42, y: 0.5 }, { x: 0.46, y: 0.44 }, { x: 0.50, y: 0.5 },
      { x: 0.54, y: 0.56 }, { x: 0.58, y: 0.50 }, { x: 0.62, y: 0.48 },
    ],
  },
  {
    id: 'snow',
    name: 'Frozen Peaks',
    description: 'Where mental fortitude is forged in the biting cold of the mountains.',
    xpThreshold: 7500,
    completionXP: 15000,
    color: '#a8d8f0',
    bgClass: 'biome-snow',
    accentColor: '#ffffff',
    icon: '🏔️',
    emoji: '🏔️',
    bounds: { x: 0.6, y: 0.1, w: 0.2, h: 0.8 },
    path: [
      { x: 0.62, y: 0.48 }, { x: 0.66, y: 0.42 }, { x: 0.70, y: 0.38 },
      { x: 0.74, y: 0.44 }, { x: 0.78, y: 0.50 }, { x: 0.82, y: 0.48 },
    ],
  },
  {
    id: 'lava',
    name: 'Inferno Dungeon',
    description: 'The ultimate test. Legendary habit builders conquer the eternal flame.',
    xpThreshold: 15000,
    completionXP: 30000,
    color: '#ff4500',
    bgClass: 'biome-lava',
    accentColor: '#ff7c2a',
    icon: '🌋',
    emoji: '🌋',
    bounds: { x: 0.8, y: 0.1, w: 0.2, h: 0.8 },
    path: [
      { x: 0.82, y: 0.48 }, { x: 0.86, y: 0.52 }, { x: 0.88, y: 0.48 },
      { x: 0.90, y: 0.44 }, { x: 0.94, y: 0.50 }, { x: 0.98, y: 0.48 },
    ],
  },
]

export function getBiomeByXP(xp: number): Biome {
  const unlocked = BIOMES.filter(b => xp >= b.xpThreshold)
  return unlocked[unlocked.length - 1] ?? BIOMES[0]
}

export function getBiomeProgress(biome: Biome, xp: number): number {
  if (xp < biome.xpThreshold) return 0
  const xpInBiome = xp - biome.xpThreshold
  const xpNeeded = biome.completionXP - biome.xpThreshold
  return Math.min(100, (xpInBiome / xpNeeded) * 100)
}
