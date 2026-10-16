'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { HoverCard } from '@/components/HoverCard'
import ArticleAdminActions from '@/components/ArticleAdminActions'

type Article = {
  id: string
  title: string
  excerpt: string | null
  image_url: string | null
}

export function PublicacionesSearch({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return articles
    return articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      (a.excerpt ?? '').toLowerCase().includes(q)
    )
  }, [articles, query])

  return (
    <div>
      {/* Buscador */}
      <div style={{
        position: 'relative',
        maxWidth: 460,
        marginBottom: 36,
      }}>
        <svg
          width="16" height="16"
          viewBox="0 0 24 24" fill="none"
          stroke="#9ca3af" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 14, top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        >
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por título o tema…"
          aria-label="Buscar publicaciones"
          style={{
            width: '100%',
            padding: '13px 16px 13px 40px',
            borderRadius: 12,
            border: '1.5px solid rgba(0,0,0,0.10)',
            fontSize: 15,
            background: '#fff',
            color: '#1B2B26',
            outline: 'none',
            transition: 'border-color .15s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            fontFamily: 'inherit',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#2F7D6B')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.10)')}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Borrar búsqueda"
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9ca3af', padding: 4, lineHeight: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Resultados */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--ink-muted)' }}>
          <p style={{ fontSize: 17 }}>
            No encontramos publicaciones para <strong>&ldquo;{query}&rdquo;</strong>.
          </p>
          <button
            onClick={() => setQuery('')}
            style={{
              marginTop: 12, background: 'none', border: 'none',
              color: 'var(--sage-text)', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Ver todas las publicaciones
          </button>
        </div>
      ) : (
        <>
          {query && (
            <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
              {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'} para &ldquo;{query}&rdquo;
            </p>
          )}
          <div className="writings">
            {filtered.map(a => (
              <HoverCard key={a.id} className="writing" style={{ position: 'relative' }}>
                <ArticleAdminActions id={a.id} />
                {a.image_url && (
                  <Link href={`/publicaciones/${a.id}`} tabIndex={-1} aria-hidden="true"
                    style={{ display: 'block', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '10px', marginBottom: '14px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.image_url} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Link>
                )}
                <h3>
                  <Link href={`/publicaciones/${a.id}`} style={{ color: 'inherit' }}>{a.title}</Link>
                </h3>
                {a.excerpt && <p>{a.excerpt}</p>}
                <span className="writing__meta">
                  <Link href={`/publicaciones/${a.id}`} style={{ color: 'var(--sage-text)', fontWeight: 700 }}>
                    Leer →
                  </Link>
                </span>
              </HoverCard>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
