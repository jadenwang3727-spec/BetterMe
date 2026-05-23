'use client'

import { useRef } from 'react'
import { LazyMotion, domAnimation, m, useInView } from 'framer-motion'

const TESTIMONIALS = [
  {
    name: 'Alex K.',
    handle: '@axquest',
    avatar: '🧙',
    level: 24,
    text: 'I tried every habit app. HabitQuest is the only one where I actually look forward to logging. Hitting level 20 after 3 months of consistent workouts was surreal.',
    streak: 67,
    color: '#bf5fff',
  },
  {
    name: 'Maya R.',
    handle: '@starshaper',
    avatar: '⚔️',
    level: 31,
    text: 'My accountability party has 4 of us from college. We haven\'t broken our shared streak in 2 months. The realtime chat when someone completes a habit is genuinely exciting.',
    streak: 58,
    color: '#00c8ff',
  },
  {
    name: 'Jordan T.',
    handle: '@pixelgrind',
    avatar: '🛡️',
    level: 17,
    text: 'As someone with ADHD the gamification loop is exactly what I need. The XP floating up when I complete something scratches that same itch as video games.',
    streak: 34,
    color: '#39ff14',
  },
  {
    name: 'Sam P.',
    handle: '@habithero',
    avatar: '🔮',
    level: 42,
    text: 'The world map progression is genius. Unlocking the Cyber City biome after hitting 3000 XP made me feel like I actually accomplished something real.',
    streak: 112,
    color: '#ffd700',
  },
  {
    name: 'Riley M.',
    handle: '@questlord',
    avatar: '🎯',
    level: 19,
    text: 'Built 5 habits in 90 days. The grace day system is what kept me going — I didn\'t quit when I missed a day because my streak survived. Game changer.',
    streak: 41,
    color: '#ff6b2b',
  },
  {
    name: 'Casey W.',
    handle: '@lvlup_daily',
    avatar: '✨',
    level: 28,
    text: 'The identity-based onboarding ("I am someone who...") shifted how I think about habits. It\'s not what I do, it\'s who I\'m becoming. Deep stuff in a pixel game.',
    streak: 89,
    color: '#ff0080',
  },
]

const STATS = [
  { value: '10,000+', label: 'Active Adventurers', icon: '👥' },
  { value: '500K+', label: 'Habits Completed', icon: '✅' },
  { value: '4.9★', label: 'Average Rating', icon: '⭐' },
  { value: '90 days', label: 'Avg. Streak Record', icon: '🔥' },
]

export function SocialProof() {
  const titleRef = useRef<HTMLDivElement>(null)
  const inView = useInView(titleRef, { once: true })

  return (
    <LazyMotion features={domAnimation}>
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          <m.div
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          >
            {STATS.map((stat, i) => (
              <m.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center p-6 rounded-lg border"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </m.div>
            ))}
          </m.div>

          {/* Section header */}
          <div className="text-center mb-12">
            <span className="text-xs font-['Press_Start_2P'] text-[var(--color-neon-green)] opacity-70 uppercase tracking-widest">
              Testimonials
            </span>
            <h2 className="text-3xl font-bold text-white mt-3">
              From the{' '}
              <span className="text-[var(--color-neon-green)]">Adventurer</span> Community
            </h2>
          </div>

          {/* Testimonials grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.handle} testimonial={t} index={i} />
            ))}
          </div>
        </div>
      </section>
    </LazyMotion>
  )
}

function TestimonialCard({
  testimonial: t,
  index,
}: {
  testimonial: typeof TESTIMONIALS[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="pixel-card rounded-lg border p-5 flex flex-col gap-3"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
          style={{ background: `${t.color}20`, border: `2px solid ${t.color}60` }}
        >
          {t.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{t.name}</span>
            <span className="text-xs px-1.5 py-0.5 rounded text-[10px] font-['Press_Start_2P']"
              style={{ background: `${t.color}20`, color: t.color }}>
              Lv.{t.level}
            </span>
          </div>
          <div className="text-xs text-slate-500">{t.handle}</div>
        </div>
        <div className="text-xs text-[var(--color-neon-orange)] font-semibold">
          🔥 {t.streak}d
        </div>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
    </m.div>
  )
}
