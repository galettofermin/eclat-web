'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Inicio',
    shortLabel: 'Inicio',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  {
    href: '/admin/inscripciones',
    label: 'Inscripciones',
    shortLabel: 'Inscripc.',
    badge: 'pending',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    href: '/admin/comunidad',
    label: 'Comunidad',
    shortLabel: 'Comunidad',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/admin/escritos',
    label: 'Escritos',
    shortLabel: 'Escritos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    href: '/admin/formacion',
    label: 'Formación',
    shortLabel: 'Formac.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
]

// Items secundarios (footer del sidebar, no en tab bar mobile)
const NAV_SECONDARY = [
  {
    href: '/admin/configuracion',
    label: 'Configuración',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

// Items que se muestran en la tab bar mobile
const MOBILE_TAB_ITEMS = ['/admin', '/admin/inscripciones', '/admin/comunidad', '/admin/escritos', '/admin/formacion']

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { count } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
      setPendingCount(count ?? 0)
    }
    load()
    const interval = setInterval(load, 60_000)
    return () => clearInterval(interval)
  }, [])

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const getBadge = (item: typeof NAV_ITEMS[0]) => {
    if (item.badge === 'pending') return pendingCount
    return 0
  }

  const mobileTabs = NAV_ITEMS.filter(item => MOBILE_TAB_ITEMS.includes(item.href))

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F7', display: 'flex' }}>

      {/* ── Sidebar desktop ── */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '0.5px solid rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
        // Oculto en mobile — lo hacemos con media query en el style tag de abajo
      }} className="admin-sidebar">

        {/* Logo / brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '20px 16px 16px',
          borderBottom: '0.5px solid rgba(0,0,0,0.07)',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="ÉCLAT" style={{ width: 28, height: 28 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1d1d1f', letterSpacing: '-0.01em' }}>ÉCLAT</div>
            <div style={{ fontSize: 10, color: '#86868b', marginTop: 1 }}>Panel admin</div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href)
            const count = getBadge(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 8,
                  marginBottom: 2,
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 400,
                  color: active ? '#2F7D6B' : '#424245',
                  background: active ? 'rgba(47,125,107,0.10)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background 0.15s, color 0.15s',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)'
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                <span style={{
                  width: 18, height: 18, flexShrink: 0,
                  color: active ? '#2F7D6B' : '#86868b',
                }}>
                  {item.icon}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {count > 0 && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: item.badge === 'pending' ? '#ff3b30' : '#2F7D6B',
                    color: '#fff',
                    borderRadius: 999,
                    minWidth: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                  }}>
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer del sidebar */}
        <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.07)' }}>
          {/* Items secundarios */}
          <div style={{ padding: '8px 8px 0' }}>
            {NAV_SECONDARY.map(item => {
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 10px', borderRadius: 8, marginBottom: 2,
                  fontSize: 12.5, fontWeight: active ? 600 : 400,
                  color: active ? '#2F7D6B' : '#86868b',
                  background: active ? 'rgba(47,125,107,0.10)' : 'transparent',
                  textDecoration: 'none', transition: 'background 0.15s',
                }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)' }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <span style={{ width: 16, height: 16, flexShrink: 0, color: active ? '#2F7D6B' : '#a1a1a6' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
          <div style={{
            padding: '10px 16px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <a href="/" target="_blank" rel="noopener" style={{
              fontSize: 12, color: '#86868b', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15,3 21,3 21,9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Ver sitio
            </a>
            <a href="/api/auth/logout" style={{
              fontSize: 12, color: '#86868b', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Salir
            </a>
          </div>
        </div>
      </aside>

      {/* ── Contenido principal ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="admin-main">

        {/* Header mobile */}
        <header className="admin-mobile-header" style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          height: 52,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '0.5px solid rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="ÉCLAT" style={{ width: 24, height: 24 }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#1d1d1f' }}>Panel admin</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/" target="_blank" rel="noopener" style={{ fontSize: 12, color: '#86868b', textDecoration: 'none' }}>
              Ver sitio ↗
            </a>
            <a href="/api/auth/logout" style={{ fontSize: 12, color: '#86868b', textDecoration: 'none' }}>
              Salir
            </a>
          </div>
        </header>

        {/* Área scrollable */}
        <main style={{ flex: 1, padding: 'clamp(24px, 3vw, 40px) clamp(16px, 3vw, 40px)', paddingBottom: 80 }} className="admin-content">
          {children}
        </main>

        {/* ── Tab bar mobile ── */}
        <nav className="admin-tabbar" style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '0.5px solid rgba(0,0,0,0.12)',
          zIndex: 20,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          <div style={{ display: 'flex', alignItems: 'stretch', height: 56 }}>
            {mobileTabs.map(item => {
              const active = isActive(item.href)
              const count = getBadge(item)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    textDecoration: 'none',
                    color: active ? '#2F7D6B' : '#86868b',
                    position: 'relative',
                    fontSize: 9,
                    fontWeight: active ? 600 : 400,
                    letterSpacing: '0.01em',
                  }}
                >
                  <span style={{ width: 22, height: 22, display: 'block', position: 'relative' }}>
                    {item.icon}
                    {count > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: -3,
                        right: -5,
                        fontSize: 8,
                        fontWeight: 700,
                        background: item.badge === 'pending' ? '#ff3b30' : '#2F7D6B',
                        color: '#fff',
                        borderRadius: 999,
                        minWidth: 14,
                        height: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 3px',
                        border: '1.5px solid rgba(255,255,255,0.9)',
                      }}>
                        {count > 9 ? '9+' : count}
                      </span>
                    )}
                  </span>
                  <span>{item.shortLabel}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Media queries para mobile/desktop */}
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-mobile-header { display: flex !important; }
          .admin-tabbar { display: block !important; }
          .admin-main { margin-left: 0 !important; }
        }
        @media (min-width: 769px) {
          .admin-main { margin-left: 220px; }
        }
      `}</style>
    </div>
  )
}
