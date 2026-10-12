import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
import { enviarAccesoCurso } from '@/lib/email'

// MP test usa GET para verificar que el endpoint responde
export async function GET() {
  return NextResponse.json({ ok: true })
}

export async function POST(req: Request) {
  try {
    // Soporte para formato IPN (topic/id en query) y Webhooks (body.type/data.id)
    const url = new URL(req.url)
    const topic = url.searchParams.get('topic')
    const qId  = url.searchParams.get('id')

    let paymentId: string | number | null = null

    if (topic === 'payment' && qId) {
      // Formato IPN clásico
      paymentId = qId
    } else {
      const body = await req.json().catch(() => ({}))
      if (body.type !== 'payment') return NextResponse.json({ ok: true })
      paymentId = body.data?.id ?? null
    }

    if (!paymentId) return NextResponse.json({ ok: true })

    const mp = new MercadoPagoConfig({ accessToken: (process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN)! })
    const paymentClient = new Payment(mp)
    let payment
    try {
      payment = await paymentClient.get({ id: paymentId })
    } catch {
      // ID de prueba o pago no encontrado: igual responder 200
      return NextResponse.json({ ok: true })
    }

    if (payment.status === 'approved') {
      const userId = payment.metadata?.user_id
      const courseId = payment.metadata?.course_id
      const userEmail = payment.metadata?.user_email

      if (userId && courseId) {
        const supabase = createAdminClient()
        const { error: enrollError } = await supabase.from('enrollments').upsert(
          {
            user_id: userId,
            course_id: courseId,
            status: 'approved',
            payment_method: 'mercadopago',
            payment_id: String(payment.id),
            amount: payment.transaction_amount ?? 0,
            user_email: userEmail ?? '',
            approved_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,course_id' }
        )
        // Sin acceso guardado no se responde ok: así Mercado Pago reintenta la notificación
        if (enrollError) {
          console.error('MP webhook enrollment error:', enrollError)
          return NextResponse.json({ error: 'No se pudo guardar el acceso' }, { status: 500 })
        }

        // Enviar email de acceso si tenemos el email del usuario
        if (userEmail) {
          const { data: course } = await supabase
            .from('courses')
            .select('title')
            .eq('id', courseId)
            .single()

          const siteUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://eclatcentro.com'
          await enviarAccesoCurso({
            email: userEmail,
            nombre: userEmail.split('@')[0],
            tituloCurso: course?.title ?? 'tu curso',
            urlCurso: `${siteUrl}/cursos/${courseId}`,
          }).catch(err => console.error('Email acceso error:', err))
        }
      }
    }
  } catch (error) {
    console.error('MP webhook error:', error)
  }

  return NextResponse.json({ ok: true })
}
