'use client'

import { useEffect, useRef } from 'react'

/* Fondo abstracto animado — inspirado en gradientes holográficos aurora.
   Usa Canvas 2D con blobs de color que se mueven lentamente.
   Paleta ÉCLAT: verdes institucionales, blancos cálidos, sin azul ni morado. */

export default function HeroBg({ opacity = 0.55 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrame: number
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    // Blobs con colores ÉCLAT
    const blobs = [
      { x: 0.15, y: 0.25, r: 0.38, color: '#2F7D6B', alpha: 0.22, speed: 0.00018, ox: 0.08, oy: 0.12 },
      { x: 0.75, y: 0.15, r: 0.42, color: '#4a9b88', alpha: 0.16, speed: 0.00014, ox: -0.1, oy: 0.08 },
      { x: 0.55, y: 0.7,  r: 0.36, color: '#DCEFE8', alpha: 0.35, speed: 0.00022, ox: 0.12, oy: -0.1 },
      { x: 0.85, y: 0.65, r: 0.30, color: '#b8ddd0', alpha: 0.28, speed: 0.00016, ox: -0.08, oy: 0.14 },
      { x: 0.3,  y: 0.8,  r: 0.28, color: '#a0c8b8', alpha: 0.20, speed: 0.00020, ox: 0.14, oy: -0.08 },
      { x: 0.6,  y: 0.35, r: 0.25, color: '#e8f4f0', alpha: 0.30, speed: 0.00012, ox: -0.12, oy: 0.1 },
      { x: 0.1,  y: 0.6,  r: 0.22, color: '#f0f7f4', alpha: 0.25, speed: 0.00024, ox: 0.1, oy: 0.12 },
    ]

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      // Fondo base cálido
      ctx.fillStyle = '#FAFAF8'
      ctx.fillRect(0, 0, w, h)

      blobs.forEach((blob) => {
        time
        const cx = (blob.x + Math.sin(time * blob.speed * 1000 + blob.ox * 10) * blob.ox) * w
        const cy = (blob.y + Math.cos(time * blob.speed * 1000 + blob.oy * 10) * blob.oy) * h
        const r = blob.r * Math.max(w, h) * (1 + Math.sin(time * blob.speed * 500) * 0.08)

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        // Parsear el color hex a rgba
        const hex = blob.color.replace('#', '')
        const ri = parseInt(hex.substring(0, 2), 16)
        const gi = parseInt(hex.substring(2, 4), 16)
        const bi = parseInt(hex.substring(4, 6), 16)
        grad.addColorStop(0, `rgba(${ri},${gi},${bi},${blob.alpha})`)
        grad.addColorStop(0.5, `rgba(${ri},${gi},${bi},${blob.alpha * 0.5})`)
        grad.addColorStop(1, `rgba(${ri},${gi},${bi},0)`)

        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      })

      time++
      animFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity, mixBlendMode: 'normal' }}
    />
  )
}
