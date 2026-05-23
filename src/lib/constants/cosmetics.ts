import type { CosmeticType } from '@/lib/supabase/types'

export interface CosmeticItem {
  id: string
  name: string
  description: string
  type: CosmeticType
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpCost: number | null
  emoji: string
  color: string
}

export const COSMETICS: CosmeticItem[] = [
  { id: 'hat-crown',    name: 'Pixel Crown',     description: 'For the reigning habit champion',        type: 'hat',        rarity: 'legendary', xpCost: null,  emoji: '👑', color: '#FFD700' },
  { id: 'hat-wizard',   name: 'Wizard Hat',      description: 'Cast spells of productivity',           type: 'hat',        rarity: 'rare',      xpCost: 500,   emoji: '🧙', color: '#7C4DFF' },
  { id: 'hat-pirate',   name: 'Pirate Cap',      description: 'Sail the seas of self-improvement',     type: 'hat',        rarity: 'common',    xpCost: 200,   emoji: '🏴‍☠️', color: '#4A4A4A' },
  { id: 'hat-santa',    name: 'Santa Hat',        description: 'A seasonal classic',                    type: 'hat',        rarity: 'rare',      xpCost: null,  emoji: '🎅', color: '#FF0000' },
  { id: 'cape-fire',    name: 'Fire Cape',        description: 'Blaze through your habits',             type: 'cape',       rarity: 'epic',      xpCost: 1000,  emoji: '🔥', color: '#FF6B35' },
  { id: 'cape-ice',     name: 'Frost Mantle',     description: 'Cool, calm, consistent',                type: 'cape',       rarity: 'epic',      xpCost: 1000,  emoji: '❄️', color: '#00D4FF' },
  { id: 'cape-rainbow', name: 'Rainbow Trail',    description: 'Leave a colorful mark on every habit',  type: 'cape',       rarity: 'legendary', xpCost: null,  emoji: '🌈', color: '#FF2D92' },
  { id: 'pet-slime',    name: 'Green Slime',      description: 'A bouncy companion for your journey',   type: 'pet',        rarity: 'common',    xpCost: 150,   emoji: '🟢', color: '#39FF14' },
  { id: 'pet-dragon',   name: 'Baby Dragon',      description: 'The mightiest of habit companions',     type: 'pet',        rarity: 'legendary', xpCost: null,  emoji: '🐲', color: '#FF4500' },
  { id: 'pet-cat',      name: 'Pixel Cat',        description: 'A purrfect productivity partner',       type: 'pet',        rarity: 'rare',      xpCost: 400,   emoji: '🐱', color: '#FFA500' },
  { id: 'bg-forest',    name: 'Forest Clearing',  description: 'A peaceful woodland background',        type: 'background', rarity: 'common',    xpCost: 0,     emoji: '🌲', color: '#2D7A3E' },
  { id: 'bg-cyber',     name: 'Neon Grid',        description: 'Future vibes background',               type: 'background', rarity: 'rare',      xpCost: 600,   emoji: '🤖', color: '#00D4FF' },
  { id: 'frame-gold',   name: 'Gold Frame',       description: 'Premium avatar border',                 type: 'frame',      rarity: 'epic',      xpCost: 800,   emoji: '🏆', color: '#FFD700' },
]

export const RARITY_COLORS = {
  common:    '#9E9E9E',
  rare:      '#2196F3',
  epic:      '#9C27B0',
  legendary: '#FFD700',
}
