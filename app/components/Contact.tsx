// EDIT: swap the placeholder values below for the client's real contact
// details. Each block is a "column with a caption" as requested — caption on
// top, detail underneath.
const CONTACT_COLUMNS = [
  {
    caption: "Email",
    detail: "hello@vexora.io",
  },
  {
    caption: "Phone",
    detail: "+91 00000 00000",
  },
  {
    caption: "Office",
    detail: "4th Floor, Cyber Towers\nHitech City, Hyderabad 500081",
  },
  {
    caption: "Support hours",
    detail: "24/7 — average first response 6 minutes",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-xl reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">05 — Contact</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Talk to the people running the servers.
          </h2>
          <p className="mt-4 text-text-muted">
            Questions about a plan, a migration, or an enterprise setup —
            reach out and we&apos;ll get back to you same day.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <form className="reveal flex flex-col gap-5 border border-border bg-surface p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-text-muted">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  className="border border-border bg-bg px-4 py-3 text-text outline-none placeholder:text-text-muted/60 focus:border-text"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-text-muted">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="jane@company.com"
                  className="border border-border bg-bg px-4 py-3 text-text outline-none placeholder:text-text-muted/60 focus:border-text"
                />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-sm text-text-muted">
              Message
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us what you're building..."
                className="resize-none border border-border bg-bg px-4 py-3 text-text outline-none placeholder:text-text-muted/60 focus:border-text"
              />
            </label>
            {/* EDIT: this form has no backend yet — wire it to Formspree,
               a serverless function, or an API route before going live. */}
            <button
              type="submit"
              className="mt-2 bg-text px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-80"
            >
              Send message
            </button>
          </form>

          <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            {CONTACT_COLUMNS.map((c, i) => (
              <div
                key={c.caption}
                className="reveal flex flex-col justify-between bg-surface p-7"
                style={{ animationDelay: `${0.05 + i * 0.06}s` }}
              >
                <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                  {c.caption}
                </p>
                <p className="mt-4 whitespace-pre-line font-display text-lg text-text">
                  {c.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
