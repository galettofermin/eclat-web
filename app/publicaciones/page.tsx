import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Publicaciones · ÉCLAT — Pensar la práctica",
  description:
    "Publicaciones de ÉCLAT: artículos, recursos y materiales sobre salud mental, educación, inclusión escolar y trabajo interdisciplinario.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PublicacionesPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const articles: Article[] = data ?? [];

  return (
    <>
      <section className="phead">
        <div className="wrap reveal">
          <nav className="crumb">
            <Link href="/">Inicio</Link>
            &nbsp;/&nbsp;
            <b>Publicaciones</b>
          </nav>
          <h1>
            Pensar la <em>práctica.</em>
          </h1>
          <p className="phead__lede">
            La producción de conocimiento es una dimensión central de la
            identidad de ÉCLAT. A través de artículos, recursos y materiales de
            consulta abrimos espacios de reflexión sobre los desafíos
            contemporáneos de la salud mental y la educación.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {articles.length === 0 ? (
            <div
              className="reveal"
              style={{
                textAlign: "center",
                padding: "72px 24px",
                color: "var(--ink-muted)",
              }}
            >
              <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                Próximamente.
              </p>
              <p style={{ fontSize: "15px" }}>
                Estamos preparando los primeros artículos.
              </p>
            </div>
          ) : (
            <div className="writings reveal">
              {articles.map((a) => (
                <article key={a.id} className="writing">
                  {a.image_url && (
                    <div
                      style={{
                        width: "100%",
                        height: "180px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        marginBottom: "16px",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.image_url}
                        alt={a.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                  <span className="writing__tag">{a.category}</span>
                  <h3>{a.title}</h3>
                  <p>{a.excerpt}</p>
                  <span className="writing__meta">
                    <span>{formatDate(a.created_at)}</span>
                    <span>{a.read_time}</span>
                  </span>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="ctaband">
        <div className="wrap">
          <div>
            <h2>¿Querés escribir con nosotros?</h2>
            <p>
              Recibimos producciones del equipo y de colegas que quieran
              compartir su práctica.
            </p>
          </div>
          <a
            className="btn btn--primary"
            href={`https://wa.me/5493572441454?text=${encodeURIComponent(
              "Hola ÉCLAT, quisiera proponer una publicación."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Proponer una publicación
          </a>
        </div>
      </section>
    </>
  );
}
