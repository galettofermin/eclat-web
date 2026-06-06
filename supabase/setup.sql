-- ================================================================
-- ÉCLAT — Setup completo de base de datos
-- Ejecutar en Supabase SQL Editor (dashboard.supabase.com)
-- ================================================================

-- ── Tabla: articles ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.articles (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT        NOT NULL,
  category    TEXT        DEFAULT '',
  excerpt     TEXT        DEFAULT '',
  content     TEXT        DEFAULT '',
  image_url   TEXT        DEFAULT '',
  read_time   TEXT        DEFAULT '5 min',
  featured    BOOLEAN     DEFAULT false,
  published   BOOLEAN     DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Agregar image_url si la tabla ya existe sin esa columna
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';

-- ── Tabla: services (títulos y descripciones) ────────────────────
CREATE TABLE IF NOT EXISTS public.services (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT        NOT NULL,
  description TEXT        DEFAULT '',
  sort_order  INTEGER     DEFAULT 0,
  published   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── Tabla: servicios (imágenes, linked por nombre) ───────────────
CREATE TABLE IF NOT EXISTS public.servicios (
  id          SERIAL      PRIMARY KEY,
  nombre      TEXT        NOT NULL UNIQUE,
  descripcion TEXT        DEFAULT '',
  imagen_url  TEXT        DEFAULT '',
  orden       INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── Seed: 8 áreas de servicios ───────────────────────────────────
INSERT INTO public.services (title, description, sort_order, published) VALUES
  ('Psicología',                   'Atención clínica de niños, adolescentes y adultos. Un espacio de escucha para alojar el malestar y construir, caso por caso, una salida posible.', 1, true),
  ('Psicopedagogía',               'Acompañamos los procesos de aprendizaje y la trayectoria escolar, leyendo la dificultad más allá del rendimiento.', 2, true),
  ('Fonoaudiología',               'Lenguaje, voz, habla y comunicación en cada etapa del desarrollo, con abordajes situados.', 3, true),
  ('Psicomotricidad',              'El cuerpo en movimiento como vía de expresión, juego y desarrollo.', 4, true),
  ('Inclusión Escolar',            'Apoyos y articulación con la escuela y la familia para sostener trayectorias educativas: PPI, DAI y acompañamiento.', 5, true),
  ('Evaluaciones Interdisciplinarias', 'Lecturas integrales y situadas entre distintas disciplinas, que orientan cada intervención.', 6, true),
  ('Orientación a Familias',       'Un espacio para pensar la crianza, los vínculos y los desafíos cotidianos.', 7, true),
  ('Asesoramiento Institucional',  'Acompañamos a escuelas e instituciones frente a situaciones complejas, construyendo respuestas conjuntas.', 8, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.servicios (nombre, descripcion, imagen_url, orden) VALUES
  ('Psicología',                   'Atención clínica de niños, adolescentes y adultos.', '', 1),
  ('Psicopedagogía',               'Acompañamos los procesos de aprendizaje.', '', 2),
  ('Fonoaudiología',               'Lenguaje, voz, habla y comunicación.', '', 3),
  ('Psicomotricidad',              'El cuerpo en movimiento.', '', 4),
  ('Inclusión Escolar',            'Apoyos y articulación con la escuela.', '', 5),
  ('Evaluaciones Interdisciplinarias', 'Lecturas integrales y situadas.', '', 6),
  ('Orientación a Familias',       'Un espacio para pensar la crianza.', '', 7),
  ('Asesoramiento Institucional',  'Acompañamos a escuelas e instituciones.', '', 8)
ON CONFLICT (nombre) DO NOTHING;

-- ── RLS ─────────────────────────────────────────────────────────
ALTER TABLE public.articles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;

-- articles: autenticados pueden todo; anon solo lee publicados
DROP POLICY IF EXISTS "articles_auth_all"  ON public.articles;
DROP POLICY IF EXISTS "articles_anon_read" ON public.articles;
CREATE POLICY "articles_auth_all"  ON public.articles FOR ALL     TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "articles_anon_read" ON public.articles FOR SELECT  TO anon           USING (published = true);

-- services: autenticados pueden todo; anon lee
DROP POLICY IF EXISTS "services_auth_all"  ON public.services;
DROP POLICY IF EXISTS "services_anon_read" ON public.services;
CREATE POLICY "services_auth_all"  ON public.services FOR ALL    TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "services_anon_read" ON public.services FOR SELECT TO anon           USING (true);

-- servicios: service_role bypasa RLS; anon lee
DROP POLICY IF EXISTS "servicios_anon_read" ON public.servicios;
CREATE POLICY "servicios_anon_read" ON public.servicios FOR SELECT TO anon USING (true);
-- autenticados también necesitan leer (admin panel)
DROP POLICY IF EXISTS "servicios_auth_all" ON public.servicios;
CREATE POLICY "servicios_auth_all" ON public.servicios FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── Storage buckets ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('servicios', 'servicios', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('articulos',  'articulos',  true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies: servicios
DROP POLICY IF EXISTS "servicios_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "servicios_auth_upload"  ON storage.objects;
DROP POLICY IF EXISTS "servicios_auth_update"  ON storage.objects;
DROP POLICY IF EXISTS "servicios_auth_delete"  ON storage.objects;
CREATE POLICY "servicios_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'servicios');
CREATE POLICY "servicios_auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'servicios');
CREATE POLICY "servicios_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'servicios');
CREATE POLICY "servicios_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'servicios');

-- Storage policies: articulos
DROP POLICY IF EXISTS "articulos_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "articulos_auth_upload"  ON storage.objects;
DROP POLICY IF EXISTS "articulos_auth_update"  ON storage.objects;
DROP POLICY IF EXISTS "articulos_auth_delete"  ON storage.objects;
CREATE POLICY "articulos_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'articulos');
CREATE POLICY "articulos_auth_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'articulos');
CREATE POLICY "articulos_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'articulos');
CREATE POLICY "articulos_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'articulos');
