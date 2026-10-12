'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegistroPage() {
  const router = useRouter()
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }

    setLoading(true); setError('')
    const nombre = form.nombre.trim()
    const apellido = form.apellido.trim()
    const { data, error: authError } = await createClient().auth.signUp({
      email: form.email.trim(),
      password: form.password,
      // El perfil del alumno vive en los metadatos del usuario (no hay tabla profiles)
      options: { data: { nombre, apellido, full_name: `${nombre} ${apellido}`.trim() } },
    })

    if (authError) {
      setError(authError.message.includes('registered') ? 'Ya existe una cuenta con ese correo.' : authError.message)
      setLoading(false)
      return
    }

    fetch('/api/email/bienvenida', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, nombre }),
    }).catch(() => {})

    if (data.session) { router.push('/mi-cuenta'); router.refresh() }
    else { setSent(true); setLoading(false) }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13,
    border: '1px solid var(--eclat-border)', background: 'white',
    color: 'var(--eclat-text)', outline: 'none',
  }
  const labelClass = 'block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.06em]'
  const focus = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'var(--eclat-mid)'),
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'var(--eclat-border)'),
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: 'var(--eclat-cream)' }}
    >
      {/* Decoración SVG */}
      <svg className="absolute right-0 top-0 pointer-events-none" width="340" height="340" viewBox="0 0 340 340" style={{ opacity: 0.05 }}>
        <circle cx="280" cy="60" r="100" fill="none" stroke="#3a5444" strokeWidth="1.5"/>
        <circle cx="280" cy="60" r="55" fill="none" stroke="#3a5444" strokeWidth="1"/>
        <line x1="180" y1="0" x2="340" y2="160" stroke="#3a5444" strokeWidth="1"/>
        <line x1="210" y1="0" x2="340" y2="130" stroke="#3a5444" strokeWidth="0.8"/>
      </svg>
      <svg className="absolute left-0 bottom-0 pointer-events-none" width="240" height="240" viewBox="0 0 240 240" style={{ opacity: 0.05 }}>
        <circle cx="60" cy="180" r="80" fill="none" stroke="#3a5444" strokeWidth="1.5"/>
        <line x1="0" y1="100" x2="140" y2="240" stroke="#3a5444" strokeWidth="1"/>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
        style={{ maxWidth: 420 }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <img
            src="/logo.svg"
            alt="ÉCLAT"
            style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '12px' }}
          />
          <span style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            fontWeight: 600
          }}>
            Centro de Atención Integral
          </span>
        </div>

        {/* Card */}
        <div
          className="bg-white px-10 py-9"
          style={{ borderRadius: 12, border: '1px solid var(--eclat-border-2)', boxShadow: '0 2px 16px rgba(30,42,36,0.07)' }}
        >
          {sent ? (
            <div className="text-center">
              <h1 className="text-[20px] font-medium mb-3" style={{ color: 'var(--eclat-text)' }}>¡Cuenta creada!</h1>
              <p className="text-[13px] leading-relaxed mb-6" style={{ color: 'var(--eclat-text-2)' }}>
                Te enviamos un correo a <b>{form.email}</b>. Confirmalo para poder iniciar sesión.
              </p>
              <Link href="/login" className="font-medium hover:underline text-[13px]" style={{ color: 'var(--eclat-mid)' }}>
                Ir a iniciar sesión →
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-[20px] font-medium mb-4" style={{ color: 'var(--eclat-text)' }}>Creá tu cuenta</h1>
              <p className="text-[12.5px] leading-relaxed px-3 py-2.5 rounded-lg mb-6" style={{ background: 'var(--eclat-bg-green)', color: 'var(--eclat-text-2)' }}>
                Si ya te inscribiste a un curso, no necesitás registrarte de nuevo. Ingresá directamente desde{' '}
                <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--eclat-mid)' }}>Ingresar</Link>.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="nombre" className={labelClass} style={{ color: 'var(--eclat-text-2)' }}>Nombre</label>
                    <input id="nombre" required autoFocus autoComplete="given-name" value={form.nombre}
                      onChange={e => set('nombre', e.target.value)} style={inputStyle} {...focus} />
                  </div>
                  <div>
                    <label htmlFor="apellido" className={labelClass} style={{ color: 'var(--eclat-text-2)' }}>Apellido</label>
                    <input id="apellido" required autoComplete="family-name" value={form.apellido}
                      onChange={e => set('apellido', e.target.value)} style={inputStyle} {...focus} />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className={labelClass} style={{ color: 'var(--eclat-text-2)' }}>Correo electrónico</label>
                  <input id="email" type="email" required autoComplete="email" value={form.email}
                    onChange={e => set('email', e.target.value)} style={inputStyle} placeholder="tu@email.com" {...focus} />
                </div>

                <div>
                  <label htmlFor="password" className={labelClass} style={{ color: 'var(--eclat-text-2)' }}>Contraseña</label>
                  <div className="relative">
                    <input id="password" type={showPass ? 'text' : 'password'} required minLength={8} autoComplete="new-password"
                      value={form.password} onChange={e => set('password', e.target.value)}
                      style={{ ...inputStyle, paddingRight: 40 }} placeholder="Mínimo 8 caracteres" {...focus} />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--eclat-text-4)' }}
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-[12px] px-3 py-2.5 rounded-lg" style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030' }}>
                    {error}
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-[13px] font-semibold rounded-lg mt-2 disabled:opacity-60"
                  style={{ background: 'var(--eclat-dark)', color: '#d4e0d8' }}
                  whileHover={{ opacity: 0.88 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </motion.button>
              </form>

              <p className="text-center text-[12px] mt-5" style={{ color: 'var(--eclat-text-3)' }}>
                ¿Ya tenés cuenta?{' '}
                <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--eclat-mid)' }}>
                  Iniciá sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
