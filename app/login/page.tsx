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
  // Solo rutas internas: evita redirigir a otro sitio con ?redirect=//dominio
  const rawRedirect = params.get('redirect')
  const redirect = rawRedirect?.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : null

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
      router.push(redirect || '/mi-cuenta')
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
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
        <img
          src="/LOGO CON NOMBRE.png"
          alt="ÉCLAT"
          style={{ width: '140px', objectFit: 'contain' }}
        />
      </div>

      {/* Card */}
      <div
        className="bg-white login-card"
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
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #EDF3F0 0%, #FAFBF9 60%, #F0F4F2 100%)' }}
    >
      <Suspense fallback={<div className="w-full" style={{ maxWidth: 420 }} />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
