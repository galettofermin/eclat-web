'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BANK_ALIAS, WHATSAPP_URL } from '@/lib/constants'

interface CoursePriceCardProps {
  price: number
  priceOriginal: number
  courseId: string
  isFree: boolean
  freeLink: string | null
  freeCta: string | null
  isDirector: boolean
  isEnrolled: boolean
  isPending: boolean
  user: boolean
}

const formatPrice = (p: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

export default function CoursePriceCard({
  price, priceOriginal, courseId, isFree, freeLink, freeCta,
  isDirector, isEnrolled, isPending, user
}: CoursePriceCardProps) {
  const [expandMP, setExpandMP] = useState(false)
  const [expandTransfer, setExpandTransfer] = useState(false)
  const discount = priceOriginal > price
    ? Math.round(((priceOriginal - price) / priceOriginal) * 100)
    : 0

  if (isFree) {
    return (
      <div className="bg-white rounded-2xl border border-[#2F7D6B]/30 shadow-xl p-6">
        <p className="text-[22px] font-bold text-[#2F7D6B] mb-1">Gratuito</p>
        <p className="text-[13px] text-[#6E6E73] mb-5">Descarga directa sin registro</p>
        {freeLink && (
          <a href={freeLink} target="_blank" rel="noopener noreferrer"
            className="block w-full text-center bg-[#2F7D6B] text-white font-semibold py-3.5 rounded-xl hover:bg-[#245f52] transition-colors text-[15px]">
            {freeCta ?? 'Descargar gratis'}
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-black/[0.08] shadow-xl p-6">
      {/* Precio */}
      <div className="mb-5">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-[32px] font-bold text-[#0A0A0A] leading-none">{formatPrice(price)}</span>
          {discount > 0 && (
            <span className="bg-[#DCEFE8] text-[#2F7D6B] text-[12px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
        {priceOriginal > price && (
          <p className="text-[15px] text-[#86868b] line-through">{formatPrice(priceOriginal)}</p>
        )}
        {discount > 0 && (
          <p className="text-[12px] text-[#2F7D6B] font-semibold mt-1">
            ¡Oferta limitada! Ahorrás {formatPrice(priceOriginal - price)}
          </p>
        )}
      </div>

      {/* CTA principal */}
      {isDirector ? (
        <div className="w-full text-center bg-[#DCEFE8] text-[#2F7D6B] font-semibold py-3.5 rounded-xl text-[14px] mb-4">
          ✓ Director — acceso total
        </div>
      ) : isEnrolled ? (
        <div className="w-full text-center bg-[#DCEFE8] text-[#2F7D6B] font-semibold py-3.5 rounded-xl text-[14px] mb-4">
          ✓ Ya tenés acceso
        </div>
      ) : isPending ? (
        <div className="w-full text-center bg-amber-50 text-amber-700 font-semibold py-3.5 rounded-xl text-[14px] mb-4 border border-amber-200">
          Pago en verificación
        </div>
      ) : !user ? (
        <Link href={`/login?redirect=/inscripcion/${courseId}`}
          className="block w-full text-center bg-[#2F7D6B] text-white font-bold py-4 rounded-xl hover:bg-[#245f52] transition-colors text-[16px] mb-4 shadow-lg shadow-[#2F7D6B]/25">
          Inscribirme ahora
        </Link>
      ) : (
        <Link href={`/inscripcion/${courseId}`}
          className="block w-full text-center bg-[#2F7D6B] text-white font-bold py-4 rounded-xl hover:bg-[#245f52] transition-colors text-[16px] mb-4 shadow-lg shadow-[#2F7D6B]/25">
          Inscribirme ahora
        </Link>
      )}

      {/* Formas de pago */}
      {!isDirector && !isEnrolled && !isPending && (
        <div className="space-y-2 mb-4">
          {/* Mercado Pago */}
          <button onClick={() => setExpandMP(!expandMP)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#009EE3]/5 border border-[#009EE3]/20 rounded-xl hover:bg-[#009EE3]/10 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#009EE3] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">MP</span>
              </div>
              <span className="text-[13px] font-medium text-[#0A0A0A]">Mercado Pago</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2"
              className={`transition-transform ${expandMP ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {expandMP && (
            <div className="px-4 py-3 bg-[#F5F5F7] rounded-xl text-[12px] text-[#424245] space-y-1">
              <p>✓ Tarjeta de crédito (hasta 12 cuotas)</p>
              <p>✓ Tarjeta de débito</p>
              <p>✓ Dinero en cuenta MP</p>
              <p>✓ Pago en efectivo (Rapipago, Pago Fácil)</p>
            </div>
          )}

          {/* Transferencia */}
          <button onClick={() => setExpandTransfer(!expandTransfer)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#2F7D6B]/5 border border-[#2F7D6B]/20 rounded-xl hover:bg-[#2F7D6B]/10 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#2F7D6B] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
              </div>
              <span className="text-[13px] font-medium text-[#0A0A0A]">Transferencia bancaria</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2"
              className={`transition-transform ${expandTransfer ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {expandTransfer && (
            <div className="px-4 py-3 bg-[#F5F5F7] rounded-xl text-[12px] text-[#424245] space-y-1.5">
              <p className="font-semibold text-[#0A0A0A]">Alias: <span className="font-mono text-[#2F7D6B]">{BANK_ALIAS}</span></p>
              <p>Titular: Centro ÉCLAT</p>
              <p className="text-[#86868b]">Una vez transferido, mandanos el comprobante por WhatsApp para activar el acceso.</p>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#2F7D6B] font-semibold hover:underline">
                Enviar comprobante →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Incluye */}
      <div className="border-t border-black/5 pt-4 space-y-2">
        <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wide mb-2">Este curso incluye</p>
        {[
          'Acceso de por vida',
          'Materiales descargables (PDF y video)',
          'Cierre del módulo interactivo',
          'Acompañamiento del equipo ÉCLAT',
        ].map(item => (
          <div key={item} className="flex items-center gap-2 text-[13px] text-[#424245]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F7D6B" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
