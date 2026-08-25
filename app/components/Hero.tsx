import AsciiGlobe from "./AsciiGlobe";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-28">
        <div className="reveal" style={{ animationDelay: "0.05s" }}>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
            01 — Vexora / VPS Infrastructure
          </p>

          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-text sm:text-5xl md:text-6xl">
            Virtual servers that
            <br />
            deploy in <span className="underline decoration-1 underline-offset-8">under 55 seconds</span>.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
            Vexora runs high-performance VPS infrastructure on NVMe storage
            across global regions — full root access, predictable pricing, and
            a network built for production workloads.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#plans"
              className="rounded-none bg-text px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-80"
            >
              View plans
            </a>
            <a
              href="#contact"
              className="rounded-none border border-border px-6 py-3 text-sm font-medium text-text transition-colors hover:border-text"
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
          className="reveal flex items-center justify-center border border-border bg-surface p-6"
          style={{ animationDelay: "0.15s" }}
        >
          <AsciiGlobe />
        </div>
      </div>
    </section>
  );
}
