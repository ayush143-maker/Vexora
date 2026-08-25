"use client";

import { useEffect, useRef } from "react";

// Lightweight canvas "node map" — a rotating field of points on a sphere with
// pulse-connections, standing in for Vexora's global server regions. Chosen
// instead of a full WebGL/3D scene: it reads as dimensional and on-brand for
// infrastructure, but stays cheap enough to run smoothly on phones.
export default function NodeMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const POINT_COUNT = 90;
    type Pt = { theta: number; phi: number; pulse: number };
    const points: Pt[] = Array.from({ length: POINT_COUNT }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi: Math.acos(2 * Math.random() - 1),
      pulse: Math.random() * Math.PI * 2,
    }));

    // A handful of active "regions" that periodically flash and connect —
    // suggests live global infrastructure rather than decorative dots.
    const activeLinks: [number, number][] = [];
    for (let i = 0; i < 10; i++) {
      activeLinks.push([
        Math.floor(Math.random() * POINT_COUNT),
        Math.floor(Math.random() * POINT_COUNT),
      ]);
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    let rotation = 0;
    let raf = 0;
    const radius = () => Math.min(width, height) * 0.38;

    function project(p: Pt, rot: number) {
      const theta = p.theta + rot;
      const r = radius();
      const x = r * Math.sin(p.phi) * Math.cos(theta);
      const y = r * Math.cos(p.phi);
      const z = r * Math.sin(p.phi) * Math.sin(theta);
      const scale = 260 / (260 - z);
      return {
        x: width / 2 + x * scale,
        y: height / 2 + y * scale,
        z,
        scale,
      };
    }

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      rotation = prefersReducedMotion ? 0.4 : t * 0.00012;

      const projected = points.map((p) => ({ ...project(p, rotation), p }));

      // connections
      ctx.lineWidth = 1;
      activeLinks.forEach(([a, b], i) => {
        const pa = projected[a];
        const pb = projected[b];
        const pulse = (Math.sin(t * 0.0015 + i) + 1) / 2;
        if (pa.z < 40 && pb.z < 40) {
          ctx.strokeStyle = `rgba(108, 142, 255, ${0.08 + pulse * 0.18})`;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
      });

      // points
      projected
        .sort((a, b) => a.z - b.z)
        .forEach(({ x, y, z, scale, p }) => {
          const depthAlpha = Math.min(1, Math.max(0.12, (z + radius()) / (radius() * 2)));
          const pulse = (Math.sin(t * 0.002 + p.pulse) + 1) / 2;
          const size = (1.4 + pulse * 1.1) * scale;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(108, 142, 255, ${depthAlpha * 0.85})`;
          ctx.fill();
        });

      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    }

    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-full w-full"
      style={{ display: "block" }}
    />
  );
}
