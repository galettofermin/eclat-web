'use client'

import { useEffect, useState } from 'react'
import AdminNav from '@/components/admin/AdminNav'

interface Suscriptor {
  id: string
  email: string
  nombre: string | null
  lista: string
  activo: boolean
  creado_es: string
}

export default function AdminSuscriptores() {
  const [items, setItems] = useState<Suscriptor[]>([])
  const [loading, setLoading] = useState(true)
  const [lista, setLista] = useState<'todos' | 'pausa' | 'general'>('todos')
  const [reload, setReload] = useState(0)

  // Formulario agregar suscriptor manual
  const [formEmail, setFormEmail] = useState('')
  const [formNombre, setFormNombre] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [formMsg, setFormMsg] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const params = lista !== 'todos' ? `?lista=${lista}` : ''
      const res = await fetch(`/api/admin/suscriptores${params}`)
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    load()
  }, [lista, reload])

  const agregarSuscriptor = async (e: React.FormEvent) => {
    e.preventDefault()
    const email = formEmail.trim()
    if (!email) return
    setFormLoading(true)
    setFormMsg(null)
    try {
      const res = await fetch('/api/newsletter/suscribir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nombre: formNombre.trim() || undefined }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Error al agregar')
      setFormMsg({ tipo: 'ok', texto: `${email} agregado correctamente.` })
      setFormEmail('')
      setFormNombre('')
      setReload(r => r + 1) // dispara useEffect para recargar lista
    } catch (err: unknown) {
      setFormMsg({ tipo: 'error', texto: err instanceof Error ? err.message : 'Error desconocido' })
    } finally {
      setFormLoading(false)
    }
  }

  const exportCSV = () => {
    const header = 'email,nombre,lista,fecha'
    const rows = items.map(s =>
      `${s.email},${s.nombre ?? ''},${s.lista},${new Date(s.creado_es).toLocaleDateString('es-AR')}`
    )
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `suscriptores-${lista}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div>
      <AdminNav />
      <div className="flex items-start justify-between mb-2 gap-4 flex-wrap">
        <div>
          <h1 className="text-[28px] font-semibold text-[#0A0A0A]">Suscriptores</h1>
          <p className="text-[15px] text-[#6E6E73]">
            {items.length} suscriptor{items.length !== 1 ? 'es' : ''} activo{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={exportCSV}
          disabled={items.length === 0}
          className="flex items-center gap-2 bg-[#2F7D6B] text-white font-semibold text-[13px] px-4 py-2.5 rounded-full hover:bg-[#245f52] disabled:opacity-50 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Exportar CSV
        </button>
      </div>

      {/* Agregar suscriptor manual */}
      <form
        onSubmit={agregarSuscriptor}
        className="bg-white border border-black/5 rounded-2xl px-6 py-5 mb-6 flex flex-col sm:flex-row gap-3 items-end"
      >
        <div className="flex-1 min-w-0">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E73] mb-1.5">
            Correo electrónico *
          </label>
          <input
            type="email"
            required
            placeholder="nombre@email.com"
            value={formEmail}
            onChange={e => setFormEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-black/10 text-[14px] text-[#0A0A0A] focus:outline-none focus:border-[#2F7D6B]"
          />
        </div>
        <div className="flex-1 min-w-0">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E73] mb-1.5">
            Nombre (opcional)
          </label>
          <input
            type="text"
            placeholder="Ej: María"
            value={formNombre}
            onChange={e => setFormNombre(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-black/10 text-[14px] text-[#0A0A0A] focus:outline-none focus:border-[#2F7D6B]"
          />
        </div>
        <button
          type="submit"
          disabled={formLoading || !formEmail.trim()}
          className="shrink-0 bg-[#2F7D6B] text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg hover:bg-[#245f52] disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {formLoading ? 'Agregando...' : '+ Agregar'}
        </button>
      </form>

      {formMsg && (
        <p className={`-mt-4 mb-4 text-[12px] font-medium px-1 ${formMsg.tipo === 'ok' ? 'text-[#2F7D6B]' : 'text-red-600'}`}>
          {formMsg.texto}
        </p>
      )}

      {/* Filtros por lista */}
      <div className="flex gap-2 my-6">
        {(['todos', 'pausa', 'general'] as const).map(f => (
          <button
            key={f}
            onClick={() => setLista(f)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
              lista === f
                ? 'bg-[#2F7D6B] text-white'
                : 'bg-white border border-black/10 text-[#424245] hover:border-[#2F7D6B]/40'
            }`}
          >
            {f === 'todos' ? 'Todas las listas' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-black/5">
          <p className="text-[16px] text-[#6E6E73]">Todavía no hay suscriptores en esta lista.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/5 bg-[#F9F9F9]">
                <th className="px-5 py-3 text-[12px] font-semibold text-[#6E6E73] uppercase tracking-wide">Email</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-[#6E6E73] uppercase tracking-wide hidden sm:table-cell">Nombre</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-[#6E6E73] uppercase tracking-wide hidden md:table-cell">Lista</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-[#6E6E73] uppercase tracking-wide">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {items.map(s => (
                <tr key={s.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5 text-[14px] text-[#0A0A0A] font-medium">{s.email}</td>
                  <td className="px-5 py-3.5 text-[14px] text-[#6E6E73] hidden sm:table-cell">
                    {s.nombre ?? <span className="italic text-[#86868b]">—</span>}
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-[11px] font-semibold uppercase tracking-wide bg-[#DCEFE8] text-[#2F7D6B] px-2.5 py-0.5 rounded-full">
                      {s.lista}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#6E6E73]">{formatDate(s.creado_es)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
