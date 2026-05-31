import CourseForm from '@/components/admin/CourseForm'

export default function NuevoCurso() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#0A0A0A]">Nuevo curso</h1>
        <p className="text-[15px] text-[#6E6E73]">Agregá un nuevo material de formación</p>
      </div>
      <div className="bg-white rounded-2xl border border-black/5 p-8">
        <CourseForm />
      </div>
    </div>
  )
}
