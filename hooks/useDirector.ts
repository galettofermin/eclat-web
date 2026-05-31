'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DIRECTOR_EMAIL } from '@/lib/constants'

export function useDirector() {
  const [isDirector, setIsDirector] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsDirector(user?.email === DIRECTOR_EMAIL)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsDirector(session?.user?.email === DIRECTOR_EMAIL)
    })

    return () => subscription.unsubscribe()
  }, [])

  return isDirector
}
