import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { WA_URL } from '@/lib/constants'
import { WaIcon } from '@/components/WaIcon'
import ArticleAdminActions, { NewArticleButton } from '@/components/ArticleAdminActions'
import { AnimatedSection } from '@/components/AnimatedSection'
import { StaggerList, StaggerItem } from '@/components/StaggerList'
import { HoverCard } from '@/components/HoverCard'

export const dynamic = 'force-dynamic'

export default async function PublicacionesPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('articles')
    .select('id, title, excerpt, image_url')
    .eq('published', true)
    .order('created_at', { ascending: false })
  const articles = data ?? []

  return (
    <>
      <section className="phead">
        <AnimatedSection className="wrap">
          <nav className="crumb"><Link href="/">Inicio</Link>&nbsp;/&nbsp;<b>Publicaciones</b></nav>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1>Pensar la <em>práctica.</em></h1>
              <p className="phead__lede">
                La producción de conocimiento es una dimensión central de la identidad de ÉCLAT.
                Artículos, recursos y materiales sobre salud mental y educación.
              </p>
            </div>
            <NewArticleButton />
          </div>
        </AnimatedSection>
      </section>

      <section className="section">
        <div className="wrap">
          {articles.length === 0 ? (
            <AnimatedSection style={{ textAlign: 'center', padding: '72px 24px', color: 'var(--ink-muted)' }}>
              <p style={{ fontSize: 18, marginBottom: 8 }}>Próximamente.</p>
              <p style={{ fontSize: 15 }}>Estamos preparando los primeros artículos.</p>
            </AnimatedSection>
          ) : (
            <StaggerList className="writings">
              {articles.map(a => (
                <StaggerItem key={a.id}>
                <HoverCard className="writing" style={{ position: 'relative' }}>
                  <ArticleAdminActions id={a.id} />
                  {a.image_url && (
                    // La imagen también lleva al artículo; fuera del orden de tabulación para no duplicar el link del título
                    <Link href={`/publicaciones/${a.id}`} tabIndex={-1} aria-hidden="true"
                      style={{ display: 'block', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '10px', marginBottom: '14px' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Link>
                  )}
                  <h3>
                    <Link href={`/publicaciones/${a.id}`} style={{ color: 'inherit' }}>{a.title}</Link>
                  </h3>
                  <p>{a.excerpt}</p>
                  <span className="writing__meta">
                    <Link href={`/publicaciones/${a.id}`} style={{ color: 'var(--sage-text)', fontWeight: 700 }}>
                      Leer →
                    </Link>
                  </span>
                </HoverCard>
                </StaggerItem>
              ))}
            </StaggerList>
          )}
        </div>
      </section>

      <section className="ctaband">
        <div className="wrap">
          <div>
            <h2>¿Querés escribir con nosotros?</h2>
            <p>Recibimos producciones del equipo y de colegas que quieran compartir su práctica.</p>
          </div>
          <a
            className="btn-wa"
            href={WA_URL('Hola ÉCLAT, quisiera proponer una publicación.')}
            target="_blank" rel="noopener noreferrer"
          >
            <WaIcon />Proponer una publicación
          </a>
        </div>
      </section>
    </>
  )
}
