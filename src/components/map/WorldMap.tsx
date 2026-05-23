'use client'

import { useState, useEffect, useRef } from 'react'
import { WorldMapCanvas } from './WorldMapCanvas'
import { BIOMES, getBiomeByXP, getBiomeProgress } from '@/lib/constants/biomes'
import { cn } from '@/lib/utils/cn'

interface WorldMapProps {
  userXP: number
}

export function WorldMap({ userXP }: WorldMapProps) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 300 })
  const [selectedBiome, setSelectedBiome] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function update() {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth
        setDimensions({ width: w, height: Math.round(w * 0.35) })
      }
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const currentBiome = getBiomeByXP(userXP)

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="relative">
        <WorldMapCanvas userXP={userXP} width={dimensions.width} height={dimensions.height} />

        {/* Biome click overlays */}
        <div className="absolute inset-0 flex">
          {BIOMES.map(biome => {
            const unlocked = userXP >= biome.xpThreshold
            const progress = getBiomeProgress(biome, userXP)
            return (
              <button
                key={biome.id}
                className="flex-1 relative group"
                onClick={() => setSelectedBiome(biome.id === selectedBiome ? null : biome.id)}
                disabled={!unlocked}
                aria-label={biome.name}
              >
                {unlocked && (
                  <div className={cn(
                    'absolute inset-0 border-2 border-transparent transition-all duration-200 rounded',
                    'group-hover:bg-white/5',
                    biome.id === selectedBiome && 'border-white/30 bg-white/10'
                  )} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Biome details */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {BIOMES.map(biome => {
          const unlocked = userXP >= biome.xpThreshold
          const progress = getBiomeProgress(biome, userXP)
          const isCurrent = biome.id === currentBiome.id

          return (
            <button
              key={biome.id}
              onClick={() => setSelectedBiome(biome.id === selectedBiome ? null : biome.id)}
              className={cn(
                'p-3 rounded-lg border text-left transition-all duration-200',
                unlocked
                  ? 'border-[var(--color-border)] hover:border-[var(--color-border-bright)] cursor-pointer'
                  : 'border-[var(--color-border)] opacity-50 cursor-not-allowed',
                isCurrent && 'border-[var(--color-neon-purple)]',
                biome.id === selectedBiome && 'bg-[var(--color-bg-hover)]'
              )}
              disabled={!unlocked}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-lg">{biome.emoji}</span>
                {isCurrent && (
                  <span
                    className="text-[8px] px-1 py-0.5 rounded font-bold uppercase"
                    style={{ background: biome.accentColor + '30', color: biome.accentColor }}
                  >
                    Current
                  </span>
                )}
                {!unlocked && <span className="text-xs">🔒</span>}
              </div>
              <p className={cn('font-semibold text-xs', unlocked ? 'text-white' : 'text-slate-500')}>
                {biome.name}
              </p>
              {unlocked && (
                <div className="mt-1.5 h-1 rounded-full bg-[var(--color-bg-hover)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, background: biome.accentColor }}
                  />
                </div>
              )}
              {!unlocked && (
                <p className="text-[10px] text-slate-600 mt-1">
                  {biome.xpThreshold.toLocaleString()} XP
                </p>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected biome detail */}
      {selectedBiome && (
        <div
          className="p-4 rounded-lg border border-[var(--color-border-bright)] bg-[var(--color-bg-hover)]"
        >
          {(() => {
            const biome = BIOMES.find(b => b.id === selectedBiome)!
            const progress = getBiomeProgress(biome, userXP)
            return (
              <div className="flex items-start gap-3">
                <span className="text-3xl">{biome.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{biome.name}</h3>
                  <p className="text-slate-400 text-sm mt-0.5">{biome.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <span>Progress: <span className="text-white font-bold">{Math.round(progress)}%</span></span>
                    <span>•</span>
                    <span>Unlocks at: {biome.xpThreshold.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
