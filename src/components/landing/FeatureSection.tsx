'use client'

import { useRef } from 'react'
import { LazyMotion, domAnimation, m, useInView } from 'framer-motion'

const FEATURES = [
  {
    icon: '🔥',
    title: 'Streak System',
    desc: 'Build unstoppable momentum. Grace days prevent streak loss from life happening — because life does happen.',
    color: '#ff6b2b',
    glow: 'rgba(255,107,43,0.3)',
  },
  {
    icon: '⚔️',
    title: 'Accountability Parties',
    desc: 'Form guilds with friends. Realtime chat, shared streak goals, and group XP bonuses keep everyone accountable.',
    color: '#bf5fff',
    glow: 'rgba(191,95,255,0.3)',
  },
  {
    icon: '🗺️',
    title: 'World Map Progression',
    desc: 'Unlock 5 epic biomes as you gain XP — Forest, Desert, Cyber City, Snowy Mountains, and Lava Dungeon.',
    color: '#39ff14',
    glow: 'rgba(57,255,20,0.3)',
  },
  {
    icon: '📊',
    title: 'Deep Analytics',
    desc: 'Visualize your consistency heatmap, mood correlations, best performing days, and category breakdowns.',
    color: '#00c8ff',
    glow: 'rgba(0,200,255,0.3)',
  },
  {
    icon: '🏆',
    title: 'Achievements',
    desc: '20+ unlockable achievements from First Step to Legendary status. Secret achievements await the dedicated.',
    color: '#ffd700',
    glow: 'rgba(255,215,0,0.3)',
  },
  {
    icon: '🎮',
    title: 'Daily Quests',
    desc: 'Fresh challenges every day. Complete bonus quests to earn extra XP and cosmetic rewards for your profile.',
    color: '#ff0080',
    glow: 'rgba(255,0,128,0.3)',
  },
]

function FeatureCard({
  feature,
  index,
}: {
  feature: typeof FEATURES[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="pixel-card rounded-lg border p-6 flex flex-col gap-3 cursor-default"
      style={{
        borderColor: 'var(--color-border)',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 24px ${feature.glow}`
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
        style={{ background: `${feature.color}20`, border: `2px solid ${feature.color}40` }}
      >
        {feature.icon}
      </div>
      <h3 className="font-bold text-white text-lg">{feature.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
    </m.div>
  )
}

export function FeatureSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true })

  return (
    <LazyMotion features={domAnimation}>
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <m.div
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-['Press_Start_2P'] text-[var(--color-neon-purple)] opacity-70 uppercase tracking-widest">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
              Everything You Need to{' '}
              <span className="text-[var(--color-neon-purple)]">Level Up</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Built on behavioral psychology principles with the engagement loop of your favorite RPG.
              Because habits should feel like quests, not chores.
            </p>
          </m.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>
    </LazyMotion>
  )
}
