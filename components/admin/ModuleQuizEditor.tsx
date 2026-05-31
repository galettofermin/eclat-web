'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ModuleQuiz, QuizQuestion } from '@/lib/types'

const LETTERS = ['A', 'B', 'C', 'D']

interface QuestionFormProps {
  initial?: QuizQuestion
  onSave: (data: Omit<QuizQuestion, 'id' | 'quiz_id' | 'created_at'>) => Promise<void>
  onCancel: () => void
}

function QuestionForm({ initial, onSave, onCancel }: QuestionFormProps) {
  const [question, setQuestion] = useState(initial?.question ?? '')
  const [options, setOptions] = useState<string[]>(initial?.options ?? ['', '', '', ''])
  const [correct, setCorrect] = useState(initial?.correct_index ?? 0)
  const [explanation, setExplanation] = useState(initial?.explanation ?? '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || options.some(o => !o.trim())) return
    setLoading(true)
    await onSave({ question, options, correct_index: correct, explanation, sort_order: initial?.sort_order ?? 0 })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#F5F5F7] rounded-2xl p-5 space-y-4 border border-black/[0.06]">
      <div>
        <label className="block text-[12px] font-semibold text-[#0A0A0A] mb-1.5 uppercase tracking-wide">Pregunta</label>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          rows={2}
          required
          placeholder="Escribí la pregunta..."
          className="w-full px-3 py-2.5 rounded-xl border border-black/10 text-[14px] focus:outline-none focus:border-[#2F7D6B] transition-colors resize-none bg-white"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[12px] font-semibold text-[#0A0A0A] uppercase tracking-wide">Opciones
          <span className="text-[#86868b] font-normal normal-case tracking-normal ml-1">— marcá la correcta</span>
        </label>
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCorrect(i)}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                correct === i
                  ? 'bg-[#2F7D6B] border-[#2F7D6B] text-white'
                  : 'border-black/20 text-[#86868b] hover:border-[#2F7D6B]/50'
              }`}
            >
              {LETTERS[i]}
            </button>
            <input
              type="text"
              value={opt}
              onChange={e => { const n = [...options]; n[i] = e.target.value; setOptions(n) }}
              required
              placeholder={`Opción ${LETTERS[i]}`}
              className="flex-1 px-3 py-2 rounded-xl border border-black/10 text-[13px] focus:outline-none focus:border-[#2F7D6B] transition-colors bg-white"
            />
          </div>
        ))}
        <p className="text-[11px] text-[#86868b]">El círculo verde indica la respuesta correcta</p>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#0A0A0A] mb-1.5 uppercase tracking-wide">
          Explicación <span className="text-[#86868b] font-normal normal-case tracking-normal">(opcional, aparece al corregir)</span>
        </label>
        <input
          type="text"
          value={explanation}
          onChange={e => setExplanation(e.target.value)}
          placeholder="Ej: La respuesta correcta es B porque..."
          className="w-full px-3 py-2.5 rounded-xl border border-black/10 text-[13px] focus:outline-none focus:border-[#2F7D6B] transition-colors bg-white"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={loading}
          className="bg-[#2F7D6B] text-white font-semibold px-5 py-2.5 rounded-full text-[13px] hover:bg-[#245f52] disabled:opacity-60 transition-colors">
          {loading ? 'Guardando...' : initial ? 'Guardar cambios' : 'Agregar pregunta'}
        </button>
        <button type="button" onClick={onCancel}
          className="text-[13px] font-medium text-[#6E6E73] px-4 py-2.5 rounded-full hover:bg-[#F5F5F7] transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default function ModuleQuizEditor({ moduleId }: { moduleId: string }) {
  const [quiz, setQuiz] = useState<ModuleQuiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const load = async () => {
    const supabase = createClient()
    const { data: quizData } = await supabase
      .from('module_quizzes').select('*').eq('module_id', moduleId).maybeSingle()

    if (quizData) {
      setQuiz(quizData)
      const { data: qs } = await supabase
        .from('quiz_questions').select('*').eq('quiz_id', quizData.id).order('sort_order')
      setQuestions(qs ?? [])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [moduleId])

  const ensureQuiz = async (): Promise<string> => {
    if (quiz) return quiz.id
    const supabase = createClient()
    const { data } = await supabase
      .from('module_quizzes').insert({ module_id: moduleId, title: 'Cierre del módulo' }).select().single()
    setQuiz(data!)
    return data!.id
  }

  const addQuestion = async (data: Omit<QuizQuestion, 'id' | 'quiz_id' | 'created_at'>) => {
    const quizId = await ensureQuiz()
    const supabase = createClient()
    const { data: q } = await supabase
      .from('quiz_questions')
      .insert({ ...data, quiz_id: quizId, sort_order: questions.length })
      .select().single()
    if (q) setQuestions(prev => [...prev, q])
    setShowAddForm(false)
  }

  const updateQuestion = async (id: string, data: Omit<QuizQuestion, 'id' | 'quiz_id' | 'created_at'>) => {
    const supabase = createClient()
    await supabase.from('quiz_questions').update(data).eq('id', id)
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...data } : q))
    setEditingId(null)
  }

  const deleteQuestion = async (id: string) => {
    if (!confirm('¿Eliminar esta pregunta?')) return
    const supabase = createClient()
    await supabase.from('quiz_questions').delete().eq('id', id)
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  if (loading) return (
    <div className="flex items-center gap-2 py-3 text-[13px] text-[#6E6E73]">
      <div className="w-3 h-3 border border-[#2F7D6B] border-t-transparent rounded-full animate-spin" />
      Cargando cierre...
    </div>
  )

  return (
    <div className="mt-4 border-t-2 border-dashed border-[#2F7D6B]/30 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#2F7D6B]" />
          <span className="text-[13px] font-bold text-[#2F7D6B] uppercase tracking-[0.12em]">Cierre del módulo</span>
          {questions.length > 0 && (
            <span className="text-[11px] text-[#86868b] bg-[#F5F5F7] px-2 py-0.5 rounded-full">
              {questions.length} pregunta{questions.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)}
            className="text-[12px] font-semibold text-[#2F7D6B] bg-[#DCEFE8] px-3 py-1.5 rounded-full hover:bg-[#c8e4d8] transition-colors">
            + Agregar pregunta
          </button>
        )}
      </div>

      {/* Existing questions */}
      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div key={q.id}>
            {editingId === q.id ? (
              <QuestionForm
                initial={q}
                onSave={data => updateQuestion(q.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="bg-white rounded-xl border border-black/[0.06] p-4 group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-[13px] font-semibold text-[#0A0A0A] flex-1">
                    <span className="text-[#86868b] mr-1.5">{idx + 1}.</span>
                    {q.question}
                  </p>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => setEditingId(q.id)}
                      className="text-[11px] font-medium text-[#2F7D6B] bg-[#DCEFE8] px-2.5 py-1 rounded-full hover:bg-[#c8e4d8] transition-colors">
                      Editar
                    </button>
                    <button onClick={() => deleteQuestion(q.id)}
                      className="text-[11px] font-medium text-red-500 bg-red-50 px-2.5 py-1 rounded-full hover:bg-red-100 transition-colors">
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`flex items-center gap-2 text-[12px] px-3 py-1.5 rounded-lg ${
                      i === q.correct_index
                        ? 'bg-[#DCEFE8] text-[#2F7D6B] font-semibold'
                        : 'text-[#424245]'
                    }`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        i === q.correct_index ? 'bg-[#2F7D6B] text-white' : 'bg-[#F5F5F7] text-[#86868b]'
                      }`}>
                        {LETTERS[i]}
                      </span>
                      {opt}
                      {i === q.correct_index && <span className="ml-auto text-[10px]">✓ correcta</span>}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <p className="text-[11px] text-[#86868b] mt-2 pl-1 italic">💡 {q.explanation}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="mt-3">
          <QuestionForm onSave={addQuestion} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      {questions.length === 0 && !showAddForm && (
        <div className="text-center py-6 bg-[#F5F5F7] rounded-xl border-2 border-dashed border-black/[0.08]">
          <p className="text-[13px] text-[#86868b] mb-2">Todavía no hay preguntas en este cierre</p>
          <button onClick={() => setShowAddForm(true)}
            className="text-[13px] font-semibold text-[#2F7D6B] hover:underline">
            + Agregar la primera pregunta
          </button>
        </div>
      )}
    </div>
  )
}
