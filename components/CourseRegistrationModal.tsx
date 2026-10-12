'use client'

import { useEffect, useRef, useState } from 'react'
import { REGISTRATION_ROLES } from '@/lib/registrationRoles'

type Props = {
  courseId: string
  courseTitle: string
  /** Clases del botón que abre el modal (cambia según dónde se use) */
  triggerClassName?: string
  triggerLabel?: string
}

const EMPTY = { nombre: '', apellido: '', email: '', telefono: '', localidad: '', rol: '', website: '' }

export default function CourseRegistrationModal({ courseId, courseTitle, triggerClassName, triggerLabel = 'Inscribirme' }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const firstField = useRef<HTMLInputElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  const close = () => {
    setOpen(false)
    if (status === 'done') { setForm(EMPTY); setStatus('idle') }
    trigger.current?.focus()
  }

  // Escape cierra, se bloquea el scroll de fondo y el foco va al primer campo
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstField.current?.focus()
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending'); setError('')
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, courseId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'No pudimos enviar la inscripción.')
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos enviar la inscripción.')
      setStatus('idle')
    }
  }

  return (
    <>
      <button ref={trigger} type="button" className={triggerClassName} onClick={() => setOpen(true)}>
        {triggerLabel}
      </button>

      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) close() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(20,26,24,.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, overflowY: 'auto',
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reg-title"
            style={{
              position: 'relative', background: '#fff', borderRadius: 20, padding: 36,
              width: '100%', maxWidth: 480, maxHeight: 'calc(100vh - 32px)', overflowY: 'auto',
              boxShadow: '0 30px 80px -20px rgba(0,0,0,.45)', textAlign: 'left', color: 'var(--slate-900)',
            }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, lineHeight: 1, cursor: 'pointer', color: 'var(--ink-muted)', padding: 6 }}
            >
              ✕
            </button>

            {status === 'done' ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <h2 id="reg-title" style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>¡Listo!</h2>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--slate-700)', marginBottom: 24 }}>
                  ¡Tu inscripción fue recibida! Te contactamos pronto para confirmar tu lugar.
                </p>
                <button type="button" className="btn-wa" style={{ justifyContent: 'center' }} onClick={close}>Cerrar</button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--sage-text)', marginBottom: 6 }}>
                  Inscripción
                </p>
                <h2 id="reg-title" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.25, marginBottom: 24, paddingRight: 24 }}>{courseTitle}</h2>

                <div className="form__row">
                  <div className="field">
                    <label htmlFor="reg-nombre">Nombre</label>
                    <input ref={firstField} id="reg-nombre" required autoComplete="given-name" value={form.nombre} onChange={set('nombre')} />
                  </div>
                  <div className="field">
                    <label htmlFor="reg-apellido">Apellido</label>
                    <input id="reg-apellido" required autoComplete="family-name" value={form.apellido} onChange={set('apellido')} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="reg-email">Mail</label>
                  <input id="reg-email" type="email" required autoComplete="email" value={form.email} onChange={set('email')} placeholder="tu@email.com" />
                </div>
                <div className="form__row">
                  <div className="field">
                    <label htmlFor="reg-tel">Teléfono</label>
                    <input id="reg-tel" type="tel" required autoComplete="tel" value={form.telefono} onChange={set('telefono')} placeholder="Cód. + número" />
                  </div>
                  <div className="field">
                    <label htmlFor="reg-localidad">Localidad</label>
                    <input id="reg-localidad" required autoComplete="address-level2" value={form.localidad} onChange={set('localidad')} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="reg-rol">¿Desde dónde te acercás?</label>
                  <select id="reg-rol" value={form.rol} onChange={set('rol')}>
                    <option value="">Elegí una opción</option>
                    {REGISTRATION_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* Honeypot anti-spam: oculto para personas */}
                <input
                  type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  value={form.website} onChange={set('website')}
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                />

                {error && (
                  <p role="alert" style={{ fontSize: 13, color: '#c53030', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 8, padding: '10px 12px', marginBottom: 16 }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-wa"
                  disabled={status === 'sending'}
                  style={{ width: '100%', justifyContent: 'center', opacity: status === 'sending' ? .7 : 1 }}
                >
                  {status === 'sending' ? 'Enviando…' : 'Inscribirme'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
