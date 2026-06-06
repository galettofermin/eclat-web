'use client'
import { useState, useEffect } from 'react'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/check')
      .then(r => r.json())
      .then(d => setIsAdmin(d.isAdmin === true))
      .catch(() => setIsAdmin(false))
      .finally(() => setLoading(false))
  }, [])

  return { isAdmin, loading }
}
