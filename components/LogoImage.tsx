'use client'

import { useState } from 'react'
import Image from 'next/image'
import { LOGO_URL } from '@/lib/constants'

export default function LogoImage({
  size = 36,
  className = '',
}: {
  size?: number
  className?: string
}) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div
        style={{ width: size, height: size, fontSize: Math.round(size * 0.45) }}
        className={`rounded-full bg-[#2F7D6B] flex items-center justify-center text-white font-bold shrink-0 ${className}`}
      >
        É
      </div>
    )
  }

  return (
    <Image
      src={LOGO_URL}
      alt="Centro ÉCLAT"
      width={size}
      height={size}
      className={`rounded-full object-cover shrink-0 ${className}`}
      unoptimized
      onError={() => setHasError(true)}
    />
  )
}
