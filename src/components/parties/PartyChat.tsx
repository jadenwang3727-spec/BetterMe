'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendMessage } from '@/lib/parties/actions'
import { formatRelativeTime } from '@/lib/utils/format'
import { Send } from 'lucide-react'
import type { Database } from '@/lib/supabase/types'

interface Message {
  id: string
  content: string
  created_at: string
  profiles: {
    id: string
    username: string
    display_name: string
    avatar_skin_tone: string
  } | null
}

interface PartyChatProps {
  partyId: string
  currentUserId: string
  initialMessages: Message[]
}

const REACTION_EMOJIS = ['🔥', '💪', '⭐', '👑', '❤️', '⚡']

export function PartyChat({ partyId, currentUserId, initialMessages }: PartyChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const channel = supabase
      .channel(`party-chat-${partyId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `party_id=eq.${partyId}`,
      }, async (payload) => {
        const newMsg = payload.new as Database['public']['Tables']['messages']['Row']
        // Fetch profile for the new message
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_skin_tone')
          .eq('id', newMsg.user_id)
          .single()

        setMessages(prev => [...prev, {
          id: newMsg.id,
          content: newMsg.content,
          created_at: newMsg.created_at,
          profiles: profile,
        }])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [partyId, supabase])

  async function handleSend() {
    if (!input.trim() || sending) return
    setSending(true)
    await sendMessage(partyId, input.trim())
    setInput('')
    setSending(false)
  }

  return (
    <div className="flex flex-col h-80">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-8">
            No messages yet. Be the first to say something! 👋
          </p>
        )}
        {messages.map(msg => {
          const isOwn = msg.profiles?.id === currentUserId
          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
            >
              <div
                className="w-7 h-7 rounded shrink-0 flex items-center justify-center text-xs font-bold"
                style={{
                  background: msg.profiles?.avatar_skin_tone ?? '#F5CBA7',
                  color: '#000',
                  border: isOwn ? '1px solid var(--color-neon-purple)' : '1px solid var(--color-border)',
                }}
              >
                {msg.profiles?.display_name?.[0]?.toUpperCase()}
              </div>
              <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                {!isOwn && (
                  <span className="text-slate-500 text-xs px-1">{msg.profiles?.display_name}</span>
                )}
                <div
                  className={`px-3 py-2 rounded-lg text-sm ${
                    isOwn
                      ? 'bg-[var(--color-neon-purple)]/20 border border-[var(--color-neon-purple)]/30 text-white'
                      : 'bg-[var(--color-bg-hover)] border border-[var(--color-border)] text-slate-200'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-slate-600 text-[10px] px-1">
                  {formatRelativeTime(msg.created_at)}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Quick reactions */}
      <div className="px-3 py-1.5 flex gap-1 border-t border-[var(--color-border)]">
        {REACTION_EMOJIS.map(emoji => (
          <button
            key={emoji}
            onClick={() => {
              setInput(prev => prev + emoji)
            }}
            className="w-7 h-7 hover:bg-[var(--color-bg-hover)] rounded text-sm transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[var(--color-border)] flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder="Say something..."
          maxLength={1000}
          className="flex-1 px-3 py-2 bg-[var(--color-bg-hover)] border border-[var(--color-border)]
            rounded text-sm text-white placeholder-slate-500 focus:outline-none
            focus:border-[var(--color-neon-purple)] transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="px-3 py-2 bg-[var(--color-neon-purple)] text-white rounded
            hover:brightness-110 transition-all disabled:opacity-50 pixel-button"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
