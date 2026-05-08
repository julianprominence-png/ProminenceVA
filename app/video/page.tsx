"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
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
  depth: number;
  delay: number;
}

interface WorkItem {
  title: string;
  cat: string;
  dur: string;
  num: string;
  gradient: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const LILY_PADS: LilyPad[] = [
  { id: 0, x: 6,  y: 18, size: 75, rotation: 22,  depth: 0.3, delay: 0   }, // top-left corner
  { id: 1, x: 88, y: 12, size: 62, rotation: -18, depth: 0.5, delay: 0.5 }, // top-right corner
  { id: 2, x: 92, y: 72, size: 82, rotation: 14,  depth: 0.6, delay: 0.2 }, // bottom-right
  { id: 3, x: 4,  y: 80, size: 58, rotation: -35, depth: 0.4, delay: 0.8 }, // bottom-left
  { id: 4, x: 50, y: 88, size: 52, rotation: 50,  depth: 0.7, delay: 0.4 }, // bottom-center
];

const WORKS: WorkItem[] = [
  { title: "Neon Drift",        cat: "Music Video",     dur: "3:42",  num: "001", gradient: "linear-gradient(135deg,#1a0a2e,#2d1b69,#0f0a1a)" },
  { title: "Urban Stories",     cat: "Documentary",     dur: "12:10", num: "002", gradient: "linear-gradient(135deg,#0a0a0a,#1a1a2e,#16213e)" },
  { title: "Product Launch",    cat: "Commercial",      dur: "0:30",  num: "003", gradient: "linear-gradient(135deg,#0d0d1a,#1a0a2e,#2d1357)" },
  { title: "Wedding Highlight", cat: "Event Film",      dur: "5:20",  num: "004", gradient: "linear-gradient(135deg,#1a0f0f,#2d1a2e,#1a0a0a)" },
  { title: "Street Pulse",      cat: "Short Film",      dur: "8:45",  num: "005", gradient: "linear-gradient(135deg,#080d1a,#0d1b2e,#1a1a3e)" },
  { title: "Brand Identity",    cat: "Motion Graphics", dur: "1:15",  num: "006", gradient: "linear-gradient(135deg,#0a1a0a,#1a2d1a,#0f1a0f)" },
  { title: "Live Concert",      cat: "Event Coverage",  dur: "4:55",  num: "007", gradient: "linear-gradient(135deg,#1a0a1a,#2e0d2e,#1a0a2e)" },
  { title: "Aerial Landscapes", cat: "Showreel",        dur: "2:30",  num: "008", gradient: "linear-gradient(135deg,#0a0d1a,#0d1a2e,#0a1635)" },
];

const SERVICES = [
  { num: "01", name: "Cinematic Editing",  price: "₱8,500",  unit: "project", desc: "Full post-production cutting for short films, documentaries, and narrative features. Pacing, rhythm, story — handled with intent.", icon: "M15 10l4.553-2.069A1 1 0 0121 8.876V15.124a1 1 0 01-1.447.895L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" },
  { num: "02", name: "Highlight Reels",    price: "₱4,500",  unit: "reel",    desc: "Weddings, events, corporate highlights. Tight, emotional edits that capture the energy of the moment in minutes.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { num: "03", name: "Music Videos",       price: "₱6,000",  unit: "video",   desc: "Visual interpretation of sound. From performance cuts to concept-driven narratives synced perfectly to the beat.", icon: "M9 19V6l12-3v13M6 21a3 3 0 100-6 3 3 0 000 6zm12-3a3 3 0 100-6 3 3 0 000 6z" },
  { num: "04", name: "Social Content",     price: "₱2,200",  unit: "cut",     desc: "Reels, TikToks, and short-form cuts optimised for each platform. Fast turnaround without sacrificing quality.", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { num: "05", name: "Colour Grading",     price: "₱3,800",  unit: "project", desc: "Look development and DaVinci Resolve grading. From log correction to cinematic LUT creation and final delivery.", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  { num: "06", name: "Motion Graphics",    price: "₱5,500",  unit: "project", desc: "Titles, lower thirds, animated logos, and transitions. Clean motion design integrated directly into your edit.", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
];

const PROCESS_STEPS = [
  { n: "01", title: "Brief & Discovery",    desc: "We align on your vision, references, deadlines, and deliverables before a single frame is touched." },
  { n: "02", title: "Rough Assembly",       desc: "A full rough cut shaped for story and pacing. You see the bones before the polish begins." },
  { n: "03", title: "Refinement Rounds",    desc: "Up to three revision passes. Feedback is taken seriously — this is a collaborative craft." },
  { n: "04", title: "Colour & Sound",       desc: "Final grade, audio mix, and finishing. Every detail dialled in before delivery." },
  { n: "05", title: "Delivery",             desc: "Exported in your required specs — broadcast, web, or archival. Files delivered clean and on time." },
];

const TOOLS = [
  { logo: "CC", name: "CapCut",          color: "#00d2ff", borderColor: "rgba(0,210,255,0.2)",       url: "https://www.capcut.com",                                              desc: "Fast, fluid editing for social-first content. Mobile and desktop. Perfect for quick-turn Reels and TikTok." },
  { logo: "Pr", name: "Adobe Premiere",  color: "#9999ff", borderColor: "rgba(153,153,255,0.2)",     url: "https://www.adobe.com/products/premiere.html",                        desc: "Industry-standard NLE for cinematic storytelling. Deep integration with the Adobe ecosystem." },
  { logo: "DR", name: "DaVinci Resolve", color: "#ff6b6b", borderColor: "rgba(255,107,107,0.2)",     url: "https://www.blackmagicdesign.com/products/davinciresolve",             desc: "Professional colour grading and post-production suite. Where the grade lives and breathes." },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VideoEditPage() {
  const [scrollY, setScrollY]     = useState(0);
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });
  const [ripples, setRipples]     = useState<Ripple[]>([]);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos]     = useState({ x: 0, y: 0 });
  const [cursorBig, setCursorBig] = useState(false);

  const rippleId   = useRef(0);
  const autoTimer  = useRef<ReturnType<typeof setInterval> | null>(null);
  const ringRef    = useRef({ x: 0, y: 0 });
  const targetRef  = useRef({ x: 0, y: 0 });
  const rafRef     = useRef<number | null>(null);

  // ── Scroll
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setScrollY(window.scrollY); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Mouse
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setCursorPos({ x: e.clientX, y: e.clientY });
      setMousePos({
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── Ring animation
  useEffect(() => {
    const animate = () => {
      ringRef.current.x += (targetRef.current.x - ringRef.current.x) * 0.12;
      ringRef.current.y += (targetRef.current.y - ringRef.current.y) * 0.12;
      setRingPos({ x: ringRef.current.x, y: ringRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // ── Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ── Carousel auto
  const goTo = useCallback((idx: number) => {
    setCarouselIdx(((idx % WORKS.length) + WORKS.length) % WORKS.length);
  }, []);

  const resetAuto = useCallback((idx: number) => {
    if (autoTimer.current) clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => setCarouselIdx(p => ((p + 1) % WORKS.length)), 3500);
    goTo(idx);
  }, [goTo]);

  useEffect(() => {
    autoTimer.current = setInterval(() => setCarouselIdx(p => ((p + 1) % WORKS.length)), 3500);
    return () => { if (autoTimer.current) clearInterval(autoTimer.current); };
  }, []);

  // ── Ripple
  const addRipple = (x: number, y: number) => {
    const id = rippleId.current++;
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 2200);
  };

  // ── Lily pad parallax transform — subtle, edge-only drift
  const padTransform = (pad: LilyPad) => {
    const mouseX = mousePos.x * pad.depth * 9;
    const mouseY = mousePos.y * pad.depth * 6;
    const scrollShift = scrollY * pad.depth * 0.06;
    return `translate(${mouseX}px, ${mouseY - scrollShift}px)`;
  };

  // ── Submit
  const handleSubmit = () => {
    if (formState.name && formState.email && formState.message) setSubmitted(true);
  };

  // ── All Works duplicated for looping
  const allWorks = [...WORKS, ...WORKS];

  return (
    <>
      {/* ─── Global Styles ───────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Syne:wght@400;600;700;800&display=swap');

        :root {
          --bg: #080808;
          --bg2: #0d0d0d;
          --surface: #111111;
          --surface2: #171717;
          --border: rgba(255,255,255,0.07);
          --purple: #9b5de5;
          --purple-light: #c084fc;
          --purple-dark: #6d28d9;
          --purple-glow: rgba(155,93,229,0.22);
          --text: #f0f0f0;
          --text-muted: #5a5a5a;
          --text-dim: #2a2a2a;
          --lily-green: #2d6a4f;
          --lily-light: #52b788;
          --flower-pink: #f4a5b8;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        body {
          font-family: 'Syne', sans-serif;
          background: var(--bg);
          color: var(--text);
          overflow-x: hidden;
          cursor: none;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--purple-dark); border-radius: 2px; }

        /* Grain */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 9990;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          animation: grain 0.5s steps(1) infinite;
        }
        @keyframes grain {
          0%,100%{background-position:0 0}
          20%{background-position:-30px -15px}
          40%{background-position:25px -25px}
          60%{background-position:-20px 20px}
          80%{background-position:30px 10px}
        }

        /* Reveal animations */
        .reveal, .reveal-left, .reveal-right {
          opacity: 0;
          transition: opacity 0.95s cubic-bezier(0.16,1,0.3,1), transform 0.95s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal         { transform: translateY(55px); }
        .reveal-left    { transform: translateX(-55px); }
        .reveal-right   { transform: translateX(55px); }
        .reveal.visible, .reveal-left.visible, .reveal-right.visible {
          opacity: 1; transform: translate(0);
        }

        /* Water + lily animations */
        @keyframes shimmer {
          0%,100%{opacity:0.25} 50%{opacity:0.65}
        }
        @keyframes float {
          0%,100%{transform:translateY(0px) rotate(0deg)}
          33%{transform:translateY(-7px) rotate(0.8deg)}
          66%{transform:translateY(-3px) rotate(-0.5deg)}
        }
        @keyframes rippleOut  { 0%{r:1;stroke-opacity:.9} 100%{r:55;stroke-opacity:0} }
        @keyframes rippleOut2 { 0%{r:1;stroke-opacity:.6} 100%{r:80;stroke-opacity:0} }
        @keyframes rippleOut3 { 0%{r:1;stroke-opacity:.3} 100%{r:110;stroke-opacity:0} }

        /* Scroll indicator */
        @keyframes scrollLine {
          0%{transform:scaleY(0);transform-origin:top}
          50%{transform:scaleY(1);transform-origin:top}
          51%{transform:scaleY(1);transform-origin:bottom}
          100%{transform:scaleY(0);transform-origin:bottom}
        }

        /* Pulse dot */
        @keyframes pulseDot {
          0%,100%{box-shadow:0 0 0 0 var(--purple-glow)}
          50%{box-shadow:0 0 0 8px transparent}
        }

        /* Film strip hole */
        @keyframes rotatePulse {
          from{transform:rotate(0deg)} to{transform:rotate(360deg)}
        }

        /* Section base */
        section { position: relative; overflow: hidden; }

        /* Label */
        .section-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--purple);
          margin-bottom: 0.8rem;
        }
        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem, 7vw, 5.5rem);
          line-height: 0.9;
          color: var(--text);
          letter-spacing: 0.01em;
        }
        .accent-dash {
          width: 44px; height: 2px;
          background: var(--purple);
          margin: 1.4rem 0;
        }

        /* Buttons */
        .btn-primary {
          display: inline-block;
          padding: 0.88rem 2.4rem;
          background: var(--purple);
          color: #fff;
          border: none;
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          clip-path: polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
          transition: background 0.3s, transform 0.2s;
        }
        .btn-primary:hover { background: var(--purple-light); transform: translateY(-2px); }

        .btn-ghost {
          display: inline-block;
          padding: 0.88rem 2.4rem;
          background: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border);
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.3s, color 0.3s, transform 0.2s;
        }
        .btn-ghost:hover { border-color: var(--purple); color: var(--purple); transform: translateY(-2px); }

        /* ── Film strip ── */
        .film-card {
          flex: 0 0 340px;
          position: relative;
          background: var(--surface);
          border-left: 1px solid #191919;
          border-right: 1px solid #191919;
          cursor: pointer;
          transition: transform 0.4s ease;
          user-select: none;
        }
        .film-card:hover { transform: scale(1.025); z-index: 5; }
        .film-card:hover .film-frame-bg { transform: scale(1.06); filter: brightness(0.42) saturate(0.9); }
        .film-card:hover .play-circle { transform: translate(-50%,-50%) scale(1.12); background: var(--purple); }

        .film-holes {
          height: 26px;
          background: #080808;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 14px;
          border-top: 1px solid #1a1a1a;
          border-bottom: 1px solid #1a1a1a;
        }
        .hole {
          width: 13px; height: 9px;
          background: #030303;
          border-radius: 2px;
          border: 1px solid #161616;
          flex-shrink: 0;
        }

        .film-frame {
          height: 220px;
          position: relative;
          overflow: hidden;
        }
        .film-frame-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.6s ease, filter 0.4s;
          filter: brightness(0.5) saturate(0.8);
        }
        .film-frame::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%);
        }

        .play-circle {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 52px; height: 52px;
          background: rgba(155,93,229,0.18);
          border: 1.5px solid var(--purple);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          z-index: 5;
          transition: transform 0.3s, background 0.3s;
          backdrop-filter: blur(4px);
        }

        .film-meta {
          position: absolute;
          bottom: 12px; left: 14px; right: 14px;
          z-index: 5;
        }

        /* ── Services grid ── */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          margin-top: 4rem;
        }
        @media (max-width: 900px) { .services-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 580px) { .services-grid { grid-template-columns: 1fr; } }

        .service-item {
          background: var(--bg);
          padding: 2.8rem 2.2rem;
          position: relative;
          overflow: hidden;
          transition: background 0.35s;
          cursor: default;
        }
        .service-item::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: var(--purple);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .service-item:hover { background: var(--surface); }
        .service-item:hover::after { transform: scaleX(1); }

        /* ── Tool cards ── */
        .tool-card {
          border: 1px solid var(--border);
          background: var(--surface);
          padding: 2.5rem 2rem;
          position: relative;
          overflow: hidden;
          transition: border-color 0.4s, transform 0.35s;
          text-decoration: none;
          display: block;
          cursor: pointer;
        }
        .tool-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: var(--purple);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .tool-card:hover { border-color: rgba(155,93,229,0.35); transform: translateY(-5px); }
        .tool-card:hover::before { transform: scaleX(1); }

        /* ── Process step ── */
        .process-step {
          padding: 2rem 0;
          border-bottom: 1px solid var(--border);
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          cursor: default;
          transition: padding-left 0.3s ease;
        }
        .process-step:first-child { border-top: 1px solid var(--border); }
        .process-step:hover { padding-left: 0.7rem; }
        .process-step:hover .step-num { color: var(--purple); }
        .step-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.4rem;
          color: var(--text-dim);
          line-height: 1;
          min-width: 44px;
          transition: color 0.3s;
        }

        /* ── Contact form ── */
        .form-field {
          border-bottom: 1px solid var(--border);
          transition: border-color 0.3s;
        }
        .form-field:focus-within { border-color: var(--purple); }
        .form-input {
          width: 100%;
          padding: 0.9rem 0;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          color: var(--text);
        }
        .form-input::placeholder { color: var(--text-muted); }

        /* Reel fade edges */
        .reel-fade-left {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 120px;
          background: linear-gradient(to right, var(--bg), transparent);
          z-index: 10;
          pointer-events: none;
        }
        .reel-fade-right {
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 120px;
          background: linear-gradient(to left, var(--bg), transparent);
          z-index: 10;
          pointer-events: none;
        }

        /* Lily cursor */
        .lily-group { cursor: pointer; }

        @media (max-width: 640px) {
          .hero-stats { gap: 1.5rem; }
          .process-layout { grid-template-columns: 1fr !important; }
          .tools-grid { grid-template-columns: 1fr !important; }
          .contact-layout { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>

      {/* ─── Custom Cursor ───────────────────────────────────────────────── */}
      <div style={{
        position: "fixed",
        left: cursorPos.x, top: cursorPos.y,
        width: cursorBig ? 16 : 10,
        height: cursorBig ? 16 : 10,
        background: "var(--purple)",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-50%,-50%)",
        transition: "width 0.3s, height 0.3s",
        mixBlendMode: "screen",
      }} />
      <div style={{
        position: "fixed",
        left: ringPos.x, top: ringPos.y,
        width: cursorBig ? 52 : 36,
        height: cursorBig ? 52 : 36,
        border: `1px solid rgba(155,93,229,${cursorBig ? "0.8" : "0.45"})`,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9998,
        transform: "translate(-50%,-50%)",
        transition: "width 0.3s, height 0.3s, border-color 0.3s",
      }} />

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section id="hero" style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "0 clamp(2rem,7vw,7rem)",
        position: "relative",
        background: "var(--bg)",
        overflow: "hidden",
      }}>

        {/* ── Water canvas (hero only) ── */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="waterGrad" cx="50%" cy="40%" r="70%">
              <stop offset="0%"   stopColor="#0a0316" />
              <stop offset="55%"  stopColor="#050110" />
              <stop offset="100%" stopColor="#030108" />
            </radialGradient>
            <pattern id="caustic" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <ellipse cx="10" cy="10" rx="8" ry="3" fill="none" stroke="rgba(155,93,229,0.025)" strokeWidth="0.35" />
              <ellipse cx="5"  cy="5"  rx="3" ry="1.5" fill="none" stroke="rgba(155,93,229,0.015)" strokeWidth="0.25" />
            </pattern>
            <filter id="blur4"><feGaussianBlur stdDeviation="3" /></filter>
            <filter id="reflBlur"><feGaussianBlur stdDeviation="0.9" /></filter>
            <radialGradient id="lilyGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%"  stopColor="#52b788" />
              <stop offset="60%" stopColor="#2d6a4f" />
              <stop offset="100%" stopColor="#1b4332" />
            </radialGradient>
            <radialGradient id="lilyGradDeep" cx="40%" cy="35%" r="65%">
              <stop offset="0%"  stopColor="#40916c" />
              <stop offset="60%" stopColor="#1b4332" />
              <stop offset="100%" stopColor="#081c11" />
            </radialGradient>
            <radialGradient id="flowerGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="#ffd6e0" />
              <stop offset="100%" stopColor="#f4a5b8" />
            </radialGradient>
          </defs>

          {/* Deep water */}
          <rect width="100" height="100" fill="url(#waterGrad)" />
          <rect width="100" height="100" fill="url(#caustic)" style={{ animation: "shimmer 5s ease-in-out infinite", opacity: 0.6 }} />
          <rect width="100" height="100" fill="url(#caustic)" style={{ animation: "shimmer 9s ease-in-out infinite", transform: "rotate(45deg) scale(1.5)", transformOrigin: "50% 50%", opacity: 0.4 }} />

          {/* Very faint horizontal shimmer lines — only 8 */}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i}
              x1="0" y1={10 + i * 10}
              x2="100" y2={10 + i * 10}
              stroke="rgba(155,93,229,0.04)"
              strokeWidth="0.25"
              style={{ animation: `shimmer ${4 + (i % 3)}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
            />
          ))}

          {/* Soft glow blobs — very low opacity */}
          <ellipse cx="15"  cy="20" rx="22" ry="14" fill="rgba(80,20,160,0.08)"  filter="url(#blur4)" />
          <ellipse cx="85"  cy="75" rx="18" ry="11" fill="rgba(80,20,160,0.06)"  filter="url(#blur4)" />
          <ellipse cx="50"  cy="50" rx="15" ry="9"  fill="rgba(155,93,229,0.04)" filter="url(#blur4)" />

          {/* Ripples */}
          {ripples.map(r => (
            <g key={r.id}>
              <circle cx={r.x} cy={r.y} r="1" fill="none" stroke="rgba(155,93,229,0.9)" strokeWidth="0.5" style={{ animation: "rippleOut 2.2s ease-out forwards" }} />
              <circle cx={r.x} cy={r.y} r="1" fill="none" stroke="rgba(155,93,229,0.55)" strokeWidth="0.4" style={{ animation: "rippleOut2 2.2s ease-out forwards", animationDelay: "0.18s" }} />
              <circle cx={r.x} cy={r.y} r="1" fill="none" stroke="rgba(155,93,229,0.25)" strokeWidth="0.3" style={{ animation: "rippleOut3 2.2s ease-out forwards", animationDelay: "0.35s" }} />
            </g>
          ))}
        </svg>

        {/* ── Lily Pads SVG layer ── */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, overflow: "visible" }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {LILY_PADS.map((pad, i) => {
            const s = pad.size / 1000;
            const opacity = 0.35 + pad.depth * 0.55;
            const reflOpacity = (1 - pad.depth) * 0.28;
            const hasFlower = i % 3 === 0;
            return (
              <g
                key={pad.id}
                className="lily-group"
                style={{
                  transform: padTransform(pad),
                  animationDelay: `${pad.delay}s`,
                  animationDuration: `${5 + pad.depth * 4}s`,
                  animation: `float ${5 + pad.depth * 4}s ease-in-out ${pad.delay}s infinite`,
                  opacity,
                  willChange: "transform",
                }}
                onClick={() => addRipple(pad.x, pad.y)}
              >
                {/* Shadow */}
                <ellipse cx={pad.x} cy={pad.y + s * 120} rx={s * 460} ry={s * 140} fill="rgba(0,0,0,0.3)" filter="url(#reflBlur)" />

                {/* Pad */}
                <g transform={`translate(${pad.x},${pad.y}) rotate(${pad.rotation})`}>
                  <ellipse cx={-s * 80} cy={-s * 100} rx={s * 175} ry={s * 95} fill="rgba(255,255,255,0.08)" style={{ filter: "blur(1px)" }} />
                  <path
                    d={`M 0 0 L ${s*500*Math.cos(Math.PI*0.15)} ${-s*500*Math.sin(Math.PI*0.15)} A ${s*500} ${s*500} 0 1 1 ${s*500*Math.cos(Math.PI*0.85)} ${-s*500*Math.sin(Math.PI*0.85)} Z`}
                    fill={pad.depth > 0.5 ? "url(#lilyGrad)" : "url(#lilyGradDeep)"}
                    stroke="rgba(82,183,136,0.25)"
                    strokeWidth={s * 28}
                  />
                  {[0,40,80,120,160,200,240,280,320].map((angle, vi) => (
                    <line key={vi} x1="0" y1="0"
                      x2={s*480*Math.cos((angle*Math.PI)/180)}
                      y2={s*480*Math.sin((angle*Math.PI)/180)}
                      stroke="rgba(82,183,136,0.2)" strokeWidth={s*10} />
                  ))}
                  {hasFlower && (
                    <g transform={`translate(${-s*60},${-s*60})`}>
                      {[0,72,144,216,288].map((a, fi) => (
                        <ellipse key={fi}
                          cx={s*80*Math.cos((a*Math.PI)/180)} cy={s*80*Math.sin((a*Math.PI)/180)}
                          rx={s*88} ry={s*52} fill="url(#flowerGrad)" opacity="0.8"
                          transform={`rotate(${a},${s*80*Math.cos((a*Math.PI)/180)},${s*80*Math.sin((a*Math.PI)/180)})`}
                        />
                      ))}
                      <circle cx="0" cy="0" r={s*52} fill="#ffefd5" opacity="0.9" />
                      <circle cx="0" cy="0" r={s*26} fill="#ffd700" opacity="0.85" />
                    </g>
                  )}
                </g>

                {/* Reflection */}
                <g transform={`translate(${pad.x},${pad.y+s*200}) rotate(${-pad.rotation}) scale(1,-0.3)`} opacity={reflOpacity} filter="url(#reflBlur)">
                  <path d={`M 0 0 L ${s*500*Math.cos(Math.PI*0.15)} ${-s*500*Math.sin(Math.PI*0.15)} A ${s*500} ${s*500} 0 1 1 ${s*500*Math.cos(Math.PI*0.85)} ${-s*500*Math.sin(Math.PI*0.85)} Z`} fill="url(#lilyGrad)" />
                </g>
              </g>
            );
          })}
        </svg>

        {/* Scanline reflection overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "repeating-linear-gradient(180deg,transparent 0px,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)",
          mixBlendMode: "multiply",
        }} />

        {/* Purple glow */}
        <div style={{
          position: "absolute",
          width: 650, height: 650,
          borderRadius: "50%",
          background: "radial-gradient(ellipse,rgba(109,40,217,0.14) 0%,transparent 70%)",
          top: -120, right: -80,
          pointerEvents: "none",
          zIndex: 3,
          transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 20}px)`,
          transition: "transform 0.1s linear",
        }} />

        {/* Background watermark text */}
        <div style={{
          position: "absolute",
          right: "-4%",
          top: "50%",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(12rem,28vw,25rem)",
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1px rgba(155,93,229,0.06)",
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
          letterSpacing: "-0.02em",
          zIndex: 3,
          transform: `translateY(calc(-50% + ${scrollY * 0.2}px))`,
        }}>
          EDIT
        </div>

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 5, maxWidth: 760 }}>
          <div className="reveal" style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", background: "var(--purple)",
              animation: "pulseDot 2s ease-in-out infinite",
            }} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Available for projects — 2025
            </span>
          </div>

          <h1 className="reveal" style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(5.5rem,15vw,13rem)",
            lineHeight: 0.88,
            color: "var(--text)",
            letterSpacing: "0.01em",
            transitionDelay: "0.1s",
          }}>
            Video<br />
            <em style={{
              fontStyle: "italic",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              color: "var(--purple-light)",
              fontSize: "0.82em",
              display: "block",
            }}>Edit</em>
          </h1>

          <p className="reveal" style={{
            maxWidth: 440, color: "var(--text-muted)", lineHeight: 1.85,
            fontSize: "0.95rem", fontWeight: 400, marginTop: "2rem",
            transitionDelay: "0.2s",
          }}>
            Cinematic storytelling through precision cutting, colour, and motion. Every frame is intentional. Every cut earns its place.
          </p>

          <div className="reveal" style={{ display: "flex", gap: "1rem", marginTop: "3rem", flexWrap: "wrap", transitionDelay: "0.3s" }}>
            <a href="#reel" className="btn-primary"
              onMouseEnter={() => setCursorBig(true)} onMouseLeave={() => setCursorBig(false)}>
              View Works
            </a>
            <a href="#contact" className="btn-ghost"
              onMouseEnter={() => setCursorBig(true)} onMouseLeave={() => setCursorBig(false)}>
              Get In Touch
            </a>
          </div>

          <div className="reveal" style={{
            display: "flex", gap: "3rem", marginTop: "4rem",
            paddingTop: "2.5rem", borderTop: "1px solid var(--border)",
            transitionDelay: "0.4s",
          }}>
            {[["120+","Projects"],["6","Years"],["40+","Clients"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.6rem", color: "var(--text)", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "0.3rem" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: "absolute", bottom: "2.5rem", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
          color: "var(--text-muted)", fontSize: "0.62rem", letterSpacing: "0.3em",
          textTransform: "uppercase", zIndex: 5,
          opacity: Math.max(0, 1 - scrollY / 220),
        }}>
          <div style={{
            width: 1, height: 50,
            background: "linear-gradient(to bottom, var(--purple), transparent)",
            animation: "scrollLine 2s ease-in-out infinite",
          }} />
          <span>Scroll</span>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FILM STRIP REEL
      ════════════════════════════════════════ */}
      <section id="reel" style={{ padding: "7rem 0", background: "var(--bg)", position: "relative" }}>
        {/* Header */}
        <div style={{
          padding: "0 clamp(2rem,7vw,7rem)",
          marginBottom: "3.5rem",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        }}>
          <div>
            <p className="section-label reveal">Portfolio</p>
            <h2 className="section-title reveal" style={{ transitionDelay: "0.1s" }}>Selected<br/>Works</h2>
            <div className="accent-dash reveal" style={{ transitionDelay: "0.2s" }} />
          </div>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            {[{ label: "←", action: () => resetAuto(carouselIdx - 1) }, { label: "→", action: () => resetAuto(carouselIdx + 1) }].map(({ label, action }) => (
              <button key={label} onClick={action}
                onMouseEnter={() => setCursorBig(true)} onMouseLeave={() => setCursorBig(false)}
                style={{
                  width: 44, height: 44,
                  background: "var(--surface)", border: "1px solid var(--border)",
                  color: "var(--text-muted)", fontSize: "1.05rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "border-color 0.3s, color 0.3s, background 0.3s",
                }}
                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--purple)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--purple)"; }}
                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Film strip */}
        <div style={{ position: "relative", overflow: "hidden", padding: "16px 0" }}>
          <div className="reel-fade-left" />
          <div className="reel-fade-right" />
          <div style={{
            display: "flex",
            transform: `translateX(${-carouselIdx * 340}px)`,
            transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
            willChange: "transform",
          }}>
            {allWorks.map((w, i) => (
              <div key={i} className="film-card"
                onMouseEnter={() => setCursorBig(true)} onMouseLeave={() => setCursorBig(false)}>
                {/* Top holes */}
                <div className="film-holes">
                  {Array.from({ length: 9 }, (_, hi) => <div key={hi} className="hole" />)}
                </div>

                {/* Frame */}
                <div className="film-frame">
                  <div className="film-frame-bg" style={{ background: w.gradient }} />

                  <div className="play-circle">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--purple-light)">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>

                  <div className="film-meta">
                    <span style={{ fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--purple-light)", marginBottom: 4, display: "block" }}>
                      {w.cat}
                    </span>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>
                      {w.title}
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", marginTop: 4, display: "block" }}>{w.dur}</span>
                  </div>

                  <span style={{
                    position: "absolute", top: 8, right: 12,
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em", zIndex: 5,
                  }}>{w.num}</span>
                </div>

                {/* Bottom holes */}
                <div className="film-holes" style={{ borderTop: "1px solid #1a1a1a", borderBottom: "none" }}>
                  {Array.from({ length: 9 }, (_, hi) => <div key={hi} className="hole" />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2rem" }}>
          {WORKS.map((_, i) => (
            <button key={i} onClick={() => resetAuto(i)}
              style={{
                width: i === carouselIdx ? 28 : 8, height: 8,
                borderRadius: 4, border: "none",
                background: i === carouselIdx ? "var(--purple)" : "var(--surface2)",
                cursor: "pointer", transition: "width 0.3s, background 0.3s", padding: 0,
              }}
            />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          SERVICES
      ════════════════════════════════════════ */}
      <section id="services" style={{ padding: "8rem clamp(2rem,7vw,7rem)", background: "var(--bg)", position: "relative" }}>
        <div style={{
          position: "absolute", width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(ellipse,rgba(109,40,217,0.07) 0%,transparent 70%)",
          bottom: -100, right: "5%", pointerEvents: "none",
        }} />

        <p className="section-label reveal">What I offer</p>
        <h2 className="section-title reveal" style={{ transitionDelay: "0.1s" }}>Services</h2>
        <div className="accent-dash reveal" style={{ transitionDelay: "0.2s" }} />

        <div className="services-grid">
          {SERVICES.map((svc, i) => (
            <div key={svc.num} className={`service-item reveal`} style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.75rem", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "1.8rem" }}>{svc.num}</div>
              <div style={{
                width: 46, height: 46,
                background: "rgba(155,93,229,0.08)", border: "1px solid rgba(155,93,229,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1.4rem",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={svc.icon} />
                </svg>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.7rem" }}>{svc.name}</div>
              <div style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.8 }}>{svc.desc}</div>
              <div style={{ marginTop: "1.8rem", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "var(--purple-light)", letterSpacing: "0.04em" }}>
                {svc.price}
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginLeft: 7, verticalAlign: "middle" }}>
                  / {svc.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          PROCESS
      ════════════════════════════════════════ */}
      <section id="process" style={{
        padding: "8rem clamp(2rem,7vw,7rem)",
        background: "var(--bg2)",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg,transparent,rgba(155,93,229,0.2),transparent)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg,transparent,rgba(155,93,229,0.2),transparent)",
        }} />

        <p className="section-label reveal">How it works</p>
        <h2 className="section-title reveal" style={{ transitionDelay: "0.1s" }}>The Process</h2>
        <div className="accent-dash reveal" style={{ transitionDelay: "0.2s" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start", marginTop: "3rem" }} className="process-layout">
          {/* Steps */}
          <div>
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.n} className={`process-step reveal`} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="step-num">{step.n}</div>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.98rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.45rem" }}>{step.title}</div>
                  <div style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.8 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual */}
          <div className="reveal-right" style={{ position: "sticky", top: "3rem" }}>
            <div style={{
              aspectRatio: "4/5",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              position: "relative",
              overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                position: "absolute", inset: -60,
                background: "radial-gradient(ellipse at center,rgba(155,93,229,0.1) 0%,transparent 70%)",
                animation: "rotatePulse 10s linear infinite",
              }} />
              <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: "4.5rem",
                  color: "transparent", WebkitTextStroke: "1px rgba(155,93,229,0.25)",
                  lineHeight: 1, letterSpacing: "0.05em",
                }}>
                  FRAME<br />BY<br />FRAME
                </div>
                <div style={{ fontSize: "0.68rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "1rem" }}>
                  Precision in every cut
                </div>
              </div>
              {/* Corner brackets */}
              {[
                { top: 14, left: 14, borderTop: "1px solid rgba(155,93,229,0.35)", borderLeft: "1px solid rgba(155,93,229,0.35)" },
                { top: 14, right: 14, borderTop: "1px solid rgba(155,93,229,0.35)", borderRight: "1px solid rgba(155,93,229,0.35)" },
                { bottom: 14, left: 14, borderBottom: "1px solid rgba(155,93,229,0.35)", borderLeft: "1px solid rgba(155,93,229,0.35)" },
                { bottom: 14, right: 14, borderBottom: "1px solid rgba(155,93,229,0.35)", borderRight: "1px solid rgba(155,93,229,0.35)" },
              ].map((s, ci) => (
                <div key={ci} style={{ position: "absolute", width: 22, height: 22, ...s }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TOOLS
      ════════════════════════════════════════ */}
      <section id="tools" style={{ padding: "8rem clamp(2rem,7vw,7rem)", background: "var(--bg)" }}>
        <p className="section-label reveal">Arsenal</p>
        <h2 className="section-title reveal" style={{ transitionDelay: "0.1s" }}>Tools of<br/>the Craft</h2>
        <div className="accent-dash reveal" style={{ transitionDelay: "0.2s" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", marginTop: "4rem" }} className="tools-grid">
          {TOOLS.map((tool, i) => (
            <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer"
              className="tool-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}
              onMouseEnter={() => setCursorBig(true)} onMouseLeave={() => setCursorBig(false)}>
              <div style={{
                width: 58, height: 58,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${tool.borderColor}`,
                marginBottom: "1.6rem",
                fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.45rem",
                color: tool.color, letterSpacing: "0.05em",
              }}>
                {tool.logo}
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.6rem" }}>{tool.name}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.8 }}>{tool.desc}</div>
              <div style={{ marginTop: "1.8rem", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--purple)" }}>
                Visit site →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          CONTACT
      ════════════════════════════════════════ */}
      <section id="contact" style={{ padding: "8rem clamp(2rem,7vw,7rem) 10rem", background: "var(--bg2)", position: "relative" }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg,transparent,rgba(155,93,229,0.2),transparent)",
        }} />

        <p className="section-label reveal">Connect</p>
        <h2 className="section-title reveal" style={{ transitionDelay: "0.1s" }}>Start a<br/>Conversation</h2>
        <div className="accent-dash reveal" style={{ transitionDelay: "0.2s" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", marginTop: "4rem" }} className="contact-layout">
          {/* Info */}
          <div className="reveal-left" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {[
              ["Email",         "hello@videoedit.studio"],
              ["Based in",      "Manila, Philippines"],
              ["Availability",  "Open for Projects"],
              ["Response time", "Within 24 hours"],
            ].map(([label, value]) => (
              <div key={label}>
                <span style={{ fontSize: "0.67rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>{label}</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 300, color: "var(--text)" }}>{value}</span>
              </div>
            ))}
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.85, paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
              Whether it&apos;s a quick question or a full project brief — I&apos;m happy to talk about your vision.
            </p>
          </div>

          {/* Form */}
          <div className="reveal-right">
            {submitted ? (
              <div style={{
                padding: "3rem", border: "1px solid rgba(155,93,229,0.28)",
                background: "rgba(155,93,229,0.04)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center",
              }}>
                <div style={{ fontSize: "2rem", color: "var(--purple)" }}>✦</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "var(--purple-light)", letterSpacing: "0.06em" }}>Message Sent</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Thank you for reaching out. I&apos;ll be in touch within 24 hours.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {[
                  { key: "name",    placeholder: "Your Name",     type: "text"  },
                  { key: "email",   placeholder: "Email Address", type: "email" },
                  { key: "subject", placeholder: "Project Type",  type: "text"  },
                ].map(({ key, placeholder, type }) => (
                  <div key={key} className="form-field">
                    <input
                      className="form-input"
                      type={type}
                      placeholder={placeholder}
                      value={formState[key as keyof typeof formState]}
                      onChange={e => setFormState(s => ({ ...s, [key]: e.target.value }))}
                    />
                  </div>
                ))}
                <div className="form-field">
                  <textarea
                    className="form-input"
                    placeholder="Tell me about your project…"
                    rows={5}
                    value={formState.message}
                    style={{ resize: "none" }}
                    onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  onMouseEnter={() => setCursorBig(true)} onMouseLeave={() => setCursorBig(false)}
                  style={{
                    marginTop: "0.8rem",
                    padding: "1rem 2.8rem",
                    background: "transparent",
                    border: "1px solid var(--purple)",
                    color: "var(--purple)",
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "0.78rem", fontWeight: 700,
                    letterSpacing: "0.22em", textTransform: "uppercase",
                    cursor: "pointer", alignSelf: "flex-start",
                    transition: "background 0.3s, color 0.3s, transform 0.2s",
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--purple)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--purple)"; }}
                >
                  Send Message →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}