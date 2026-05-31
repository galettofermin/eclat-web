export interface Article {
  id: string
  title: string
  category: string
  excerpt: string
  content: string
  read_time: string
  featured: boolean
  published: boolean
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  badge: string
  badge_type: 'free' | 'soon'
  link: string | null
  cta: string | null
  sort_order: number
  published: boolean
  price: number
  is_free: boolean
  // Campos enriquecidos
  long_description: string
  target_audience: string
  learnings: string        // Una línea por objetivo
  syllabus: string         // Una línea por tema del temario
  duration: string
  modality: string
  level: string
}

export interface CourseModule {
  id: string
  course_id: string
  title: string
  sort_order: number
  created_at: string
}

export interface ModuleMaterial {
  id: string
  module_id: string
  type: 'pdf' | 'video' | 'youtube'
  title: string
  url: string | null
  file_path: string | null
  sort_order: number
  created_at: string
}

export interface CourseModuleWithMaterials extends CourseModule {
  materials: ModuleMaterial[]
}

export interface Service {
  id: string
  title: string
  description: string
  sort_order: number
  published: boolean
}

export interface SiteConfig {
  key: string
  value: string
  updated_at: string
}
