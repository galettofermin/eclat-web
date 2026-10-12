-- Inscripciones a cursos desde el modal de la página del curso.
-- La API (/api/registrations) inserta con la service role key después de validar,
-- así que no hace falta una policy pública de INSERT. Solo el director puede leer.
CREATE TABLE IF NOT EXISTS public.course_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  course_title TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  localidad TEXT NOT NULL,
  rol TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.course_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin lee inscripciones" ON public.course_registrations
  FOR SELECT USING (auth.jwt() ->> 'email' = 'galettofermin@gmail.com');
