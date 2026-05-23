'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { LazyMotion, domAnimation, m, useInView } from 'framer-motion'
import { PixelButton } from '@/components/ui/PixelButton'

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <LazyMotion features={domAnimation}>
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #bf5fff, transparent 70%)' }}
          />
        </div>

        {/* Pixel decorations */}
        <div className="absolute top-12 left-8 text-4xl opacity-20 animate-float-cloud"
          style={{ animationDuration: '8s' }}>⚔️</div>
        <div className="absolute bottom-12 right-8 text-4xl opacity-20 animate-float-cloud"
          style={{ animationDuration: '6s', animationDelay: '2s' }}>🏆</div>
        <div className="absolute top-1/2 left-12 text-2xl opacity-15 animate-float-cloud"
          style={{ animationDuration: '10s', animationDelay: '1s' }}>✨</div>
        <div className="absolute top-1/3 right-16 text-2xl opacity-15 animate-float-cloud"
          style={{ animationDuration: '7s', animationDelay: '3s' }}>🔮</div>

        <m.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <m.div
            initial={{ scale: 0.5, rotate: -5 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: 'spring', duration: 0.7, delay: 0.1 }}
            className="text-6xl mb-6"
          >
            🎮
          </m.div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Your adventure{' '}
            <span style={{
              color: '#bf5fff',
              textShadow: '0 0 30px rgba(191,95,255,0.6)'
            }}>
              starts now
            </span>
          </h2>

          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of adventurers who turned their daily habits into legendary quests.
            Free forever. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/auth/signup">
              <PixelButton size="lg" variant="primary">
                Create Free Account →
              </PixelButton>
            </Link>
            <Link href="/auth/login">
              <PixelButton size="lg" variant="secondary">
                I Already Have an Account
              </PixelButton>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            {['✓ Free forever', '✓ No ads', '✓ No credit card', '✓ Open source friendly'].map(item => (
              <span key={item} className="text-slate-400">{item}</span>
            ))}
          </div>
        </m.div>
      </section>
    </LazyMotion>
  )
}
