import { createClient } from '@/lib/supabase/server'
import CourseForm from '@/components/admin/CourseForm'
import { notFound } from 'next/navigation'

export default async function EditarCurso({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!course) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#0A0A0A]">Editar curso</h1>
        <p className="text-[15px] text-[#6E6E73] truncate max-w-xl">{course.title}</p>
      </div>
      <div className="bg-white rounded-2xl border border-black/5 p-8">
        <CourseForm course={course} />
      </div>
    </div>
  )
}
