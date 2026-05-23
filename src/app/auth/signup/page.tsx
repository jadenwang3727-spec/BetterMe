import type { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default function SignupPage() {
  return (
    <AuthLayout
      title="Begin Your Quest"
      subtitle="Join thousands of adventurers leveling up their lives."
    >
      <SignupForm />
    </AuthLayout>
  )
}
