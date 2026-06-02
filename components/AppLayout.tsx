'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AppSidebar from './AppSidebar'

interface Props {
  children: React.ReactNode
  userEmail?: string
  userName?: string
  isDirector?: boolean
}

export default function AppLayout({ children, userEmail, userName, isDirector }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) setCollapsed(JSON.parse(saved))
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('sidebar-collapsed', JSON.stringify(next))
  }

  const sidebarWidth = collapsed ? 64 : 210

  // Evitar flash de hidratación: pre-render con estado expandido
  if (!mounted) {
    return (
      <div className="flex min-h-screen" style={{ background: 'var(--eclat-cream)' }}>
        <div style={{ width: 210, flexShrink: 0 }} />
        <div className="flex-1">{children}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--eclat-cream)' }}>
      <AppSidebar
        collapsed={collapsed}
        onToggle={toggle}
        userEmail={userEmail}
        userName={userName}
        isDirector={isDirector}
      />
      <motion.div
        className="flex-1 min-w-0"
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
