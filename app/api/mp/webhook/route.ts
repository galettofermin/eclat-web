import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createAdminClient } from '@/lib/supabase/admin'
import { enviarAccesoCurso } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true })
    }

    const mp = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! })
    const paymentClient = new Payment(mp)
    const payment = await paymentClient.get({ id: body.data.id })

    if (payment.status === 'approved') {
      const userId = payment.metadata?.user_id
      const courseId = payment.metadata?.course_id
      const userEmail = payment.metadata?.user_email

      if (userId && courseId) {
        const supabase = createAdminClient()
        await supabase.from('enrollments').upsert(
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

        // Enviar email de acceso si tenemos el email del usuario
        if (userEmail) {
          const { data: course } = await supabase
            .from('courses')
            .select('title')
            .eq('id', courseId)
            .single()

          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eclatcentro.com'
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
