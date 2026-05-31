'use client'

import { useState } from 'react'
import type { QuizQuestion } from '@/lib/types'

const LETTERS = ['A', 'B', 'C', 'D']

interface CourseQuizProps {
  questions: QuizQuestion[]
}

export default function CourseQuiz({ questions }: CourseQuizProps) {
  const [selected, setSelected] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  if (!questions.length) return null

  const correct = submitted
    ? questions.filter(q => selected[q.id] === q.correct_index).length
    : 0

  const allAnswered = questions.every(q => selected[q.id] !== undefined)

  return (
    <div className="mt-8 border-t-2 border-[#2F7D6B]/20 pt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-[#2F7D6B] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-[#0A0A0A]">Cierre del módulo</h3>
          <p className="text-[12px] text-[#6E6E73]">{questions.length} pregunta{questions.length !== 1 ? 's' : ''} · Respondé todas para continuar</p>
        </div>
      </div>

      {/* Resultado */}
      {submitted && (
        <div className={`mb-6 rounded-2xl p-5 flex items-center gap-4 ${
          correct === questions.length
            ? 'bg-[#DCEFE8] border border-[#2F7D6B]/20'
            : correct >= questions.length / 2
            ? 'bg-amber-50 border border-amber-200'
            : 'bg-red-50 border border-red-100'
        }`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[22px] shrink-0 ${
            correct === questions.length ? 'bg-[#2F7D6B]' : correct >= questions.length / 2 ? 'bg-amber-400' : 'bg-red-400'
          }`}>
            {correct === questions.length ? '🎉' : correct >= questions.length / 2 ? '👍' : '📖'}
          </div>
          <div>
            <p className={`text-[16px] font-bold ${
              correct === questions.length ? 'text-[#2F7D6B]' : correct >= questions.length / 2 ? 'text-amber-700' : 'text-red-600'
            }`}>
              {correct === questions.length
                ? '¡Perfecto! Todas correctas.'
                : `${correct} de ${questions.length} correctas`}
            </p>
            <p className="text-[13px] text-[#6E6E73] mt-0.5">
              {correct === questions.length
                ? 'Completaste el módulo exitosamente.'
                : 'Revisá las respuestas y repasá el material del módulo.'}
            </p>
          </div>
        </div>
      )}

      {/* Preguntas */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const userAnswer = selected[q.id]
          const isCorrect = submitted && userAnswer === q.correct_index
          const isWrong = submitted && userAnswer !== undefined && userAnswer !== q.correct_index

          return (
            <div key={q.id} className={`rounded-2xl border p-5 transition-colors ${
              submitted
                ? isCorrect ? 'border-[#2F7D6B]/30 bg-[#DCEFE8]/20' : isWrong ? 'border-red-200 bg-red-50/30' : 'border-black/[0.06] bg-white'
                : 'border-black/[0.06] bg-white'
            }`}>
              <p className="text-[14px] font-semibold text-[#0A0A0A] mb-4">
                <span className="text-[#86868b] mr-1.5 font-normal">{idx + 1}.</span>
                {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isSelected = userAnswer === i
                  const isCorrectOption = submitted && i === q.correct_index
                  const isWrongSelected = submitted && isSelected && i !== q.correct_index

                  return (
                    <button
                      key={i}
                      onClick={() => !submitted && setSelected(s => ({ ...s, [q.id]: i }))}
                      disabled={submitted}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                        isCorrectOption
                          ? 'border-[#2F7D6B] bg-[#DCEFE8]'
                          : isWrongSelected
                          ? 'border-red-400 bg-red-50'
                          : isSelected
                          ? 'border-[#2F7D6B] bg-[#DCEFE8]/50'
                          : 'border-black/[0.08] bg-white hover:border-[#2F7D6B]/40 hover:bg-[#F5F5F7]'
                      } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 transition-colors ${
                        isCorrectOption
                          ? 'bg-[#2F7D6B] text-white'
                          : isWrongSelected
                          ? 'bg-red-400 text-white'
                          : isSelected
                          ? 'bg-[#2F7D6B]/20 text-[#2F7D6B]'
                          : 'bg-[#F5F5F7] text-[#86868b]'
                      }`}>
                        {submitted && isCorrectOption ? '✓' : submitted && isWrongSelected ? '✗' : LETTERS[i]}
                      </span>
                      <span className={`text-[13px] font-medium ${
                        isCorrectOption ? 'text-[#2F7D6B]' : isWrongSelected ? 'text-red-600' : 'text-[#0A0A0A]'
                      }`}>
                        {opt}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Explicación */}
              {submitted && q.explanation && (
                <div className="mt-3 flex items-start gap-2 bg-white/70 rounded-xl px-4 py-3 border border-black/5">
                  <span className="text-[#2F7D6B] text-[14px] shrink-0">💡</span>
                  <p className="text-[13px] text-[#424245]">{q.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Submit / Retry */}
      <div className="mt-6 flex gap-3">
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={!allAnswered}
            className="bg-[#2F7D6B] text-white font-semibold px-7 py-3 rounded-full text-[15px] hover:bg-[#245f52] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-[#2F7D6B]/20"
          >
            {allAnswered ? 'Verificar respuestas' : `Respondé todas (${Object.keys(selected).length}/${questions.length})`}
          </button>
        ) : (
          <button
            onClick={() => { setSelected({}); setSubmitted(false) }}
            className="border border-[#2F7D6B]/30 text-[#2F7D6B] font-semibold px-7 py-3 rounded-full text-[15px] hover:bg-[#DCEFE8]/30 transition-colors"
          >
            Intentar de nuevo
          </button>
        )}
      </div>
    </div>
  )
}
