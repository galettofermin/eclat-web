'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { REGISTRATION_ROLES } from '@/lib/registrationRoles'
import { BANK_ALIAS, WA_URL } from '@/lib/constants'
import { WaIcon } from '@/components/WaIcon'

type Props = {
  courseId: string
  courseTitle: string
  price?: number
  /** Mail del usuario con sesión: si viene, no se pide contraseña ni se crea cuenta */
  userEmail?: string | null
  /** Clases del botón que abre el modal (cambia según dónde se use) */
  triggerClassName?: string
  triggerLabel?: string
}

// Cómo terminó el envío: define el mensaje final
type Outcome = 'new' | 'newWithSession' | 'existing' | 'loggedIn' | 'accountFailed'
type PayStep = 'form' | 'choose' | 'done'

const EMPTY = { nombre: '', apellido: '', email: '', telefono: '', localidad: '', rol: '', password: '', confirm: '', website: '' }

const OUTCOME_TEXT: Record<Outcome, string> = {
  new: 'Vas a recibir un mail para confirmar tu cuenta. Una vez que el equipo de ÉCLAT habilite tu acceso, podrás ingresar desde Mi cuenta.',
  newWithSession: 'Ya creamos tu cuenta. Una vez que el equipo de ÉCLAT habilite tu acceso, vas a ver el curso en Mi cuenta.',
  existing: 'Este mail ya tiene una cuenta. Podés inscribirte igual — tu acceso se habilitará cuando confirmemos el pago.',
  loggedIn: 'Una vez que el equipo de ÉCLAT habilite tu acceso, vas a ver el curso en Mi cuenta.',
  accountFailed: 'No pudimos crear tu cuenta en este momento. Podés crearla después desde Registrarse con este mismo mail.',
}

const isExistingAccountError = (msg: string, code?: string) =>
  code === 'user_already_exists' || code === 'email_exists' || /already (been )?registered|already exists/i.test(msg)

const formatPrice = (p: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

export default function CourseRegistrationModal({ courseId, courseTitle, price, userEmail, triggerClassName, triggerLabel = 'Inscribirme' }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ ...EMPTY, email: userEmail ?? '' })
  const [step, setStep] = useState<PayStep>('form')
  const [outcome, setOutcome] = useState<Outcome>('new')
  const [savedOutcome, setSavedOutcome] = useState<Outcome>('new')
  const [error, setError] = useState('')
  const [paying, setPaying] = useState(false)
  const [byTransfer, setByTransfer] = useState(false)
  const firstField = useRef<HTMLInputElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  // true si se abrió directo en "Elegí cómo pagar" y la inscripción todavía no se guardó
  const pendingSave = useRef(false)

  const close = () => {
    setOpen(false)
    if (step === 'done') { setForm({ ...EMPTY, email: userEmail ?? '' }); setStep('form'); setByTransfer(false) }
    trigger.current?.focus()
  }

  // Si el usuario ya tiene sesión, saltar directo al paso de pago al abrir
  const handleOpen = () => {
    if (userEmail && price && price > 0) {
      setStep('choose')
      setSavedOutcome('loggedIn')
      pendingSave.current = true
    } else {
      setStep('form')
    }
    setError('')
    setOpen(true)
  }

  // Escape cierra, se bloquea el scroll de fondo y el foco va al primer campo
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (step === 'form') firstField.current?.focus()
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  // Paso 1: crear la cuenta (salvo que ya haya sesión). Devuelve null si hay que frenar el envío.
  const createAccount = async (): Promise<Outcome | null> => {
    if (userEmail) return 'loggedIn'

    if (form.password.length < 8) { setError('La contraseña tiene que tener al menos 8 caracteres.'); return null }
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden.'); return null }

    const nombre = form.nombre.trim()
    const apellido = form.apellido.trim()
    const { data, error: signUpError } = await createClient().auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: { nombre, apellido, full_name: `${nombre} ${apellido}` },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/mi-cuenta`,
      },
    })

    if (signUpError) {
      if (isExistingAccountError(signUpError.message, signUpError.code)) return 'existing'
      // Un problema con la contraseña lo puede corregir la persona: se frena y se muestra
      if (signUpError.code === 'weak_password' || /password/i.test(signUpError.message)) {
        setError('La contraseña no es válida. Probá con otra más larga o con letras y números.')
        return null
      }
      // Cualquier otro error (p. ej. límite de envío de mails): la inscripción se guarda igual
      console.error('signUp:', signUpError)
      return 'accountFailed'
    }

    // Con la confirmación por mail activa, Supabase no avisa con error si el mail ya existe:
    // devuelve un usuario sin identidades
    if (data.user && data.user.identities?.length === 0) return 'existing'
    return data.session ? 'newWithSession' : 'new'
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('form'); setError('')
    setPaying(true)
    try {
      const result = await createAccount()
      if (!result) { setPaying(false); return }

      // Paso 2: guardar la inscripción. La contraseña no se envía.
      const { password: _pw, confirm: _confirm, ...registration } = form
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...registration, courseId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'No pudimos enviar la inscripción.')

      setSavedOutcome(result)
      // Si hay precio → elegir método de pago; si no → listo
      if (price && price > 0) {
        setStep('choose')
      } else {
        setOutcome(result)
        setStep('done')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos enviar la inscripción.')
    } finally {
      setPaying(false)
    }
  }

  // Guarda la inscripción cuando el usuario ya tiene sesión y saltó el form
  // El servidor completa nombre y apellido desde la cuenta. Se guarda una sola vez aunque
  // la persona pruebe los dos métodos de pago.
  const saveRegistrationIfLoggedIn = async () => {
    if (!userEmail || !pendingSave.current) return // solo para usuarios con sesión que saltearon el form
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, courseId }),
    }).catch(() => null) // best-effort: si falla igual seguimos
    if (res?.ok) pendingSave.current = false
    else console.error('No se pudo guardar la inscripción', res?.status)
  }

  const payWithMP = async () => {
    setPaying(true)
    try {
      await saveRegistrationIfLoggedIn()
      // El servidor toma el usuario de la sesión o, si no hay, lo busca por el mail
      const res = await fetch('/api/mp/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, userEmail: form.email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al crear el pago')
      window.location.href = data.init_point
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con Mercado Pago')
      setPaying(false)
    }
  }

  const payWithTransfer = async () => {
    await saveRegistrationIfLoggedIn()
    setByTransfer(true)
    setOutcome(savedOutcome)
    setStep('done')
  }

  return (
    <>
      <button ref={trigger} type="button" className={triggerClassName} onClick={handleOpen}>
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

            {step === 'done' ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }} role="status">
                <h2 id="reg-title" style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>¡Tu inscripción fue recibida!</h2>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--slate-700)', marginBottom: 24 }}>
                  {OUTCOME_TEXT[outcome]}
                </p>
                {/* Datos para transferir: antes estaban en la tarjeta del curso */}
                {byTransfer && (
                  <div style={{ textAlign: 'left', background: 'var(--paper-2, #f5f5f3)', borderRadius: 12, padding: '16px 18px', marginBottom: 20, fontSize: 14, lineHeight: 1.6 }}>
                    <p style={{ fontWeight: 600 }}>Datos para la transferencia</p>
                    {price ? <p>Monto: <strong>{formatPrice(price)}</strong></p> : null}
                    <p>Alias: <strong style={{ fontFamily: 'monospace', color: 'var(--green-700)' }}>{BANK_ALIAS}</strong></p>
                    <p>Titular: Centro ÉCLAT</p>
                    <p style={{ color: 'var(--ink-muted)', marginTop: 6 }}>Una vez transferido, mandanos el comprobante por WhatsApp para activar el acceso.</p>
                    <a
                      className="btn-wa btn-wa--sm"
                      style={{ marginTop: 10 }}
                      href={WA_URL(`Hola ÉCLAT, te envío el comprobante de la transferencia por "${courseTitle}".`)}
                      target="_blank" rel="noopener noreferrer"
                    >
                      <WaIcon />Enviar comprobante
                    </a>
                  </div>
                )}
                {outcome === 'accountFailed' ? (
                  <Link href="/registro" className="btn-wa" style={{ justifyContent: 'center' }}>Crear mi cuenta</Link>
                ) : (
                  <button type="button" className="btn-wa" style={{ justifyContent: 'center' }} onClick={close}>Cerrar</button>
                )}
              </div>
            ) : step === 'choose' ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--sage-text)', marginBottom: 6 }}>
                  Elegí cómo pagar
                </p>
                <h2 id="reg-title" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.25, marginBottom: 8, paddingRight: 24 }}>{courseTitle}</h2>
                {price && price > 0 && (
                  <p style={{ fontSize: 26, fontWeight: 700, color: 'var(--sage)', marginBottom: 28 }}>{formatPrice(price)}</p>
                )}

                {error && (
                  <p role="alert" style={{ fontSize: 13, color: '#c53030', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 8, padding: '10px 12px', marginBottom: 16 }}>
                    {error}
                  </p>
                )}

                {/* Mercado Pago */}
                <button
                  type="button"
                  onClick={payWithMP}
                  disabled={paying}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: '#009ee3', color: '#fff', border: 'none', borderRadius: 12,
                    fontSize: 15, fontWeight: 700, padding: '14px 20px', cursor: paying ? 'not-allowed' : 'pointer',
                    opacity: paying ? .7 : 1, marginBottom: 12,
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="11" fill="#fff" fillOpacity=".2"/>
                    <path d="M7 12.5c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5Z" fill="#fff"/>
                  </svg>
                  {paying ? 'Redirigiendo…' : 'Pagar con Mercado Pago'}
                </button>

                {/* Transferencia */}
                <button
                  type="button"
                  onClick={payWithTransfer}
                  disabled={paying}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: 'var(--paper-2, #f5f5f3)', color: 'var(--slate-900)', border: '1.5px solid var(--border, #e2e2e0)',
                    borderRadius: 12, fontSize: 15, fontWeight: 600, padding: '14px 20px',
                    cursor: paying ? 'not-allowed' : 'pointer', opacity: paying ? .7 : 1,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="2" y="5" width="20" height="14" rx="3"/>
                    <path d="M2 10h20"/>
                  </svg>
                  Pagar por transferencia
                </button>

                <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 14 }}>
                  Con transferencia, el equipo de ÉCLAT confirma el pago y habilita tu acceso.
                </p>
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
                  <input
                    id="reg-email" type="email" required autoComplete="email" value={form.email} onChange={set('email')} placeholder="tu@email.com"
                    readOnly={!!userEmail} style={userEmail ? { background: 'var(--paper-2, #f5f5f3)', color: 'var(--ink-muted)' } : undefined}
                  />
                  {userEmail && <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 6 }}>Te inscribís con tu cuenta.</p>}
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

                {!userEmail && (
                  <div className="form__row">
                    <div className="field">
                      <label htmlFor="reg-pass">Contraseña</label>
                      <input id="reg-pass" type="password" required minLength={8} autoComplete="new-password"
                        value={form.password} onChange={set('password')} placeholder="Mínimo 8 caracteres" />
                    </div>
                    <div className="field">
                      <label htmlFor="reg-confirm">Confirmar contraseña</label>
                      <input id="reg-confirm" type="password" required minLength={8} autoComplete="new-password"
                        value={form.confirm} onChange={set('confirm')} />
                    </div>
                  </div>
                )}

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
                  disabled={paying}
                  style={{ width: '100%', justifyContent: 'center', opacity: paying ? .7 : 1 }}
                >
                  {paying ? 'Enviando…' : 'Inscribirme'}
                </button>
                {!userEmail && (
                  <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 12, textAlign: 'center' }}>
                    Con este mail y contraseña vas a ingresar a tu cuenta para ver el curso.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
