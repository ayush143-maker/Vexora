export default function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <a href="#top" className="font-display text-sm font-semibold text-text">
          Vexora<span className="text-accent">.</span>
        </a>
        <p className="font-mono text-xs text-text-muted">
          © {new Date().getFullYear()} Vexora. All servers, no nonsense.
        </p>
      </div>
    </footer>
  );
}
