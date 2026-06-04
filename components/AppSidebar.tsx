'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Home, BookOpen, Library, Briefcase, Users, MessageSquare,
  Settings, LogOut, GraduationCap,
} from 'lucide-react'

interface AppSidebarProps {
  userEmail?: string
  userName?: string
  isDirector?: boolean
  onClose?: () => void
}

const navGroups = [
  [
    { label: 'Inicio', href: '/', icon: Home, exact: true },
    { label: 'Formaciones', href: '/formaciones', icon: GraduationCap, exact: false },
    { label: 'Biblioteca', href: '/biblioteca', icon: Library, exact: false },
  ],
  [
    { label: 'Servicios', href: '/servicios', icon: Briefcase, exact: false },
    { label: 'Primera consulta', href: '/turnos', icon: Users, exact: false },
    { label: 'Comunidad', href: '/escritos', icon: MessageSquare, exact: false },
  ],
  [
    { label: 'Mis formaciones', href: '/mis-cursos', icon: BookOpen, exact: false },
    { label: 'Mensajes', href: '/mensajes', icon: MessageSquare, exact: false },
    { label: 'Configuración', href: '/mi-cuenta/perfil', icon: Settings, exact: false },
  ],
]

function IconBtn({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ElementType
  label: string
  isActive: boolean
  onClick?: () => void
}) {
  return (
    <div className="relative group flex items-center justify-center">
      <button
        onClick={onClick}
        className="flex items-center justify-center rounded-[10px] transition-colors"
        style={{
          width: 40, height: 40,
          background: isActive ? '#e8f0ea' : 'transparent',
          color: isActive ? '#3a5444' : '#8a9e92',
        }}
        onMouseEnter={e => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.background = '#f0f7f2'
            ;(e.currentTarget as HTMLElement).style.color = '#3a5444'
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLElement).style.color = '#8a9e92'
          }
        }}
      >
        <Icon size={16} strokeWidth={1.8} />
      </button>
      {/* Tooltip */}
      <div
        className="absolute left-full ml-3 px-2.5 py-1.5 rounded-md text-[11px] font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
        style={{
          background: '#1e2a24', color: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {label}
      </div>
    </div>
  )
}

function NavIconLink({
  item,
  isActive,
}: {
  item: { label: string; href: string; icon: React.ElementType }
  isActive: boolean
}) {
  const Icon = item.icon
  return (
    <div className="relative group flex items-center justify-center">
      <Link
        href={item.href}
        className="flex items-center justify-center rounded-[10px] transition-colors"
        style={{
          width: 40, height: 40,
          background: isActive ? '#e8f0ea' : 'transparent',
          color: isActive ? '#3a5444' : '#8a9e92',
        }}
        onMouseEnter={e => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.background = '#f0f7f2'
            ;(e.currentTarget as HTMLElement).style.color = '#3a5444'
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLElement).style.color = '#8a9e92'
          }
        }}
      >
        <Icon size={16} strokeWidth={1.8} />
      </Link>
      <div
        className="absolute left-full ml-3 px-2.5 py-1.5 rounded-md text-[11px] font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
        style={{
          background: '#1e2a24', color: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {item.label}
      </div>
    </div>
  )
}

export default function AppSidebar({ userEmail, userName, isDirector, onClose: _onClose }: AppSidebarProps) {
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
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40"
      style={{
        width: 64,
        background: '#ffffff',
        borderRight: '0.5px solid #e8ede9',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{ height: 64, borderBottom: '0.5px solid #e8ede9' }}
      >
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/LOGO.png"
            alt="ÉCLAT"
            width={32}
            height={32}
            priority
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center py-3 gap-0.5">
        {navGroups.map((group, gi) => (
          <div key={gi} className="w-full flex flex-col items-center gap-0.5">
            {group.map(item => (
              <NavIconLink
                key={item.href}
                item={item}
                isActive={isActive(item.href, item.exact)}
              />
            ))}
            {gi < navGroups.length - 1 && (
              <div className="my-2" style={{ width: 24, height: '0.5px', background: '#e8ede9' }} />
            )}
          </div>
        ))}

        {isDirector && (
          <>
            <div className="my-2" style={{ width: 24, height: '0.5px', background: '#e8ede9' }} />
            <NavIconLink
              item={{ label: 'Panel director', href: '/admin', icon: Settings }}
              isActive={isActive('/admin', false)}
            />
          </>
        )}
      </nav>

      {/* Footer */}
      <div
        className="shrink-0 flex flex-col items-center py-3 gap-1"
        style={{ borderTop: '0.5px solid #e8ede9' }}
      >
        {userEmail && (
          <div className="relative group flex items-center justify-center">
            <div
              className="flex items-center justify-center rounded-[10px] text-[12px] font-medium cursor-default"
              style={{ width: 40, height: 40, background: '#e8f0ea', color: '#3a5444' }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div
              className="absolute left-full ml-3 px-2.5 py-1.5 rounded-md text-[11px] font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
              style={{ background: '#1e2a24', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              {displayName}
              {userEmail && <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 6 }}>{userEmail}</span>}
            </div>
          </div>
        )}

        <IconBtn
          icon={LogOut}
          label="Cerrar sesión"
          isActive={false}
          onClick={handleLogout}
        />
      </div>
    </aside>
  )
}
