'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useAdmin } from '@/hooks/useAdmin'

export default function AdminBar() {
  const { isAdmin, loading } = useAdmin()

  useEffect(() => {
    if (!loading && isAdmin) {
      document.body.style.paddingBottom = '44px'
    }
    return () => {
      document.body.style.paddingBottom = ''
    }
  }, [isAdmin, loading])

  if (loading || !isAdmin) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 44, zIndex: 100,
      background: 'var(--slate-900)',
      borderTop: '1px solid rgba(255,255,255,.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 20, fontSize: 13, fontWeight: 500,
    }}>
      <span style={{ color: '#9FB2AB', letterSpacing: '.01em' }}>Modo administrador</span>
      <span style={{ color: 'rgba(255,255,255,.25)' }}>·</span>
      <Link href="/admin" style={{ color: '#C6E0D6', fontWeight: 700 }}>Panel</Link>
      <span style={{ color: 'rgba(255,255,255,.25)' }}>·</span>
      <a href="/api/auth/logout" style={{ color: '#C6E0D6', fontWeight: 700 }}>Cerrar sesión</a>
    </div>
  )
}
