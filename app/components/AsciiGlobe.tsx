"use client";

import { useEffect, useRef } from "react";

// Same grid size as the original component.
const COLS = 64;
const ROWS = 32;

// Slightly inside the full bounds so the globe does not clip harshly.
const RADIUS = 0.985;

// Fixed camera tilt so the poles and latitude lines read as a globe.
const TILT = 0.42;

const SPEED = 0.0055;

// ASCII brightness ramp.
const RAMP = ".:-=+*#%@";
const MARKER_CHAR = "@";

type GridPoint = {
  x: number;
  y: number;
  z: number;
  major: boolean;
};

type MarkerPoint = {
  x: number;
  y: number;
  z: number;
};

function normalize(x: number, y: number, z: number) {
  const d = Math.hypot(x, y, z) || 1;
  return { x: x / d, y: y / d, z: z / d };
}

const LIGHT = normalize(-0.44, 0.58, 0.76);

function latLonToPoint(latDeg: number, lonDeg: number) {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  const r = Math.cos(lat);

  return {
    x: r * Math.cos(lon),
    y: Math.sin(lat),
    z: r * Math.sin(lon),
  };
}

function buildGlobe() {
  const grid: GridPoint[] = [];
  const markers: MarkerPoint[] = [];

  // Latitude lines.
  // Equator is emphasized so the object reads as a globe, not just a sphere.
  for (let lat = -80; lat <= 80; lat += 20) {
    const major = lat === 0;

    for (let lon = 0; lon < 360; lon += 3) {
      const p = latLonToPoint(lat, lon);
      grid.push({ ...p, major });
    }
  }

  // Longitude lines.
  // Every 90 degrees is slightly emphasized.
  for (let lon = 0; lon < 360; lon += 30) {
    const major = lon % 90 === 0;

    for (let lat = -87; lat <= 87; lat += 3) {
      const p = latLonToPoint(lat, lon);
      grid.push({ ...p, major });
    }
  }

  // Poles.
  grid.push({ x: 0, y: 1, z: 0, major: true });
  grid.push({ x: 0, y: -1, z: 0, major: true });

  // Optional server / region markers.
  // Remove these if you want a pure wireframe globe.
  const markerLocations: Array<[number, number]> = [
    [37.77, -122.42], // San Francisco
    [40.71, -74.01], // New York
    [51.51, -0.13], // London
    [50.11, 8.68], // Frankfurt
    [1.35, 103.82], // Singapore
    [35.68, 139.69], // Tokyo
    [-33.87, 151.21], // Sydney
    [-23.55, -46.63], // São Paulo
  ];

  for (const [lat, lon] of markerLocations) {
    markers.push(latLonToPoint(lat, lon));
  }

  return { grid, markers };
}

export default function AsciiGlobe() {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const { grid, markers } = buildGlobe();

    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);

    // Static outer silhouette circle in screen space.
    // This helps the globe read as a solid round object.
    const outline: Array<{ x: number; y: number }> = [];
    const OUTLINE_POINTS = 240;

    for (let i = 0; i < OUTLINE_POINTS; i++) {
      const t = (i / OUTLINE_POINTS) * Math.PI * 2;
      outline.push({ x: Math.cos(t), y: Math.sin(t) });
    }

    let angle = 0.75;
    let raf = 0;

    const projectX = (x: number) =>
      Math.round((x * RADIUS + 1) * 0.5 * (COLS - 1));

    const projectY = (y: number) =>
      Math.round((-y * RADIUS + 1) * 0.5 * (ROWS - 1));

    function render() {
      const buffer: string[][] = Array.from({ length: ROWS }, () =>
        Array<string>(COLS).fill(" ")
      );

      const depth: number[][] = Array.from({ length: ROWS }, () =>
        Array<number>(COLS).fill(-Infinity)
      );

      // Draw outer globe edge first.
      for (const p of outline) {
        const sx = projectX(p.x);
        const sy = projectY(p.y);

        if (sx >= 0 && sx < COLS && sy >= 0 && sy < ROWS) {
          if (depth[sy][sx] < 0) {
            depth[sy][sx] = 0;
            buffer[sy][sx] = ".";
          }
        }
      }

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Draw rotating latitude/longitude grid.
      for (const p of grid) {
        // Rotate around Y axis.
        const x = p.x * cosA + p.z * sinA;
        const z0 = -p.x * sinA + p.z * cosA;
        const y0 = p.y;

        // Fixed camera tilt around X axis.
        const y = y0 * cosT - z0 * sinT;
        const z = y0 * sinT + z0 * cosT;

        // Only draw the visible front hemisphere.
        if (z <= 0.02) continue;

        const sx = projectX(x);
        const sy = projectY(y);

        if (sx < 0 || sx >= COLS || sy < 0 || sy >= ROWS) continue;
        if (z <= depth[sy][sx]) continue;

        depth[sy][sx] = z;

        const light = Math.max(
          0,
          x * LIGHT.x + y * LIGHT.y + z * LIGHT.z
        );

        const level = Math.min(
          1,
          0.16 + 0.84 * (0.62 * z + 0.38 * light)
        );

        let idx = Math.max(
          0,
          Math.min(
            RAMP.length - 1,
            Math.floor(level * (RAMP.length - 1))
          )
        );

        // Slightly brighten important lines.
        if (p.major) {
          idx = Math.min(RAMP.length - 1, idx + 1);
        }

        buffer[sy][sx] = RAMP[idx] ?? ".";
      }

      // Draw markers on top when they are on the visible side.
      for (const m of markers) {
        const x = m.x * cosA + m.z * sinA;
        const z0 = -m.x * sinA + m.z * cosA;
        const y0 = m.y;

        const y = y0 * cosT - z0 * sinT;
        const z = y0 * sinT + z0 * cosT;

        if (z <= 0.08) continue;

        const sx = projectX(x);
        const sy = projectY(y);

        if (sx < 0 || sx >= COLS || sy < 0 || sy >= ROWS) continue;

        buffer[sy][sx] = MARKER_CHAR;
        depth[sy][sx] = Math.max(depth[sy][sx], z);
      }

      if (pre) {
        pre.textContent = buffer.map((row) => row.join("")).join("\n");
      }
    }

    function tick() {
      render();

      if (!prefersReducedMotion) {
        angle += SPEED;
        raf = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(raf);
    };
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
