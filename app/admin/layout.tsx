import Link from 'next/link'
import AdminShell from '@/components/admin/AdminShell'

export const metadata = { title: 'Admin — Centro ÉCLAT' }

// Layout propio del admin: sin sidebar ni navbar/footer públicos (los oculta HideOnAdmin en el layout raíz).
// El acceso lo protege el middleware.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
