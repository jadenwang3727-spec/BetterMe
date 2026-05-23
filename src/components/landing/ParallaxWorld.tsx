'use client'

import { useEffect, useRef } from 'react'
import { WalkingSprite } from './WalkingSprite'

interface Cloud {
  x: number
  y: number
  w: number
  speed: number
}

export function ParallaxWorld() {
  const containerRef = useRef<HTMLDivElement>(null)
  const layer2Ref = useRef<HTMLDivElement>(null)
  const layer3Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY
      if (layer2Ref.current) layer2Ref.current.style.transform = `translateY(${y * 0.3}px)`
      if (layer3Ref.current) layer3Ref.current.style.transform = `translateY(${y * 0.15}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Sky */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #0a0118 0%, #1a0533 40%, #0d1f3c 70%, #0a1628 100%)' }}
      />

      {/* Stars */}
      <div className="absolute inset-0">
        {STARS.map((s, i) => (
          <div key={i} className="absolute rounded-full animate-pulse"
            style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.size, height: s.size,
              background: 'white',
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}
      </div>

      {/* Distant mountains — layer 2 */}
      <div ref={layer2Ref} className="absolute bottom-0 left-0 right-0 will-change-transform">
        <svg viewBox="0 0 1200 300" className="w-full" preserveAspectRatio="none" style={{ display: 'block' }}>
          {/* Far mountains */}
          <polygon points="0,300 100,120 200,180 320,80 440,160 560,60 680,140 800,100 920,170 1040,90 1160,150 1200,300"
            fill="#1a0a36" opacity="0.9" />
          {/* Mid mountains */}
          <polygon points="0,300 80,200 180,140 280,210 380,130 480,200 580,110 700,190 820,120 940,200 1060,130 1200,180 1200,300"
            fill="#250d47" opacity="0.95" />
          {/* Neon mountain tops */}
          <line x1="320" y1="80" x2="320" y2="100" stroke="#bf5fff" strokeWidth="1" opacity="0.4" />
          <line x1="560" y1="60" x2="560" y2="85" stroke="#00c8ff" strokeWidth="1" opacity="0.4" />
          <line x1="800" y1="100" x2="800" y2="120" stroke="#39ff14" strokeWidth="1" opacity="0.3" />
        </svg>
      </div>

      {/* Pixel clouds */}
      <div className="absolute top-0 left-0 right-0 h-48">
        {CLOUDS.map((c, i) => (
          <div key={i} className="absolute animate-float-cloud"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              animationDelay: `${i * 2.3}s`,
              animationDuration: `${20 + c.speed * 10}s`,
            }}>
            <PixelCloud width={c.w} />
          </div>
        ))}
      </div>

      {/* Foreground city silhouette — layer 3 */}
      <div ref={layer3Ref} className="absolute bottom-0 left-0 right-0 will-change-transform">
        <svg viewBox="0 0 1200 200" className="w-full" preserveAspectRatio="none" style={{ display: 'block' }}>
          {/* Buildings */}
          {BUILDINGS.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={200 - b.h} width={b.w} height={b.h} fill="#0d0820" />
              {/* Windows */}
              {Array.from({ length: Math.floor(b.h / 20) }, (_, r) =>
                Array.from({ length: Math.floor(b.w / 12) }, (_, c) => (
                  <rect key={`${r}-${c}`}
                    x={b.x + 4 + c * 12} y={200 - b.h + 8 + r * 20}
                    width={4} height={6}
                    fill={Math.random() > 0.4 ? b.winColor : '#0d0820'}
                    opacity={0.8}
                  />
                ))
              )}
              {/* Antenna */}
              {b.antenna && (
                <>
                  <rect x={b.x + b.w / 2 - 1} y={200 - b.h - 15} width={2} height={15} fill="#1a0a36" />
                  <circle cx={b.x + b.w / 2} cy={200 - b.h - 15} r={2} fill="#ff0080" opacity={0.9} />
                </>
              )}
            </g>
          ))}
          {/* Ground */}
          <rect x={0} y={190} width={1200} height={10} fill="#0a0118" />
          {/* Neon ground line */}
          <line x1="0" y1="190" x2="1200" y2="190" stroke="#bf5fff" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>

      {/* Walking sprite on the ground */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end" style={{ height: 52 }}>
        <WalkingSprite size={40} color="#bf5fff" className="w-full" />
      </div>
    </div>
  )
}

function PixelCloud({ width }: { width: number }) {
  const h = Math.round(width * 0.4)
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={{ imageRendering: 'pixelated' }}>
      <rect x={width * 0.25} y={h * 0.4} width={width * 0.5} height={h * 0.6} fill="white" opacity="0.08" />
      <rect x={width * 0.1} y={h * 0.6} width={width * 0.8} height={h * 0.4} fill="white" opacity="0.06" />
      <rect x={width * 0.3} y={h * 0.1} width={width * 0.4} height={h * 0.5} fill="white" opacity="0.07" />
    </svg>
  )
}

const STARS = Array.from({ length: 80 }, (_, i) => ({
  x: (i * 137.508) % 100,
  y: (i * 97.3) % 60,
  size: i % 3 === 0 ? 2 : 1,
  opacity: 0.3 + (i % 5) * 0.14,
  delay: (i * 0.37) % 4,
  dur: 2 + (i % 3),
}))

const CLOUDS: Cloud[] = [
  { x: 5, y: 5, w: 80, speed: 0.5 },
  { x: 20, y: 12, w: 60, speed: 0.3 },
  { x: 45, y: 3, w: 100, speed: 0.7 },
  { x: 65, y: 8, w: 70, speed: 0.4 },
  { x: 80, y: 15, w: 50, speed: 0.6 },
]

const BUILDINGS = [
  { x: 0, y: 0, w: 60, h: 120, winColor: '#00c8ff', antenna: true },
  { x: 70, y: 0, w: 40, h: 80, winColor: '#bf5fff', antenna: false },
  { x: 120, y: 0, w: 80, h: 150, winColor: '#39ff14', antenna: true },
  { x: 210, y: 0, w: 50, h: 90, winColor: '#00c8ff', antenna: false },
  { x: 270, y: 0, w: 100, h: 170, winColor: '#bf5fff', antenna: true },
  { x: 380, y: 0, w: 45, h: 100, winColor: '#ffd700', antenna: false },
  { x: 435, y: 0, w: 70, h: 130, winColor: '#39ff14', antenna: true },
  { x: 515, y: 0, w: 55, h: 95, winColor: '#00c8ff', antenna: false },
  { x: 580, y: 0, w: 90, h: 160, winColor: '#bf5fff', antenna: true },
  { x: 680, y: 0, w: 40, h: 75, winColor: '#ffd700', antenna: false },
  { x: 730, y: 0, w: 65, h: 140, winColor: '#39ff14', antenna: true },
  { x: 805, y: 0, w: 50, h: 85, winColor: '#00c8ff', antenna: false },
  { x: 865, y: 0, w: 85, h: 155, winColor: '#bf5fff', antenna: true },
  { x: 960, y: 0, w: 45, h: 100, winColor: '#ffd700', antenna: false },
  { x: 1015, y: 0, w: 70, h: 120, winColor: '#39ff14', antenna: true },
  { x: 1095, y: 0, w: 55, h: 90, winColor: '#00c8ff', antenna: false },
  { x: 1155, y: 0, w: 45, h: 110, winColor: '#bf5fff', antenna: true },
]
