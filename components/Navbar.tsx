'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { NAV_LINKS, WHATSAPP_URL, DIRECTOR_EMAIL } from '@/lib/constants'
import LogoImage from './LogoImage'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isDirector, setIsDirector] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

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
        setIsDirector(true); setUserEmail(null)
      } else {
        setIsDirector(false); setUserEmail(user.email ?? null)
      }
    })
  }, [pathname])

  // Cerrar dropdown al hacer clic afuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUserEmail(null); setIsDirector(false); setDropdownOpen(false)
    router.push('/'); router.refresh()
  }

  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : ''

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

          {/* Logo */}
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

          {/* Desktop auth + CTA */}
          <div className="hidden md:flex items-center gap-3">

            {/* Director */}
            {isDirector && (
              <>
                <Link href="/admin" className="flex items-center gap-1.5 text-[13px] font-semibold text-[#2F7D6B] hover:text-[#245f52] transition-colors">
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
            )}

            {/* Usuario logueado — avatar + dropdown */}
            {!isDirector && userEmail && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="w-8 h-8 rounded-full bg-[#2F7D6B] text-white text-[13px] font-bold flex items-center justify-center hover:bg-[#245f52] transition-colors focus:outline-none"
                  aria-label="Mi cuenta"
                >
                  {initial}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-xl border border-black/[0.07] overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-black/[0.06]">
                        <p className="text-[11px] text-[#6E6E73] truncate">{userEmail}</p>
                      </div>
                      <div className="py-1.5">
                        <Link href="/mi-cuenta/perfil" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#1B2B26] hover:bg-[#F5F5F7] transition-colors">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                          </svg>
                          Mi perfil
                        </Link>
                        <Link href="/mi-cuenta/mis-cursos" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#1B2B26] hover:bg-[#F5F5F7] transition-colors">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                          </svg>
                          Mis cursos
                        </Link>
                      </div>
                      <div className="border-t border-black/[0.06] py-1.5">
                        <button onClick={handleLogout}
                          className="flex items-center gap-2.5 px-4 py-2.5 w-full text-[14px] text-red-500 hover:bg-red-50 transition-colors">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                          </svg>
                          Cerrar sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* No logueado — "Mi cuenta" siempre visible */}
            {!isDirector && !userEmail && (
              <Link href="/login" className="text-[13px] font-medium text-[#1B2B26] hover:text-[#2F7D6B] transition-colors">
                Mi cuenta
              </Link>
            )}

            {/* CTA Contactanos */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#2F7D6B] text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-[#245f52] transition-colors"
            >
              Contactanos
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
                    <Link href="/mi-cuenta/perfil" onClick={() => setMenuOpen(false)} className="block w-full py-3.5 text-[16px] text-[#1d1d1f] font-medium border-b border-black/5">
                      Mi perfil
                    </Link>
                  </li>
                  <li>
                    <Link href="/mi-cuenta/mis-cursos" onClick={() => setMenuOpen(false)} className="block w-full py-3.5 text-[16px] text-[#1d1d1f] font-medium border-b border-black/5">
                      Mis cursos
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="block w-full text-left py-3.5 text-[16px] text-red-500 font-medium border-b border-black/5">
                      Cerrar sesión
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="block w-full py-3.5 text-[16px] text-[#1d1d1f] font-medium border-b border-black/5">
                    Mi cuenta
                  </Link>
                </li>
              )}

              <li className="pt-3 pb-2">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="block text-center bg-[#2F7D6B] text-white py-3.5 rounded-2xl font-semibold text-[15px]">
                  Contactanos
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
