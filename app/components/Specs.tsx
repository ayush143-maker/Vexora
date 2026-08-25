const SPECS = [
  {
    label: "Compute",
    detail: "Dedicated vCPU cores on AMD EPYC — no noisy-neighbor throttling.",
    stat: "3.6 GHz",
  },
  {
    label: "Storage",
    detail: "Local NVMe drives in RAID-10, not network-attached block storage.",
    stat: "~620k IOPS",
  },
  {
    label: "Network",
    detail: "Redundant uplinks with DDoS filtering on every plan by default.",
    stat: "10 Gbps",
  },
  {
    label: "Provisioning",
    detail: "Servers boot from a pre-baked image the moment payment clears.",
    stat: "< 55s",
  },
];

export default function Specs() {
  return (
    <section id="specs" className="border-b border-border bg-surface/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-xl reveal">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Infrastructure</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Built on hardware, not promises.
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {SPECS.map((s, i) => (
            <div
              key={s.label}
              className="reveal flex flex-col justify-between bg-bg p-7"
              style={{ animationDelay: `${0.08 + i * 0.06}s` }}
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                  {s.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{s.detail}</p>
              </div>
              <p className="mt-8 font-display text-2xl font-semibold text-text">{s.stat}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
