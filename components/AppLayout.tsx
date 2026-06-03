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
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) setCollapsed(JSON.parse(saved))

    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    setMounted(true)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) setMobileOpen(false)
  }, [isMobile])

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('sidebar-collapsed', JSON.stringify(next))
  }

  const desktopMargin = collapsed ? 64 : 210

  if (!mounted) {
    return (
      <div className="flex min-h-screen" style={{ background: 'var(--eclat-cream)' }}>
        <div style={{ width: 210, flexShrink: 0 }} className="hidden md:block" />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--eclat-cream)' }}>

      {/* ── DESKTOP sidebar (hidden on mobile) ── */}
      {!isMobile && (
        <AppSidebar
          collapsed={collapsed}
          onToggle={toggle}
          userEmail={userEmail}
          userName={userName}
          isDirector={isDirector}
        />
      )}

      {/* ── MOBILE header ── */}
      {isMobile && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
          style={{ height: 52, background: 'var(--eclat-cream)', borderBottom: '1px solid var(--eclat-border)' }}
        >
          <Link href="/" className="flex items-center gap-2">
            <img src="/LOGO.png" alt="ÉCLAT" width={28} height={28} style={{ objectFit: 'contain' }} />
            <span className="font-semibold tracking-widest text-[11px] uppercase" style={{ color: 'var(--eclat-text)' }}>ÉCLAT</span>
          </Link>
          <button onClick={() => setMobileOpen(o => !o)} style={{ color: 'var(--eclat-text-2)', padding: 4 }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      )}

      {/* ── MOBILE drawer + overlay ── */}
      <AnimatePresence>
        {mobileOpen && isMobile && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.45)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 h-full z-50"
              initial={{ x: -210 }}
              animate={{ x: 0 }}
              exit={{ x: -210 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <AppSidebar
                collapsed={false}
                onToggle={() => setMobileOpen(false)}
                userEmail={userEmail}
                userName={userName}
                isDirector={isDirector}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <motion.div
        className="flex-1 min-w-0"
        animate={{ marginLeft: isMobile ? 0 : desktopMargin }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ paddingTop: isMobile ? 52 : 0 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
