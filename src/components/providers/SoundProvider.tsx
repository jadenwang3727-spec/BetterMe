'use client'

import { createContext, useContext, useState, useCallback, useRef } from 'react'

type SoundName = 'complete' | 'levelup' | 'click' | 'achievement'

interface SoundContextValue {
  soundEnabled: boolean
  toggleSound: () => void
  play: (sound: SoundName) => void
}

const SoundContext = createContext<SoundContextValue>({
  soundEnabled: true,
  toggleSound: () => {},
  play: () => {},
})

const SOUND_URLS: Record<SoundName, string> = {
  complete:    '/audio/complete.mp3',
  levelup:     '/audio/levelup.mp3',
  click:       '/audio/click.mp3',
  achievement: '/audio/levelup.mp3',
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioCache = useRef<Map<SoundName, HTMLAudioElement>>(new Map())

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev)
  }, [])

  const play = useCallback((sound: SoundName) => {
    if (!soundEnabled || typeof window === 'undefined') return
    try {
      let audio = audioCache.current.get(sound)
      if (!audio) {
        audio = new Audio(SOUND_URLS[sound])
        audio.volume = 0.4
        audioCache.current.set(sound, audio)
      }
      audio.currentTime = 0
      audio.play().catch(() => {})
    } catch {
      // Audio not available
    }
  }, [soundEnabled])

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, play }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  return useContext(SoundContext)
}
