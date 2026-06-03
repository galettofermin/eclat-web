'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DIRECTOR_EMAIL } from '@/lib/constants'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError || !data.user) {
      setError('El correo o la contraseña no son correctos.')
      setLoading(false)
      return
    }

    // Detectar rol y redirigir
    if (data.user.email === DIRECTOR_EMAIL) {
      router.push(redirect || '/admin')
    } else {
      router.push(redirect || '/dashboard')
    }
    router.refresh()
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13,
    border: '1px solid var(--eclat-border)', background: 'white',
    color: 'var(--eclat-text)', outline: 'none',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
      style={{ maxWidth: 420 }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <img src="/LOGO.png" alt="ÉCLAT" width={56} height={56} style={{ objectFit: 'contain', marginBottom: 10 }} />
        <p className="font-semibold tracking-widest text-[18px] uppercase" style={{ color: 'var(--eclat-text)' }}>ÉCLAT</p>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--eclat-text-3)' }}>Centro de Atención Integral</p>
      </div>

      {/* Card */}
      <div
        className="bg-white px-10 py-9"
        style={{ borderRadius: 12, border: '1px solid var(--eclat-border-2)', boxShadow: '0 2px 16px rgba(30,42,36,0.07)' }}
      >
        <h1 className="text-[20px] font-medium mb-6" style={{ color: 'var(--eclat-text)' }}>Iniciá sesión</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.06em]" style={{ color: 'var(--eclat-text-2)' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              style={inputStyle}
              placeholder="tu@email.com"
              onFocus={e => (e.target.style.borderColor = 'var(--eclat-mid)')}
              onBlur={e => (e.target.style.borderColor = 'var(--eclat-border)')}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-[0.06em]" style={{ color: 'var(--eclat-text-2)' }}>
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: 40 }}
                placeholder="••••••••"
                onFocus={e => (e.target.style.borderColor = 'var(--eclat-mid)')}
                onBlur={e => (e.target.style.borderColor = 'var(--eclat-border)')}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
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
            className="w-full py-3 text-[13px] font-semibold rounded-lg mt-2"
            style={{ background: 'var(--eclat-dark)', color: '#d4e0d8' }}
            whileHover={{ opacity: 0.88 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </motion.button>
        </form>

        <p className="text-center text-[12px] mt-5" style={{ color: 'var(--eclat-text-3)' }}>
          ¿No tenés cuenta?{' '}
          <Link href="/registro" className="font-medium hover:underline" style={{ color: 'var(--eclat-mid)' }}>
            Registrate acá
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
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

      <Suspense fallback={<div className="w-full" style={{ maxWidth: 420 }} />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
