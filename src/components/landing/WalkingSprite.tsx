'use client'

import { useEffect, useRef } from 'react'

interface WalkingSpriteProps {
  className?: string
  size?: number
  color?: string
}

export function WalkingSprite({ className = '', size = 32, color = '#bf5fff' }: WalkingSpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const xRef = useRef(0)
  const dirRef = useRef(1)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const px = size / 16
    let lastTime = 0
    const FRAME_MS = 150

    function drawSprite(x: number, frame: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.imageSmoothingEnabled = false

      const bodyColor = color
      const skinColor = '#ffd4a3'
      const shadowColor = 'rgba(0,0,0,0.3)'
      const eyeColor = '#1a0533'
      const shoeColor = '#2a1a4a'

      // Shadow
      ctx.fillStyle = shadowColor
      ctx.beginPath()
      ctx.ellipse(x + 8 * px, 15 * px, 5 * px, 2 * px, 0, 0, Math.PI * 2)
      ctx.fill()

      const legOffset = Math.sin(frame * Math.PI / 2) * px * 1.5

      // Legs
      ctx.fillStyle = shoeColor
      ctx.fillRect(x + 5 * px, 11 * px + legOffset, 2 * px, 3 * px)
      ctx.fillRect(x + 9 * px, 11 * px - legOffset, 2 * px, 3 * px)

      // Body
      ctx.fillStyle = bodyColor
      ctx.fillRect(x + 4 * px, 5 * px, 8 * px, 7 * px)

      // Arms
      const armOffset = Math.sin(frame * Math.PI / 2) * px
      ctx.fillRect(x + 2 * px, 6 * px - armOffset, 2 * px, 4 * px)
      ctx.fillRect(x + 12 * px, 6 * px + armOffset, 2 * px, 4 * px)

      // Head
      ctx.fillStyle = skinColor
      ctx.fillRect(x + 4 * px, 0, 8 * px, 6 * px)

      // Eyes
      ctx.fillStyle = eyeColor
      ctx.fillRect(x + 5 * px, 2 * px, px, px)
      ctx.fillRect(x + 10 * px, 2 * px, px, px)

      // Hair
      ctx.fillStyle = '#3a1a6a'
      ctx.fillRect(x + 4 * px, 0, 8 * px, px)
      ctx.fillRect(x + 3 * px, px, px, 2 * px)
    }

    const c = canvas
    const g = ctx

    function loop(time: number) {
      if (time - lastTime > FRAME_MS) {
        frameRef.current = (frameRef.current + 1) % 4
        lastTime = time
      }

      xRef.current += dirRef.current * 1.5
      if (xRef.current > c.width - 16 * px) dirRef.current = -1
      if (xRef.current < 0) dirRef.current = 1

      g.save()
      if (dirRef.current === -1) {
        g.translate(c.width, 0)
        g.scale(-1, 1)
        drawSprite(c.width - xRef.current - 16 * px, frameRef.current)
      } else {
        drawSprite(xRef.current, frameRef.current)
      }
      g.restore()

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [size, color])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={size}
      className={`pixel-art ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
