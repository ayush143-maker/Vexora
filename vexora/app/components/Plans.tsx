const PLANS = [
  {
    name: "Nano",
    price: "5",
    tagline: "Side projects, staging, small bots.",
    specs: ["1 vCPU", "1 GB RAM", "25 GB NVMe", "1 TB transfer"],
  },
  {
    name: "Core",
    price: "22",
    tagline: "The default for production apps and small teams.",
    specs: ["4 vCPU", "8 GB RAM", "160 GB NVMe", "6 TB transfer", "Daily snapshots", "Priority support"],
    featured: true,
  },
  {
    name: "Scale",
    price: "68",
    tagline: "High-traffic services and databases.",
    specs: ["8 vCPU", "32 GB RAM", "480 GB NVMe", "16 TB transfer"],
  },
];

export default function Plans() {
  return (
    <section id="plans" className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-xl reveal">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Pricing</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Plans that scale with you, not against you.
          </h2>
          <p className="mt-4 text-text-muted">
            Every plan runs on the same NVMe fleet. Upgrade or downgrade anytime — no
            migrations, no downtime.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`reveal flex flex-col rounded-xl border p-8 ${
                plan.featured
                  ? "border-accent/50 bg-surface-2 md:-translate-y-4 md:py-10 shadow-[0_0_0_1px_rgba(108,142,255,0.15),0_20px_60px_-20px_rgba(108,142,255,0.35)]"
                  : "border-border bg-surface"
              }`}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              {plan.featured && (
                <span className="mb-4 inline-flex w-fit rounded-full bg-accent/15 px-3 py-1 font-mono text-xs text-accent">
                  Most deployed
                </span>
              )}
              <h3 className="font-display text-xl font-semibold text-text">{plan.name}</h3>
              <p className="mt-2 text-sm text-text-muted">{plan.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1 font-mono">
                <span className="text-3xl text-text">${plan.price}</span>
                <span className="text-sm text-text-muted">/mo</span>
              </div>

              <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-border pt-6 font-mono text-sm text-text-muted">
                {plan.specs.map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="text-accent">›</span>
                    {s}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-8 rounded-md px-4 py-3 text-center text-sm font-medium transition-transform hover:scale-[1.02] ${
                  plan.featured
                    ? "bg-accent text-[#05060a]"
                    : "border border-border text-text"
                }`}
              >
                Get {plan.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
