import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { findUserByEmail } from '@/lib/auth/findUsersByEmail'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { courseId, userEmail } = await req.json()
    if (!courseId) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Usuario al que se le habilita el curso: el de la sesión o, si recién creó la cuenta
    // desde el modal (sin sesión hasta confirmar el mail), el que tiene ese mail
    const { data: { user: sessionUser } } = await createClient().auth.getUser()
    const user = sessionUser
      ?? (typeof userEmail === 'string' && userEmail.trim() ? await findUserByEmail(supabase, userEmail) : undefined)
    if (!user) {
      return NextResponse.json({ error: 'No encontramos una cuenta con ese mail. Creá tu cuenta desde Registrarse y volvé a intentar.' }, { status: 400 })
    }
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

    const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'Token de MP no configurado en el servidor' }, { status: 500 })
    }

    const mp = new MercadoPagoConfig({ accessToken: token })
    const preference = new Preference(mp)
    const siteUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://eclatcentro.com'

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
          success: `${siteUrl}/gracias?curso=${courseId}`,
          failure: `${siteUrl}/cursos/${courseId}?pago=error`,
          pending: `${siteUrl}/cursos/${courseId}?pago=pendiente`,
        },
        auto_return: 'approved',
        notification_url: `${siteUrl}/api/mp/webhook`,
        metadata: {
          user_id: user.id,
          course_id: courseId,
          user_email: user.email ?? '',
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
