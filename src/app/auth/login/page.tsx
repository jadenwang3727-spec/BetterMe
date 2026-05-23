import type { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Log In',
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back, Hero"
      subtitle="Your streak is waiting for you."
    >
      <LoginForm />
    </AuthLayout>
  )
}
