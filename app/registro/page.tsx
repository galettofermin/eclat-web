'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
  'Tierra del Fuego', 'Tucumán',
]

export default function RegistroPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nombre: '', apellido: '', dni: '', email: '',
    password: '', confirm: '', provincia: '', localidad: '',
    newsletter: true,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden.'); return }
    if (form.password.length < 6) { setError('Mínimo 6 caracteres en la contraseña.'); return }

    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: `${form.nombre} ${form.apellido}`.trim(),
          dni: form.dni,
          provincia: form.provincia,
          localidad: form.localidad,
          newsletter: form.newsletter,
        }
      }
    })

    if (authError) { setError(authError.message); setLoading(false); return }

    fetch('/api/email/bienvenida', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, nombre: form.nombre }),
    }).catch(() => {})

    if (data.session) { router.push('/'); router.refresh() }
    else { alert('¡Cuenta creada! Revisá tu email para confirmar.'); router.push('/login') }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 7, fontSize: 13,
    border: '1px solid var(--eclat-border)', background: 'white',
    color: 'var(--eclat-text)', outline: 'none',
  }

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 600,
    marginBottom: 4, color: 'var(--eclat-text-2)',
    letterSpacing: '0.03em',
  }

  return (
    <div className="flex min-h-screen">
      {/* ── COLUMNA IZQUIERDA ── */}
      <div
        className="hidden lg:flex w-1/2 flex-col relative overflow-hidden"
        style={{ background: 'var(--eclat-bg-green)', borderRight: '1px solid var(--eclat-border)' }}
      >
        {/* Decoración SVG */}
        <svg className="absolute right-0 bottom-0 pointer-events-none" width="300" height="300" viewBox="0 0 300 300" style={{ opacity: 0.08 }}>
          <circle cx="250" cy="250" r="120" fill="none" stroke="#3a5444" strokeWidth="1.5"/>
          <circle cx="250" cy="250" r="70" fill="none" stroke="#3a5444" strokeWidth="1"/>
          <line x1="130" y1="300" x2="300" y2="130" stroke="#3a5444" strokeWidth="1"/>
          <line x1="160" y1="300" x2="300" y2="160" stroke="#3a5444" strokeWidth="0.8"/>
        </svg>

        <div className="relative flex flex-col h-full px-12 py-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'var(--eclat-mid)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" fill="white" opacity="0.9"/>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </div>
            <span className="font-semibold tracking-widest text-[12px] uppercase" style={{ color: 'var(--eclat-text)' }}>ÉCLAT</span>
          </div>

          {/* Título */}
          <h1
            className="mb-4 leading-snug"
            style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400, color: 'var(--eclat-text)', maxWidth: 380 }}
          >
            Salud mental, educación y acompañamiento{' '}
            <em style={{ color: 'var(--eclat-dark-3)' }}>interdisciplinario.</em>
          </h1>

          <p className="text-[13px] leading-relaxed mb-8" style={{ color: 'var(--eclat-text-2)', maxWidth: 340 }}>
            Un espacio donde cada persona es acompañada en su singularidad. Atención clínica, formación y comunidad profesional.
          </p>

          {/* Pilares */}
          <div className="space-y-3 mb-10">
            {[
              { t: 'Atención clínica', d: 'Psicología, psicopedagogía, fonoaudiología y más' },
              { t: 'Formación', d: 'Cursos con fundamento clínico para profesionales' },
              { t: 'Comunidad', d: 'Intercambio entre colegas del campo' },
            ].map(p => (
              <div key={p.t} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--eclat-mid)' }} />
                <div>
                  <p className="text-[12px] font-semibold" style={{ color: 'var(--eclat-text)' }}>{p.t}</p>
                  <p className="text-[11px]" style={{ color: 'var(--eclat-text-3)' }}>{p.d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Cita */}
          <div className="mt-auto" style={{ borderLeft: '2px solid var(--eclat-border-2)', paddingLeft: 14 }}>
            <p className="text-[13px] italic" style={{ fontFamily: 'Georgia, serif', color: 'var(--eclat-text-2)' }}>
              "Cada situación merece una mirada. Cada persona, un tiempo."
            </p>
          </div>
        </div>
      </div>

      {/* ── COLUMNA DERECHA — FORMULARIO ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 overflow-y-auto" style={{ background: 'var(--eclat-cream)' }}>
        <div className="w-full max-w-md">
          <h2 className="text-[22px] font-semibold mb-1" style={{ color: 'var(--eclat-text)' }}>Crear cuenta</h2>
          <p className="text-[13px] mb-7" style={{ color: 'var(--eclat-text-3)' }}>
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--eclat-mid)' }}>
              Iniciá sesión acá
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre + Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Nombre</label>
                <input style={inputStyle} required value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Tu nombre" />
              </div>
              <div>
                <label style={labelStyle}>Apellido</label>
                <input style={inputStyle} required value={form.apellido} onChange={e => set('apellido', e.target.value)} placeholder="Apellido" />
              </div>
            </div>

            {/* DNI */}
            <div>
              <label style={labelStyle}>DNI</label>
              <input style={inputStyle} required value={form.dni} onChange={e => set('dni', e.target.value)} placeholder="12345678" />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" style={inputStyle} required value={form.email} onChange={e => set('email', e.target.value)} placeholder="tu@email.com" />
            </div>

            {/* Contraseña */}
            <div>
              <label style={labelStyle}>Contraseña</label>
              <input type="password" style={inputStyle} required value={form.password} onChange={e => set('password', e.target.value)} placeholder="Mínimo 6 caracteres" />
            </div>

            {/* Confirmar */}
            <div>
              <label style={labelStyle}>Confirmar contraseña</label>
              <input type="password" style={inputStyle} required value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="••••••••" />
            </div>

            {/* Provincia + Localidad */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Provincia</label>
                <select style={{ ...inputStyle, appearance: 'none' as any }} value={form.provincia} onChange={e => set('provincia', e.target.value)}>
                  <option value="">Seleccioná</option>
                  {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Localidad</label>
                <input style={inputStyle} value={form.localidad} onChange={e => set('localidad', e.target.value)} placeholder="Tu ciudad" />
              </div>
            </div>

            {/* Newsletter */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.newsletter}
                onChange={e => set('newsletter', e.target.checked)}
                className="mt-0.5"
                style={{ accentColor: 'var(--eclat-mid)' }}
              />
              <span className="text-[12px] leading-relaxed" style={{ color: 'var(--eclat-text-2)' }}>
                Quiero recibir novedades, nuevas formaciones y recursos de ÉCLAT en mi correo.
              </span>
            </label>

            {error && (
              <p className="text-[12px] px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-[13px] font-semibold rounded-lg transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: 'var(--eclat-dark)', color: '#d4e0d8' }}
            >
              {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
            </button>

            <p className="text-center text-[11px]" style={{ color: 'var(--eclat-text-4)' }}>
              Al registrarte aceptás nuestros{' '}
              <Link href="/terminos" className="hover:underline" style={{ color: 'var(--eclat-mid)' }}>términos</Link>{' '}
              y{' '}
              <Link href="/privacidad" className="hover:underline" style={{ color: 'var(--eclat-mid)' }}>política de privacidad</Link>.
            </p>
          </form>

          <p className="text-center text-[12px] mt-6" style={{ color: 'var(--eclat-text-3)' }}>
            <Link href="/formaciones" className="hover:underline" style={{ color: 'var(--eclat-mid)' }}>
              ¿Querés conocer la plataforma antes? Explorá las formaciones →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
