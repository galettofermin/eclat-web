// Convierte un link de YouTube o Vimeo en la URL de su reproductor embebible.
// Devuelve null si no lo reconoce (en ese caso se muestra como link común).
export function toEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null
  let u: URL
  try { u = new URL(url.trim()) } catch { return null }
  const host = u.hostname.replace(/^www\.|^m\./, '')

  if (host === 'youtu.be') {
    const id = u.pathname.slice(1).split('/')[0]
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const id = u.searchParams.get('v') ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1]
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    // vimeo.com/ID/HASH o ?h=HASH: los videos no listados necesitan el hash
    const [, id, pathHash] = u.pathname.match(/(\d+)(?:\/([0-9a-f]+))?/) ?? []
    const hash = u.searchParams.get('h') ?? pathHash
    return id ? `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ''}` : null
  }
  return null
}
