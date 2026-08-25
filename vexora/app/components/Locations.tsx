const REGIONS = [
  { city: "New York", code: "NYC1", ping: "8ms" },
  { city: "Frankfurt", code: "FRA1", ping: "11ms" },
  { city: "Singapore", code: "SIN1", ping: "14ms" },
  { city: "Mumbai", code: "BOM1", ping: "6ms" },
  { city: "São Paulo", code: "GRU1", ping: "19ms" },
  { city: "Sydney", code: "SYD1", ping: "22ms" },
];

export default function Locations() {
  return (
    <section id="locations" className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 flex flex-col gap-4 reveal sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">Locations</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              Twelve regions. One control panel.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-text-muted">
            Deploy close to your users. Move a server to a new region anytime —
            we handle the network cutover.
          </p>
        </div>

        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {REGIONS.map((r, i) => (
            <div
              key={r.code}
              className="reveal flex items-center justify-between gap-4 bg-surface px-6 py-4 transition-colors hover:bg-surface-2"
              style={{ animationDelay: `${0.05 + i * 0.05}s` }}
            >
              <div className="flex items-center gap-4">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-status" />
                <span className="font-display text-sm text-text sm:text-base">{r.city}</span>
              </div>
              <div className="flex items-center gap-6 font-mono text-xs text-text-muted sm:text-sm">
                <span>{r.code}</span>
                <span>{r.ping} avg</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
