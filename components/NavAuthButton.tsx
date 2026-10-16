"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { DIRECTOR_EMAIL } from "@/lib/constants";
import { useRouter } from "next/navigation";

type NavUser = { isAdmin: boolean; nombre: string };

function toNavUser(user: User | null): NavUser | null {
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  const nombre = meta.nombre || String(meta.full_name ?? "").trim().split(/\s+/)[0] || user.email?.split("@")[0] || "";
  return { isAdmin: user.email === DIRECTOR_EMAIL, nombre };
}

const Icon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 12, height: 12 }}>
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

export function NavAuthButton() {
  const [user, setUser] = useState<NavUser | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(toNavUser(data.user)));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toNavUser(session?.user ?? null));
    });
    return () => subscription.unsubscribe();
  }, []);

  // Cerrar al hacer click afuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  // No logueado
  if (!user?.nombre) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="/registro" className="btn btn--ghost nav__register" style={{ padding: '11px 16px', fontSize: '14px' }}>
          Registrarse
        </Link>
        <Link href="/login" className="btn btn--primary nav__login" style={{ padding: '11px 20px', fontSize: '15px' }} aria-label="Ingresar">
          <Icon />
          Ingresar
        </Link>
      </div>
    );
  }

  // Logueado — botón con dropdown
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`btn btn--primary nav__login${user.isAdmin ? ' nav__login--admin' : ''}`}
        style={{ padding: '11px 20px', fontSize: '15px', maxWidth: 220, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', border: 'none' }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Mi cuenta (${user.nombre})`}
      >
        <Icon />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.isAdmin ? 'Admin' : `Hola, ${user.nombre}`}
        </span>
        <ChevronIcon />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: 180,
            background: '#fff',
            borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
            overflow: 'hidden',
            zIndex: 999,
          }}
        >
          <Link
            href={user.isAdmin ? "/admin" : "/mi-cuenta"}
            onClick={() => setOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px',
              fontSize: 14, color: '#1B2B26', textDecoration: 'none',
              fontWeight: 500,
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f5f9f7')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            {user.isAdmin ? 'Panel admin' : 'Mis cursos'}
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '12px 16px',
              fontSize: 14, color: '#6E6E73', textAlign: 'left',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#f5f9f7';
              (e.currentTarget as HTMLElement).style.color = '#c0392b';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#6E6E73';
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
