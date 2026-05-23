'use client'

import { useRef } from 'react'
import { LazyMotion, domAnimation, m, useInView } from 'framer-motion'

const STEPS = [
  {
    step: '01',
    icon: '✨',
    title: 'Define Your Identity',
    desc: 'Start with "I am someone who..." — the most powerful sentence in habit formation. Your identity drives behavior, not just willpower.',
    color: '#bf5fff',
  },
  {
    step: '02',
    icon: '📅',
    title: 'Create Your Habits',
    desc: 'Choose from suggested habits or create your own. Set difficulty, frequency, and category. Each habit earns daily XP based on challenge level.',
    color: '#00c8ff',
  },
  {
    step: '03',
    icon: '⚡',
    title: 'Log & Earn XP',
    desc: 'Check off habits each day. Instant visual feedback with particle bursts, floating XP numbers, and streak counters that grow with you.',
    color: '#39ff14',
  },
  {
    step: '04',
    icon: '🏰',
    title: 'Unlock Your World',
    desc: 'Accumulate XP to unlock new biomes on your world map. From Starter Forest to Lava Dungeon — your world expands as you grow.',
    color: '#ff6b2b',
  },
  {
    step: '05',
    icon: '🤝',
    title: 'Join an Accountability Party',
    desc: 'Invite friends to your party. Share wins in realtime chat, compete on group streaks, and keep each other on track.',
    color: '#ff0080',
  },
]

export function HowItWorks() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true })

  return (
    <LazyMotion features={domAnimation}>
      <section className="py-24 px-4" style={{ background: 'rgba(191,95,255,0.03)' }}>
        <div className="max-w-4xl mx-auto">
          <m.div
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-['Press_Start_2P'] text-[var(--color-neon-blue)] opacity-70 uppercase tracking-widest">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
              Your Quest Begins in{' '}
              <span className="text-[var(--color-neon-blue)]">5 Steps</span>
            </h2>
          </m.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 hidden sm:block"
              style={{ background: 'linear-gradient(180deg, var(--color-neon-purple), var(--color-neon-blue), var(--color-neon-green), #ff6b2b, #ff0080)' }}
            />

            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <StepItem key={step.step} step={step} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  )
}

function StepItem({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex gap-6 items-start relative"
    >
      {/* Step circle */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0 z-10 relative"
        style={{
          background: `${step.color}20`,
          border: `2px solid ${step.color}`,
          boxShadow: `0 0 16px ${step.color}40`,
          color: step.color,
        }}
      >
        {step.icon}
      </div>

      <div className="flex-1 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-['Press_Start_2P'] opacity-40" style={{ color: step.color }}>
            {step.step}
          </span>
          <h3 className="text-lg font-bold text-white">{step.title}</h3>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
      </div>
    </m.div>
  )
}
