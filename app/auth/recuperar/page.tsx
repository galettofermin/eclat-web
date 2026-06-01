'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { LOGO_URL } from '@/lib/constants'

type Status = 'loading' | 'ready' | 'saving' | 'done' | 'error'

export default function AuthRecuperar() {
  const [status, setStatus] = useState<Status>('loading')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  // Leer tokens del hash de la URL y establecer sesión
  useEffect(() => {
    const hash = window.location.hash.slice(1) // quita el '#'
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type') // 'recovery' para reset de contraseña

    if (!accessToken || !refreshToken) {
      setStatus('error')
      setErrorMsg('Link inválido o expirado. Solicitá un nuevo link desde la pantalla de ingreso.')
      return
    }

    const supabase = createClient()
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        if (error) {
          setStatus('error')
          setErrorMsg('No se pudo verificar el link. Puede haber expirado.')
        } else {
          setStatus('ready')
        }
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (password !== confirm) {
      setErrorMsg('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setStatus('saving')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setErrorMsg(error.message)
      setStatus('ready')
    } else {
      setStatus('done')
      setTimeout(() => router.push('/mi-cuenta'), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-6 font-sans">
      <div className="w-full max-w-sm">

        {/* Logo y encabezado */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src={LOGO_URL}
            alt="ÉCLAT"
            width={60}
            height={60}
            className="rounded-full object-cover mb-4 shadow-lg"
          />
          <h1 className="text-[22px] font-semibold text-[#0A0A0A]">Nueva contraseña</h1>
          <p className="text-[14px] text-[#6E6E73] mt-1">Centro ÉCLAT</p>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-8 shadow-sm">

          {/* Cargando sesión */}
          {status === 'loading' && (
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="w-8 h-8 border-2 border-[#2F7D6B]/30 border-t-[#2F7D6B] rounded-full animate-spin" />
              <p className="text-[14px] text-[#6E6E73]">Verificando link…</p>
            </div>
          )}

          {/* Error de token */}
          {status === 'error' && (
            <div className="flex flex-col items-center py-4 text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
                </svg>
              </div>
              <p className="text-[15px] font-semibold text-[#0A0A0A]">Link inválido</p>
              <p className="text-[13px] text-[#6E6E73]">{errorMsg}</p>
              <button
                onClick={() => router.push('/login')}
                className="mt-2 text-[14px] font-semibold text-[#2F7D6B] hover:text-[#245f52] transition-colors"
              >
                Volver al inicio de sesión →
              </button>
            </div>
          )}

          {/* Formulario */}
          {(status === 'ready' || status === 'saving') && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">
                  Confirmá la contraseña
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
                />
              </div>

              {errorMsg && (
                <p className="text-[13px] text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'saving'}
                className="w-full py-3 bg-[#2F7D6B] text-white font-semibold rounded-xl hover:bg-[#245f52] disabled:opacity-60 transition-colors text-[15px]"
              >
                {status === 'saving' ? 'Guardando…' : 'Guardar contraseña'}
              </button>
            </form>
          )}

          {/* Éxito */}
          {status === 'done' && (
            <div className="flex flex-col items-center py-4 text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#DCEFE8] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-[16px] font-semibold text-[#0A0A0A]">¡Contraseña actualizada!</p>
              <p className="text-[14px] text-[#6E6E73]">Redirigiendo a tu cuenta…</p>
            </div>
          )}

        </div>

        {/* Link volver */}
        {(status === 'ready' || status === 'saving') && (
          <p className="text-center text-[13px] text-[#6E6E73] mt-5">
            <button
              onClick={() => router.push('/login')}
              className="text-[#2F7D6B] hover:text-[#245f52] font-medium transition-colors"
            >
              Volver al inicio de sesión
            </button>
          </p>
        )}

      </div>
    </div>
  )
}
