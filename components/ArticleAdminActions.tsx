'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/hooks/useAdmin'
import { createClient } from '@/lib/supabase/client'
import type { Article } from '@/lib/types'
import ArticleForm from '@/components/admin/ArticleForm'

// Botones de admin para las tarjetas de /publicaciones (la página es Server Component).
// Solo se muestran si hay sesión de admin; al guardar o borrar se refresca la página del servidor.
export default function ArticleAdminActions({ id }: { id: string }) {
  const { isAdmin } = useAdmin()
  const router = useRouter()
  const [editing, setEditing] = useState<Article | null>(null)
  const [busy, setBusy] = useState(false)

  if (!isAdmin) return null

  const openEdit = async () => {
    setBusy(true)
    const { data } = await createClient().from('articles').select('*').eq('id', id).single()
    setBusy(false)
    if (data) setEditing(data as Article)
  }
  const closeEdit = () => setEditing(null)

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este artículo?')) return
    setBusy(true)
    await fetch(`/api/admin/articulos/${id}`, { method: 'DELETE' })
    setBusy(false)
    router.refresh()
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, position: 'relative', zIndex: 1 }}>
        <button
          onClick={openEdit}
          disabled={busy}
          style={{ background: 'var(--slate-900)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, padding: '5px 10px', cursor: 'pointer' }}
        >
          ✏ Editar
        </button>
        <button
          onClick={handleDelete}
          disabled={busy}
          style={{ background: '#c53030', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, padding: '5px 10px', cursor: 'pointer' }}
        >
          🗑 Eliminar
        </button>
      </div>

      {/* ── Modal edición ── */}
      {editing && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, overflowY: 'auto',
          }}
          onClick={e => { if (e.target === e.currentTarget) closeEdit() }}
        >
          <div style={{
            background: '#fff', borderRadius: 20, padding: '32px 36px',
            width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 30px 80px -20px rgba(0,0,0,.45)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Editar artículo</h2>
              <button onClick={closeEdit} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--ink-muted)', lineHeight: 1 }}>✕</button>
            </div>

            <ArticleForm
              key={editing.id}
              article={editing}
              onSaved={() => { closeEdit(); router.refresh() }}
              onCancel={closeEdit}
            />
          </div>
        </div>
      )}
    </>
  )
}

export function NewArticleButton() {
  const { isAdmin } = useAdmin()
  if (!isAdmin) return null
  return (
    <Link
      href="/admin/escritos/nuevo"
      className="btn btn--primary"
      style={{ padding: '11px 22px', fontSize: 14, flexShrink: 0 }}
    >
      + Nuevo artículo
    </Link>
  )
}
