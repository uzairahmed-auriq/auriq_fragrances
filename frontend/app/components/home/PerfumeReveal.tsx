"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useScrollProgress } from "../../hooks/useScrollProgress";
// 200 particles for a massive, full-screen mist explosion
const PARTICLES = Array.from({ length: 200 }, (_, i) => {
  // Full 360-degree massive burst to cover the entire viewport
  const baseAngle = -180 + (i * 1.8); 
  const jitter = (i % 5 === 0) ? 30 : (i % 5 === 1) ? -30 : (i % 5 === 2) ? 15 : -15;
  return {
    id: i,
    angle: baseAngle + jitter,
    // Massive distance to push particles all the way to the edges of the screen
    distance: 50 + (i % 20) * 75,   // 50px to 1475px travel distance
    size: 2.5 + (i % 4),            // larger mist drops (2.5px - 5.5px)
    opacity: 0.5 + (i % 10) * 0.05, // highly visible (0.5 - 0.95)
  };
});

const TEXTS = [
  {
    label: "The Auriq Experience",
    heading: "Born from\nRarity.",
    sub: "Every bottle carries the essence of the world's most coveted ingredients — sourced from silk-route markets, rose valleys, and ancient forests.",
  },
  {
    label: "Master Craftsmanship",
    heading: "Sealed with\nPrecision.",
    sub: "Each cap is engineered for a satisfying, airtight seal — preserving your fragrance at peak intensity from the very first spray.",
  },
  {
    label: "The Signature Moment",
    heading: "One Spray.\nUnforgettable.",
    sub: "High-concentration Eau de Parfum with a sillage that commands every room — elegantly, effortlessly, always.",
  },
  {
    label: "Your Scent Awaits",
    heading: "Discover Your\nSignature.",
    sub: "From deep ouds to luminous florals — explore a collection crafted for those who live with intention.",
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(Math.max(t, 0), 1);
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function PerfumeReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);
  const progress = useScrollProgress(sectionRef);

  const [isMobile, setIsMobile] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [smoothProgress, setSmoothProgress] = useState(0);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Smooth lerp toward raw scroll progress for buttery animation
  useEffect(() => {
    if (prefersReduced) { setSmoothProgress(progress); return; }
    let current = smoothProgress;
    const animate = () => {
      current = lerp(current, progress, 0.15); // Increased lerp speed from 0.08 to 0.15 for tighter, faster scroll tracking
      setSmoothProgress(current);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [progress, prefersReduced]);

  const p = smoothProgress;

  // Stage breakpoints (0-1) with dead-zones to create a natural pause/delay after each step
  function calcStage(scrollP: number, start: number) {
    // Each stage has a 0.25 scroll window. We animate for the first 0.15, and pause for the remaining 0.10
    return easeInOut(Math.min(Math.max((scrollP - start) / 0.15, 0), 1));
  }

  const s1 = calcStage(p, 0);
  const s2 = calcStage(p, 0.25);
  const s3 = calcStage(p, 0.50);
  const s4 = calcStage(p, 0.75);

  // Bottle
  const bottleY   = lerp(120, 0, s1);
  const bottleOp  = lerp(0, 1, Math.min(s1 * 1.5, 1));
  const bottleScale = lerp(0.92, 1, s1) + lerp(0, 0.02, s2);

  // Cap: lifts in s2, partially settles in s4
  const capY = lerp(0, -72, s2) + lerp(0, 20, s4);

  // Glow line between cap and body
  const glowOp = lerp(0, 1, s2) * lerp(1, 0.3, s4);

  // Spray particles spread: s3
  const spray = s3;

  // Current text stage
  const stageIndex = Math.min(Math.floor(p * 3.99), 3);

  // ─── Mobile / reduced motion fallback ────────────────────────────────────
  if (isMobile || prefersReduced) {
    return (
      <section className="bg-perfume-main py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(212,175,55,0.07) 0%, transparent 70%)" }} />

        <div className="container-lux flex flex-col items-center text-center gap-12">
          {/* Bottle SVG */}
          <div className="relative w-48 h-80">
            <PerfumeBottleSVG capY={0} glowOp={0} />
          </div>

          <div className="max-w-sm">
            <span className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold block mb-4">
              {TEXTS[3].label}
            </span>
            <h2 className="text-4xl font-serif text-foreground font-bold tracking-wide leading-tight mb-5 whitespace-pre-line">
              {TEXTS[3].heading}
            </h2>
            <p className="text-foreground/65 text-sm leading-relaxed font-medium mb-8">
              {TEXTS[3].sub}
            </p>
            <Link href="/collections"
              className="lg-btn-primary inline-block px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase text-white">
              Explore Collections
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ─── Desktop scroll-driven experience ────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      style={{ height: "1200vh", position: "relative" }}
      className="bg-perfume-main"
    >
      <div
        style={{ position: "sticky", top: 0, height: "100vh" }}
        className="overflow-hidden flex items-center"
      >
        {/* ── Deep background glow ── */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 55% 60% at 72% 55%, rgba(212,175,55,${lerp(0, 0.12, s1)}) 0%, transparent 65%)`,
            transition: "background 0.1s",
          }} />

        {/* ── Subtle scanline texture ── */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
          }} />

        <div className="container-lux w-full flex items-center h-full gap-0">

          {/* ── LEFT: Text panel ─────────────────────────────────────────── */}
          <div className="w-[45%] relative flex flex-col justify-center" style={{ height: "70vh" }}>

            {/* Stage counter pill */}
            <div className="flex items-center gap-3 mb-8">
              {TEXTS.map((_, i) => (
                <div key={i}
                  className="rounded-full transition-all duration-700"
                  style={{
                    height: "2px",
                    width: i === stageIndex ? "32px" : "12px",
                    background: i === stageIndex
                      ? "rgba(212,175,55,0.9)"
                      : "rgba(255,255,255,0.15)",
                  }} />
              ))}
            </div>

            {/* Text slides */}
            <div className="relative" style={{ height: "280px" }}>
              {TEXTS.map((text, i) => {
                const active = i === stageIndex;
                const past   = i < stageIndex;
                return (
                  <div
                    key={i}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{
                      opacity: active ? 1 : 0,
                      transform: `translateY(${active ? 0 : past ? -24 : 28}px)`,
                      transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)",
                      pointerEvents: active ? "auto" : "none",
                    }}
                  >
                    <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-bold mb-5 block">
                      {text.label}
                    </span>
                    <h2 className="font-serif text-foreground font-bold tracking-wide leading-[1.1] mb-6 whitespace-pre-line"
                      style={{ fontSize: "clamp(2.4rem, 4vw, 3.8rem)" }}>
                      {text.heading}
                    </h2>
                    <p className="text-foreground/60 font-medium leading-relaxed"
                      style={{ fontSize: "clamp(0.8rem, 1.1vw, 0.95rem)", maxWidth: "420px" }}>
                      {text.sub}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA — appears at stage 4 */}
            <div style={{
              opacity: s4,
              transform: `translateY(${lerp(20, 0, s4)}px)`,
              transition: "opacity 0.5s, transform 0.5s",
              marginTop: "2rem",
            }}>
              <Link href="/collections"
                className="lg-btn-primary inline-block px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase text-white"
                style={{ boxShadow: `0 0 ${lerp(0, 30, s4)}px rgba(212,175,55,0.25)` }}>
                Explore Collections
              </Link>
            </div>

            {/* Scroll cue — disappears once started */}
            <div className="absolute bottom-8 left-0 flex items-center gap-3"
              style={{ opacity: lerp(1, 0, Math.min(p * 6, 1)), transition: "opacity 0.3s" }}>
              <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
                <div className="w-1 h-2 rounded-full bg-gold/60 animate-bounce" />
              </div>
              <span className="text-[10px] text-foreground/40 tracking-[0.25em] uppercase font-medium">Scroll to explore</span>
            </div>
          </div>

          {/* ── RIGHT: Bottle ────────────────────────────────────────────── */}
          <div className="w-[55%] h-full flex items-center justify-center relative">

            {/* Soft halo behind bottle */}
            <div className="absolute rounded-full pointer-events-none"
              style={{
                width: "360px",
                height: "360px",
                background: `radial-gradient(circle, rgba(212,175,55,${lerp(0, 0.08, s1)}) 0%, transparent 70%)`,
                filter: "blur(40px)",
                transform: "translateY(60px)",
              }} />

            {/* Bottle wrapper */}
            <div
              className="relative will-change-transform"
              style={{
                width: "280px",
                height: "560px",
                opacity: bottleOp,
                transform: `translateY(${bottleY}px) scale(${bottleScale})`,
              }}
            >
              {/* Gold seam glow (cap separation) */}
              <div
                className="absolute left-1/2 rounded-full pointer-events-none z-20"
                style={{
                  top: "192px",
                  width: "116px",
                  height: "2px",
                  marginLeft: "-58px",
                  background: "rgba(212,175,55,0.9)",
                  boxShadow: `0 0 ${lerp(0, 20, glowOp)}px ${lerp(0, 8, glowOp)}px rgba(212,175,55,0.6)`,
                  opacity: glowOp,
                }}
              />

              {/* Main SVG */}
              <PerfumeBottleSVG capY={capY} glowOp={glowOp} />

              {/* ── Spray particles ── */}
              <div
                className="absolute z-30 pointer-events-none"
                style={{ top: "148px", left: "140px", transform: `translateY(${capY}px)` }}
              >
                {PARTICLES.map((pt) => {
                  const rad = (pt.angle * Math.PI) / 180;
                  const tx  = Math.cos(rad) * pt.distance * spray;
                  const ty  = Math.sin(rad) * pt.distance * spray;
                  const pop = spray < 0.5 ? spray * 2 : (1 - spray) * 2;
                  return (
                    <div
                      key={pt.id}
                      className="absolute rounded-full will-change-transform"
                      style={{
                        width:  `${pt.size}px`,
                        height: `${pt.size}px`,
                        marginLeft: `-${pt.size / 2}px`,
                        marginTop:  `-${pt.size / 2}px`,
                        background: "rgba(240,205,85,0.95)", // Brighter gold core
                        boxShadow:  `0 0 ${pt.size * 3}px ${pt.size}px rgba(212,175,55,0.9)`, // Intense glow
                        opacity: pop * pt.opacity,
                        transform: `translate(${tx}px, ${ty}px)`,
                      }}
                    />
                  );
                })}
              </div>

              {/* ── Mist haze behind particles ── */}
              <div
                className="absolute rounded-full pointer-events-none z-20"
                style={{
                  top: "100px",
                  left: "50%",
                  marginLeft: "-70px",
                  width:  "140px",
                  height: "140px",
                  background: `radial-gradient(circle, rgba(212,175,55,${lerp(0, 0.12, spray)}) 0%, transparent 70%)`,
                  filter: "blur(18px)",
                  opacity: spray < 0.5 ? spray * 2 : (1 - spray) * 2,
                  transform: `translateY(${capY}px)`,
                }}
              />
            </div>

            {/* Floating ingredient tags — appear in s3/s4 */}
            {[
              { label: "Oud Noir",      top: "18%",  right: "6%",   delay: 0   },
              { label: "Rose Absolute", top: "38%",  right: "2%",   delay: 0.1 },
              { label: "Amber Woods",   bottom: "28%", right: "8%", delay: 0.2 },
            ].map((tag) => (
              <div
                key={tag.label}
                className="absolute lux-glass px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gold pointer-events-none"
                style={{
                  top:    tag.top,
                  bottom: (tag as any).bottom,
                  right:  tag.right,
                  opacity: lerp(0, 1, Math.max(s3 - tag.delay * 2, 0)),
                  transform: `translateX(${lerp(24, 0, Math.max(s3 - tag.delay * 2, 0))}px)`,
                  transition: "none",
                  whiteSpace: "nowrap",
                  borderRadius: "8px",
                }}
              >
                {tag.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Isolated SVG bottle ──────────────────────────────────────────────────────
function PerfumeBottleSVG({ capY, glowOp }: { capY: number; glowOp: number }) {
  return (
    <svg
      viewBox="0 0 200 420"
      className="w-full h-full"
      style={{ overflow: "visible" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1c1c1c" />
          <stop offset="40%"  stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#111111" />
        </linearGradient>
        <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#181818" />
          <stop offset="50%"  stopColor="#252525" />
          <stop offset="100%" stopColor="#141414" />
        </linearGradient>
        <linearGradient id="shineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
        </linearGradient>
        <linearGradient id="goldEdge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#a87c2a" />
          <stop offset="40%"  stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8a6520" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Bottle body ── */}
      <g>
        {/* Shadow base */}
        <ellipse cx="100" cy="415" rx="42" ry="5" fill="rgba(0,0,0,0.35)" />

        {/* Main body shape */}
        <rect x="36" y="170" width="128" height="240" rx="14" fill="url(#bodyGrad)" />
        {/* Gold border */}
        <rect x="36" y="170" width="128" height="240" rx="14"
          fill="none" stroke="url(#goldEdge)" strokeWidth="1.5" />
        {/* Left edge highlight */}
        <rect x="36" y="170" width="4"   height="240" rx="2" fill="rgba(255,255,255,0.06)" />
        {/* Right edge shadow */}
        <rect x="160" y="170" width="4"  height="240" rx="2" fill="rgba(0,0,0,0.3)" />
        {/* Top shine */}
        <rect x="44" y="175" width="112" height="60"  rx="8" fill="url(#shineGrad)" />
        {/* Glass depth inner */}
        <rect x="50" y="185" width="100" height="215" rx="10"
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* Neck taper */}
        <path d="M 70 170 L 50 140 L 150 140 L 130 170 Z"
          fill="url(#bodyGrad)" stroke="url(#goldEdge)" strokeWidth="1.2" />
        <path d="M 72 170 L 53 143 L 147 143 L 128 170 Z"
          fill="rgba(255,255,255,0.03)" />

        {/* Shoulder ring */}
        <rect x="36" y="165" width="128" height="8" rx="4"
          fill="url(#goldEdge)" opacity="0.7" />

        {/* Label area */}
        <rect x="52" y="215" width="96" height="130" rx="6"
          fill="rgba(0,0,0,0.25)" stroke="rgba(212,175,55,0.15)" strokeWidth="0.8" />

        {/* Brand name */}
        <text x="100" y="268"
          textAnchor="middle" dominantBaseline="middle"
          fill="#d4af37"
          fontSize="20" fontWeight="600" letterSpacing="0.35em"
          fontFamily="Georgia, 'Times New Roman', serif"
          filter="url(#glow)">
          AURIQ
        </text>

        {/* Tagline */}
        <text x="100" y="290"
          textAnchor="middle" dominantBaseline="middle"
          fill="rgba(255,255,255,0.28)"
          fontSize="6.5" letterSpacing="0.5em"
          fontFamily="'Helvetica Neue', Arial, sans-serif">
          EAU DE PARFUM
        </text>

        {/* Decorative lines */}
        <line x1="62" y1="302" x2="138" y2="302" stroke="rgba(212,175,55,0.2)" strokeWidth="0.6" />
        <line x1="72" y1="307" x2="128" y2="307" stroke="rgba(212,175,55,0.12)" strokeWidth="0.4" />

        {/* Volume */}
        <text x="100" y="322"
          textAnchor="middle" dominantBaseline="middle"
          fill="rgba(255,255,255,0.20)"
          fontSize="6" letterSpacing="0.3em"
          fontFamily="'Helvetica Neue', Arial, sans-serif">
          100 ml / 3.4 fl.oz
        </text>

        {/* Liquid fill indicator (subtle) */}
        <rect x="51" y="340" width="98" height="50" rx="4"
          fill="rgba(212,175,55,0.04)" />
        <rect x="51" y="355" width="98" height="2" rx="1"
          fill="rgba(212,175,55,0.08)" />
      </g>

      {/* ── Cap ── (animated separately via transform) */}
      <g style={{ transform: `translateY(${capY}px)`, willChange: "transform" }}>
        {/* Cap body */}
        <rect x="50" y="75" width="100" height="68" rx="8"
          fill="url(#capGrad)" stroke="url(#goldEdge)" strokeWidth="1.5" />
        {/* Cap left highlight */}
        <rect x="50" y="75" width="4" height="68" rx="3"
          fill="rgba(255,255,255,0.07)" />
        {/* Cap top shine */}
        <rect x="57" y="78" width="86" height="20" rx="4"
          fill="url(#shineGrad)" />
        {/* Cap inner detail ring */}
        <rect x="57" y="134" width="86" height="6" rx="3"
          fill="rgba(212,175,55,0.18)" />

        {/* Neck collar */}
        <rect x="68" y="60" width="64" height="18" rx="4"
          fill="url(#capGrad)" stroke="url(#goldEdge)" strokeWidth="1.2" />
        <rect x="68" y="60" width="64" height="6" rx="3"
          fill="rgba(255,255,255,0.06)" />

        {/* Atomizer stem */}
        <rect x="88" y="40" width="24" height="22" rx="3"
          fill="#1a1a1a" stroke="rgba(212,175,55,0.5)" strokeWidth="1" />
        <rect x="91" y="40" width="6" height="22" rx="2"
          fill="rgba(255,255,255,0.05)" />

        {/* Nozzle tip */}
        <rect x="94" y="30" width="12" height="12" rx="2"
          fill="#d4af37"
          style={{ filter: `drop-shadow(0 0 ${glowOp * 8}px rgba(212,175,55,0.8))` }} />
        <rect x="99" y="24" width="2" height="8" rx="1"
          fill="rgba(212,175,55,0.6)" />
      </g>
    </svg>
  );
}
