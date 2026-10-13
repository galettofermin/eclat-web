-- Docentes por curso: texto libre, uno por línea (como learnings y syllabus)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructors text;
