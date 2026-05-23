import { createClient } from '@/lib/supabase/server'

export async function getUserParties(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('party_members')
    .select(`
      role,
      joined_at,
      parties (
        id, name, description, invite_code, icon, color,
        owner_id, is_public, created_at
      )
    `)
    .eq('user_id', userId)
    .order('joined_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getPartyWithMembers(partyId: string) {
  const supabase = await createClient()
  const [partyRes, membersRes] = await Promise.all([
    supabase.from('parties').select('*').eq('id', partyId).single(),
    supabase.from('party_members').select(`
      role, joined_at, last_seen_at,
      profiles (id, username, display_name, xp, level, avatar_skin_tone)
    `).eq('party_id', partyId),
  ])
  return {
    party: partyRes.data,
    members: membersRes.data ?? [],
  }
}

export async function getPartyMessages(partyId: string, limit = 50) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id, content, message_type, metadata, created_at, is_deleted,
      profiles (id, username, display_name, avatar_skin_tone)
    `)
    .eq('party_id', partyId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []).reverse()
}
