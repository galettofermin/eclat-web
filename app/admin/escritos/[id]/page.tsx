import { createClient } from '@/lib/supabase/server'
import ArticleForm from '@/components/admin/ArticleForm'
import { notFound } from 'next/navigation'

export default async function EditarEscrito({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!article) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#0A0A0A]">Editar escrito</h1>
        <p className="text-[15px] text-[#6E6E73] truncate max-w-xl">{article.title}</p>
      </div>
      <div className="bg-white rounded-2xl border border-black/5 p-8">
        <ArticleForm article={article} />
      </div>
    </div>
  )
}
