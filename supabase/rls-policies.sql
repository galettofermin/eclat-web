-- ============================================================
-- ÉCLAT — Políticas de Row Level Security (RLS)
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. TABLA: suscriptores ────────────────────────────────
CREATE TABLE IF NOT EXISTS suscriptores (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      text        UNIQUE NOT NULL,
  nombre     text,
  lista      text        DEFAULT 'general',
  activo     boolean     DEFAULT true,
  creado_en  timestamptz DEFAULT now()
);

ALTER TABLE suscriptores ENABLE ROW LEVEL SECURITY;

-- Solo el admin puede leer
CREATE POLICY "Admin lee suscriptores" ON suscriptores
  FOR SELECT USING (
    auth.jwt() ->> 'email' = 'galettofermin@gmail.com'
  );

-- Cualquier visitante puede suscribirse
CREATE POLICY "Cualquiera puede suscribirse" ON suscriptores
  FOR INSERT WITH CHECK (true);

-- ── 2. TABLA: enrollments ─────────────────────────────────
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Usuario ve sus propias inscripciones
CREATE POLICY "Usuario ve sus inscripciones" ON enrollments
  FOR SELECT USING (auth.uid() = user_id);

-- Usuario puede crear su propia inscripción (transferencia)
CREATE POLICY "Usuario crea su inscripcion" ON enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin ve y gestiona todo
CREATE POLICY "Admin gestiona inscripciones" ON enrollments
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'galettofermin@gmail.com'
  );

-- Webhook de MP puede insertar/actualizar (service role bypasa RLS)
-- No se necesita policy especial: createAdminClient() usa service role key

-- ── 3. TABLA: module_progress ────────────────────────────
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve su progreso" ON module_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuario registra su progreso" ON module_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario actualiza su progreso" ON module_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin ve todo el progreso" ON module_progress
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'galettofermin@gmail.com'
  );

-- ── 4. TABLA: quiz_results ───────────────────────────────
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve sus resultados" ON quiz_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuario guarda sus resultados" ON quiz_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin ve todos los resultados" ON quiz_results
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'galettofermin@gmail.com'
  );

-- ── 5. TABLA: site_config ────────────────────────────────
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Lectura pública (textos del sitio)
CREATE POLICY "Lectura publica site_config" ON site_config
  FOR SELECT USING (true);

-- Solo admin puede escribir
CREATE POLICY "Admin escribe site_config" ON site_config
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'galettofermin@gmail.com'
  );

-- ── 6. TABLAS de cursos y contenido (solo lectura pública) ──
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cursos publicados son publicos" ON courses
  FOR SELECT USING (published = true);
CREATE POLICY "Admin gestiona cursos" ON courses
  FOR ALL USING (auth.jwt() ->> 'email' = 'galettofermin@gmail.com');

ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Modulos publicos" ON course_modules
  FOR SELECT USING (true);
CREATE POLICY "Admin gestiona modulos" ON course_modules
  FOR ALL USING (auth.jwt() ->> 'email' = 'galettofermin@gmail.com');

ALTER TABLE module_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Materiales publicos" ON module_materials
  FOR SELECT USING (true);
CREATE POLICY "Admin gestiona materiales" ON module_materials
  FOR ALL USING (auth.jwt() ->> 'email' = 'galettofermin@gmail.com');

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Articulos publicados son publicos" ON articles
  FOR SELECT USING (published = true);
CREATE POLICY "Admin gestiona articulos" ON articles
  FOR ALL USING (auth.jwt() ->> 'email' = 'galettofermin@gmail.com');

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Servicios publicados son publicos" ON services
  FOR SELECT USING (published = true);
CREATE POLICY "Admin gestiona servicios" ON services
  FOR ALL USING (auth.jwt() ->> 'email' = 'galettofermin@gmail.com');
