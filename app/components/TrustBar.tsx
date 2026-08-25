const LOGOS = ["NIMBUS", "FORGEWORKS", "ORBITAL", "LATTICE", "HAVENDATA", "QUORUM"];

export default function TrustBar() {
  return (
    <section className="border-b border-border bg-surface/40 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-6 text-center font-mono text-xs uppercase tracking-widest text-text-muted">
          Trusted by teams shipping on Vexora
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
          {LOGOS.map((l) => (
            <span
              key={l}
              className="font-display text-sm tracking-wide text-text-muted"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
