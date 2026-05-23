import Link from 'next/link'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-deep)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Pixel grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-neon-purple) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-neon-purple) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Floating pixel particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-none opacity-30"
            style={{
              background: ['#39ff14', '#00d4ff', '#bf5fff', '#ffe000', '#ff2d92', '#ff7c2a'][i],
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `pixel-bounce ${1.5 + i * 0.3}s steps(2) infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="pixel-font text-2xl text-[var(--color-neon-purple)] mb-2"
              style={{ textShadow: '0 0 20px var(--color-neon-purple)' }}>
              HabitQuest
            </div>
          </Link>
          <h1 className="text-xl font-bold text-white mt-4">{title}</h1>
          {subtitle && <p className="text-slate-400 mt-1 text-sm">{subtitle}</p>}
        </div>

        {/* Card */}
        <div className="pixel-card rounded-lg p-6 border border-[var(--color-border-bright)]"
          style={{ boxShadow: '0 0 40px rgba(191,95,255,0.1)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
