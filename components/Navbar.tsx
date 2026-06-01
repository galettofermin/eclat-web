'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { NAV_LINKS, WHATSAPP_URL, DIRECTOR_EMAIL } from '@/lib/constants'
import LogoImage from './LogoImage'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isDirector, setIsDirector] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setUserEmail(null); setIsDirector(false); return }
      if (user.email === DIRECTOR_EMAIL) {
        setIsDirector(true)
        setUserEmail(null)
      } else {
        setIsDirector(false)
        setUserEmail(user.email ?? null)
      }
    })
  }, [pathname])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUserEmail(null)
    setIsDirector(false)
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.09)]' : ''}`}
        style={{
          background: 'rgba(240,247,244,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(47,125,107,0.12)',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between" style={{ height: 60 }}>
          <Link href="/" className="flex items-center gap-2.5 group">
            <LogoImage size={34} />
            <span className="font-semibold text-[15px] tracking-tight text-[#1d1d1f] group-hover:text-[#2F7D6B] transition-colors">
              ÉCLAT
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`text-[14px] font-medium transition-colors ${pathname === link.href ? 'text-[#2F7D6B]' : 'text-[#1B2B26] hover:text-[#2F7D6B]'}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {isDirector ? (
              <>
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-[#2F7D6B] hover:text-[#245f52] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  Panel admin
                </Link>
                <button onClick={handleLogout} className="text-[13px] font-medium text-[#6E6E73] hover:text-[#0A0A0A] transition-colors">
                  Salir
                </button>
              </>
            ) : userEmail ? (
              <>
                <Link href="/mis-cursos" className="text-[14px] font-medium text-[#1B2B26] hover:text-[#2F7D6B] transition-colors">
                  Mis cursos
                </Link>
                <button onClick={handleLogout} className="text-[13px] font-medium text-[#6E6E73] hover:text-[#0A0A0A] transition-colors">
                  Salir
                </button>
              </>
            ) : (
              <Link href="/login" className="text-[13px] font-medium text-[#1B2B26] hover:text-[#2F7D6B] transition-colors">
                Ingresar
              </Link>
            )}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#2F7D6B] text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-[#245f52] transition-colors">
              Turnos
            </a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2 -mr-1" aria-label="Menú">
            <motion.span animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 bg-[#1d1d1f] origin-center transition-all" />
            <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-5 h-0.5 bg-[#1d1d1f]" />
            <motion.span animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 bg-[#1d1d1f] origin-center" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[60px] inset-x-0 z-40 bg-white/98 backdrop-blur-md border-b border-black/10 md:hidden shadow-lg"
          >
            <ul className="flex flex-col px-5 py-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setMenuOpen(false)} className="block w-full py-3.5 text-[16px] text-[#1d1d1f] font-medium border-b border-black/5">
                    {link.label}
                  </Link>
                </li>
              ))}

              {isDirector ? (
                <>
                  <li>
                    <Link href="/admin" onClick={() => setMenuOpen(false)} className="block w-full py-3.5 text-[16px] text-[#2F7D6B] font-semibold border-b border-black/5">
                      Panel admin
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="block w-full text-left py-3.5 text-[16px] text-[#6E6E73] font-medium border-b border-black/5">
                      Cerrar sesión
                    </button>
                  </li>
                </>
              ) : userEmail ? (
                <>
                  <li>
                    <Link href="/mis-cursos" onClick={() => setMenuOpen(false)} className="block w-full py-3.5 text-[16px] text-[#1d1d1f] font-medium border-b border-black/5">
                      Mis cursos
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="block w-full text-left py-3.5 text-[16px] text-[#6E6E73] font-medium border-b border-black/5">
                      Cerrar sesión
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="block w-full py-3.5 text-[16px] text-[#1d1d1f] font-medium border-b border-black/5">
                    Ingresar
                  </Link>
                </li>
              )}
              <li className="pt-3 pb-2">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="block text-center bg-[#2F7D6B] text-white py-3.5 rounded-2xl font-semibold text-[15px]">
                  Reservar turno
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
