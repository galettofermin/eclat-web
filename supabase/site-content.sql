CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "auth all" ON public.site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO public.site_content (key, value) VALUES
  ('home.hero.title', 'Salud mental, educación y acompañamiento interdisciplinario.'),
  ('home.hero.lede', 'Construimos respuestas singulares frente a los desafíos que presentan las trayectorias de niños, adolescentes, familias e instituciones.'),
  ('home.quote', 'No existen respuestas universales para situaciones singulares.'),
  ('conocer.hero.title', 'ÉCLAT, de cerca.'),
  ('conocer.hero.lede', 'ÉCLAT articula salud mental, educación y formación para construir respuestas frente a los desafíos contemporáneos, reconociendo la singularidad de cada trayectoria.'),
  ('servicios.hero.title', 'Un lugar para cada situación.'),
  ('formacion.hero.title', 'Cursos, seminarios y trayectos formativos.'),
  ('formacion.hero.lede', 'La formación es uno de los pilares estratégicos de ÉCLAT.')
ON CONFLICT (key) DO NOTHING;
