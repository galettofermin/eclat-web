'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, BookOpen, Library, Briefcase, Users, MessageSquare,
  Settings, LogOut, ChevronRight, ChevronLeft, GraduationCap,
} from 'lucide-react'

interface AppSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  userEmail?: string
  userName?: string
  isDirector?: boolean
}

const navMain = [
  { label: 'Inicio', href: '/', icon: Home, exact: true },
  { label: 'Formaciones', href: '/formaciones', icon: GraduationCap, exact: false },
  { label: 'Biblioteca', href: '/biblioteca', icon: Library, exact: false },
]

const navCentro = [
  { label: 'Servicios', href: '/servicios', icon: Briefcase, exact: false },
  { label: 'Primera consulta', href: '/turnos', icon: Users, exact: false },
  { label: 'Comunidad', href: '/escritos', icon: MessageSquare, exact: false },
]

const navUser = [
  { label: 'Mis formaciones', href: '/mis-cursos', icon: BookOpen, exact: false },
  { label: 'Mensajes', href: '/mensajes', icon: MessageSquare, exact: false },
  { label: 'Configuración', href: '/mi-cuenta/perfil', icon: Settings, exact: false },
]

function NavItem({
  item, isActive, collapsed,
}: {
  item: { label: string; href: string; icon: React.ElementType }
  isActive: boolean
  collapsed: boolean
}) {
  const Icon = item.icon
  return (
    <div className="relative group">
      <Link
        href={item.href}
        className={`flex items-center rounded-lg mb-0.5 transition-colors ${
          collapsed ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-2.5 py-2'
        }`}
        style={isActive
          ? {
              background: '#c2d4c7',
              color: '#1e2a24',
              borderLeft: collapsed ? 'none' : '2px solid #3a5444',
              paddingLeft: collapsed ? undefined : '10px',
            }
          : { color: '#4a5e52' }
        }
        onMouseEnter={e => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.background = '#d4e8da'
            ;(e.currentTarget as HTMLElement).style.color = '#1e2a24'
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLElement).style.color = '#4a5e52'
          }
        }}
      >
        <Icon size={15} strokeWidth={1.7} className="shrink-0" />
        {!collapsed && <span className="text-[12.5px] font-medium">{item.label}</span>}
      </Link>
      {collapsed && (
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
          style={{ background: '#1e2a24', color: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.15)', border: '1px solid #c2d4c7' }}
        >
          {item.label}
        </div>
      )}
    </div>
  )
}

export default function AppSidebar({
  collapsed = false, onToggle, userEmail, userName, isDirector,
}: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const displayName = userName || (userEmail ? userEmail.split('@')[0] : '')

  return (
    <motion.aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40 overflow-hidden"
      animate={{ width: collapsed ? 64 : 210 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: '#e8f0ea', borderRight: '1px solid #c2d4c7' }}
    >
      {/* Logo */}
      <div
        className={`flex items-center shrink-0 ${collapsed ? 'justify-center px-0 py-5' : 'px-4 pt-5 pb-4'}`}
        style={{ background: '#ffffff', borderBottom: '1px solid #c2d4c7' }}
      >
        <Link href="/" className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
          <img
            src="/LOGO.png"
            alt="ÉCLAT"
            width={40}
            height={40}
            style={{ objectFit: 'contain', flexShrink: 0 }}
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-semibold tracking-widest text-[11px] uppercase overflow-hidden whitespace-nowrap"
                style={{ color: '#1e2a24' }}
              >
                ÉCLAT
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        {isDirector && !collapsed && (
          <span
            className="ml-auto text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
            style={{ background: '#c2d4c7', color: '#3a5444' }}
          >
            Dir.
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 overflow-y-auto overflow-x-hidden py-3 ${collapsed ? 'px-2' : 'px-2.5'}`}>
        {navMain.map(item => (
          <NavItem key={item.href} item={item} isActive={isActive(item.href, item.exact)} collapsed={collapsed} />
        ))}

        {!collapsed && (
          <p className="px-2.5 py-1.5 mt-1 text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#6b8c77' }}>
            Centro ÉCLAT
          </p>
        )}
        {collapsed && <div className="my-2 mx-1" style={{ height: 1, background: '#c2d4c7' }} />}

        {navCentro.map(item => (
          <NavItem key={item.href} item={item} isActive={isActive(item.href, item.exact)} collapsed={collapsed} />
        ))}

        <div className="my-2 mx-1" style={{ height: 1, background: '#c2d4c7' }} />

        {navUser.map(item => (
          <NavItem key={item.href} item={item} isActive={isActive(item.href, item.exact)} collapsed={collapsed} />
        ))}

        {isDirector && (
          <NavItem
            item={{ label: 'Panel director', href: '/admin', icon: Settings }}
            isActive={isActive('/admin', false)}
            collapsed={collapsed}
          />
        )}
      </nav>

      {/* Footer: usuario + toggle */}
      <div className="shrink-0" style={{ borderTop: '1px solid #c2d4c7' }}>
        {/* Usuario */}
        {userEmail && (
          <div
            className={`flex items-center ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5 gap-2'}`}
            style={{ background: '#d4e8da' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold"
              style={{ background: '#3a5444', color: 'white' }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium truncate" style={{ color: '#1e2a24' }}>{displayName}</p>
                <p className="text-[10px] truncate" style={{ color: '#3a5444' }}>{userEmail}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="transition-colors shrink-0"
                style={{ color: '#6b8c77' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1e2a24')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b8c77')}
              >
                <LogOut size={13} />
              </button>
            )}
          </div>
        )}

        {/* Botón toggle */}
        <div className="relative group">
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-full py-3 transition-colors"
            style={{ color: '#3a5444', borderTop: '1px solid #c2d4c7' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1e2a24')}
            onMouseLeave={e => (e.currentTarget.style.color = '#3a5444')}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
            style={{ background: '#1e2a24', color: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.15)', border: '1px solid #c2d4c7' }}
          >
            {collapsed ? 'Expandir' : 'Colapsar'}
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
