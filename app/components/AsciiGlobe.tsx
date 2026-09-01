"use client";

import { useEffect, useRef } from "react";

// Same grid size as your original globe.
const COLS = 64;
const ROWS = 32;

const R = 0.985;
const TILT = 0.38;
const SPEED = 0.006;

// Dot-style ramp: keep it subtle and "dotted".
const LAND_RAMP = ".:o";
const OUTLINE_CHAR = ".";

// [longitude, latitude, longitudeRadius, latitudeRadius]
// This is a stylized low-res world map made from overlapping land blobs.
type LandEllipse = [number, number, number, number];

const LAND_ELLIPSES: LandEllipse[] = [
  // North America
  [-152, 64, 16, 8],
  [-125, 58, 15, 12],
  [-95, 58, 25, 14],
  [-70, 55, 15, 12],
  [-98, 40, 28, 10],
  [-80, 38, 12, 10],
  [-102, 24, 10, 8],
  [-88, 15, 8, 5],
  [-112, 27, 4, 7],
  [-75, 20, 8, 3],

  // Greenland / Iceland
  [-42, 74, 16, 9],
  [-19, 65, 5, 4],

  // South America
  [-68, 7, 14, 8],
  [-55, 2, 12, 8],
  [-47, -10, 16, 14],
  [-52, -25, 12, 10],
  [-72, -5, 6, 18],
  [-70, -30, 5, 14],
  [-64, -38, 10, 12],
  [-69, -48, 5, 8],

  // Africa
  [0, 28, 20, 8],
  [-8, 12, 14, 10],
  [15, 23, 20, 8],
  [30, 27, 8, 7],
  [45, 8, 8, 7],
  [20, 2, 16, 12],
  [35, -5, 10, 12],
  [22, -25, 12, 10],
  [47, -20, 4, 8],

  // Europe
  [-5, 40, 7, 5],
  [2, 47, 8, 7],
  [-3, 54, 4, 6],
  [15, 62, 10, 10],
  [12, 43, 3, 6],
  [22, 42, 8, 7],
  [30, 52, 18, 10],
  [24, 58, 8, 5],

  // Middle East / Central Asia
  [38, 38, 10, 6],
  [45, 27, 14, 10],
  [48, 42, 10, 6],
  [65, 45, 18, 10],

  // Russia / Siberia
  [50, 58, 20, 12],
  [90, 60, 35, 12],
  [130, 62, 25, 10],
  [160, 57, 6, 8],
  [170, 60, 10, 8],
  [175, 64, 8, 6],

  // South Asia
  [78, 25, 10, 8],
  [78, 15, 8, 10],
  [81, 7, 2, 2],

  // East Asia
  [110, 35, 18, 12],
  [105, 25, 12, 8],
  [85, 32, 12, 6],
  [127, 37, 3, 5],
  [138, 38, 4, 8],

  // Southeast Asia / islands
  [102, 16, 8, 10],
  [102, 4, 5, 8],
  [101, 0, 6, 3],
  [114, 0, 7, 5],
  [110, -7, 8, 2],
  [122, -2, 6, 5],
  [145, -6, 10, 4],
  [122, 12, 4, 7],

  // Australia / Oceania
  [125, -25, 15, 12],
  [145, -28, 10, 12],
  [135, -15, 10, 6],
  [146, -42, 3, 3],
  [171, -41, 5, 7],
];

function insideEllipse(
  lon: number,
  lat: number,
  cLon: number,
  cLat: number,
  rx: number,
  ry: number
) {
  if (rx <= 0 || ry <= 0) return false;

  let dLon = lon - cLon;

  // Wrap longitude distance.
  dLon = ((dLon + 540) % 360) - 180;

  const dLat = lat - cLat;

  return (dLon * dLon) / (rx * rx) + (dLat * dLat) / (ry * ry) <= 1;
}

function isLand(lon: number, lat: number) {
  for (const [cLon, cLat, rx, ry] of LAND_ELLIPSES) {
    if (insideEllipse(lon, lat, cLon, cLat, rx, ry)) {
      return true;
    }
  }

  return false;
}

function latLonToXYZ(latDeg: number, lonDeg: number) {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;

  const cosLat = Math.cos(lat);

  return {
    x: cosLat * Math.cos(lon),
    y: Math.sin(lat),
    z: cosLat * Math.sin(lon),
  };
}

function buildLandPoints() {
  const points: Array<{ x: number; y: number; z: number }> = [];

  for (let row = 0; row < ROWS; row++) {
    const lat = 90 - ((row + 0.5) * 180) / ROWS;

    for (let col = 0; col < COLS; col++) {
      const lon = -180 + ((col + 0.5) * 360) / COLS;

      if (!isLand(lon, lat)) continue;

      points.push(latLonToXYZ(lat, lon));
    }
  }

  return points;
}

export default function AsciiGlobe() {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const landPoints = buildLandPoints();

    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);

    // Static globe outline so the shape stays readable even over open ocean.
    const outline: Array<{ x: number; y: number }> = [];
    const OUTLINE_POINTS = 260;

    for (let i = 0; i < OUTLINE_POINTS; i++) {
      const t = (i / OUTLINE_POINTS) * Math.PI * 2;
      outline.push({
        x: Math.cos(t),
        y: Math.sin(t),
      });
    }

    let angle = -2.1;
    let raf = 0;

    const projectX = (x: number) =>
      Math.round((x * R + 1) * 0.5 * (COLS - 1));

    const projectY = (y: number) =>
      Math.round((-y * R + 1) * 0.5 * (ROWS - 1));

    function render() {
      const buffer: string[][] = Array.from({ length: ROWS }, () =>
        Array<string>(COLS).fill(" ")
      );

      const depth: number[][] = Array.from({ length: ROWS }, () =>
        Array<number>(COLS).fill(-Infinity)
      );

      // Draw outline first.
      for (const p of outline) {
        const sx = projectX(p.x);
        const sy = projectY(p.y);

        if (sx >= 0 && sx < COLS && sy >= 0 && sy < ROWS) {
          if (depth[sy][sx] < 0) {
            depth[sy][sx] = 0;
            buffer[sy][sx] = OUTLINE_CHAR;
          }
        }
      }

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Draw dotted landmasses.
      for (const p of landPoints) {
        // Rotate around Y axis.
        const x = p.x * cosA + p.z * sinA;
        const z0 = -p.x * sinA + p.z * cosA;
        const y0 = p.y;

        // Tilt camera.
        const y = y0 * cosT - z0 * sinT;
        const z = y0 * sinT + z0 * cosT;

        // Front hemisphere only.
        if (z <= 0.03) continue;

        const sx = projectX(x);
        const sy = projectY(y);

        if (sx < 0 || sx >= COLS || sy < 0 || sy >= ROWS) continue;
        if (z <= depth[sy][sx]) continue;

        depth[sy][sx] = z;

        const level = Math.min(1, 0.2 + z * 0.8);
        const idx = Math.min(
          LAND_RAMP.length - 1,
          Math.floor(level * (LAND_RAMP.length - 1))
        );

        buffer[sy][sx] = LAND_RAMP[idx] ?? ".";
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
