import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: '¡Inscripción confirmada!',
  robots: { index: false },
}

export const dynamic = 'force-dynamic'

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: { curso?: string }
}) {
  let courseTitle: string | null = null

  if (searchParams.curso) {
    const supabase = createClient()
    const { data } = await supabase
      .from('courses')
      .select('title')
      .eq('id', searchParams.curso)
      .single()
    courseTitle = data?.title ?? null
  }

  return (
    <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <div style={{ maxWidth: 520, textAlign: 'center' }}>

        {/* Ícono de check */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: '#DCEFE8', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 28px',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: 'clamp(28px, 5vw, 38px)',
          fontWeight: 500,
          color: '#1d1d1f',
          lineHeight: 1.2,
          marginBottom: 16,
        }}>
          ¡Tu inscripción está confirmada!
        </h1>

        {courseTitle && (
          <p style={{
            fontSize: 16,
            color: '#2F7D6B',
            fontWeight: 600,
            marginBottom: 12,
            background: '#DCEFE8',
            padding: '10px 20px',
            borderRadius: 999,
            display: 'inline-block',
          }}>
            {courseTitle}
          </p>
        )}

        <p style={{ fontSize: 16, color: '#424245', lineHeight: 1.7, marginBottom: 8 }}>
          El pago fue procesado exitosamente. Te enviamos un mail con los detalles de tu acceso.
        </p>
        <p style={{ fontSize: 15, color: '#6e6e73', lineHeight: 1.7, marginBottom: 36 }}>
          Podés empezar a cursar ahora mismo desde tu cuenta.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href={searchParams.curso ? `/cursos/${searchParams.curso}` : '/mi-cuenta'}
            style={{
              background: '#2F7D6B', color: '#fff',
              padding: '12px 28px', borderRadius: 999,
              fontWeight: 600, fontSize: 15,
              textDecoration: 'none', display: 'inline-block',
            }}
          >
            Ir al curso →
          </Link>
          <Link
            href="/mi-cuenta"
            style={{
              background: 'transparent', color: '#2F7D6B',
              padding: '12px 28px', borderRadius: 999,
              fontWeight: 500, fontSize: 15,
              textDecoration: 'none', display: 'inline-block',
              border: '1.5px solid #2F7D6B',
            }}
          >
            Mi cuenta
          </Link>
        </div>

      </div>
    </section>
  )
}
