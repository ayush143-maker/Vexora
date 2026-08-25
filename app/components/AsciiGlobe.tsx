"use client";

import { useEffect, useRef } from "react";

// Rotating wireframe globe rendered as ASCII characters on a monospace grid.
// Replaces the earlier glow-dot canvas: same idea (server regions on a
// sphere) but rendered in the site's own type system instead of a generic
// "tech gradient" look — it reads as an editorial/technical artifact, not a
// SaaS decoration.
const CHARS = " .:-=+*#%@";
const RAMP_LEN = CHARS.length;

export default function AsciiGlobe() {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const COLS = 64;
    const ROWS = 32;
    const R = 1;

    // Fibonacci sphere sampling for even point distribution.
    const POINTS = 340;
    const sphere: { x: number; y: number; z: number }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < POINTS; i++) {
      const y = 1 - (i / (POINTS - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = golden * i;
      sphere.push({
        x: Math.cos(theta) * radiusAtY,
        y,
        z: Math.sin(theta) * radiusAtY,
      });
    }

    let raf = 0;
    let angle = 0;

    function frame() {
      const buffer: string[][] = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(" ")
      );
      const depth: number[][] = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(-Infinity)
      );

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      for (const p of sphere) {
        // rotate around Y axis
        const x = p.x * cosA - p.z * sinA;
        const z = p.x * sinA + p.z * cosA;
        const y = p.y;

        // light direction (fixed, upper-left-front) for shading
        const lightX = -0.5;
        const lightY = 0.6;
        const lightZ = 0.7;
        const brightness = Math.max(0, x * lightX + y * lightY + z * lightZ);

        // perspective-ish project to grid (aspect-corrected for char cells)
        const screenX = Math.round((x * R + 1) * 0.5 * (COLS - 1));
        const screenY = Math.round((-y * R + 1) * 0.5 * (ROWS - 1));

        if (
          screenX >= 0 &&
          screenX < COLS &&
          screenY >= 0 &&
          screenY < ROWS &&
          z > depth[screenY][screenX]
        ) {
          depth[screenY][screenX] = z;
          const rampIdx = Math.min(
            RAMP_LEN - 1,
            Math.floor(brightness * (RAMP_LEN - 1) * 1.3)
          );
          buffer[screenY][screenX] = CHARS[rampIdx] ?? CHARS[0];
        }
      }

      if (pre) {
        pre.textContent = buffer.map((row) => row.join("")).join("\n");
      }

      if (!prefersReducedMotion) {
        angle += 0.006;
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
      className="select-none whitespace-pre font-mono leading-[1.05] text-[10px] text-white/80 sm:text-[11px]"
      style={{ letterSpacing: "0.05em" }}
    />
  );
}
