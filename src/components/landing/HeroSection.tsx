'use client'

import Link from 'next/link'
import { ParallaxWorld } from './ParallaxWorld'
import { PixelButton } from '@/components/ui/PixelButton'
import { LazyMotion, domAnimation, m } from 'framer-motion'

export function HeroSection() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParallaxWorld />

        {/* Gradient overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a011880] to-[#0a0118]" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Logo pixel badge */}
          <m.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.7, bounce: 0.4 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-['Press_Start_2P'] border"
            style={{
              background: 'rgba(191,95,255,0.15)',
              borderColor: 'rgba(191,95,255,0.5)',
              color: '#bf5fff',
              boxShadow: '0 0 20px rgba(191,95,255,0.3)',
            }}
          >
            <span className="animate-pixel-bounce inline-block">⚔</span>
            <span>Level Up Your Life</span>
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4"
            style={{ textShadow: '0 0 40px rgba(191,95,255,0.5), 0 2px 4px rgba(0,0,0,0.8)' }}
          >
            Build Habits.{' '}
            <span style={{ color: '#bf5fff', textShadow: '0 0 30px rgba(191,95,255,0.8)' }}>
              Earn XP.
            </span>
            <br />
            <span style={{ color: '#00c8ff', textShadow: '0 0 30px rgba(0,200,255,0.8)' }}>
              Conquer
            </span>{' '}
            Together.
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Turn your daily habits into an epic RPG adventure. Track streaks, unlock biomes,
            join accountability parties, and watch your real-life character level up.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/auth/signup">
              <PixelButton size="lg" variant="primary">
                Start Your Quest →
              </PixelButton>
            </Link>
            <Link href="/auth/login">
              <PixelButton size="lg" variant="ghost">
                Continue Journey
              </PixelButton>
            </Link>
          </m.div>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-400"
          >
            {[
              { value: '10K+', label: 'Adventurers' },
              { value: '500K+', label: 'Habits Logged' },
              { value: '98%', label: 'Free Forever' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </m.div>
        </div>

        {/* Scroll indicator */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 text-xs"
        >
          <span>Scroll to explore</span>
          <m.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-lg"
          >↓</m.div>
        </m.div>
      </section>
    </LazyMotion>
  )
}
