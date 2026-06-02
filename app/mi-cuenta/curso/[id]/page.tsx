import { redirect } from 'next/navigation'

export default function MiCuentaCurso({ params }: { params: { id: string } }) {
  redirect(`/cursos/${params.id}`)
}
