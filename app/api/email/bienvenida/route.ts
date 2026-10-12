import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { findUserByEmail } from '@/lib/auth/findUsersByEmail'
import { enviarBienvenida } from '@/lib/email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  try {
    const { email, nombre } = await req.json()
    if (typeof email !== 'string' || !EMAIL_RE.test(email)) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

    // Solo se manda a cuentas que existen: evita usar el endpoint para mandar mails a cualquiera.
    // Se responde ok igual para no revelar si el mail tiene cuenta.
    if (!(await findUserByEmail(createAdminClient(), email))) return NextResponse.json({ ok: true })

    await enviarBienvenida({ email, nombre: nombre || email.split('@')[0] })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Bienvenida email error:', error)
    return NextResponse.json({ ok: true }) // No bloqueamos el registro si falla el email
  }
}
