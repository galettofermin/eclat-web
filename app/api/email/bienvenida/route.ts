import { NextResponse } from 'next/server'
import { enviarBienvenida } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email, nombre } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

    await enviarBienvenida({ email, nombre: nombre || email.split('@')[0] })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Bienvenida email error:', error)
    return NextResponse.json({ ok: true }) // No bloqueamos el registro si falla el email
  }
}
