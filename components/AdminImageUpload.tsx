'use client'
import { useRef, useState } from 'react'

type Props = {
  src: string | null
  bucket: string
  path: string
  isAdmin: boolean
  onUpdate: (url: string) => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function AdminImageUpload({
  src, bucket, path, isAdmin, onUpdate, children, className, style,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const fd = new FormData()
    fd.append('file', file)
    fd.append('bucket', bucket)
    fd.append('path', path)

    const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const json = await res.json()
    if (json.url) onUpdate(json.url)

    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div
      className={`admin-photo-wrap${className ? ' ' + className : ''}`}
      style={style}
    >
      {src ? (
        <img
          src={src}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : children}

      {isAdmin && (
        <>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="admin-photo-overlay"
          >
            {uploading ? 'Subiendo…' : '✏ Cambiar foto'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
        </>
      )}
    </div>
  )
}
