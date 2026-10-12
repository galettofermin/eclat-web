'use client'

import CourseRegistrationModal from '@/components/CourseRegistrationModal'

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
  courseTitle: string
  userEmail: string | null
}

const formatPrice = (p: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

export default function CoursePriceCard({
  price, priceOriginal, courseId, courseTitle, userEmail, isFree, freeLink, freeCta,
  isDirector, isEnrolled, isPending, user
}: CoursePriceCardProps) {
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
      {/* Precio (sin precio cargado se omite en vez de mostrar $0) */}
      {price > 0 && (
      <div className="mb-5">
        <div className="flex items-baseline flex-wrap gap-y-1 mb-1">
          {/* Precio anterior tachado solo si es mayor al actual */}
          {priceOriginal > price && (
            <span style={{ fontSize: '16px', color: 'var(--ink-muted)', textDecoration: 'line-through', marginRight: '8px' }}>
              {formatPrice(priceOriginal)}
            </span>
          )}
          <span style={{ fontSize: '26px', fontWeight: 700, color: 'var(--slate-900)' }}>
            {formatPrice(price)}
          </span>
          {discount > 0 && (
            <span className="bg-[#DCEFE8] text-[#2F7D6B] text-[12px] font-bold px-2 py-0.5 rounded-full ml-3">
              -{discount}%
            </span>
          )}
        </div>
        {discount > 0 && (
          <p className="text-[12px] text-[#2F7D6B] font-semibold mt-1">
            ¡Oferta limitada! Ahorrás {formatPrice(priceOriginal - price)}
          </p>
        )}
      </div>
      )}

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
      ) : (
        <>
          <CourseRegistrationModal
            courseId={courseId}
            courseTitle={courseTitle}
            price={price}
            userEmail={userEmail}
            triggerClassName="block w-full text-center bg-[#25655B] text-white font-bold py-4 rounded-xl hover:bg-[#1d5249] transition-colors text-[16px] mb-2 shadow-lg shadow-[#25655B]/25"
          />
          <p className="text-[12px] text-[#86868b] text-center mb-4">
            Dejanos tus datos y te contactamos para confirmar tu lugar.
          </p>
        </>
      )}


      {/* Incluye */}
      <div className="border-t border-black/5 pt-4 space-y-2">
        <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wide mb-2">Este curso incluye</p>
        {[
          'Acceso ilimitado al contenido',
          'Certificación al completar el curso',
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
