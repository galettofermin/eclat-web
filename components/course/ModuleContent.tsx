import { toEmbedUrl } from '@/lib/embed'

type Material = { id: string; type: string; title: string; url: string | null }

const Placeholder = ({ label }: { label: string }) => (
  <div className="rounded-xl border border-dashed border-black/10 bg-[#FAFAFA] px-4 py-3 text-[12px] text-[#86868b]">
    {label} — próximamente
  </div>
)

// Contenido de un módulo desbloqueado: video embebido, PDFs y texto.
// Lo que todavía no se cargó desde el admin se muestra como placeholder.
export default function ModuleContent({ materials }: { materials: Material[] }) {
  const videos = materials.filter(m => m.type === 'youtube' || m.type === 'video')
  const pdfs = materials.filter(m => m.type === 'pdf')

  return (
    <div className="px-5 pb-5 pt-3 bg-[#F9F9F9] border-t border-black/[0.04] space-y-4">
      {videos.length ? videos.map(v => {
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
              <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#2F7D6B] hover:underline">Ver video →</a>
            ) : null}
          </div>
        )
      }) : <Placeholder label="Video" />}

      {pdfs.length ? (
        <div className="space-y-1.5">
          {pdfs.map(p => (
            <a key={p.id} href={p.url ?? '#'} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white border border-black/[0.05] hover:border-[#2F7D6B]/40 transition-colors group">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-red-50 text-red-500 text-[10px] font-bold">PDF</span>
              <span className="text-[13px] font-medium text-[#0A0A0A] group-hover:text-[#2F7D6B] transition-colors flex-1 truncate">{p.title}</span>
              <span className="text-[12px] text-[#86868b] shrink-0">Abrir →</span>
            </a>
          ))}
        </div>
      ) : <Placeholder label="PDF" />}

      <Placeholder label="Texto del módulo" />
    </div>
  )
}
