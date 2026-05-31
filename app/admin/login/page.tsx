'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { LOGO_URL } from '@/lib/constants'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Credenciales incorrectas. Verificá tu email y contraseña.')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-6 font-sans">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image
            src={LOGO_URL}
            alt="ÉCLAT"
            width={60}
            height={60}
            className="rounded-full object-cover mb-4 shadow-lg"
            unoptimized
          />
          <h1 className="text-[22px] font-semibold text-[#0A0A0A]">Acceso director</h1>
          <p className="text-[14px] text-[#6E6E73] mt-1">Centro ÉCLAT — Panel de administración</p>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-8 shadow-sm">
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
              <p className="text-[13px] text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2F7D6B] text-white font-semibold rounded-xl hover:bg-[#245f52] disabled:opacity-60 transition-colors text-[15px] mt-2"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-[#6E6E73] mt-6">
          Acceso restringido · Centro ÉCLAT
        </p>
      </div>
    </div>
  )
}
