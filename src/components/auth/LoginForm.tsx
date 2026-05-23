'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signInWithEmail } from '@/lib/auth/actions'
import { GoogleOAuthButton } from './GoogleOAuthButton'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    setServerError('')
    const data = new FormData()
    data.append('email', values.email)
    data.append('password', values.password)
    const result = await signInWithEmail(data)
    if (result?.error) setServerError(result.error)
  }

  return (
    <div className="space-y-4">
      <GoogleOAuthButton />

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--color-border)]" />
        <span className="text-xs text-slate-500 uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-[var(--color-border)]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="hero@habitquest.gg"
            className="w-full px-3 py-2.5 bg-[var(--color-bg-hover)] border border-[var(--color-border)]
              rounded text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-neon-purple)]
              focus:ring-1 focus:ring-[var(--color-neon-purple)] transition-colors text-sm"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-slate-300">Password</label>
          </div>
          <input
            {...register('password')}
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2.5 bg-[var(--color-bg-hover)] border border-[var(--color-border)]
              rounded text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-neon-purple)]
              focus:ring-1 focus:ring-[var(--color-neon-purple)] transition-colors text-sm"
          />
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {serverError && (
          <div className="p-3 bg-red-900/30 border border-red-700 rounded text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="pixel-button w-full py-3 bg-[var(--color-neon-purple)] text-white
            font-bold text-sm rounded uppercase tracking-wide hover:brightness-110 transition-all
            disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in...' : 'Start Quest →'}
        </button>
      </form>

      <p className="text-center text-slate-400 text-sm">
        New adventurer?{' '}
        <Link href="/auth/signup" className="text-[var(--color-neon-purple)] hover:underline">
          Create account
        </Link>
      </p>
    </div>
  )
}
