// app/layout.tsx
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import AdminBar from "@/components/AdminBar";
import { RevealScript } from "@/components/RevealScript";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eclatcentro.com"),
  title: {
    default: "Psicólogo en Oncativo · ÉCLAT Centro de Salud Mental y Educación",
    template: "%s · ÉCLAT",
  },
  description: "Centro interdisciplinario en Oncativo, Córdoba. Psicología, psicopedagogía, fonoaudiología e inclusión escolar. Pedí tu entrevista hoy.",
  keywords: [
    "psicología Oncativo", "psicopedagogía Córdoba", "fonoaudiología", "psicomotricidad",
    "centro de atención integral", "ÉCLAT", "salud mental niños", "inclusión escolar",
    "terapia Oncativo", "salud mental Córdoba", "evaluación interdisciplinaria",
  ],
  alternates: { canonical: "https://eclatcentro.com" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: { icon: "/LOGO.png", apple: "/LOGO.png" },
  openGraph: {
    title: "ÉCLAT · Centro de Atención Integral — Oncativo, Córdoba",
    description: "Psicología, psicopedagogía, fonoaudiología, psicomotricidad e inclusión escolar en Oncativo, Córdoba. Equipo interdisciplinario.",
    url: "https://eclatcentro.com",
    siteName: "ÉCLAT Centro de Atención Integral",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ÉCLAT · Centro de Atención Integral" }],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ÉCLAT · Centro de Atención Integral — Oncativo, Córdoba",
    description: "Psicología, psicopedagogía, fonoaudiología y más en Oncativo, Córdoba.",
    images: ["/og-image.png"],
  },
};

const NAV_LINKS = [
  { href: "/",              label: "Inicio" },
  { href: "/conocer",       label: "Nosotros" },
  { href: "/servicios",     label: "Servicios" },
  { href: "/formacion",     label: "Formación" },
  { href: "/publicaciones", label: "Publicaciones" },
  { href: "/contacto",      label: "Contacto" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={cormorant.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["MedicalBusiness", "LocalBusiness"],
              "name": "ÉCLAT Centro de Atención Integral",
              "alternateName": "ÉCLAT",
              "url": "https://eclatcentro.com",
              "logo": "https://eclatcentro.com/LOGO.png",
              "image": "https://eclatcentro.com/og-image.png",
              "description": "Centro de atención integral en Oncativo, Córdoba. Psicología, psicopedagogía, fonoaudiología, psicomotricidad e inclusión escolar.",
              "foundingDate": "2022-07-09",
              "telephone": "+54-9-3572-44-1454",
              "email": "centrointegraleclat@gmail.com",
              "priceRange": "$$",
              "areaServed": ["Oncativo", "Córdoba", "Argentina"],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Castelli 260",
                "addressLocality": "Oncativo",
                "addressRegion": "Córdoba",
                "postalCode": "5986",
                "addressCountry": "AR",
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -31.9167,
                "longitude": -63.6833,
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
                "opens": "08:00",
                "closes": "20:00",
              },
              "sameAs": [
                "https://instagram.com/eclatcentro",
                "https://wa.me/5493572441454",
              ],
            }),
          }}
        />
      </head>
      <body>
        <div className="pageload"><i></i></div>

        {/* Navbar */}
        <header className="nav">
          <div className="nav__in">
            <Link className="nav__brand" href="/" aria-label="ÉCLAT inicio">
              <img src="/LOGO.png" alt="ÉCLAT" style={{ height: "44px", width: "auto" }} />
            </Link>
            <nav className="nav__links">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href}>{l.label}</Link>
              ))}
            </nav>
            <button className="nav__ham" aria-label="Menú" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
            <Link className="btn btn--primary nav__login" href="/login" style={{ padding: "11px 20px", fontSize: "15px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
              </svg>
              Ingreso
            </Link>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer className="foot">
          <div className="wrap">
            <div className="foot__grid">
              <div>
                <img className="foot__logo" src="/LOGO.png" alt="ÉCLAT" style={{ width: "52px", height: "auto", filter: "brightness(0) invert(1)" }} />
                <p className="foot__tag">Centro de atención integral en Oncativo, Córdoba. Salud mental, educación y formación desde una mirada interdisciplinaria.</p>
              </div>
              <div>
                <h4>Institución</h4>
                <ul>
                  {NAV_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Contacto</h4>
                <ul>
                  <li><a href="https://wa.me/5493572441454">WhatsApp · +54 9 3572 44-1454</a></li>
                  <li><Link href="/contacto">Castelli 260, Oncativo, Córdoba</Link></li>
                  <li><a href="mailto:centrointegraleclat@gmail.com">centrointegraleclat@gmail.com</a></li>
                  <li><a href="https://instagram.com/eclatcentro" target="_blank" rel="noopener">Instagram · @eclatcentro</a></li>
                </ul>
              </div>
            </div>
            <div className="foot__bar">
              <span>© 2026 ÉCLAT · Centro de Atención Integral</span>
              <span>Fundada el 9 de julio de 2022 · Oncativo, Córdoba</span>
            </div>
          </div>
        </footer>

        {/* WhatsApp flotante */}
        <a className="wa-fab" href="https://wa.me/5493572441454?text=Hola%20%C3%89CLAT%2C%20quisiera%20hacer%20una%20consulta." aria-label="Escribinos por WhatsApp" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.999zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.166-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" />
          </svg>
          <span className="wa-label">Escribinos</span>
        </a>

        <AdminBar />
        <RevealScript />
      </body>
    </html>
  );
}
