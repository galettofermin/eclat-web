-- ============================================================
-- ÉCLAT — Tabla de mensajería interna
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS mensajes (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  de         text        NOT NULL,   -- user_id remitente
  para       text        NOT NULL,   -- user_id destinatario
  contenido  text        NOT NULL,
  leido      boolean     DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mensajes_de_idx ON mensajes(de);
CREATE INDEX IF NOT EXISTS mensajes_para_idx ON mensajes(para);
CREATE INDEX IF NOT EXISTS mensajes_created_at_idx ON mensajes(created_at DESC);

ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;

-- Usuario ve sus propios mensajes (enviados y recibidos)
CREATE POLICY "Usuario ve sus mensajes" ON mensajes
  FOR SELECT USING (
    auth.uid()::text = de OR auth.uid()::text = para
  );

-- Usuario solo puede enviar desde su propia cuenta
CREATE POLICY "Usuario puede enviar mensajes" ON mensajes
  FOR INSERT WITH CHECK (auth.uid()::text = de);

-- Usuario puede marcar como leído los mensajes que recibió
CREATE POLICY "Usuario marca leído" ON mensajes
  FOR UPDATE USING (auth.uid()::text = para);

-- Admin (service role) tiene acceso total — no necesita policy
-- ya que createAdminClient() usa service role key que bypasea RLS
