'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/actions'

export async function createParty(name: string, description: string, icon: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: party, error } = await supabase
    .from('parties')
    .insert({ name, description, icon, owner_id: user.id })
    .select()
    .single()

  if (error) return { error: error.message }

  // Auto-join as owner
  await supabase.from('party_members').insert({
    party_id: party.id,
    user_id: user.id,
    role: 'owner',
  })

  revalidatePath('/parties')
  return { data: party }
}

export async function joinParty(inviteCode: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: party, error: findError } = await supabase
    .from('parties')
    .select('id, max_members')
    .eq('invite_code', inviteCode.toUpperCase())
    .single()

  if (findError || !party) return { error: 'Party not found. Check your invite code.' }

  const { count } = await supabase
    .from('party_members')
    .select('*', { count: 'exact', head: true })
    .eq('party_id', party.id)

  if ((count ?? 0) >= party.max_members) return { error: 'Party is full.' }

  const { error } = await supabase
    .from('party_members')
    .insert({ party_id: party.id, user_id: user.id, role: 'member' })

  if (error) return { error: 'Already a member or join failed.' }

  revalidatePath('/parties')
  return { data: { partyId: party.id } }
}

export async function sendMessage(partyId: string, content: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .insert({ party_id: partyId, user_id: user.id, content })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function leaveParty(partyId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  const { error } = await supabase
    .from('party_members')
    .delete()
    .eq('party_id', partyId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/parties')
  return { success: true }
}
