import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
import { createAdminClient } from '@/lib/supabase/admin'
import { enviarNotificacionMensaje } from '@/lib/email'
import { DIRECTOR_EMAIL } from '@/lib/constants'

// GET /api/mensajes — lista de conversaciones del usuario actual
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()

  // Todos los mensajes donde participa el usuario
  const { data: msgs } = await admin
    .from('mensajes')
    .select('*')
    .or(`de.eq.${user.id},para.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (!msgs?.length) return NextResponse.json({ conversaciones: [] })

  // Agrupar por interlocutor
  const map = new Map<string, {
    otroId: string
    ultimoMensaje: string
    ultimaFecha: string
    noLeidos: number
  }>()

  for (const m of msgs) {
    const otroId = m.de === user.id ? m.para : m.de
    if (!map.has(otroId)) {
      map.set(otroId, {
        otroId,
        ultimoMensaje: m.contenido,
        ultimaFecha: m.created_at,
        noLeidos: (!m.leido && m.para === user.id) ? 1 : 0,
      })
    } else {
      const entry = map.get(otroId)!
      if (!m.leido && m.para === user.id) entry.noLeidos++
    }
  }

  // Enriquecer con datos del interlocutor (nombre / email)
  const conversaciones = await Promise.all(
    Array.from(map.values()).map(async (conv) => {
      let nombre = 'Usuario'
      let email = ''
      try {
        const { data: { user: otroUser } } = await admin.auth.admin.getUserById(conv.otroId)
        email = otroUser?.email ?? ''
        nombre = otroUser?.user_metadata?.full_name ?? email.split('@')[0] ?? 'Usuario'
      } catch {}
      return { ...conv, nombre, email }
    })
  )

  return NextResponse.json({ conversaciones })
}

// POST /api/mensajes — enviar nuevo mensaje
export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { para, contenido } = await req.json()
  if (!para || !contenido?.trim()) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Insertar mensaje
  const { data: mensaje, error } = await admin
    .from('mensajes')
    .insert({
      de: user.id,
      para,
      contenido: contenido.trim(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Enviar notificación por email al destinatario (no bloquea)
  try {
    const { data: { user: destinatario } } = await admin.auth.admin.getUserById(para)
    const emailDestinatario = destinatario?.email
    if (emailDestinatario) {
      const nombreRemitente =
        user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'ÉCLAT'
      const nombreDestinatario =
        destinatario.user_metadata?.full_name ?? emailDestinatario.split('@')[0] ?? 'Usuario'
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eclatcentro.com'

      await enviarNotificacionMensaje({
        email: emailDestinatario,
        nombreDestinatario,
        nombreRemitente,
        preview: contenido.trim().slice(0, 120),
        urlBandeja: `${siteUrl}/mensajes/${user.id}`,
      })
    }
  } catch (err) {
    console.error('Email notificación mensaje error:', err)
  }

  return NextResponse.json({ mensaje })
}
