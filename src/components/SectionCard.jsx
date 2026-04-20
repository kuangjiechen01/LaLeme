export default function SectionCard({ title, eyebrow, action, children, className = "" }) {
  return (
    <section className={`section-card ${className}`}>
      {(title || eyebrow || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                {eyebrow}
              </p>
            ) : null}
            {title ? <h2 className="mt-1 text-lg font-semibold text-[var(--ink)]">{title}</h2> : null}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
