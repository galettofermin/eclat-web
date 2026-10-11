"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export function NavAuthButton() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/auth/check')
      .then(r => r.json())
      .then(d => setIsAdmin(d.isAdmin === true))
      .catch(() => {});
  }, []);

  return (
    <Link
      href={isAdmin ? "/admin" : "/login"}
      className="btn btn--primary nav__login"
      style={{ padding: '11px 20px', fontSize: '15px' }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>
      </svg>
      {isAdmin ? "Mi cuenta" : "Ingreso"}
    </Link>
  );
}
