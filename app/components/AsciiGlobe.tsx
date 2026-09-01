"use client";
import { useEffect, useRef } from "react";

const CHARS = ".:-=+*#%@";
const RAMP_LEN = CHARS.length;

export default function AsciiGlobe() {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // your original values - not changed
    const COLS = 64;
    const ROWS = 32;
    const R = 1;
    const POINTS = 340;

    const sphere = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < POINTS; i++) {
      const y = 1 - (i / (POINTS - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      sphere.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r });
    }

    let raf = 0;
    let angle = 0;
    const PERSPECTIVE = 2.4;
    const TILT = 0.32;
    const CHAR_ASPECT = 1.7; // <- this is what fixes the egg on mobile
    const cosT = Math.cos(TILT), sinT = Math.sin(TILT);
    const light = { x: -0.5, y: 0.65, z: 0.6 };

    function frame() {
      const buf = Array.from({ length: ROWS }, () => Array(COLS).fill(" "));
      const dep = Array.from({ length: ROWS }, () => Array(COLS).fill(-Infinity));
      const cosA = Math.cos(angle), sinA = Math.sin(angle);

      for (const p of sphere) {
        // rotate Y + tilt X
        const x1 = p.x * cosA - p.z * sinA;
        const z1 = p.x * sinA + p.z * cosA;
        const y2 = p.y * cosT - z1 * sinT;
        const z2 = p.y * sinT + z1 * cosT;
        const x2 = x1;

        const scale = PERSPECTIVE / (PERSPECTIVE - z2); // real perspective
        const sx = Math.round((x2 * scale * CHAR_ASPECT + 1) * 0.5 * (COLS - 1));
        const sy = Math.round((-y2 * scale + 1) * 0.5 * (ROWS - 1));
        if (sx < 0 || sx >= COLS || sy < 0 || sy >= ROWS) continue;
        if (z2 < dep[sy][sx]) continue;

        const bright = Math.max(0, x2 * light.x + y2 * light.y + z2 * light.z);
        const lum = z2 < 0? bright * 0.35 : bright;
        const idx = Math.min(RAMP_LEN - 1, Math.floor(lum * (RAMP_LEN - 1) * 1.25));

        buf[sy][sx] = CHARS[idx];
        dep[sy][sx] = z2;
      }

      if (pre) pre.textContent = buf.map(r => r.join("")).join("\n");
      if (!reduced) {
        angle += 0.006; // your original speed
        raf = requestAnimationFrame(frame);
      }
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <pre
      ref={preRef}
      aria-hidden="true"
      className="select-none whitespace-pre font-mono leading-none text-[10px] text-white/80 sm:text-[11px]"
      style={{ letterSpacing: "0.04em" }}
    />
  );
}
