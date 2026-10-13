import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata: Metadata = {
  title: 'Desuscripción',
  robots: { index: false },
}

export const dynamic = 'force-dynamic'

export default async function DesuscribirsePage({
  searchParams,
}: {
  searchParams: { id?: string; ok?: string }
}) {
  // Si viene con ?id= lo procesamos acá también (por si llega directo sin pasar por la API)
  if (searchParams.id && !searchParams.ok) {
    await createAdminClient()
      .from('suscriptores')
      .update({ activo: false })
      .eq('id', searchParams.id)
      .catch(() => {})
  }

  const confirmado = !!searchParams.ok || !!searchParams.id

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5', display: 'flex', flexDirection: 'column' }}>

      {/* Header ÉCLAT */}
      <header style={{ backgroundColor: '#1B2B26', padding: '24px 40px', textAlign: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <p style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: '600', margin: '0', letterSpacing: '-0.5px', fontFamily: 'Georgia, serif' }}>ÉCLAT</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', margin: '4px 0 0', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
            Centro de Atención Integral · Oncativo
          </p>
        </Link>
      </header>

      {/* Contenido */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

          {confirmado ? (
            <>
              {/* Ícono */}
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                backgroundColor: '#DCEFE8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 28px',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h1 style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(24px, 4vw, 32px)',
                fontWeight: 500, color: '#1B2B26',
                lineHeight: 1.2, margin: '0 0 16px',
              }}>
                Te desuscribiste correctamente
              </h1>

              <p style={{ fontSize: 16, color: '#4B6B5E', lineHeight: 1.7, margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
                Ya no recibirás más mails de nuestra parte.
              </p>
              <p style={{ fontSize: 15, color: '#6B8C83', lineHeight: 1.7, margin: '0 0 40px', fontFamily: 'Georgia, serif' }}>
                Si fue un error o en algún momento querés volver a suscribirte,
                podés escribirnos.
              </p>
            </>
          ) : (
            <>
              <h1 style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(24px, 4vw, 32px)',
                fontWeight: 500, color: '#1B2B26',
                lineHeight: 1.2, margin: '0 0 16px',
              }}>
                Desuscripción
              </h1>
              <p style={{ fontSize: 16, color: '#4B6B5E', lineHeight: 1.7, margin: '0 0 40px', fontFamily: 'Georgia, serif' }}>
                Usá el link del pie de página de cualquier mail que hayas recibido para desuscribirte.
              </p>
            </>
          )}

          {/* Separador */}
          <div style={{ borderTop: '1px solid #E0E7E4', margin: '0 0 40px' }} />

          {/* Info de contacto */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: '28px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 13, color: '#9CA8A3', fontFamily: 'sans-serif', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Contacto
            </p>
            <p style={{ fontSize: 15, color: '#1B2B26', fontFamily: 'Georgia, serif', lineHeight: 1.7, margin: '0 0 20px' }}>
              ÉCLAT Centro de Atención Integral<br />
              Oncativo, Córdoba, Argentina
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="https://wa.link/vyi5uv"
                style={{
                  backgroundColor: '#2F7D6B', color: '#FFFFFF',
                  padding: '10px 24px', borderRadius: 999,
                  fontWeight: 600, fontSize: 14,
                  textDecoration: 'none', fontFamily: 'sans-serif',
                  display: 'inline-block',
                }}
              >
                WhatsApp
              </Link>
              <Link
                href="/"
                style={{
                  backgroundColor: 'transparent', color: '#2F7D6B',
                  padding: '10px 24px', borderRadius: 999,
                  fontWeight: 500, fontSize: 14,
                  textDecoration: 'none', fontFamily: 'sans-serif',
                  display: 'inline-block',
                  border: '1.5px solid #2F7D6B',
                }}
              >
                Volver al inicio
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1B2B26', padding: '20px 40px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0, fontFamily: 'sans-serif' }}>
          © {new Date().getFullYear()} ÉCLAT Centro de Atención Integral
        </p>
      </footer>

    </div>
  )
}
