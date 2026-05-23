import type { Metadata } from 'next'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeatureSection } from '@/components/landing/FeatureSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { SocialProof } from '@/components/landing/SocialProof'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'HabitQuest — Level Up Your Life',
  description:
    'Build habits, earn XP, unlock worlds, and hold each other accountable. The habit-building platform for people who love games.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-deep)' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,1,24,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">⚔️</span>
          <span className="font-['Press_Start_2P'] text-xs text-white hidden sm:block">HabitQuest</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/auth/login"
            className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
            Log In
          </Link>
          <Link href="/auth/signup"
            className="pixel-button text-sm font-semibold text-white px-4 py-1.5 rounded"
            style={{
              background: 'var(--color-neon-purple)',
              boxShadow: '0 4px 0 0 #7b2fbe',
            }}>
            Start Free
          </Link>
        </div>
      </nav>

      {/* Page sections */}
      <main>
        <HeroSection />
        <div id="features">
          <FeatureSection />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <SocialProof />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}
