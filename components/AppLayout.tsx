'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppSidebar from './AppSidebar'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface Props {
  children: React.ReactNode
  userEmail?: string
  userName?: string
  isDirector?: boolean
}

export default function AppLayout({ children, userEmail, userName, isDirector }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    setMounted(true)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) setMobileOpen(false)
  }, [isMobile])

  if (!mounted) {
    return (
      <div className="flex min-h-screen" style={{ background: '#ffffff' }}>
        <div style={{ width: 64, flexShrink: 0 }} className="hidden md:block" />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>

      {/* Desktop sidebar */}
      {!isMobile && (
        <AppSidebar userEmail={userEmail} userName={userName} isDirector={isDirector} />
      )}

      {/* Mobile header */}
      {isMobile && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5"
          style={{ height: 52, background: '#ffffff', borderBottom: '0.5px solid #f0f4f1' }}
        >
          <Link href="/" className="flex items-center gap-2">
            <img src="/LOGO.png" alt="ÉCLAT" width={26} height={26} style={{ objectFit: 'contain' }} />
            <span className="font-medium tracking-widest text-[11px] uppercase" style={{ color: '#1e2a24' }}>ÉCLAT</span>
          </Link>
          <button onClick={() => setMobileOpen(o => !o)} style={{ color: '#8a9e92', padding: 4 }}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      )}

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && isMobile && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.3)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 h-full z-50"
              initial={{ x: -64 }}
              animate={{ x: 0 }}
              exit={{ x: -64 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <AppSidebar
                userEmail={userEmail}
                userName={userName}
                isDirector={isDirector}
                onClose={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div
        className="flex-1 min-w-0"
        style={{
          marginLeft: isMobile ? 0 : 64,
          paddingTop: isMobile ? 52 : 0,
        }}
      >
        {children}
      </div>
    </div>
  )
}
