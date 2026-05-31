'use client'

import { useState } from 'react'

interface AccordionProps {
  items: string[]
}

export default function CourseAccordion({ items }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="border border-black/[0.08] rounded-2xl overflow-hidden divide-y divide-black/[0.06]">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center gap-4 px-5 py-4 bg-white hover:bg-[#F5F5F7] transition-colors text-left"
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
              open === i ? 'bg-[#2F7D6B] text-white' : 'bg-[#DCEFE8] text-[#2F7D6B]'
            }`}>
              {i + 1}
            </span>
            <span className="flex-1 text-[14px] font-medium text-[#0A0A0A]">{item}</span>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2"
              className={`shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {open === i && (
            <div className="px-5 py-3 bg-[#F9F9F9] border-t border-black/[0.04]">
              <p className="text-[13px] text-[#6E6E73] leading-relaxed">
                Contenido correspondiente al tema: <span className="font-medium text-[#0A0A0A]">{item}</span>
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
