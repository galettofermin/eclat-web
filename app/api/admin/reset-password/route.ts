import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/auth/checkAdmin'
import { enviarResetPassword } from '@/lib/email'

export const dynamic = 'force-dynamic'

const SITE = 'https://eclatcentro.com'

// POST { email }: genera un link de recuperación y se lo manda al alumno.
// No usa resetPasswordForEmail: ese link (PKCE) solo se puede abrir en el navegador
// que lo pidió, y acá lo pide el admin, no el alumno.
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { email } = await req.json().catch(() => ({}))
  if (typeof email !== 'string' || !email.trim()) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

  const { data, error } = await createAdminClient().auth.admin.generateLink({ type: 'recovery', email: email.trim() })
  if (error || !data.properties?.hashed_token) {
    return NextResponse.json({ error: error?.message ?? 'No se pudo generar el link.' }, { status: 500 })
  }

  const link = `${SITE}/auth/recuperar?token_hash=${encodeURIComponent(data.properties.hashed_token)}&type=recovery`

  // Si el mail falla, se le devuelve el link al admin para que lo mande por otro medio
  try {
    const { error: mailError } = await enviarResetPassword({ email: email.trim(), link })
    if (mailError) throw mailError
  } catch (e) {
    console.error('Mail de reset de contraseña:', e)
    return NextResponse.json({ ok: false, link }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
