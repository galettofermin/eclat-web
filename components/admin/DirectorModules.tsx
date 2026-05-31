'use client'

import ModulesEditor from './ModulesEditor'

interface DirectorModulesProps {
  courseId: string
  initialModules: unknown[]
}

export default function DirectorModules({ courseId }: DirectorModulesProps) {
  return (
    <div className="border-2 border-dashed border-[#2F7D6B]/30 rounded-2xl p-5 bg-[#DCEFE8]/10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#2F7D6B] animate-pulse" />
        <p className="text-[13px] font-semibold text-[#2F7D6B]">Editor de módulos — solo visible para vos</p>
      </div>
      <ModulesEditor courseId={courseId} />
    </div>
  )
}
