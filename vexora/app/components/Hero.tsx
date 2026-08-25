import NodeMap from "./NodeMap";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-28">
        <div className="reveal" style={{ animationDelay: "0.05s" }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-status" />
            All regions operational
          </div>

          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-text sm:text-5xl md:text-6xl">
            Virtual servers that
            <br />
            deploy in <span className="text-accent">under 55 seconds</span>.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
            Vexora runs high-performance VPS infrastructure on NVMe storage
            across global regions — full root access, predictable pricing, and
            a network built for production workloads.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#plans"
              className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-[#05060a] transition-transform hover:scale-[1.03]"
            >
              View plans
            </a>
            <a
              href="#contact"
              className="rounded-md border border-border px-6 py-3 text-sm font-medium text-text transition-colors hover:border-accent/60"
            >
              Talk to us
            </a>
          </div>

          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6 font-mono">
            <div>
              <dt className="text-xs text-text-muted">Uptime SLA</dt>
              <dd className="mt-1 text-lg text-text">99.98%</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Regions</dt>
              <dd className="mt-1 text-lg text-text">12</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Avg. deploy</dt>
              <dd className="mt-1 text-lg text-text">54s</dd>
            </div>
          </dl>
        </div>

        <div
          className="reveal relative h-[320px] sm:h-[420px] md:h-[480px]"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="absolute inset-0">
            <NodeMap />
          </div>
        </div>
      </div>
    </section>
  );
}
