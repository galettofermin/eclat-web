import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const { courseId, userId, userEmail } = await req.json()
    if (!courseId || !userId) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: course } = await supabase
      .from('courses')
      .select('id, title, price')
      .eq('id', courseId)
      .single()

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 })
    }

    const mp = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! })
    const preference = new Preference(mp)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eclatcentro.com'

    const result = await preference.create({
      body: {
        items: [{
          id: courseId,
          title: course.title,
          quantity: 1,
          currency_id: 'ARS',
          unit_price: Number(course.price),
        }],
        back_urls: {
          success: `${siteUrl}/cursos/${courseId}?pago=ok`,
          failure: `${siteUrl}/inscripcion/${courseId}?pago=error`,
          pending: `${siteUrl}/cursos/${courseId}?pago=pendiente`,
        },
        auto_return: 'approved',
        notification_url: `${siteUrl}/api/mp/webhook`,
        metadata: {
          user_id: userId,
          course_id: courseId,
          user_email: userEmail ?? '',
        },
      },
    })

    return NextResponse.json({ init_point: result.init_point })
  } catch (error) {
    console.error('MP preference error:', error)
    return NextResponse.json({ error: 'Error al crear preferencia' }, { status: 500 })
  }
}
