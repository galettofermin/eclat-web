'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

type PwStatus = 'idle' | 'saving' | 'ok' | 'error'

export default function PerfilPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwStatus, setPwStatus] = useState<PwStatus>('idle')
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/login?redirect=/mi-cuenta/perfil'); return }
      setEmail(user.email ?? '')
      setLoading(false)
    })
  }, [router])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    setPwStatus('idle')

    if (password !== confirm) {
      setPwError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 6) {
      setPwError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setPwStatus('saving')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setPwError(error.message)
      setPwStatus('error')
    } else {
      setPwStatus('ok')
      setPassword('')
      setConfirm('')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2F7D6B]/30 border-t-[#2F7D6B] rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      <div className="max-w-xl mx-auto px-5 pt-28 pb-20 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#DCEFE8] flex items-center justify-center text-[#2F7D6B] font-bold text-[20px] shrink-0">
            {email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-[22px] font-semibold text-[#0A0A0A]">Mi perfil</h1>
            <p className="text-[14px] text-[#6E6E73]">{email}</p>
          </div>
        </div>

        {/* Links de navegación */}
        <div className="flex gap-3 text-[13px]">
          <Link href="/mis-cursos" className="text-[#2F7D6B] hover:underline font-medium">
            ← Mis cursos
          </Link>
        </div>

        {/* Sección cambiar contraseña */}
        <div className="bg-white rounded-2xl border border-black/5 p-7 shadow-sm">
          <h2 className="text-[17px] font-semibold text-[#0A0A0A] mb-1">Cambiar contraseña</h2>
          <p className="text-[13px] text-[#6E6E73] mb-6">Ingresá tu nueva contraseña dos veces para confirmar.</p>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setPwStatus('idle'); setPwError('') }}
                required
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setPwStatus('idle'); setPwError('') }}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
              />
            </div>

            {pwError && (
              <p className="text-[13px] text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                {pwError}
              </p>
            )}

            {pwStatus === 'ok' && (
              <div className="flex items-center gap-2 bg-[#DCEFE8] px-4 py-3 rounded-xl">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="text-[13px] font-semibold text-[#2F7D6B]">
                  Contraseña actualizada correctamente.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={pwStatus === 'saving'}
              className="w-full py-3 bg-[#2F7D6B] text-white font-semibold rounded-xl hover:bg-[#245f52] disabled:opacity-60 transition-colors text-[15px]"
            >
              {pwStatus === 'saving' ? 'Guardando…' : 'Cambiar contraseña'}
            </button>
          </form>
        </div>

      </div>
      <Footer />
    </main>
  )
}
