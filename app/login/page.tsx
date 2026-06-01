'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { LOGO_URL } from '@/lib/constants'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const redirectTo = params.get('redirect') ?? '/mis-cursos'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
    } else {
      router.push(redirectTo)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
          placeholder="tu@email.com"
        />
      </div>
      <div>
        <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
          placeholder="••••••••"
        />
      </div>
      {error && (
        <p className="text-[13px] text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#2F7D6B] text-white font-semibold rounded-xl hover:bg-[#245f52] disabled:opacity-60 transition-colors text-[15px]"
      >
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>

      <p className="text-center text-[13px] text-[#6E6E73] pt-1">
        <Link href="/olvide-contrasena" className="text-[#2F7D6B] hover:text-[#245f52] transition-colors">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-6 font-sans">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image src={LOGO_URL} alt="ÉCLAT" width={60} height={60} className="rounded-full object-cover mb-4 shadow-lg" unoptimized />
          <h1 className="text-[22px] font-semibold text-[#0A0A0A]">Ingresar</h1>
          <p className="text-[14px] text-[#6E6E73] mt-1">Plataforma de cursos — Centro ÉCLAT</p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-8 shadow-sm">
          <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="w-5 h-5 border-2 border-[#2F7D6B] border-t-transparent rounded-full animate-spin" /></div>}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="text-center text-[14px] text-[#6E6E73] mt-6">
          ¿No tenés cuenta?{' '}
          <Link href="/registro" className="text-[#2F7D6B] font-semibold hover:underline">Registrate gratis</Link>
        </p>
        <p className="text-center text-[13px] text-[#86868b] mt-2">
          <Link href="/" className="hover:text-[#0A0A0A] transition-colors">← Volver al inicio</Link>
        </p>
      </div>
    </div>
  )
}
