import Link from 'next/link'

// Va dentro del <main> del layout raíz (con navbar y footer), por eso es un <div>
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--paper)',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(5rem, 20vw, 10rem)',
          fontWeight: 300,
          color: 'var(--sage)',
          lineHeight: 1,
          margin: 0,
          letterSpacing: '-0.02em',
        }}
      >
        404
      </p>

      <h1
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
          fontWeight: 500,
          color: 'var(--slate-900)',
          margin: '1rem 0 0.5rem',
        }}
      >
        Página no encontrada
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '1rem',
          color: 'var(--ink-muted)',
          maxWidth: '360px',
          lineHeight: 1.6,
          margin: '0 0 2rem',
        }}
      >
        La dirección que buscás no existe o fue movida.
      </p>

      <Link
        href="/"
        className="btn btn--primary"
        style={{ textDecoration: 'none' }}
      >
        Volver al inicio
      </Link>
    </div>
  )
}
