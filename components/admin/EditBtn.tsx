'use client'

interface EditBtnProps {
  onClick: () => void
  label?: string
  variant?: 'section' | 'item' | 'delete' | 'add'
  className?: string
}

export default function EditBtn({ onClick, label, variant = 'item', className = '' }: EditBtnProps) {
  const base = 'inline-flex items-center gap-1.5 font-medium transition-all text-[12px] rounded-full px-2.5 py-1 '

  const styles = {
    section: base + 'bg-[#2F7D6B]/90 text-white hover:bg-[#2F7D6B] shadow-lg backdrop-blur-sm',
    item: base + 'bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm',
    delete: base + 'bg-red-500/80 text-white hover:bg-red-600 backdrop-blur-sm',
    add: base + 'bg-[#DCEFE8] text-[#2F7D6B] hover:bg-[#c8e4d8] border border-[#2F7D6B]/30',
  }

  const icons = {
    section: '✏️',
    item: '✏️',
    delete: '🗑',
    add: '+',
  }

  return (
    <button onClick={onClick} className={`${styles[variant]} ${className}`}>
      <span>{icons[variant]}</span>
      {label && <span>{label}</span>}
    </button>
  )
}
