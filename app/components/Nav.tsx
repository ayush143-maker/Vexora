"use client";

import { useState } from "react";

const LINKS = [
  { href: "#plans", label: "Plans" },
  { href: "#specs", label: "Infrastructure" },
  { href: "#locations", label: "Locations" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight text-text">
          Vexora<span className="text-text-muted">.</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#contact"
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            Sign in
          </a>
          <a
            href="#plans"
            className="rounded-none bg-text px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-80"
          >
            Deploy a server
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center border border-border text-text md:hidden"
        >
          <span className="font-mono text-xs">{open ? "×" : "≡"}</span>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border/70 px-6 py-4 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-text-muted hover:text-text"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#plans"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-none bg-text px-4 py-2 text-center text-sm font-medium text-bg"
          >
            Deploy a server
          </a>
        </nav>
      )}
    </header>
  );
}
