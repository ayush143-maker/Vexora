"use client";

import { useEffect, useRef } from "react";

const CHARS = ".:-=+*#%@";
const RAMP_LEN = CHARS.length;

export default function AsciiGlobe() {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // --- your original values - kept exactly ---
    const COLS = 64;
    const ROWS = 32;
    const R = 1;
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

    // --- wireframe cache (doesn't change your values) ---
    const MERIDIANS = 12;
    const PARALLELS = 7;
    const MER_STEPS = 44;
    const PAR_STEPS = 56;

    const meridians: { x: number; y: number; z: number }[][] = [];
    for (let m = 0; m < MERIDIANS; m++) {
      const lon = (m / MERIDIANS) * Math.PI * 2;
      const line = [];
      for (let s = 0; s <= MER_STEPS; s++) {
        const lat = -Math.PI / 2 + (s / MER_STEPS) * Math.PI;
        const c = Math.cos(lat);
        line.push({ x: c * Math.cos(lon), y: Math.sin(lat), z: c * Math.sin(lon) });
      }
      meridians.push(line);
    }

    const parallels: { x: number; y: number; z: number }[][] = [];
    for (let p = 1; p <= PARALLELS; p++) {
      const lat = -Math.PI / 2 + (p / (PARALLELS + 1)) * Math.PI;
      const y = Math.sin(lat);
      const r = Math.cos(lat);
      const line = [];
      for (let s = 0; s <= PAR_STEPS; s++) {
        const lon = (s / PAR_STEPS) * Math.PI * 2;
        line.push({ x: r * Math.cos(lon), y, z: r * Math.sin(lon) });
      }
      parallels.push(line);
    }

    let raf = 0;
    let angle = 0;

    // realism tweaks
    const PERSPECTIVE = 2.4; // viewer distance
    const TILT = 0.34;
    const CHAR_ASPECT = 0.52; // fixes 64x32 stretched oval
    const AMBIENT = 0.18;
    const cosTilt = Math.cos(TILT);
    const sinTilt = Math.sin(TILT);

    // normalized light
    const lx = -0.55, ly = 0.68, lz = 0.6;
    const llen = Math.hypot(lx, ly, lz);
    const light = { x: lx / llen, y: ly / llen, z: lz / llen };

    function frame() {
      const buffer: string[][] = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(" ")
      );
      const depth: number[][] = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(-Infinity)
      );

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // helper to rotate + project
      const rotProject = (px: number, py: number, pz: number) => {
        // Y spin
        const x1 = px * cosA - pz * sinA;
        const z1 = px * sinA + pz * cosA;
        const y1 = py;
        // X tilt
        const y2 = y1 * cosTilt - z1 * sinTilt;
        const z2 = y1 * sinTilt + z1 * cosTilt;
        const x2 = x1;

        const scale = PERSPECTIVE / (PERSPECTIVE - z2);
        const sx = x2 * scale;
        const sy = y2 * scale;

        const screenX = Math.round(
          (sx * R * CHAR_ASPECT + 1) * 0.5 * (COLS - 1)
        );
        const screenY = Math.round((-sy * R + 1) * 0.5 * (ROWS - 1));

        return { x2, y2, z2, screenX, screenY };
      };

      // 1. surface
      for (const p of sphere) {
        const { x2, y2, z2, screenX, screenY } = rotProject(p.x, p.y, p.z);
        if (screenX < 0 || screenX >= COLS || screenY < 0 || screenY >= ROWS)
          continue;
        if (z2 <= depth[screenY][screenX]) continue;

        const b = Math.max(0, x2 * light.x + y2 * light.y + z2 * light.z);
        let lum = AMBIENT + (1 - AMBIENT) * b;
        if (z2 < 0) lum *= 0.38; // hide back hemisphere

        const idx = Math.min(
          RAMP_LEN - 1,
          Math.floor(lum * (RAMP_LEN - 1) * 1.3)
        );
        buffer[screenY][screenX] = CHARS[idx]?? " ";
        depth[screenY][screenX] = z2;
      }

      // 2. wireframe overlay - only front
      const plotWire = (
        p: { x: number; y: number; z: number },
        isMeridian: boolean
      ) => {
        const { x2, y2, z2, screenX, screenY } = rotProject(p.x, p.y, p.z);
        if (screenX < 0 || screenX >= COLS || screenY < 0 || screenY >= ROWS)
          return;
        if (z2 < -0.08) return; // cull back wire
        if (z2 + 0.005 < depth[screenY][screenX]) return;

        const b = Math.max(0, x2 * light.x + y2 * light.y + z2 * light.z);
        const isPole = Math.abs(y2) > 0.9;
        let ch = isMeridian? "+" : "-";
        if (!isMeridian) ch = b > 0.45? "-" : ".";
        else ch = isPole? "+" : b > 0.5? "+" : ":";

        buffer[screenY][screenX] = ch;
        depth[screenY][screenX] = z2 + 0.01;
      };

      for (const line of parallels) for (const p of line) plotWire(p, false);
      for (const line of meridians) for (const p of line) plotWire(p, true);

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
