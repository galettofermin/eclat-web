import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { WA_URL } from '@/lib/constants'
import { WaIcon } from '@/components/WaIcon'
import { NewArticleButton } from '@/components/ArticleAdminActions'
import { AnimatedSection } from '@/components/AnimatedSection'
import { PublicacionesSearch } from '@/components/PublicacionesSearch'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Publicaciones',
  description: 'Artículos y recursos sobre salud mental, infancia, adolescencia, educación e inclusión escolar. Producción clínica y reflexión sobre la práctica interdisciplinaria del equipo ÉCLAT.',
  keywords: [
    'artículos salud mental', 'infancia y salud mental', 'adolescencia psicología',
    'inclusión escolar recursos', 'autismo educación', 'TDAH estrategias',
    'psicopedagogía artículos', 'fonoaudiología infancia', 'práctica clínica',
  ],
  alternates: { canonical: 'https://eclatcentro.com/publicaciones' },
}

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
            <PublicacionesSearch articles={articles} />
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
