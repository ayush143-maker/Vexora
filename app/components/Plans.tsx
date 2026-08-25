const PLANS = [
  {
    name: "Nano",
    price: "399",
    tagline: "Side projects, staging, small bots.",
    specs: ["1 vCPU", "1 GB RAM", "25 GB NVMe", "1 TB transfer"],
  },
  {
    name: "Core",
    price: "1,499",
    tagline: "The default for production apps and small teams.",
    specs: ["4 vCPU", "8 GB RAM", "160 GB NVMe", "6 TB transfer", "Daily snapshots", "Priority support"],
    featured: true,
  },
  {
    name: "Scale",
    price: "4,999",
    tagline: "High-traffic services and databases.",
    specs: ["8 vCPU", "32 GB RAM", "480 GB NVMe", "16 TB transfer"],
  },
];

export default function Plans() {
  return (
    <section id="plans" className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-xl reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">02 — Pricing</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Plans that scale with you, not against you.
          </h2>
          <p className="mt-4 text-text-muted">
            Every plan runs on the same NVMe fleet. Upgrade or downgrade anytime — no
            migrations, no downtime. Billed in INR.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`reveal flex flex-col border p-8 ${
                plan.featured
                  ? "border-text bg-text text-bg md:-translate-y-4 md:py-10"
                  : "border-border bg-surface"
              }`}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              {plan.featured && (
                <span className="mb-4 inline-flex w-fit border border-bg px-3 py-1 font-mono text-xs">
                  Most deployed
                </span>
              )}
              <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
              <p
                className={`mt-2 text-sm ${plan.featured ? "text-bg/70" : "text-text-muted"}`}
              >
                {plan.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-1 font-mono">
                <span className="text-3xl">₹{plan.price}</span>
                <span className={`text-sm ${plan.featured ? "text-bg/70" : "text-text-muted"}`}>
                  /mo
                </span>
              </div>

              <ul
                className={`mt-6 flex flex-1 flex-col gap-3 border-t pt-6 font-mono text-sm ${
                  plan.featured ? "border-bg/25 text-bg/80" : "border-border text-text-muted"
                }`}
              >
                {plan.specs.map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <span>—</span>
                    {s}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-8 border px-4 py-3 text-center text-sm font-medium transition-opacity hover:opacity-80 ${
                  plan.featured
                    ? "border-bg bg-bg text-text"
                    : "border-border text-text"
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
