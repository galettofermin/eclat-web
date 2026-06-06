type Props = {
  onEdit: () => void
  label?: string
}

export default function AdminEditButton({ onEdit, label = 'Editar' }: Props) {
  return (
    <button
      type="button"
      onClick={onEdit}
      style={{
        background: 'var(--slate-900)',
        color: '#fff',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        padding: '6px 12px',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        lineHeight: 1,
        transition: 'opacity .15s ease',
        flexShrink: 0,
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '.8')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      ✏ {label}
    </button>
  )
}
