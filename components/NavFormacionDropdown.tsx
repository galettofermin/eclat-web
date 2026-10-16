"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Curso {
  id: string;
  title: string;
  badge: string | null;
}

interface Props {
  cursos: Curso[];
}

export function NavFormacionDropdown({ cursos }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cerrar al click afuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (cursos.length > 0) setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      ref={ref}
      className="nav-form-wrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href="/formacion"
        className={open ? "is-active" : ""}
        onClick={() => setOpen(false)}
      >
        Formación
        {cursos.length > 0 && (
          <svg
            className="nav-form-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
      </Link>

      {open && cursos.length > 0 && (
        <div className="nav-form-drop">
          <div className="nav-form-drop__header">
            Formaciones activas
          </div>
          {cursos.map((c) => (
            <Link
              key={c.id}
              href={`/cursos/${c.id}`}
              className="nav-form-drop__item"
              onClick={() => setOpen(false)}
            >
              {c.badge && (
                <span className="nav-form-drop__badge">{c.badge}</span>
              )}
              <span className="nav-form-drop__title">{c.title}</span>
              <svg
                className="nav-form-drop__arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
          <Link
            href="/formacion"
            className="nav-form-drop__all"
            onClick={() => setOpen(false)}
          >
            Ver todas las formaciones →
          </Link>
        </div>
      )}
    </div>
  );
}
