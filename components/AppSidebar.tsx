'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Home, BookOpen, Library, Briefcase, Users, MessageSquare,
  Settings, LogOut, ChevronRight, GraduationCap,
} from 'lucide-react'

interface AppSidebarProps {
  userEmail?: string
  userName?: string
  isDirector?: boolean
}

const navMain = [
  { label: 'Inicio', href: '/', icon: Home, hint: '' },
  { label: 'Formaciones', href: '/formaciones', icon: GraduationCap, hint: 'Cursos y recorridos' },
  { label: 'Biblioteca', href: '/biblioteca', icon: Library, hint: 'Lecturas y recursos' },
]

const navCentro = [
  { label: 'Áreas de trabajo', href: '/servicios', icon: Briefcase },
  { label: 'Primera consulta', href: '/turnos', icon: Users },
  { label: 'Comunidad', href: '/escritos', icon: MessageSquare },
]

const navUser = [
  { label: 'Mis formaciones', href: '/mis-cursos', icon: BookOpen },
  { label: 'Mensajes', href: '/mensajes', icon: MessageSquare },
  { label: 'Configuración', href: '/mi-cuenta/perfil', icon: Settings },
]

export default function AppSidebar({ userEmail, userName, isDirector }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40 overflow-y-auto"
      style={{ width: 210, background: 'var(--eclat-dark)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" className="flex items-center gap-2.5 mb-2">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={{ background: 'var(--eclat-mid)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" fill="white" opacity="0.9"/>
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
            </svg>
          </div>
          <span className="text-white font-semibold tracking-widest text-[11px] uppercase">ÉCLAT</span>
        </Link>
        <p className="text-[10px] pl-[38px]" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
          Centro de atención integral
        </p>
        {isDirector && (
          <span
            className="ml-[38px] mt-1.5 inline-block text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(90,148,110,0.25)', color: 'var(--eclat-light)' }}
          >
            Director
          </span>
        )}
      </div>

      {/* Nav principal */}
      <nav className="px-2.5 pt-3 pb-1">
        {navMain.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 group transition-colors ${
              isActive(item.href)
                ? 'text-white'
                : 'hover:text-white'
            }`}
            style={isActive(item.href)
              ? { background: 'rgba(255,255,255,0.1)', color: 'white' }
              : { color: 'rgba(255,255,255,0.55)' }
            }
          >
            <item.icon size={14} strokeWidth={1.8} className="shrink-0" />
            <span className="text-[12.5px] font-medium flex-1">{item.label}</span>
            {item.hint && (
              <span
                className="text-[9px] hidden group-hover:block"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                {item.hint}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Separador */}
      <div className="mx-4 my-2" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* Centro ÉCLAT */}
      <div className="px-2.5">
        <p
          className="px-2.5 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: 'rgba(255,255,255,0.28)' }}
        >
          Centro ÉCLAT
        </p>
        {navCentro.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 transition-colors"
            style={isActive(item.href)
              ? { background: 'rgba(255,255,255,0.1)', color: 'white' }
              : { color: 'rgba(255,255,255,0.45)' }
            }
          >
            <item.icon size={13} strokeWidth={1.6} className="shrink-0" />
            <span className="text-[12px]">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="mx-4 my-2" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* Nav usuario */}
      <div className="px-2.5">
        {navUser.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 transition-colors"
            style={isActive(item.href)
              ? { background: 'rgba(255,255,255,0.1)', color: 'white' }
              : { color: 'rgba(255,255,255,0.45)' }
            }
          >
            <item.icon size={13} strokeWidth={1.6} className="shrink-0" />
            <span className="text-[12px]">{item.label}</span>
          </Link>
        ))}
        {isDirector && (
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 transition-colors"
            style={{ color: 'rgba(143,187,158,0.8)' }}
          >
            <Settings size={13} strokeWidth={1.6} className="shrink-0" />
            <span className="text-[12px]">Panel director</span>
          </Link>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer usuario */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {userEmail ? (
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold"
              style={{ background: 'var(--eclat-green)', color: 'white' }}
            >
              {(userName || userEmail).charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-white truncate">{userName || userEmail.split('@')[0]}</p>
              <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{userEmail}</p>
            </div>
            <button onClick={handleLogout} title="Salir" style={{ color: 'rgba(255,255,255,0.3)' }} className="hover:text-white transition-colors">
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <Link href="/login" className="flex items-center gap-2 text-[12px] transition-colors" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <ChevronRight size={13} />
            Iniciar sesión
          </Link>
        )}
      </div>
    </aside>
  )
}
