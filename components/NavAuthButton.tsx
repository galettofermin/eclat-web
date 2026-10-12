"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { DIRECTOR_EMAIL } from "@/lib/constants";

type NavUser = { isAdmin: boolean; nombre: string };

// Nombre corto para el botón: metadata.nombre (cuentas nuevas), primer nombre de
// full_name (cuentas viejas) o la parte del mail antes de la @
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

export function NavAuthButton() {
  const [user, setUser] = useState<NavUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(toNavUser(data.user)));
    // Se actualiza solo al iniciar o cerrar sesión, sin recargar la página
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toNavUser(session?.user ?? null));
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!user?.nombre) {
    return (
      <Link href="/login" className="btn btn--primary nav__login" style={{ padding: '11px 20px', fontSize: '15px' }} aria-label="Ingreso">
        <Icon />
        Ingreso
      </Link>
    );
  }

  return (
    <Link
      href={user.isAdmin ? "/admin" : "/mi-cuenta"}
      className="btn btn--primary nav__login"
      style={{ padding: '11px 20px', fontSize: '15px', maxWidth: 220 }}
      aria-label={`Mi cuenta (${user.nombre})`}
      title={user.nombre}
    >
      <Icon />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Hola, {user.nombre}</span>
    </Link>
  );
}
