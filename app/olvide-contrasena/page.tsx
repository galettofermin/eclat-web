'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { LOGO_URL } from '@/lib/constants'

export default function OlvideContrasena() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/recuperar`,
    })

    if (error) {
      setError('No se pudo enviar el email. Verificá la dirección ingresada.')
      setLoading(false)
    } else {
      setSent(true)
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
          <h1 className="text-[22px] font-semibold text-[#0A0A0A]">Recuperar contraseña</h1>
          <p className="text-[14px] text-[#6E6E73] mt-1">Centro ÉCLAT</p>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-8 shadow-sm">
          {sent ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-12 h-12 rounded-full bg-[#DCEFE8] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <p className="text-[16px] font-semibold text-[#0A0A0A]">¡Email enviado!</p>
              <p className="text-[14px] text-[#6E6E73]">
                Revisá tu bandeja de entrada. El link expira en 1 hora.
              </p>
              <Link href="/login" className="text-[14px] font-semibold text-[#2F7D6B] hover:text-[#245f52] transition-colors mt-1">
                Volver al inicio de sesión →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-[14px] text-[#6E6E73] mb-2">
                Ingresá tu email y te enviamos un link para restablecer tu contraseña.
              </p>
              <div>
                <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
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
                className="w-full py-3 bg-[#2F7D6B] text-white font-semibold rounded-xl hover:bg-[#245f52] disabled:opacity-60 transition-colors text-[15px]"
              >
                {loading ? 'Enviando…' : 'Enviar link de recuperación'}
              </button>
            </form>
          )}
        </div>

        {!sent && (
          <p className="text-center text-[13px] text-[#6E6E73] mt-5">
            <Link href="/login" className="text-[#2F7D6B] hover:text-[#245f52] font-medium transition-colors">
              ← Volver al inicio de sesión
            </Link>
          </p>
        )}

      </div>
    </div>
  )
}
