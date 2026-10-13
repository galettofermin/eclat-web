import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'

export const metadata = { title: 'Admin — Centro ÉCLAT' }

// Layout propio del admin: sin sidebar ni navbar/footer públicos (los oculta HideOnAdmin en el layout raíz).
// El acceso lo protege el middleware.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F7' }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px, 4vw, 32px)', height: '60px',
        borderBottom: '1px solid var(--line)', background: 'white', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="ÉCLAT" style={{ width: '32px', height: '32px' }} />
          <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>Panel admin</span>
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/" target="_blank" rel="noopener" style={{ fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'none' }}>Ver sitio ↗</a>
          <a href="/api/auth/logout" style={{ fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'none' }}>Cerrar sesión</a>
        </div>
      </header>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px clamp(16px, 4vw, 32px) 64px' }}>
        <AdminNav />
        {children}
      </div>
    </div>
  )
}
