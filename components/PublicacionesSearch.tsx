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
      <div style={{ marginBottom: 40 }}>
        <div style={{ position: 'relative', maxWidth: 560 }}>
          {/* Ícono lupa */}
          <svg
            width="17" height="17"
            viewBox="0 0 24 24" fill="none"
            stroke={query ? '#2F7D6B' : '#adb5bd'} strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 18, top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              transition: 'stroke .2s',
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
              padding: '15px 48px 15px 48px',
              borderRadius: 14,
              border: '1.5px solid rgba(0,0,0,0.09)',
              fontSize: 15,
              background: '#F9FAF9',
              color: '#1B2B26',
              outline: 'none',
              transition: 'border-color .2s, box-shadow .2s, background .2s',
              boxShadow: 'none',
              fontFamily: 'inherit',
              letterSpacing: '-0.01em',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#2F7D6B'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47,125,107,0.12)'
              e.currentTarget.style.background = '#fff'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.09)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.background = '#F9FAF9'
            }}
          />

          {/* Botón borrar */}
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Borrar búsqueda"
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                width: 26, height: 26, borderRadius: '50%',
                background: 'rgba(0,0,0,0.07)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                lineHeight: 0, transition: 'background .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.13)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.07)')}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.8" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* Contador de resultados — aparece solo al buscar */}
        {query && (
          <p style={{
            fontSize: 12, color: '#9ca3af',
            marginTop: 10, marginLeft: 2,
            letterSpacing: '0.01em',
          }}>
            {filtered.length === 0
              ? 'Sin resultados'
              : `${filtered.length} ${filtered.length === 1 ? 'publicación' : 'publicaciones'}`}
          </p>
        )}
      </div>

      {/* Sin resultados */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: '#F5F5F7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#424245', marginBottom: 6 }}>
            Sin resultados para &ldquo;{query}&rdquo;
          </p>
          <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 20 }}>
            Probá con otro término o explorá todas las publicaciones.
          </p>
          <button
            onClick={() => setQuery('')}
            style={{
              padding: '9px 20px', borderRadius: 99,
              background: 'none',
              border: '1.5px solid rgba(47,125,107,0.35)',
              color: '#2F7D6B', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(47,125,107,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            Ver todas
          </button>
        </div>
      ) : (
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
      )}
    </div>
  )
}
