'use client'

import { useEffect, useRef, useCallback } from 'react'
import { BIOMES, getBiomeByXP, type PathNode } from '@/lib/constants/biomes'

interface WorldMapCanvasProps {
  userXP: number
  width: number
  height: number
}

function drawBiomeBackground(
  ctx: CanvasRenderingContext2D,
  biomeId: string,
  x: number,
  y: number,
  w: number,
  h: number,
  unlocked: boolean,
  current: boolean
) {
  const BIOME_COLORS: Record<string, [string, string]> = {
    forest: ['#0d2b14', '#1a4a20'],
    desert: ['#3d2a0a', '#6b4a15'],
    cyber:  ['#001020', '#002040'],
    snow:   ['#1a2530', '#2a3a50'],
    lava:   ['#200500', '#400a00'],
  }
  const [dark, light] = BIOME_COLORS[biomeId] ?? ['#111', '#222']
  const grad = ctx.createLinearGradient(x, y, x, y + h)
  grad.addColorStop(0, unlocked ? dark : '#0a0a0a')
  grad.addColorStop(1, unlocked ? light : '#111')
  ctx.fillStyle = grad
  ctx.fillRect(x, y, w, h)

  if (!unlocked) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(x, y, w, h)
    // Lock icon
    ctx.fillStyle = '#333'
    ctx.font = `${Math.min(w, h) * 0.3}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🔒', x + w / 2, y + h / 2)
    return
  }

  if (current) {
    ctx.strokeStyle = 'rgba(191,95,255,0.6)'
    ctx.lineWidth = 2
    ctx.setLineDash([4, 4])
    ctx.strokeRect(x + 1, y + 1, w - 2, h - 2)
    ctx.setLineDash([])
  }
}

function drawPath(
  ctx: CanvasRenderingContext2D,
  nodes: PathNode[],
  cw: number,
  ch: number,
  progress: number,
  color: string
) {
  if (nodes.length < 2) return

  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 3
  ctx.setLineDash([6, 6])
  ctx.beginPath()
  ctx.moveTo(nodes[0].x * cw, nodes[0].y * ch)
  for (let i = 1; i < nodes.length; i++) {
    ctx.lineTo(nodes[i].x * cw, nodes[i].y * ch)
  }
  ctx.stroke()

  // Filled progress path
  const segments = nodes.length - 1
  const completedSegments = Math.floor(progress * segments)
  if (completedSegments > 0) {
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.setLineDash([])
    ctx.shadowBlur = 6
    ctx.shadowColor = color
    ctx.beginPath()
    ctx.moveTo(nodes[0].x * cw, nodes[0].y * ch)
    for (let i = 1; i <= completedSegments; i++) {
      ctx.lineTo(nodes[i].x * cw, nodes[i].y * ch)
    }
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  ctx.restore()

  // Draw stepping stones
  for (const node of nodes) {
    const nx = node.x * cw
    const ny = node.y * ch
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.beginPath()
    ctx.arc(nx, ny, 5, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawSprite(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, tick: number) {
  const frame = Math.floor(tick / 8) % 4
  const bob = Math.sin(tick * 0.2) * 2

  ctx.save()
  // Body
  ctx.fillStyle = color
  ctx.fillRect(Math.round(x - 4), Math.round(y - 12 + bob), 8, 10)
  // Head
  ctx.fillStyle = '#F5CBA7'
  ctx.fillRect(Math.round(x - 3), Math.round(y - 18 + bob), 6, 6)
  // Eyes
  ctx.fillStyle = '#000'
  ctx.fillRect(Math.round(x - 2 + (frame % 2 === 0 ? 0 : 0)), Math.round(y - 16 + bob), 1, 1)
  ctx.fillRect(Math.round(x + 1), Math.round(y - 16 + bob), 1, 1)
  // Legs
  ctx.fillStyle = '#4a3728'
  const legOffset = frame < 2 ? 1 : -1
  ctx.fillRect(Math.round(x - 3), Math.round(y - 2 + bob), 3, 4)
  ctx.fillRect(Math.round(x + legOffset), Math.round(y - 2 + bob), 3, 4)
  // Glow
  ctx.shadowBlur = 10
  ctx.shadowColor = color
  ctx.fillStyle = 'transparent'
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.strokeRect(Math.round(x - 5), Math.round(y - 19 + bob), 10, 18)
  ctx.shadowBlur = 0
  ctx.restore()
}

export function WorldMapCanvas({ userXP, width, height }: WorldMapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tickRef = useRef(0)
  const rafRef = useRef<number>(0)

  const currentBiome = getBiomeByXP(userXP)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    tickRef.current++
    const tick = tickRef.current

    ctx.clearRect(0, 0, width, height)

    // Draw each biome
    for (const biome of BIOMES) {
      const bx = biome.bounds.x * width
      const by = biome.bounds.y * height
      const bw = biome.bounds.w * width
      const bh = biome.bounds.h * height

      const unlocked = userXP >= biome.xpThreshold
      const isCurrent = biome.id === currentBiome.id

      drawBiomeBackground(ctx, biome.id, bx, by, bw, bh, unlocked, isCurrent)

      if (unlocked) {
        // Biome label
        ctx.fillStyle = isCurrent ? biome.accentColor : 'rgba(255,255,255,0.5)'
        ctx.font = `bold ${Math.min(bw * 0.1, 12)}px monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillText(biome.name, bx + bw / 2, by + 8)

        // Draw path
        const biomeProgress = Math.min(1, Math.max(0, (userXP - biome.xpThreshold) / (biome.completionXP - biome.xpThreshold)))
        drawPath(ctx, biome.path, width, height, biomeProgress, biome.accentColor)
      }
    }

    // Draw player sprite at current position
    const pathNodes = currentBiome.path
    const biomeProgress = Math.min(1, (userXP - currentBiome.xpThreshold) / (currentBiome.completionXP - currentBiome.xpThreshold))
    const nodeIndex = Math.min(pathNodes.length - 1, Math.floor(biomeProgress * (pathNodes.length - 1)))
    const spriteNode = pathNodes[nodeIndex] ?? pathNodes[0]

    if (spriteNode) {
      drawSprite(ctx, spriteNode.x * width, spriteNode.y * height, currentBiome.accentColor, tick)
    }

    rafRef.current = requestAnimationFrame(render)
  }, [userXP, width, height, currentBiome])

  useEffect(() => {
    render()
    return () => cancelAnimationFrame(rafRef.current)
  }, [render])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="pixel-art rounded-lg w-full"
      style={{ imageRendering: 'pixelated' }}
      aria-label="World map showing your habit journey progress"
    />
  )
}
