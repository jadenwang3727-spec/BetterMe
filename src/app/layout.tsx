import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | HabitQuest',
    default: 'HabitQuest — Level Up Your Life Together',
  },
  description:
    'Build habits with friends. Stay accountable. Never lose momentum. The habit tracker that feels like an RPG.',
  keywords: ['habits', 'accountability', 'gamification', 'social', 'productivity', 'streak'],
  authors: [{ name: 'HabitQuest' }],
  openGraph: {
    title: 'HabitQuest — Level Up Your Life Together',
    description: 'Build habits with friends. Stay accountable. Never lose momentum.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HabitQuest — Level Up Your Life Together',
    description: 'Build habits with friends. Stay accountable. Never lose momentum.',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="bg-[var(--color-bg-deep)] text-slate-200 font-[var(--font-body)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
