'use client'
import { usePathname } from 'next/navigation'

// Oculta la navbar, el footer y los botones flotantes del sitio público dentro de /admin
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <>{children}</>
}
