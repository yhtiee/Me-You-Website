import { useEffect, useState, type ReactNode } from 'react';

import { Footer, Nav } from '../components/Chrome';
import { site } from '../site';

export type LegalSection = { id: string; title: string; body: ReactNode };

/**
 * Long-form page shell: a readable measure, a table of contents that tracks
 * where you are, and the same nav and footer as the landing page.
 */
export function LegalLayout({
  eyebrow,
  title,
  intro,
  sections,
  showUpdated = true,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  sections?: LegalSection[];
  showUpdated?: boolean;
  children?: ReactNode;
}) {
  const [active, setActive] = useState(sections?.[0]?.id ?? '');

  useEffect(() => {
    if (!sections?.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '-100px 0px -65% 0px' },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  return (
    <>
      <Nav variant="page" />
      <main id="main" className="legal">
        <header className="legal-hero">
          <div className="container">
            <span className="overline">{eyebrow}</span>
            <h1 className="title1">{title}</h1>
            <div className="lead">{intro}</div>
            {showUpdated ? <p className="legal-updated">Last updated {site.policiesUpdated}</p> : null}
          </div>
        </header>

        <div className={`container legal-body ${sections?.length ? 'with-toc' : ''}`}>
          {sections?.length ? (
            <nav className="toc" aria-label="On this page">
              <p className="overline">On this page</p>
              <ol>
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} aria-current={active === s.id ? 'location' : undefined}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <article className="prose">
            {children}
            {sections?.map((s, i) => (
              <section key={s.id} id={s.id}>
                <h2>
                  <span className="sec-num">{i + 1}</span>
                  {s.title}
                </h2>
                {s.body}
              </section>
            ))}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

/** A two-column "what / why" table that collapses to cards on phones. */
export function DataTable({ head, rows }: { head: [string, string, string]; rows: [ReactNode, ReactNode, ReactNode][] }) {
  return (
    <div className="data-table" role="table">
      <div role="row" className="dt-head">
        {head.map((h) => (
          <span role="columnheader" key={h}>
            {h}
          </span>
        ))}
      </div>
      {rows.map((r, i) => (
        <div role="row" key={i}>
          {r.map((c, j) => (
            <span role="cell" key={j} data-label={head[j]}>
              {c}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Callout({ tone = 'rose', title, children }: { tone?: 'rose' | 'iris' | 'amber'; title: string; children: ReactNode }) {
  return (
    <aside className={`callout ${tone}`}>
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
}
