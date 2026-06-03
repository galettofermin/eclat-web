import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/mensajes/[userId] — obtener hilo de conversación
export async function GET(
  _req: Request,
  { params }: { params: { userId: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const otherId = params.userId

  // Mensajes entre ambos usuarios
  const { data: mensajes } = await admin
    .from('mensajes')
    .select('*')
    .or(
      `and(de.eq.${user.id},para.eq.${otherId}),and(de.eq.${otherId},para.eq.${user.id})`
    )
    .order('created_at', { ascending: true })

  // Marcar como leídos los mensajes recibidos
  await admin
    .from('mensajes')
    .update({ leido: true })
    .eq('para', user.id)
    .eq('de', otherId)
    .eq('leido', false)

  // Info del interlocutor
  let otroNombre = 'Usuario'
  let otroEmail = ''
  try {
    const { data: { user: otroUser } } = await admin.auth.admin.getUserById(otherId)
    otroEmail = otroUser?.email ?? ''
    otroNombre =
      otroUser?.user_metadata?.full_name ?? otroEmail.split('@')[0] ?? 'Usuario'
  } catch {}

  return NextResponse.json({
    mensajes: mensajes ?? [],
    otro: { id: otherId, nombre: otroNombre, email: otroEmail },
    yo: { id: user.id },
  })
}
