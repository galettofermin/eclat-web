import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { courseId, userId, userEmail } = await req.json()
    if (!courseId || !userId) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, price, is_free')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Curso no encontrado', detail: courseError?.message }, { status: 404 })
    }

    const price = Number(course.price)
    if (!price || price <= 0) {
      return NextResponse.json({ error: 'El curso no tiene precio configurado', price }, { status: 400 })
    }

    const token = process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'Token de MP no configurado en el servidor' }, { status: 500 })
    }

    const mp = new MercadoPagoConfig({ accessToken: token })
    const preference = new Preference(mp)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eclatcentro.com'

    const result = await preference.create({
      body: {
        items: [{
          id: courseId,
          title: course.title,
          quantity: 1,
          currency_id: 'ARS',
          unit_price: price,
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('MP preference error:', msg)
    return NextResponse.json({ error: 'Error MP', detail: msg }, { status: 500 })
  }
}
