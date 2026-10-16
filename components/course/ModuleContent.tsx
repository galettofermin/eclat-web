import { toEmbedUrl } from '@/lib/embed'

type Material = { id: string; type: string; title: string; url: string | null }

// Contenido de un módulo desbloqueado: video embebido, PDFs y texto.
// Solo muestra lo que existe — sin placeholders vacíos.
export default function ModuleContent({ materials }: { materials: Material[] }) {
  const videos = materials.filter(m => m.type === 'youtube' || m.type === 'video')
  const pdfs = materials.filter(m => m.type === 'pdf')
  const texts = materials.filter(m => m.type === 'text' || m.type === 'link')

  // Módulo vacío (sin materiales cargados aún)
  if (materials.length === 0) {
    return (
      <div className="px-5 pb-5 pt-3 bg-[#F9F9F9] border-t border-black/[0.04]">
        <p className="text-[13px] text-[#86868b] italic">El contenido de este módulo estará disponible próximamente.</p>
      </div>
    )
  }

  return (
    <div className="px-5 pb-5 pt-3 bg-[#F9F9F9] border-t border-black/[0.04] space-y-4">

      {/* Videos */}
      {videos.map(v => {
        const embed = v.type === 'youtube' ? toEmbedUrl(v.url) : null
        return (
          <div key={v.id}>
            {v.title && <p className="text-[13px] font-medium text-[#0A0A0A] mb-2">{v.title}</p>}
            {embed ? (
              <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ aspectRatio: '16 / 9' }}>
                <iframe
                  src={embed}
                  title={v.title || 'Video del módulo'}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : v.type === 'video' && v.url ? (
              <video src={v.url} controls preload="metadata" className="w-full rounded-xl bg-black" />
            ) : v.url ? (
              <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#2F7D6B] hover:underline font-medium">
                Ver video →
              </a>
            ) : null}
          </div>
        )
      })}

      {/* PDFs */}
      {pdfs.length > 0 && (
        <div className="space-y-1.5">
          {pdfs.map(p => (
            <a
              key={p.id}
              href={p.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-white border border-black/[0.06] hover:border-[#2F7D6B]/40 transition-colors group"
            >
              <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-red-50 text-red-500 text-[10px] font-bold">
                PDF
              </span>
              <span className="text-[13px] font-medium text-[#0A0A0A] group-hover:text-[#2F7D6B] transition-colors flex-1 truncate">
                {p.title}
              </span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </a>
          ))}
        </div>
      )}

      {/* Links / Texto */}
      {texts.map(t => (
        <div key={t.id}>
          {t.url ? (
            <a
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] font-medium text-[#2F7D6B] hover:underline"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              {t.title || t.url}
            </a>
          ) : t.title ? (
            <p className="text-[14px] text-[#424245] leading-relaxed">{t.title}</p>
          ) : null}
        </div>
      ))}

    </div>
  )
}
