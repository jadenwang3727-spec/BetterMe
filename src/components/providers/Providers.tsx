'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { AuthProvider } from './AuthProvider'
import { GameStateProvider } from './GameStateProvider'
import { SoundProvider } from './SoundProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GameStateProvider>
          <SoundProvider>{children}</SoundProvider>
        </GameStateProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
