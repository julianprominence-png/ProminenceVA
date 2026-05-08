"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface LilyPad {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  depth: number; // 0-1, affects parallax speed & opacity
  delay: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const LILY_PADS: LilyPad[] = [
  { id: 0,  x: 8,   y: 15,  size: 90,  rotation: 20,  depth: 0.3, delay: 0    },
  { id: 1,  x: 78,  y: 10,  size: 70,  rotation: -15, depth: 0.6, delay: 0.4  },
  { id: 2,  x: 55,  y: 25,  size: 55,  rotation: 45,  depth: 0.9, delay: 0.2  },
  { id: 3,  x: 20,  y: 60,  size: 110, rotation: -30, depth: 0.2, delay: 0.6  },
  { id: 4,  x: 85,  y: 55,  size: 80,  rotation: 10,  depth: 0.7, delay: 0.1  },
  { id: 5,  x: 40,  y: 75,  size: 65,  rotation: -60, depth: 0.5, delay: 0.8  },
  { id: 6,  x: 68,  y: 80,  size: 95,  rotation: 35,  depth: 0.4, delay: 0.3  },
  { id: 7,  x: 5,   y: 85,  size: 50,  rotation: -10, depth: 0.8, delay: 0.7  },
  { id: 8,  x: 92,  y: 30,  size: 60,  rotation: 55,  depth: 0.15,delay: 0.5  },
  { id: 9,  x: 30,  y: 40,  size: 75,  rotation: -45, depth: 0.65,delay: 0.9  },
  { id: 10, x: 62,  y: 48,  size: 45,  rotation: 70,  depth: 0.85,delay: 0.15 },
  { id: 11, x: 15,  y: 35,  size: 85,  rotation: -25, depth: 0.45,delay: 0.55 },
];

export default function VideoEditPage() {
  const heroRef         = useRef<HTMLDivElement>(null);
  const waterRef        = useRef<SVGSVGElement>(null);
  const [ripples, setRipples]   = useState<Ripple[]>([]);
  const [scrollY, setScrollY]   = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const rippleId = useRef(0);

  // ── Scroll parallax ───────────────────────────────────────────────────────
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Mouse parallax ────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── Lily-pad click → ripple ───────────────────────────────────────────────
  const addRipple = (x: number, y: number) => {
    const id = rippleId.current++;
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 2000);
  };

  const handleLilyClick = (e: React.MouseEvent, pad: LilyPad) => {
    e.stopPropagation();
    addRipple(pad.x, pad.y);
  };

  // ── Parallax transform for a lily pad ────────────────────────────────────
  const padTransform = (pad: LilyPad) => {
    const speed   = pad.depth * 0.6;
    const scrollDelta = scrollY * speed * 0.15;
    const mouseX  = mousePos.x * pad.depth * 18;
    const mouseY  = mousePos.y * pad.depth * 12;
    return `translate(${mouseX}px, ${-scrollDelta + mouseY}px)`;
  };

  const projects = [
    { title: "Neon Drift",       category: "Music Video",    duration: "3:42", thumb: "🎬" },
    { title: "Urban Stories",    category: "Documentary",    duration: "12:10","thumb":"🎥" },
    { title: "Product Launch",   category: "Commercial",     duration: "0:30", thumb: "📽️" },
    { title: "Wedding Highlight",category: "Event Film",     duration: "5:20", thumb: "💒" },
    { title: "Street Pulse",     category: "Short Film",     duration: "8:45", thumb: "🎞️" },
    { title: "Brand Identity",   category: "Motion Graphics",duration: "1:15", thumb: "✨" },
  ];

  const tools = [
    {
      name: "CapCut",
      url: "https://www.capcut.com",
      logo: "CC",
      color: "#00d2ff",
      desc: "Fast mobile & desktop editing for social content.",
    },
    {
      name: "Adobe Premiere",
      url: "https://www.adobe.com/products/premiere.html",
      logo: "Pr",
      color: "#9999ff",
      desc: "Industry-standard NLE for cinematic storytelling.",
    },
    {
      name: "DaVinci Resolve",
      url: "https://www.blackmagicdesign.com/products/davinciresolve",
      logo: "DR",
      color: "#ff6b6b",
      desc: "Professional colour grading & post-production suite.",
    },
  ];

  return (
    <>
      {/* ─── Global Styles ─────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --water-deep:   #0a1628;
          --water-mid:    #0d2240;
          --water-light:  #1a3a5c;
          --water-shine:  #2d6a9f;
          --neo-bg:       #112236;
          --neo-raised:   #16304d;
          --neo-inset:    #091827;
          --neo-shadow-d: #06111e;
          --neo-shadow-l: #1e4068;
          --text-pri:     #e8f4f8;
          --text-sec:     #8bb8d4;
          --accent:       #4dd9e8;
          --accent2:      #7c3aed;
          --lily-green:   #2d6a4f;
          --lily-light:   #52b788;
          --flower-pink:  #f4a5b8;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--water-deep);
          color: var(--text-pri);
          overflow-x: hidden;
        }

        /* ── scrollbar ── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--water-deep); }
        ::-webkit-scrollbar-thumb { background: var(--water-shine); border-radius: 3px; }

        /* ── neo card ── */
        .neo {
          background: var(--neo-bg);
          border-radius: 20px;
          box-shadow:
            8px 8px 20px var(--neo-shadow-d),
           -6px -6px 16px var(--neo-shadow-l),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .neo-inset {
          background: var(--neo-inset);
          border-radius: 14px;
          box-shadow:
            inset 5px 5px 12px var(--neo-shadow-d),
            inset -4px -4px 10px rgba(45,106,159,0.25);
        }
        .neo-btn {
          background: var(--neo-bg);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow:
            5px 5px 14px var(--neo-shadow-d),
           -4px -4px 10px var(--neo-shadow-l);
        }
        .neo-btn:hover {
          box-shadow:
            3px 3px 8px var(--neo-shadow-d),
           -2px -2px 6px var(--neo-shadow-l);
          transform: translateY(-1px);
        }
        .neo-btn:active {
          box-shadow:
            inset 3px 3px 8px var(--neo-shadow-d),
            inset -2px -2px 6px var(--neo-shadow-l);
          transform: translateY(0);
        }

        /* ── water canvas ── */
        .water-canvas {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        /* ── sections ── */
        section {
          position: relative;
          z-index: 10;
        }

        /* ── fade-in on scroll ── */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── water shimmer animation ── */
        @keyframes shimmer {
          0%   { opacity: 0.3; }
          50%  { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-8px) rotate(1deg); }
          66%       { transform: translateY(-4px) rotate(-0.5deg); }
        }
        @keyframes rippleOut {
          0%   { r: 2;  stroke-opacity: 0.9; }
          100% { r: 60; stroke-opacity: 0;   }
        }
        @keyframes rippleOut2 {
          0%   { r: 2;  stroke-opacity: 0.6; }
          100% { r: 90; stroke-opacity: 0;   }
        }
        @keyframes rippleOut3 {
          0%   { r: 2;  stroke-opacity: 0.3; }
          100% { r: 120;stroke-opacity: 0;   }
        }
        @keyframes pulse-glow {
          0%,100% { filter: drop-shadow(0 0 8px var(--accent)); }
          50%      { filter: drop-shadow(0 0 22px var(--accent)); }
        }
        @keyframes textReveal {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
        }

        /* ── hero ── */
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(4rem, 12vw, 10rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 0.9;
          background: linear-gradient(135deg, #e8f4f8 0%, var(--accent) 40%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--text-sec);
          font-size: clamp(0.75rem, 2vw, 1rem);
        }

        /* ── nav ── */
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 1.2rem 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          backdrop-filter: blur(18px);
          background: rgba(10,22,40,0.55);
          border-bottom: 1px solid rgba(77,217,232,0.1);
        }
        nav .brand {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          color: var(--accent);
          letter-spacing: 0.05em;
        }
        nav ul {
          list-style: none;
          display: flex;
          gap: 2.5rem;
        }
        nav ul a {
          text-decoration: none;
          color: var(--text-sec);
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: color 0.3s;
        }
        nav ul a:hover { color: var(--accent); }

        /* ── tool card ── */
        .tool-card {
          padding: 2.4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          text-align: center;
          transition: transform 0.3s ease;
          cursor: pointer;
        }
        .tool-card:hover { transform: translateY(-6px); }
        .tool-logo {
          width: 72px; height: 72px;
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem; font-weight: 700;
        }

        /* ── project card ── */
        .project-card {
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          cursor: pointer;
          transition: transform 0.3s ease;
          overflow: hidden;
          position: relative;
        }
        .project-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(77,217,232,0.04), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .project-card:hover { transform: translateY(-4px); }
        .project-card:hover::before { opacity: 1; }
        .project-thumb {
          font-size: 2.8rem;
          height: 90px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 12px;
        }

        /* ── contact ── */
        .contact-input {
          width: 100%;
          padding: 1rem 1.4rem;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: var(--text-pri);
          background: transparent;
          resize: none;
        }
        .contact-input::placeholder { color: var(--text-sec); opacity: 0.6; }

        /* ── section label ── */
        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.6rem;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          color: var(--text-pri);
          line-height: 1.1;
        }

        /* ── accent line ── */
        .accent-line {
          width: 60px; height: 3px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          border-radius: 2px;
          margin: 1.2rem 0;
        }

        /* ── grid ── */
        .tools-grid   { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.8rem; }
        .projects-grid{ display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.6rem; }

        /* ── lily SVG ── */
        .lily-layer {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: visible;
        }
        .lily-group {
          cursor: pointer;
          pointer-events: all;
          animation: float 6s ease-in-out infinite;
        }

        /* ── reflection overlay ── */
        .reflection-overlay {
          position: fixed;
          inset: 0;
          z-index: 2;
          background:
            repeating-linear-gradient(
              180deg,
              transparent 0px,
              transparent 3px,
              rgba(0,0,0,0.06) 3px,
              rgba(0,0,0,0.06) 4px
            );
          pointer-events: none;
          mix-blend-mode: multiply;
        }

        @media (max-width: 640px) {
          nav ul { display: none; }
        }
      `}</style>

      {/* ─── Water Background SVG ────────────────────────────────────────── */}
      <svg
        ref={waterRef}
        className="water-canvas"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="waterGrad" cx="50%" cy="40%" r="70%">
            <stop offset="0%"   stopColor="#1a3a5c" />
            <stop offset="45%"  stopColor="#0d2240" />
            <stop offset="100%" stopColor="#050e1a" />
          </radialGradient>
          <filter id="blur2">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
          <filter id="blur4">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          {/* shimmer caustic pattern */}
          <pattern id="caustic" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <ellipse cx="10" cy="10" rx="8" ry="3" fill="none"
              stroke="rgba(77,217,232,0.06)" strokeWidth="0.4" />
            <ellipse cx="5"  cy="5"  rx="3" ry="1.5" fill="none"
              stroke="rgba(77,217,232,0.04)" strokeWidth="0.3" />
          </pattern>
          {/* reflection gradient */}
          <linearGradient id="reflGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(77,217,232,0.12)" />
            <stop offset="100%" stopColor="rgba(77,217,232,0)" />
          </linearGradient>
        </defs>

        {/* deep water bg */}
        <rect width="100" height="100" fill="url(#waterGrad)" />

        {/* caustic light patterns */}
        <rect width="100" height="100" fill="url(#caustic)" style={{ animation: "shimmer 4s ease-in-out infinite" }} />
        <rect width="100" height="100" fill="url(#caustic)"
          style={{ animation: "shimmer 6s ease-in-out infinite", transform: "rotate(45deg) scale(1.5)", transformOrigin: "50% 50%" }} />

        {/* horizontal water shimmer lines */}
        {Array.from({ length: 18 }, (_, i) => (
          <line key={i}
            x1="0" y1={5 + i * 5.5}
            x2="100" y2={5 + i * 5.5 + (Math.random() * 2 - 1)}
            stroke="rgba(45,106,159,0.12)"
            strokeWidth="0.3"
            style={{ animation: `shimmer ${3 + (i % 4)}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
          />
        ))}

        {/* deep glow centers */}
        <ellipse cx="30" cy="25" rx="25" ry="15" fill="rgba(29,94,147,0.2)" filter="url(#blur4)" />
        <ellipse cx="72" cy="65" rx="20" ry="12" fill="rgba(29,94,147,0.15)" filter="url(#blur4)" />
        <ellipse cx="55" cy="45" rx="18" ry="10" fill="rgba(77,217,232,0.06)" filter="url(#blur4)" />

        {/* ripples from lily taps */}
        {ripples.map(r => (
          <g key={r.id}>
            <circle cx={r.x} cy={r.y} r="2" fill="none"
              stroke="rgba(77,217,232,0.9)" strokeWidth="0.5"
              style={{ animation: "rippleOut 2s ease-out forwards" }} />
            <circle cx={r.x} cy={r.y} r="2" fill="none"
              stroke="rgba(77,217,232,0.6)" strokeWidth="0.4"
              style={{ animation: "rippleOut2 2s ease-out forwards", animationDelay: "0.15s" }} />
            <circle cx={r.x} cy={r.y} r="2" fill="none"
              stroke="rgba(77,217,232,0.3)" strokeWidth="0.3"
              style={{ animation: "rippleOut3 2s ease-out forwards", animationDelay: "0.3s" }} />
          </g>
        ))}
      </svg>

      {/* ─── Lily Pads Layer ─────────────────────────────────────────────── */}
      <svg
        className="lily-layer"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="lilyGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#52b788" />
            <stop offset="60%"  stopColor="#2d6a4f" />
            <stop offset="100%" stopColor="#1b4332" />
          </radialGradient>
          <radialGradient id="lilyGradDeep" cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#40916c" />
            <stop offset="60%"  stopColor="#1b4332" />
            <stop offset="100%" stopColor="#081c11" />
          </radialGradient>
          <radialGradient id="flowerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffd6e0" />
            <stop offset="100%" stopColor="#f4a5b8" />
          </radialGradient>
          <filter id="lilyBlur">
            <feGaussianBlur stdDeviation="0.3" />
          </filter>
          {/* reflection blur */}
          <filter id="reflBlur">
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
        </defs>

        {LILY_PADS.map((pad, i) => {
          const s = pad.size / 1000; // normalized scale
          const opacity = 0.45 + pad.depth * 0.55;
          const reflOpacity = (1 - pad.depth) * 0.35;
          const hasFlower = i % 3 === 0;

          return (
            <g
              key={pad.id}
              className="lily-group"
              style={{
                transform: padTransform(pad),
                animationDelay: `${pad.delay}s`,
                animationDuration: `${5 + pad.depth * 4}s`,
                opacity,
                willChange: "transform",
              }}
              onClick={(e) => handleLilyClick(e, pad)}
            >
              {/* shadow under pad */}
              <ellipse
                cx={pad.x}
                cy={pad.y + s * 120}
                rx={s * 480}
                ry={s * 150}
                fill="rgba(0,0,0,0.25)"
                filter="url(#reflBlur)"
              />

              {/* pad body – wedge-cut circle */}
              <g transform={`translate(${pad.x}, ${pad.y}) rotate(${pad.rotation})`}>
                {/* reflection / shimmer on pad surface */}
                <ellipse
                  cx={-s * 80}
                  cy={-s * 100}
                  rx={s * 180}
                  ry={s * 100}
                  fill="rgba(255,255,255,0.12)"
                  style={{ filter: "blur(1px)" }}
                />

                <path
                  d={`
                    M 0 0
                    L ${s * 500 * Math.cos(Math.PI * 0.15)} ${-s * 500 * Math.sin(Math.PI * 0.15)}
                    A ${s * 500} ${s * 500} 0 1 1 ${s * 500 * Math.cos(Math.PI * 0.85)} ${-s * 500 * Math.sin(Math.PI * 0.85)}
                    Z
                  `}
                  fill={pad.depth > 0.5 ? "url(#lilyGrad)" : "url(#lilyGradDeep)"}
                  stroke="rgba(82,183,136,0.3)"
                  strokeWidth={s * 30}
                />

                {/* pad veins */}
                {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, vi) => (
                  <line key={vi}
                    x1="0" y1="0"
                    x2={s * 480 * Math.cos((angle * Math.PI) / 180)}
                    y2={s * 480 * Math.sin((angle * Math.PI) / 180)}
                    stroke="rgba(82,183,136,0.25)"
                    strokeWidth={s * 12}
                  />
                ))}

                {/* optional flower */}
                {hasFlower && (
                  <g transform={`translate(${-s * 60}, ${-s * 60})`}>
                    {[0, 72, 144, 216, 288].map((a, fi) => (
                      <ellipse key={fi}
                        cx={s * 80 * Math.cos((a * Math.PI) / 180)}
                        cy={s * 80 * Math.sin((a * Math.PI) / 180)}
                        rx={s * 90}
                        ry={s * 55}
                        fill="url(#flowerGrad)"
                        opacity="0.85"
                        transform={`rotate(${a}, ${s * 80 * Math.cos((a * Math.PI) / 180)}, ${s * 80 * Math.sin((a * Math.PI) / 180)})`}
                      />
                    ))}
                    <circle cx="0" cy="0" r={s * 55} fill="#ffefd5" opacity="0.95" />
                    <circle cx="0" cy="0" r={s * 28} fill="#ffd700" opacity="0.9" />
                  </g>
                )}
              </g>

              {/* water reflection of pad */}
              <g
                transform={`translate(${pad.x}, ${pad.y + s * 200}) rotate(${-pad.rotation}) scale(1, -0.35)`}
                opacity={reflOpacity}
                filter="url(#reflBlur)"
              >
                <path
                  d={`
                    M 0 0
                    L ${s * 500 * Math.cos(Math.PI * 0.15)} ${-s * 500 * Math.sin(Math.PI * 0.15)}
                    A ${s * 500} ${s * 500} 0 1 1 ${s * 500 * Math.cos(Math.PI * 0.85)} ${-s * 500 * Math.sin(Math.PI * 0.85)}
                    Z
                  `}
                  fill="url(#lilyGrad)"
                />
              </g>
            </g>
          );
        })}
      </svg>

      {/* ─── Reflection Scanline Overlay ────────────────────────────────── */}
      <div className="reflection-overlay" />

      {/* ─── Navigation ─────────────────────────────────────────────────── */}
      <nav>
        <span className="brand">VE.</span>
        <ul>
          {["tools", "works", "contact"].map(s => (
            <li key={s}>
              <a href={`#${s}`}>{s}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "0 clamp(2rem, 8vw, 8rem)",
          position: "relative",
        }}
      >
        {/* depth layer 1 – blur bg text */}
        <div style={{
          position: "absolute",
          left: "clamp(2rem, 8vw, 8rem)",
          bottom: "18%",
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(6rem, 22vw, 18rem)",
          fontWeight: 900,
          color: "rgba(13,34,64,0.6)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          transform: `translateY(${scrollY * 0.25}px)`,
          letterSpacing: "-0.04em",
        }}>
          VIDEO
        </div>

        <div style={{
          transform: `translateY(${-scrollY * 0.18}px)`,
          zIndex: 5,
          position: "relative",
        }}>
          <p className="hero-sub" style={{ marginBottom: "1.5rem" }}>
            Crafted Frames · Fluid Motion · Pure Story
          </p>
          <h1 className="hero-title">
            Video<br />Edit
          </h1>
          <div className="accent-line" style={{ marginTop: "1.8rem" }} />
          <p style={{
            maxWidth: "460px",
            color: "var(--text-sec)",
            lineHeight: 1.75,
            fontSize: "1.05rem",
            marginTop: "1rem",
          }}>
            Where still water meets moving image — cinematic editing
            with depth, rhythm, and intention.
          </p>

          <div style={{ display: "flex", gap: "1.2rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
            <a href="#works">
              <button className="neo-btn" style={{
                padding: "0.9rem 2.2rem",
                color: "var(--accent)",
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                View Works
              </button>
            </a>
            <a href="#contact">
              <button className="neo-btn" style={{
                padding: "0.9rem 2.2rem",
                color: "var(--text-sec)",
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                Get In Touch
              </button>
            </a>
          </div>
        </div>

        {/* scroll indicator */}
        <div style={{
          position: "absolute",
          bottom: "3rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--text-sec)",
          fontSize: "0.7rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          opacity: Math.max(0, 1 - scrollY / 200),
        }}>
          <span>Scroll</span>
          <div style={{
            width: "1px",
            height: "50px",
            background: "linear-gradient(to bottom, var(--accent), transparent)",
            animation: "shimmer 2s ease-in-out infinite",
          }} />
        </div>
      </section>

      {/* ─── Tools ──────────────────────────────────────────────────────── */}
      <section
        id="tools"
        style={{
          padding: "8rem clamp(2rem, 8vw, 8rem)",
          transform: `translateY(${-scrollY * 0.04}px)`,
        }}
      >
        <div style={{ marginBottom: "3.5rem" }}>
          <p className="section-label">Arsenal</p>
          <h2 className="section-title">Tools of<br />the Craft</h2>
          <div className="accent-line" />
        </div>

        <div className="tools-grid">
          {tools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <div className="neo tool-card">
                <div
                  className="tool-logo neo-inset"
                  style={{ color: tool.color }}
                >
                  {tool.logo}
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.3rem",
                  color: "var(--text-pri)",
                }}>
                  {tool.name}
                </h3>
                <p style={{ color: "var(--text-sec)", fontSize: "0.9rem", lineHeight: 1.65 }}>
                  {tool.desc}
                </p>
                <span style={{
                  fontSize: "0.75rem",
                  color: tool.color,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginTop: "0.3rem",
                }}>
                  Visit →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ─── Works / Projects ───────────────────────────────────────────── */}
      <section
        id="works"
        style={{
          padding: "6rem clamp(2rem, 8vw, 8rem)",
          transform: `translateY(${-scrollY * 0.02}px)`,
        }}
      >
        <div style={{ marginBottom: "3.5rem" }}>
          <p className="section-label">Portfolio</p>
          <h2 className="section-title">Selected<br />Works</h2>
          <div className="accent-line" />
        </div>

        <div className="projects-grid">
          {projects.map((proj, i) => (
            <div key={i} className="neo project-card">
              <div className="neo-inset project-thumb">
                <span>{proj.thumb}</span>
              </div>
              <div>
                <p style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: "0.3rem",
                }}>
                  {proj.category}
                </p>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.2rem",
                  color: "var(--text-pri)",
                }}>
                  {proj.title}
                </h3>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "0.4rem",
              }}>
                <span style={{ color: "var(--text-sec)", fontSize: "0.85rem" }}>
                  {proj.duration}
                </span>
                <button className="neo-btn" style={{
                  padding: "0.45rem 1rem",
                  fontSize: "0.75rem",
                  color: "var(--text-sec)",
                  letterSpacing: "0.08em",
                }}>
                  Play ▶
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Contact ────────────────────────────────────────────────────── */}
      <section
        id="contact"
        style={{
          padding: "6rem clamp(2rem, 8vw, 8rem) 10rem",
        }}
      >
        <div style={{ marginBottom: "3.5rem" }}>
          <p className="section-label">Connect</p>
          <h2 className="section-title">Start a<br />Conversation</h2>
          <div className="accent-line" />
        </div>

        <div style={{
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "1.4rem",
        }}>
          {submitted ? (
            <div className="neo" style={{
              padding: "3rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}>
              <span style={{ fontSize: "3rem" }}>✦</span>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.6rem",
                color: "var(--accent)",
              }}>
                Message Sent
              </h3>
              <p style={{ color: "var(--text-sec)" }}>
                Thank you for reaching out. I&apos;ll be in touch soon.
              </p>
            </div>
          ) : (
            <>
              <div className="neo-inset" style={{ borderRadius: "14px" }}>
                <input
                  className="contact-input"
                  type="text"
                  placeholder="Your Name"
                  value={formState.name}
                  onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                  style={{ borderRadius: "14px", display: "block" }}
                />
              </div>

              <div className="neo-inset" style={{ borderRadius: "14px" }}>
                <input
                  className="contact-input"
                  type="email"
                  placeholder="Email Address"
                  value={formState.email}
                  onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                  style={{ borderRadius: "14px", display: "block" }}
                />
              </div>

              <div className="neo-inset" style={{ borderRadius: "14px" }}>
                <textarea
                  className="contact-input"
                  placeholder="Message details…"
                  rows={5}
                  value={formState.message}
                  onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                  style={{ borderRadius: "14px", display: "block" }}
                />
              </div>

              <button
                className="neo-btn"
                onClick={() => {
                  if (formState.name && formState.email && formState.message) {
                    setSubmitted(true);
                  }
                }}
                style={{
                  padding: "1rem 2.5rem",
                  color: "var(--accent)",
                  fontSize: "0.9rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  alignSelf: "flex-start",
                }}
              >
                Send Message →
              </button>
            </>
          )}
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer style={{
        position: "relative",
        zIndex: 10,
        padding: "2rem clamp(2rem, 8vw, 8rem)",
        borderTop: "1px solid rgba(77,217,232,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <span style={{ fontFamily: "'Playfair Display', serif", color: "var(--accent)", fontSize: "1.1rem" }}>
          VE.
        </span>
        <span style={{ color: "var(--text-sec)", fontSize: "0.8rem" }}>
          © {new Date().getFullYear()} Video Edit — All rights reserved
        </span>
      </footer>
    </>
  );
}