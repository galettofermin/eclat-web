import ArticleForm from '@/components/admin/ArticleForm'

export default function NuevoEscrito() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#0A0A0A]">Nuevo escrito</h1>
        <p className="text-[15px] text-[#6E6E73]">Creá un nuevo artículo para la sección Escritos</p>
      </div>
      <div className="bg-white rounded-2xl border border-black/5 p-8">
        <ArticleForm />
      </div>
    </div>
  )
}
