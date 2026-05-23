import Link from 'next/link'

const LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Roadmap', href: '#' },
  ],
  Community: [
    { label: 'Parties', href: '/parties' },
    { label: 'Leaderboard', href: '#' },
    { label: 'Discord', href: '#' },
  ],
  Account: [
    { label: 'Sign Up', href: '/auth/signup' },
    { label: 'Log In', href: '/auth/login' },
    { label: 'Settings', href: '/settings' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t py-12 px-4" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <span className="text-xl">⚔️</span>
              <span className="font-['Press_Start_2P'] text-sm text-white">HabitQuest</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Level up your life, one habit at a time. Built for the generation that grew up gaming.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {group}
              </h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} HabitQuest. Built with ⚔️ for adventurers.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span className="animate-streak-pulse inline-block">🔥</span>
            <span>Keep your streak alive</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
