"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Ripple {
  x: number;
  y: number;
  t: number;
  id: number;
}

interface LilyPad {
  x: number;
  y: number;
  r: number;
  rot: number;
  speed: number;
  wobble: number;
  wobbleSpeed: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TOOLS = [
  {
    name: "CapCut",
    url: "https://www.capcut.com",
    logo: "CC",
    desc: "Fast mobile & desktop editing",
    color: "#00e5a0",
  },
  {
    name: "Adobe Premiere",
    url: "https://www.adobe.com/products/premiere.html",
    logo: "Pr",
    desc: "Industry-standard NLE",
    color: "#9b59b6",
  },
  {
    name: "DaVinci Resolve",
    url: "https://www.blackmagicdesign.com/products/davinciresolve",
    logo: "DR",
    desc: "Pro color grading & editing",
    color: "#e8b84b",
  },
];

const WORKS = [
  {
    id: 1,
    title: "Cinematic Travel Reel",
    cat: "Travel",
    dur: "2:34",
    views: "1.2M",
  },
  {
    id: 2,
    title: "Brand Launch Film",
    cat: "Commercial",
    dur: "0:60",
    views: "890K",
  },
  {
    id: 3,
    title: "Music Video Cut",
    cat: "Music",
    dur: "3:18",
    views: "2.1M",
  },
  {
    id: 4,
    title: "Documentary Short",
    cat: "Doc",
    dur: "12:00",
    views: "430K",
  },
  {
    id: 5,
    title: "Social Media Pack",
    cat: "Social",
    dur: "0:30",
    views: "5.6M",
  },
  {
    id: 6,
    title: "Wedding Highlight",
    cat: "Event",
    dur: "4:45",
    views: "78K",
  },
];

const PROCESS_COLUMNS = [
  {
    num: "01",
    title: "Discovery",
    short: "We listen first.",
    tabs: [
      {
        label: "Briefing",
        content: "A deep-dive call to understand your vision, audience, and goals.",
        subTabs: [
          { label: "Questions", body: "We ask about tone, target platform, reference videos, and deadlines." },
          { label: "Deliverables", body: "A shared brief document with agreed scope, timeline, and revision rounds." },
        ],
      },
      {
        label: "Research",
        content: "We study your brand, competitors, and trending visual styles.",
        subTabs: [
          { label: "Mood Board", body: "Curated visual references aligned to your aesthetic." },
          { label: "Trend Audit", body: "Platform-specific format and pacing analysis." },
        ],
      },
    ],
  },
  {
    num: "02",
    title: "Pre-Production",
    short: "Planned to perfection.",
    tabs: [
      {
        label: "Script",
        content: "Story beats, voiceover copy, and on-screen text are written and approved.",
        subTabs: [
          { label: "Draft v1", body: "Initial narrative arc with placeholder visuals." },
          { label: "Revisions", body: "Two rounds of feedback before locking the script." },
        ],
      },
      {
        label: "Storyboard",
        content: "Frame-by-frame visual plan with transitions and timing notes.",
        subTabs: [
          { label: "Rough Boards", body: "Quick sketches showing scene composition." },
          { label: "Animatics", body: "Timed storyboard previews with placeholder audio." },
        ],
      },
    ],
  },
  {
    num: "03",
    title: "Editing",
    short: "Where the magic happens.",
    tabs: [
      {
        label: "Assembly Cut",
        content: "Raw footage arranged in sequence with rough pacing.",
        subTabs: [
          { label: "Sync", body: "Audio and video tracks aligned with beat markers." },
          { label: "Pacing", body: "Rhythm adjusted to match energy of the content." },
        ],
      },
      {
        label: "Fine Cut",
        content: "Transitions, titles, and motion graphics are added and polished.",
        subTabs: [
          { label: "Motion FX", body: "Kinetic text and animated overlays added." },
          { label: "Audio Mix", body: "SFX, music levels, and dialogue balanced." },
        ],
      },
    ],
  },
  {
    num: "04",
    title: "Color & Sound",
    short: "Cinematic polish.",
    tabs: [
      {
        label: "Color Grade",
        content: "DaVinci Resolve-powered grade giving every frame its signature look.",
        subTabs: [
          { label: "LUT Design", body: "Custom look-up tables built for your brand palette." },
          { label: "Scene Match", body: "Consistent exposure and hue across all clips." },
        ],
      },
      {
        label: "Sound Design",
        content: "Immersive soundscape with music, foley, and mix.",
        subTabs: [
          { label: "Music Licensing", body: "Royalty-free or licensed tracks sourced and cleared." },
          { label: "Mastering", body: "Loudness normalized for platform specifications." },
        ],
      },
    ],
  },
  {
    num: "05",
    title: "Delivery",
    short: "On time. Every time.",
    tabs: [
      {
        label: "Export",
        content: "Multiple format exports optimized for each platform.",
        subTabs: [
          { label: "Formats", body: "H.264, H.265, ProRes, or custom codec per requirement." },
          { label: "Specs", body: "Resolution, bitrate, and aspect ratio matched to platform." },
        ],
      },
      {
        label: "Handoff",
        content: "Files delivered via cloud with project archive included.",
        subTabs: [
          { label: "Cloud Link", body: "Private Dropbox or Drive folder shared with download access." },
          { label: "Archive", body: "Full project file and assets stored for 12 months." },
        ],
      },
    ],
  },
];

// ─── Swamp Canvas Component ───────────────────────────────────────────────────
function SwampCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const rippleIdRef = useRef(0);
  const lilyPadsRef = useRef<LilyPad[]>([]);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  const addRipple = useCallback((x: number, y: number) => {
    ripplesRef.current.push({ x, y, t: 0, id: rippleIdRef.current++ });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init lily pads
    const initPads = () => {
      lilyPadsRef.current = Array.from({ length: 14 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 28 + Math.random() * 40,
        rot: Math.random() * Math.PI * 2,
        speed: (Math.random() - 0.5) * 0.15,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.005 + Math.random() * 0.01,
      }));
    };
    initPads();

    // Touch / click on canvas
    const handleClick = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const pos =
        "touches" in e
          ? { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
          : { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
      addRipple(pos.x, pos.y);
    };
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchstart", handleClick, { passive: true });

    // Check if click hits a lily pad
    const checkPadHit = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      lilyPadsRef.current.forEach((pad) => {
        const dx = mx - pad.x;
        const dy = my - pad.y;
        if (Math.sqrt(dx * dx + dy * dy) < pad.r) {
          addRipple(pad.x, pad.y);
        }
      });
    };
    window.addEventListener("mousemove", checkPadHit);

    const drawWater = (t: number) => {
      const w = canvas.width;
      const h = canvas.height;

      // Base water gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#0a1a0f");
      grad.addColorStop(0.4, "#0d2318");
      grad.addColorStop(1, "#060e0a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Water shimmer lines
      ctx.save();
      ctx.globalAlpha = 0.04;
      for (let i = 0; i < 30; i++) {
        const y = ((i / 30) * h + t * 8 * (i % 3 === 0 ? 1 : -0.5)) % h;
        const waveX = Math.sin(t * 0.5 + i) * 12;
        ctx.strokeStyle = `hsl(${140 + i * 3}, 60%, ${30 + i % 5}%)`;
        ctx.lineWidth = 1 + (i % 3) * 0.5;
        ctx.beginPath();
        ctx.moveTo(waveX, y);
        ctx.bezierCurveTo(w * 0.33 + Math.sin(t + i) * 20, y + 4, w * 0.66 + Math.cos(t + i) * 20, y - 4, w + waveX, y);
        ctx.stroke();
      }
      ctx.restore();

      // Reflection glow patches
      ctx.save();
      ctx.globalAlpha = 0.03;
      for (let i = 0; i < 5; i++) {
        const rx = (Math.sin(t * 0.2 + i * 1.3) * 0.5 + 0.5) * w;
        const ry = (Math.cos(t * 0.15 + i) * 0.5 + 0.5) * h;
        const rg = ctx.createRadialGradient(rx, ry, 0, rx, ry, 120);
        rg.addColorStop(0, "#4dffb4");
        rg.addColorStop(1, "transparent");
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();
    };

    const drawLilyPad = (pad: LilyPad, t: number) => {
      const { x, y, r, rot, wobble } = pad;
      const currentRot = rot + Math.sin(wobble + t * pad.wobbleSpeed * 100) * 0.08;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(currentRot);

      // Shadow
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.ellipse(3, 4, r * 0.95, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Pad body
      const padGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r);
      padGrad.addColorStop(0, "#3a7d44");
      padGrad.addColorStop(0.5, "#2d6b38");
      padGrad.addColorStop(1, "#1a4a22");
      ctx.fillStyle = padGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let a = 0; a <= Math.PI * 2; a += 0.05) {
        const rVar = r * (0.92 + Math.sin(a * 7) * 0.04);
        ctx.lineTo(Math.cos(a) * rVar, Math.sin(a) * rVar);
      }
      // Notch
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(-0.3) * r, Math.sin(-0.3) * r);
      ctx.lineTo(Math.cos(0.3) * r, Math.sin(0.3) * r);
      ctx.closePath();
      ctx.fill();

      // Veins
      ctx.strokeStyle = "rgba(100,200,80,0.3)";
      ctx.lineWidth = 0.8;
      for (let v = 0; v < 8; v++) {
        const va = (v / 8) * Math.PI * 2 + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(Math.cos(va + 0.2) * r * 0.5, Math.sin(va + 0.2) * r * 0.5, Math.cos(va) * r * 0.88, Math.sin(va) * r * 0.88);
        ctx.stroke();
      }

      // Highlight
      ctx.save();
      ctx.globalAlpha = 0.12;
      const hlGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.35, 0, -r * 0.3, -r * 0.35, r * 0.55);
      hlGrad.addColorStop(0, "#ffffff");
      hlGrad.addColorStop(1, "transparent");
      ctx.fillStyle = hlGrad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();
    };

    const drawRipples = () => {
      ripplesRef.current = ripplesRef.current.filter((rip) => rip.t < 1);
      ripplesRef.current.forEach((rip) => {
        const maxR = 120;
        const r1 = rip.t * maxR;
        const r2 = rip.t * maxR * 0.6;
        const r3 = rip.t * maxR * 0.3;
        const alpha = (1 - rip.t) * 0.7;

        [r1, r2, r3].forEach((rr, i) => {
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rr, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(150, 255, 180, ${alpha * (1 - i * 0.25)})`;
          ctx.lineWidth = 1.5 - i * 0.4;
          ctx.stroke();
        });

        rip.t += 0.018;
      });
    };

    const drawFog = (t: number) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.save();
      ctx.globalAlpha = 0.06;
      for (let i = 0; i < 3; i++) {
        const fy = (h * 0.6) + Math.sin(t * 0.1 + i) * 40;
        const fg = ctx.createLinearGradient(0, fy - 60, 0, fy + 60);
        fg.addColorStop(0, "transparent");
        fg.addColorStop(0.5, "#b8e8c0");
        fg.addColorStop(1, "transparent");
        ctx.fillStyle = fg;
        ctx.fillRect(0, fy - 60, w, 120);
      }
      ctx.restore();
    };

    let last = 0;
    const animate = (ts: number) => {
      const dt = (ts - last) / 1000;
      last = ts;
      timeRef.current += dt;
      const t = timeRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawWater(t);
      drawFog(t);

      // Move pads
      lilyPadsRef.current.forEach((pad) => {
        pad.x += Math.sin(t * 0.2 + pad.wobble) * 0.3;
        pad.y += Math.cos(t * 0.15 + pad.wobble) * 0.2;
        pad.wobble += pad.wobbleSpeed;
        if (pad.x < -pad.r) pad.x = canvas.width + pad.r;
        if (pad.x > canvas.width + pad.r) pad.x = -pad.r;
        if (pad.y < -pad.r) pad.y = canvas.height + pad.r;
        if (pad.y > canvas.height + pad.r) pad.y = -pad.r;
        drawLilyPad(pad, t);
      });

      drawRipples();
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("touchstart", handleClick);
      window.removeEventListener("mousemove", checkPadHit);
    };
  }, [addRipple]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ cursor: "crosshair" }}
    />
  );
}

// ─── Process Column Component ─────────────────────────────────────────────────
function ProcessColumn({ col, index }: { col: (typeof PROCESS_COLUMNS)[0]; index: number }) {
  const [openTab, setOpenTab] = useState<number | null>(null);
  const [openSubTab, setOpenSubTab] = useState<number>(0);
  const colRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = colRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={colRef}
      style={{
        opacity: 0,
        transform: "translateY(40px)",
        transition: `opacity 0.7s ease ${index * 0.12}s, transform 0.7s ease ${index * 0.12}s`,
      }}
      className="flex flex-col gap-3 min-w-[220px] flex-1"
    >
      {/* Column header */}
      <div className="relative p-5 rounded-xl border border-green-900/60 bg-black/40 backdrop-blur-md overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="text-4xl font-black text-green-400/30 font-mono leading-none">{col.num}</span>
        <h3 className="text-xl font-bold text-green-100 mt-1 tracking-wide">{col.title}</h3>
        <p className="text-green-400/70 text-sm mt-1">{col.short}</p>
      </div>

      {/* Tabs */}
      {col.tabs.map((tab, ti) => (
        <div key={ti} className="rounded-xl border border-green-900/50 overflow-hidden bg-black/30 backdrop-blur-sm">
          <button
            onClick={() => {
              setOpenTab(openTab === ti ? null : ti);
              setOpenSubTab(0);
            }}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-green-900/20 transition-colors duration-200"
          >
            <span className="text-green-200 text-sm font-semibold">{tab.label}</span>
            <span
              className="text-green-400 text-lg font-mono transition-transform duration-300"
              style={{ transform: openTab === ti ? "rotate(45deg)" : "rotate(0deg)" }}
            >
              +
            </span>
          </button>

          {/* Tab content with animation */}
          <div
            style={{
              maxHeight: openTab === ti ? "400px" : "0px",
              opacity: openTab === ti ? 1 : 0,
              transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
              overflow: "hidden",
            }}
          >
            <div className="px-4 pb-4 pt-1">
              <p className="text-green-300/80 text-xs leading-relaxed mb-3">{tab.content}</p>

              {/* Sub-tabs */}
              <div className="flex gap-1 mb-2">
                {tab.subTabs.map((st, si) => (
                  <button
                    key={si}
                    onClick={() => setOpenSubTab(si)}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                    style={{
                      background: openSubTab === si ? "rgba(74,222,128,0.2)" : "transparent",
                      border: `1px solid ${openSubTab === si ? "rgba(74,222,128,0.5)" : "rgba(74,222,128,0.15)"}`,
                      color: openSubTab === si ? "#86efac" : "#4ade8080",
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Sub-tab content */}
              {tab.subTabs.map((st, si) => (
                <div
                  key={si}
                  style={{
                    maxHeight: openSubTab === si ? "100px" : "0px",
                    opacity: openSubTab === si ? 1 : 0,
                    transition: "max-height 0.3s ease, opacity 0.25s ease",
                    overflow: "hidden",
                  }}
                >
                  <p className="text-green-400/60 text-xs leading-relaxed pt-1 border-t border-green-900/30">
                    {st.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Page() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Parallax + nav scroll effect
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        if (heroRef.current) {
          heroRef.current.style.transform = `translateY(${sy * 0.4}px)`;
          heroRef.current.style.opacity = `${1 - sy / 600}`;
        }
        if (navRef.current) {
          navRef.current.style.background =
            sy > 80
              ? "rgba(6,14,10,0.85)"
              : "transparent";
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection fade-in for sections
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal-section");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.07 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,300;1,700&family=JetBrains+Mono:wght@300;400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #060e0a; color: #d1fae5; overflow-x: hidden; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060e0a; }
        ::-webkit-scrollbar-thumb { background: #1a4a22; border-radius: 2px; }

        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-mono-custom { font-family: 'JetBrains Mono', monospace; }

        .glitch-text {
          position: relative;
          display: inline-block;
        }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: transparent;
        }
        .glitch-text::before {
          color: #00ff88;
          clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
          transform: translateX(-2px);
          animation: glitch1 4s infinite;
        }
        .glitch-text::after {
          color: #ff4488;
          clip-path: polygon(0 65%, 100% 65%, 100% 80%, 0 80%);
          transform: translateX(2px);
          animation: glitch2 4s infinite;
        }
        @keyframes glitch1 {
          0%, 90%, 100% { transform: translateX(0); opacity: 0; }
          92% { transform: translateX(-3px); opacity: 0.8; }
          94% { transform: translateX(3px); opacity: 0.6; }
          96% { transform: translateX(0); opacity: 0; }
        }
        @keyframes glitch2 {
          0%, 91%, 100% { transform: translateX(0); opacity: 0; }
          93% { transform: translateX(3px); opacity: 0.8; }
          95% { transform: translateX(-3px); opacity: 0.5; }
          97% { transform: translateX(0); opacity: 0; }
        }

        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0,255,100,0.1);
          border-color: rgba(74,222,128,0.4);
        }

        .reveal-section {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .text-stroke {
          -webkit-text-stroke: 1px rgba(74,222,128,0.4);
          color: transparent;
        }

        .tool-card:hover .tool-logo {
          transform: scale(1.1) rotate(-5deg);
          transition: transform 0.3s ease;
        }

        .ripple-btn {
          position: relative;
          overflow: hidden;
        }
        .ripple-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(74,222,128,0.3) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .ripple-btn:hover::after { opacity: 1; }

        .works-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }

        .input-field {
          width: 100%;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(74,222,128,0.2);
          border-radius: 0.75rem;
          padding: 0.875rem 1.25rem;
          color: #d1fae5;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          backdrop-filter: blur(8px);
        }
        .input-field::placeholder { color: rgba(74,222,128,0.3); }
        .input-field:focus {
          border-color: rgba(74,222,128,0.5);
          box-shadow: 0 0 0 3px rgba(74,222,128,0.07);
        }

        @keyframes floatUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-animate { animation: floatUp 1s ease forwards; }
        .hero-animate-2 { animation: floatUp 1s 0.3s ease forwards; opacity: 0; }
        .hero-animate-3 { animation: floatUp 1s 0.6s ease forwards; opacity: 0; }
        .hero-animate-4 { animation: floatUp 1s 0.9s ease forwards; opacity: 0; }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(74,222,128,0.2); }
          50% { box-shadow: 0 0 40px rgba(74,222,128,0.5); }
        }
        .pulse-glow { animation: pulse-glow 3s ease infinite; }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee 20s linear infinite; display: flex; width: max-content; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      {/* Background Canvas */}
      <SwampCanvas />

      {/* Page wrapper */}
      <div className="relative z-10">

        {/* ── NAV ── */}
        <nav
          ref={navRef}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-500"
          style={{ backdropFilter: "blur(0px)", transition: "background 0.4s, backdrop-filter 0.4s" }}
        >
          <span className="font-mono-custom text-green-400 text-lg font-bold tracking-widest">
            ◈ VIDE∅
          </span>
          <div className="hidden md:flex gap-8 font-mono-custom text-xs text-green-400/60 tracking-widest">
            {["WORKS", "SERVICES", "PROCESS", "TOOLS", "CONTACT"].map((n) => (
              <a
                key={n}
                href={`#${n.toLowerCase()}`}
                className="hover:text-green-300 transition-colors duration-200 uppercase"
              >
                {n}
              </a>
            ))}
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          <div ref={heroRef}>
            <p className="hero-animate font-mono-custom text-green-400/60 text-xs tracking-[0.4em] uppercase mb-6">
              ◈ Video Production Studio
            </p>
            <h1 className="hero-animate-2 font-display text-[clamp(4rem,14vw,11rem)] leading-[0.9] font-bold text-green-50 mb-4">
              <span className="glitch-text" data-text="VIDEO">VIDEO</span>
              <br />
              <span className="text-stroke text-[clamp(4rem,14vw,11rem)] font-bold">EDIT</span>
            </h1>
            <p className="hero-animate-3 font-display italic text-green-300/70 text-xl md:text-2xl mt-6 max-w-xl mx-auto">
              Stories crafted frame by frame — where swamp meets cinema
            </p>
            <div className="hero-animate-4 flex gap-4 justify-center mt-10">
              <a
                href="#works"
                className="ripple-btn pulse-glow px-8 py-3 rounded-full border border-green-400/50 font-mono-custom text-sm text-green-300 hover:bg-green-400/10 transition-all duration-300"
              >
                VIEW WORKS
              </a>
              <a
                href="#contact"
                className="px-8 py-3 rounded-full bg-green-400/15 border border-green-400/30 font-mono-custom text-sm text-green-200 hover:bg-green-400/25 transition-all duration-300"
              >
                GET IN TOUCH
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <span className="font-mono-custom text-green-400/50 text-xs tracking-widest">SCROLL</span>
            <div className="w-px h-12 bg-gradient-to-b from-green-400/50 to-transparent" />
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div className="py-4 border-y border-green-900/40 overflow-hidden bg-black/20 backdrop-blur-sm">
          <div className="marquee-track">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="flex items-center gap-8 pr-8">
                {["COLOR GRADING", "◈", "MOTION GRAPHICS", "◈", "SOUND DESIGN", "◈", "SOCIAL CONTENT", "◈", "DOCUMENTARIES", "◈", "BRAND FILMS", "◈"].map(
                  (t, j) => (
                    <span key={j} className="font-mono-custom text-xs text-green-400/40 tracking-widest whitespace-nowrap">
                      {t}
                    </span>
                  )
                )}
              </span>
            ))}
          </div>
        </div>

        {/* ── SELECTED WORKS ── */}
        <section id="works" className="py-32 px-6 max-w-7xl mx-auto reveal-section">
          <div className="flex items-baseline gap-6 mb-16">
            <h2 className="font-display text-5xl md:text-7xl font-bold text-green-50">
              Selected
              <br />
              <em className="text-stroke">Works</em>
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-green-400/30 to-transparent self-center ml-4" />
            <span className="font-mono-custom text-xs text-green-400/40 tracking-widest">[ 06 ]</span>
          </div>

          <div className="works-grid">
            {WORKS.map((w, i) => (
              <div
                key={w.id}
                className="card-hover group relative rounded-2xl border border-green-900/50 bg-black/30 backdrop-blur-md overflow-hidden cursor-pointer"
                style={{
                  transitionDelay: `${i * 0.06}s`,
                  background: "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(10,30,15,0.3) 100%)",
                }}
              >
                {/* Thumbnail placeholder */}
                <div
                  className="h-48 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, hsl(${140 + i * 20},40%,${8 + i * 2}%) 0%, hsl(${160 + i * 15},35%,${12 + i * 2}%) 100%)`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border-2 border-green-400/30 flex items-center justify-center group-hover:border-green-400/70 group-hover:scale-110 transition-all duration-300">
                      <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[14px] border-transparent border-l-green-400/60 ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="font-mono-custom text-xs px-2 py-1 rounded-full bg-black/50 text-green-400/70 border border-green-900/50">
                      {w.cat}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="font-mono-custom text-xs text-green-400/50">{w.dur}</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-xl text-green-100 font-semibold mb-2">{w.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-custom text-xs text-green-400/40">{w.views} views</span>
                    <span className="font-mono-custom text-xs text-green-400/30">→ WATCH</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section id="services" className="py-32 px-6 max-w-7xl mx-auto reveal-section">
          <div className="flex items-baseline gap-6 mb-16">
            <h2 className="font-display text-5xl md:text-7xl font-bold text-green-50">
              Services
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-green-400/30 to-transparent self-center ml-4" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "◎", title: "Narrative Editing", desc: "Story-first cuts for films, docs, and branded content." },
              { icon: "◈", title: "Color Grading", desc: "Cinematic grade with custom LUT design." },
              { icon: "◉", title: "Motion Graphics", desc: "Kinetic titles, lower-thirds, and animated sequences." },
              { icon: "⊛", title: "Social Reels", desc: "Vertical-first content optimized for engagement." },
              { icon: "◷", title: "Sound Design", desc: "Full audio post: SFX, music, mix, and master." },
              { icon: "⊕", title: "VFX Compositing", desc: "Green screen, tracking, and visual effects." },
            ].map((s, i) => (
              <div
                key={i}
                className="card-hover p-7 rounded-2xl border border-green-900/40 bg-black/25 backdrop-blur-sm relative overflow-hidden group"
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <div className="absolute -top-6 -right-6 text-8xl text-green-900/20 font-mono select-none group-hover:text-green-900/40 transition-colors duration-500">
                  {s.icon}
                </div>
                <span className="text-3xl text-green-400/60 mb-4 block">{s.icon}</span>
                <h3 className="font-display text-2xl text-green-100 font-semibold mb-2">{s.title}</h3>
                <p className="text-green-400/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── THE PROCESS ── */}
        <section id="process" className="py-32 px-6 max-w-7xl mx-auto reveal-section">
          <div className="flex items-baseline gap-6 mb-16">
            <h2 className="font-display text-5xl md:text-7xl font-bold text-green-50">
              The
              <br />
              <em className="text-stroke">Process</em>
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-green-400/30 to-transparent self-center ml-4" />
          </div>

          <div className="flex gap-4 overflow-x-auto pb-6" style={{ scrollbarWidth: "none" }}>
            {PROCESS_COLUMNS.map((col, i) => (
              <ProcessColumn key={i} col={col} index={i} />
            ))}
          </div>
        </section>

        {/* ── TOOLS ── */}
        <section id="tools" className="py-32 px-6 max-w-7xl mx-auto reveal-section">
          <div className="flex items-baseline gap-6 mb-16">
            <h2 className="font-display text-5xl md:text-7xl font-bold text-green-50">Tools</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-green-400/30 to-transparent self-center ml-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TOOLS.map((tool, i) => (
              <a
                key={i}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tool-card card-hover group p-8 rounded-2xl border border-green-900/40 bg-black/30 backdrop-blur-md flex flex-col gap-5 relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${tool.color}10 0%, transparent 70%)` }}
                />
                <div
                  className="tool-logo w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black font-mono-custom"
                  style={{
                    background: `linear-gradient(135deg, ${tool.color}20 0%, ${tool.color}08 100%)`,
                    border: `1px solid ${tool.color}30`,
                    color: tool.color,
                  }}
                >
                  {tool.logo}
                </div>
                <div>
                  <h3 className="font-display text-2xl text-green-50 font-bold mb-1">{tool.name}</h3>
                  <p className="text-green-400/60 text-sm">{tool.desc}</p>
                </div>
                <span className="font-mono-custom text-xs text-green-400/30 group-hover:text-green-400/60 transition-colors">
                  {tool.url.replace("https://", "")} →
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── WORKS / PROJECTS ── */}
        <section className="py-32 px-6 max-w-7xl mx-auto reveal-section">
          <div className="flex items-baseline gap-6 mb-16">
            <h2 className="font-display text-5xl md:text-7xl font-bold text-green-50">
              Featured
              <br />
              <em className="text-stroke">Projects</em>
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-green-400/30 to-transparent self-center ml-4" />
          </div>

          {/* Featured large project */}
          <div className="card-hover rounded-3xl border border-green-900/40 bg-black/30 backdrop-blur-md overflow-hidden mb-8 group cursor-pointer">
            <div
              className="h-64 md:h-96 relative"
              style={{ background: "linear-gradient(135deg, #0a2010 0%, #061408 50%, #0f2a18 100%)" }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full border-2 border-green-400/40 flex items-center justify-center group-hover:border-green-400 group-hover:scale-110 transition-all duration-500 pulse-glow">
                  <div className="w-0 h-0 border-t-[10px] border-b-[10px] border-l-[18px] border-transparent border-l-green-400/80 ml-1.5" />
                </div>
                <span className="font-mono-custom text-green-400/40 text-xs tracking-widest">FEATURED PROJECT</span>
              </div>
              <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                <div>
                  <h3 className="font-display text-3xl md:text-5xl text-green-50 font-bold">Midnight Bayou</h3>
                  <p className="font-mono-custom text-green-400/50 text-sm mt-1">Documentary · 2024 · 24 min</p>
                </div>
                <span className="hidden md:block font-mono-custom text-xs text-green-400/30">3.4M views</span>
              </div>
            </div>
          </div>

          {/* Grid of smaller projects */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {WORKS.slice(0, 4).map((w, i) => (
              <div
                key={i}
                className="card-hover rounded-2xl border border-green-900/40 overflow-hidden cursor-pointer group"
                style={{ background: `linear-gradient(135deg, hsl(${135+i*18},35%,${7+i}%) 0%, #060e0a 100%)` }}
              >
                <div className="h-32 flex items-center justify-center opacity-40 group-hover:opacity-80 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full border border-green-400/60 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[9px] border-transparent border-l-green-400/80 ml-0.5" />
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <p className="font-display text-sm text-green-100 font-semibold truncate">{w.title}</p>
                  <p className="font-mono-custom text-xs text-green-400/40 mt-1">{w.cat}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="py-32 px-6 max-w-3xl mx-auto reveal-section">
          <div className="text-center mb-16">
            <p className="font-mono-custom text-xs text-green-400/40 tracking-[0.4em] uppercase mb-4">◈ Let's Create</p>
            <h2 className="font-display text-5xl md:text-7xl font-bold text-green-50">
              Get In
              <br />
              <em className="text-stroke">Touch</em>
            </h2>
          </div>

          {submitted ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-6">◈</div>
              <h3 className="font-display text-3xl text-green-200 mb-3">Message received.</h3>
              <p className="font-mono-custom text-green-400/50 text-sm">I&apos;ll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="font-mono-custom text-xs text-green-400/50 tracking-widest block mb-2">NAME</label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Your name"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="font-mono-custom text-xs text-green-400/50 tracking-widest block mb-2">EMAIL ADDRESS</label>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="font-mono-custom text-xs text-green-400/50 tracking-widest block mb-2">MESSAGE DETAILS</label>
                <textarea
                  className="input-field resize-none"
                  rows={6}
                  placeholder="Tell me about your project — format, duration, platform, deadline..."
                  required
                  value={formState.message}
                  onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                />
              </div>
              <button
                type="submit"
                className="ripple-btn pulse-glow mt-2 w-full py-4 rounded-full border border-green-400/40 bg-green-400/10 font-mono-custom text-sm text-green-300 tracking-widest hover:bg-green-400/20 hover:border-green-400/70 transition-all duration-300"
              >
                SEND MESSAGE ◈
              </button>
            </form>
          )}
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-green-900/40 py-10 px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono-custom text-green-400/30 text-xs tracking-widest">
            PROMINENCE  — {new Date().getFullYear()}
          </span>
          <span className="font-display italic text-green-400/20 text-sm">
            Every frame, a story.
          </span>
          <span className="font-mono-custom text-green-400/20 text-xs">
            Built with Next.js + Canvas
          </span>
        </footer>

      </div>
    </>
  );
}