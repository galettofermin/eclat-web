import { redirect } from 'next/navigation'

// El login del admin ahora es el mismo que el de todos: /login
export default function AdminLoginRedirect() {
  redirect('/login?redirect=/admin')
}
