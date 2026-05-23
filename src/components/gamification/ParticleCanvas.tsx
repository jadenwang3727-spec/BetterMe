'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  life: number
  maxLife: number
  size: number
}

interface ParticleCanvasProps {
  trigger: boolean
  originX: number
  originY: number
  color?: string
  onComplete?: () => void
}

export function ParticleCanvas({ trigger, originX, originY, color = '#bf5fff', onComplete }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (!trigger || hasTriggered.current) return
    hasTriggered.current = true

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = [color, '#ffd700', '#ff2d92', '#39ff14', '#00d4ff']
    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: originX,
      y: originY,
      vx: (Math.random() - 0.5) * 12,
      vy: -(Math.random() * 8 + 4),
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      maxLife: 0.6 + Math.random() * 0.8,
      size: 4 + Math.random() * 4,
    }))

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      let alive = false

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.4 // gravity
        p.life -= 0.02

        if (p.life > 0) {
          alive = true
          ctx!.globalAlpha = p.life
          ctx!.fillStyle = p.color
          ctx!.fillRect(
            Math.round(p.x - p.size / 2),
            Math.round(p.y - p.size / 2),
            Math.round(p.size),
            Math.round(p.size)
          )
        }
      }

      ctx!.globalAlpha = 1
      if (alive) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
        onComplete?.()
      }
    }

    animate()
    return () => cancelAnimationFrame(rafRef.current)
  }, [trigger, originX, originY, color, onComplete])

  if (!trigger) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99] pixel-art"
      aria-hidden="true"
    />
  )
}
