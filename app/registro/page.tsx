'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { LOGO_URL } from '@/lib/constants'

export default function RegistroPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }

    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (data.session) {
      // Confirmación desactivada → sesión inmediata
      router.push('/mis-cursos')
      router.refresh()
    } else {
      // Confirmación requerida → mostrar mensaje
      setError('')
      setLoading(false)
      alert('¡Cuenta creada! Revisá tu casilla de email y confirmá tu cuenta para ingresar.')
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-6 font-sans">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image src={LOGO_URL} alt="ÉCLAT" width={60} height={60} className="rounded-full object-cover mb-4 shadow-lg" unoptimized />
          <h1 className="text-[22px] font-semibold text-[#0A0A0A]">Crear cuenta</h1>
          <p className="text-[14px] text-[#6E6E73] mt-1">Accedé a los cursos de Centro ÉCLAT</p>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-8 shadow-sm">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                className="w-full px-4 py-3 rounded-xl border border-black/10 text-[15px] focus:outline-none focus:border-[#2F7D6B] transition-colors"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1.5">Confirmar contraseña</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
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
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        <p className="text-center text-[14px] text-[#6E6E73] mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-[#2F7D6B] font-semibold hover:underline">
            Ingresar
          </Link>
        </p>
      </div>
    </div>
  )
}
