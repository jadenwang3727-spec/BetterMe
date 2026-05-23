'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signUpWithEmail } from '@/lib/auth/actions'
import { GoogleOAuthButton } from './GoogleOAuthButton'

const schema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type FormValues = z.infer<typeof schema>

export function SignupForm() {
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    setServerError('')
    setSuccessMessage('')
    const data = new FormData()
    data.append('email', values.email)
    data.append('password', values.password)
    data.append('displayName', values.displayName)
    const result = await signUpWithEmail(data)
    if (result?.error) setServerError(result.error)
    if (result?.success) setSuccessMessage(result.success)
  }

  if (successMessage) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">📧</div>
        <h3 className="text-white font-bold text-lg">Check your email!</h3>
        <p className="text-slate-400 text-sm">{successMessage}</p>
        <Link href="/auth/login"
          className="block text-[var(--color-neon-purple)] hover:underline text-sm">
          Back to login
        </Link>
      </div>
    )
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
          <label className="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
          <input
            {...register('displayName')}
            type="text"
            placeholder="Your hero name"
            className="w-full px-3 py-2.5 bg-[var(--color-bg-hover)] border border-[var(--color-border)]
              rounded text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-neon-purple)]
              focus:ring-1 focus:ring-[var(--color-neon-purple)] transition-colors text-sm"
          />
          {errors.displayName && <p className="text-red-400 text-xs mt-1">{errors.displayName.message}</p>}
        </div>

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
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input
            {...register('password')}
            type="password"
            placeholder="Min. 8 characters"
            className="w-full px-3 py-2.5 bg-[var(--color-bg-hover)] border border-[var(--color-border)]
              rounded text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-neon-purple)]
              focus:ring-1 focus:ring-[var(--color-neon-purple)] transition-colors text-sm"
          />
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2.5 bg-[var(--color-bg-hover)] border border-[var(--color-border)]
              rounded text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-neon-purple)]
              focus:ring-1 focus:ring-[var(--color-neon-purple)] transition-colors text-sm"
          />
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
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
          {isSubmitting ? 'Creating account...' : 'Begin Journey →'}
        </button>
      </form>

      <p className="text-center text-slate-400 text-sm">
        Already a hero?{' '}
        <Link href="/auth/login" className="text-[var(--color-neon-purple)] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
