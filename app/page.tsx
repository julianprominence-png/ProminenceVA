"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Stack, TerminalWindow, Database, Cloud, FilmStrip, PlayCircle,
  VideoCamera, ImageSquare, PenNib, Layout, Quotes, Cpu,
  HardDrives, Code, Scissors, MagicWand
} from "@phosphor-icons/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------- */
/* DATA                                                                        */
/* -------------------------------------------------------------------------- */
const scriptures = [
  `Matthew 20:26–28 — "Whoever wants to become great among you must be your servant…"`,
  `Mark 10:45 — "For even the Son of Man did not come to be served, but to serve…"`,
  `Proverbs 14:23 — "All hard work brings a profit, but mere talk leads only to poverty."`,
  `Proverbs 13:4 — "The soul of the sluggard craves and gets nothing, while the soul of the diligent is richly supplied."`,
  `Ecclesiastes 9:10 — "Whatever your hand finds to do, do it with all your might…"`,
  `Proverbs 10:4 — "Lazy hands make for poverty, but diligent hands bring wealth."`,
  `Deuteronomy 8:18 — "But remember the Lord your God, for it is He who gives you the ability to produce wealth..."`,
];

const techStack = [
  {
    title: "Development Stack",
    tools: [
      { name: "Next.js", icon: <Stack weight="duotone" /> },
      { name: "VS Code", icon: <TerminalWindow weight="duotone" /> },
      { name: "Firebase", icon: <Database weight="duotone" /> },
      { name: "Vercel", icon: <Cloud weight="duotone" /> },
    ],
  },
  {
    title: "Post-Production",
    tools: [
      { name: "Premiere", icon: <VideoCamera weight="duotone" /> },
      { name: "After Effects", icon: <FilmStrip weight="duotone" /> },
      { name: "CapCut", icon: <PlayCircle weight="duotone" /> },
    ],
  },
  {
    title: "Creative Design",
    tools: [
      { name: "Photoshop", icon: <ImageSquare weight="duotone" /> },
      { name: "Illustrator", icon: <PenNib weight="duotone" /> },
      { name: "Figma", icon: <Layout weight="duotone" /> },
    ],
  },
];

const teamData = [
  { name: "Vinz Ilagan", role: "Lead Architect", icon: <Cpu weight="duotone" /> },
  { name: "Giervan Sabalbero", role: "Backend Specialist", icon: <HardDrives weight="duotone" /> },
  { name: "Julian Tolentino", role: "Frontend Engineer", icon: <Code weight="duotone" /> },
  { name: "Gian Dethan Adamos", role: "Lead Editor", icon: <Scissors weight="duotone" /> },
  { name: "Russel Minimo", role: "VFX & Motion", icon: <MagicWand weight="duotone" /> },
];

/* -------------------------------------------------------------------------- */
/* LOADER COMPONENT                                                            */
/* -------------------------------------------------------------------------- */
const ProminenceLoader = ({ onComplete }: { onComplete: () => void }) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaderRef.current) return;
    const letters = loaderRef.current.querySelectorAll<HTMLElement>(".ll");

    const tl = gsap.timeline({
      delay: 0.3,
      onComplete: () => {
        gsap.to(loaderRef.current, {
          opacity: 0,
          scale: 1.04,
          duration: 0.9,
          ease: "power3.inOut",
          onComplete,
        });
      },
    });

    // Letters reveal with stagger
    tl.fromTo(
      letters,
      { opacity: 0, y: 20, filter: "blur(12px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.055, duration: 0.55, ease: "power3.out" },
      0
    );

    // Central glow blooms
    tl.fromTo(
      glowRef.current,
      { scale: 0.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" },
      0
    );

    // Progress bar fills
    tl.fromTo(
      progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.7, ease: "power2.inOut", transformOrigin: "left center" },
      0.2
    );

    // Status text swap
    tl.to(statusRef.current, { opacity: 0, duration: 0.15 }, 1.55);
    tl.call(
      () => {
        if (statusRef.current) {
          statusRef.current.textContent = "SYSTEMS ONLINE";
          statusRef.current.style.color = "rgba(134,239,172,0.65)";
        }
      },
      [],
      1.7
    );
    tl.to(statusRef.current, { opacity: 1, duration: 0.3 }, 1.7);
    tl.to({}, { duration: 0.55 });
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[200] bg-[#020104] flex flex-col items-center justify-center overflow-hidden">
      {/* Deep purple ambient */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(88,28,135,0.28) 0%, rgba(49,10,101,0.12) 50%, transparent 80%)",
        }}
      />

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Diagonal accent lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
        <div className="absolute top-0 left-[-20%] w-[140%] h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent rotate-[15deg] origin-center" style={{ top: "30%" }} />
        <div className="absolute top-0 left-[-20%] w-[140%] h-[1px] bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent rotate-[-12deg] origin-center" style={{ top: "65%" }} />
      </div>

      {/* Main branding */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Dot trio */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-1 rounded-full bg-purple-600/60" />
          <div className="w-[7px] h-[7px] rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,1),0_0_24px_rgba(217,70,239,0.5)]" />
          <div className="w-1 h-1 rounded-full bg-purple-600/60" />
        </div>

        {/* Letters */}
        <h1 className="flex" style={{ letterSpacing: "0.38em" }}>
          {"PROMINENCE".split("").map((ch, i) => (
            <span
              key={i}
              className="ll font-black text-transparent select-none"
              style={{
                fontSize: "clamp(2.8rem, 9vw, 7.5rem)",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.28)",
                textShadow: "0 0 50px rgba(168,85,247,0.35), 0 0 100px rgba(168,85,247,0.15)",
              }}
            >
              {ch}
            </span>
          ))}
        </h1>

        <p className="text-[8px] tracking-[0.55em] text-white/22 uppercase font-semibold">
          Invisible Architecture · Visible Results
        </p>
      </div>

      {/* Bottom progress */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-64 flex flex-col items-center gap-3">
        <p ref={statusRef} className="text-[8px] tracking-[0.45em] text-purple-400/50 uppercase font-semibold">
          INITIALIZING SYSTEMS
        </p>
        <div className="w-full h-[1px] bg-white/[0.05] overflow-hidden rounded-full relative">
          <div
            ref={progressRef}
            className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-indigo-700 via-fuchsia-500 to-purple-300"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MOUNTAIN PARALLAX BACKGROUND                                                */
/* -------------------------------------------------------------------------- */
const MountainParallax = () => {
  const mountainContainerRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const blurOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountainContainerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "main",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      // Far mountains — slowest, scale up gently
      tl.fromTo(farRef.current, { y: "0%", scale: 1 }, { y: "-15%", scale: 1.25 }, 0);
      // Mid mountains — medium speed
      tl.fromTo(midRef.current, { y: "0%", scale: 1 }, { y: "-25%", scale: 1.45 }, 0);
      // Near mountains — fastest, biggest scale (approach effect)
      tl.fromTo(nearRef.current, { y: "0%", scale: 1 }, { y: "-40%", scale: 1.8 }, 0);
      // Haze clears as you approach
      tl.fromTo(hazeRef.current, { opacity: 0.7 }, { opacity: 0 }, 0);

      // Motion blur on scroll — increases with scroll velocity
      let lastScroll = 0;
      let blurTween: gsap.core.Tween | null = null;
      const onScroll = () => {
        const currentScroll = window.scrollY;
        const velocity = Math.abs(currentScroll - lastScroll);
        lastScroll = currentScroll;
        const blurAmount = Math.min(velocity * 0.15, 12);
        if (blurOverlayRef.current) {
          if (blurTween) blurTween.kill();
          blurTween = gsap.to(blurOverlayRef.current, {
            filter: `blur(${blurAmount}px)`,
            duration: 0.08,
            ease: "none",
            onComplete: () => {
              gsap.to(blurOverlayRef.current, {
                filter: "blur(0px)",
                duration: 0.6,
                ease: "power2.out",
              });
            },
          });
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, mountainContainerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mountainContainerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base dark sky */}
      <div className="absolute inset-0 bg-[#020104]" />

      {/* Subtle starfield */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* Motion blur wrapper — this div gets blurred on fast scroll */}
      <div ref={blurOverlayRef} className="absolute inset-0" style={{ willChange: "filter" }}>
        {/* Sky gradient — deep purple to dark */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, #020104 0%, #0a0320 20%, #150840 40%, #0d0525 70%, #020104 100%)",
        }} />

        {/* Far mountains layer */}
        <div ref={farRef} className="absolute inset-x-0 bottom-0 h-[70vh] transform-gpu" style={{ willChange: "transform" }}>
          <div className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-50" style={{
            backgroundImage: "url('/images/mountains-far.png')",
            filter: "brightness(0.6) saturate(0.8) hue-rotate(-10deg)",
          }} />
        </div>

        {/* Mid mountains layer */}
        <div ref={midRef} className="absolute inset-x-0 bottom-0 h-[65vh] transform-gpu" style={{ willChange: "transform" }}>
          <div className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-65" style={{
            backgroundImage: "url('/images/mountains-mid.png')",
            filter: "brightness(0.5) saturate(0.9)",
          }} />
        </div>

        {/* Near mountains layer */}
        <div ref={nearRef} className="absolute inset-x-0 bottom-0 h-[60vh] transform-gpu" style={{ willChange: "transform" }}>
          <div className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-80" style={{
            backgroundImage: "url('/images/mountains-near.png')",
            filter: "brightness(0.35) saturate(1.1)",
          }} />
        </div>
      </div>

      {/* Atmospheric haze overlay — clears on scroll */}
      <div ref={hazeRef} className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 120% 80% at 50% 60%, rgba(88,28,135,0.25) 0%, rgba(20,5,50,0.4) 40%, rgba(2,1,4,0.6) 100%)",
      }} />

      {/* Bottom fog */}
      <div className="absolute bottom-0 left-0 right-0 h-64" style={{
        background: "linear-gradient(to top, rgba(2,1,4,1) 0%, rgba(2,1,4,0.8) 30%, transparent 100%)",
      }} />
    </div>
  );
};




/* -------------------------------------------------------------------------- */
/* MAIN LANDING PAGE COMPONENT                                                */
/* -------------------------------------------------------------------------- */
export default function ProminenceLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prominenceBrandRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const revealRefs = useRef<HTMLDivElement[]>([]);
  const parallaxRefs = useRef<HTMLDivElement[]>([]);

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => { setMounted(true); }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormStatus("sending");
    try {
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp(),
      });
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 4000);
    } catch {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 4000);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
      parallaxRefs.current.forEach((el) => {
        const speed = el.dataset.speed || "1";
        gsap.to(el, {
          y: () => -200 * parseFloat(speed),
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.to(prominenceBrandRef.current, {
        y: "-18%", opacity: 0, scale: 0.88, rotationX: 12,
        scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: 1 },
      });

      revealRefs.current.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 45, scale: 0.96, rotationX: 5 },
          {
            opacity: 1, y: 0, scale: 1, rotationX: 0,
            duration: 1.4, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          }
        );
      });

      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, { xPercent: -50, ease: "none", duration: 40, repeat: -1 });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (!prominenceBrandRef.current) return;
    const xPos = (e.clientX / window.innerWidth - 0.5) * 40;
    const yPos = (e.clientY / window.innerHeight - 0.5) * 40;
    gsap.to(prominenceBrandRef.current, {
      x: xPos, y: yPos, rotationX: -yPos / 3, rotationY: xPos / 3,
      duration: 1.0, ease: "power2.out",
    });
  };

  const handleHeroMouseLeave = () => {
    gsap.to(prominenceBrandRef.current, {
      x: 0, y: 0, rotationX: 0, rotationY: 0,
      duration: 1.2, ease: "power2.out",
    });
  };

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };
  const addParallaxRef = (el: HTMLDivElement | null) => {
    if (el && !parallaxRefs.current.includes(el)) parallaxRefs.current.push(el);
  };

  /* --- Design tokens --- */
  const skeuoGlassCard =
    "relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-[#020104]/80 backdrop-blur-[80px] border border-white/10 border-b-black/80 border-r-black/50 shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.5)] rounded-3xl p-8 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_rgba(168,85,247,0.25),inset_0_1px_2px_rgba(255,255,255,0.25)] transition-all duration-500 group";
  const skeuoButton =
    "bg-gradient-to-b from-white to-gray-300 text-black font-bold rounded-full px-8 py-3 text-[10px] uppercase tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_-2px_2px_rgba(0,0,0,0.15)] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4)] active:translate-y-1 hover:from-white hover:to-gray-100 transition-all";
  const recessedWell =
    "bg-[#010002]/80 border border-white/5 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)]";
  const raisedTactileBox =
    "bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 border-b-black/60 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)]";
  const sectionLabel = (color: string) =>
    `text-[9px] font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-4 text-${color}-400`;

  return (
    <>
      {/* ================================================================ */}
      {/* LOADER                                                            */}
      {/* ================================================================ */}
      {isLoading && <ProminenceLoader onComplete={() => setIsLoading(false)} />}

      <main
        ref={containerRef}
        className="relative bg-[#020104] text-white font-sans overflow-hidden selection:bg-fuchsia-500/40 selection:text-white"
      >
        {/* ── MOUNTAIN PARALLAX BACKGROUND ── */}
        {mounted && <MountainParallax />}

        {/* ── FLOATING NAV ── */}
        <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="bg-gradient-to-b from-white/[0.08] to-[#020104]/80 backdrop-blur-3xl border border-white/10 border-b-black/80 shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] rounded-full px-6 py-3 w-full max-w-5xl flex items-center justify-between pointer-events-auto transition-all duration-500">
            <div className="font-bold tracking-[0.25em] uppercase text-[10px] flex items-center gap-3 text-white drop-shadow-md">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-3 h-3 rounded-full bg-fuchsia-500/60 animate-ping" />
                <div className="relative w-1.5 h-1.5 rounded-full bg-fuchsia-200 shadow-[0_0_15px_rgba(217,70,239,1)]" />
              </div>
              Prominence
            </div>
            <div className="hidden md:flex items-center gap-10 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">
              <a href="#services" className="hover:text-white transition-all">Architecture</a>
              <a href="#team" className="hover:text-white transition-all">The Engine</a>
              <a href="#tools" className="hover:text-white transition-all">Ecosystem</a>
              <a href="#work" className="hover:text-white transition-all">Archive</a>
            </div>
            <a href="#contact" className={skeuoButton}>Engage</a>
          </div>
        </nav>

        {/* ================================================================ */}
        {/* HERO — Depth Layers                                              */}
        {/* ================================================================ */}
        <section
          className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden perspective-[1000px]"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
        >
          {/* Edge vignette */}
          <div className="absolute inset-0 z-[8] pointer-events-none"
            style={{ background: "radial-gradient(ellipse 92% 88% at 50% 50%, transparent 52%, rgba(2,1,4,0.5) 100%)" }}
          />

          {/* LAYER 5 — Ghost brand typography (glassy watermark) */}
          <div
            ref={prominenceBrandRef}
            className="absolute inset-0 z-[20] flex items-center justify-center pointer-events-none select-none transform-gpu"
          >
            <h1
              className="font-black tracking-[0.1em] text-transparent opacity-35 mix-blend-plus-lighter"
              style={{
                fontSize: "clamp(3.5rem, 12vw, 13rem)",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.18)",
                textShadow: "0 0 60px rgba(168,85,247,0.35), 0 0 120px rgba(168,85,247,0.12)",
              }}
            >
              PROMINENCE
            </h1>
          </div>

          {/* LAYER 6 — Hero content (foreground) */}
          <div
            className="relative z-[30] text-center max-w-4xl px-6 flex flex-col items-center pl-0 md:pl-20"
            ref={addParallaxRef}
            data-speed="0.8"
          >
            <div className="inline-flex items-center gap-4 mb-8 px-6 py-2.5 rounded-full bg-[#0a0412]/80 border border-white/10 shadow-[inset_0_2px_5px_rgba(0,0,0,0.9),0_2px_4px_rgba(255,255,255,0.05)] text-fuchsia-200 text-[9px] font-bold tracking-[0.2em] uppercase backdrop-blur-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500 shadow-[0_0_10px_#f0abfc]" />
              </span>
              Invisible Architecture, Visible Results
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight leading-[1.05] mb-8 text-white drop-shadow-[0_15px_30px_rgba(0,0,0,1)]">
              Elevate your <br />
              <span className="font-medium bg-clip-text text-transparent bg-gradient-to-b from-white via-purple-200 to-fuchsia-500">
                digital reality.
              </span>
            </h2>
            <p className="text-xs md:text-sm text-white/80 max-w-xl font-light leading-relaxed backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] bg-black/40">
              We are the intelligence supporting your ascendancy. High-end virtual operations coordinating seamlessly in the void.
            </p>
          </div>
        </section>

        {/* ================================================================ */}
        {/* MANIFESTO — The Creed                                            */}
        {/* ================================================================ */}
        <section className="py-36 px-6 relative z-20 overflow-hidden">
          {/* Section ambient — warm gold-violet */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 60% at 60% 50%, rgba(109,40,217,0.14) 0%, transparent 70%)" }}
          />

          <div className="max-w-6xl mx-auto pl-6 md:pl-32">
            <div ref={addToRefs}>
              <div className="text-[9px] tracking-[0.5em] text-purple-400/50 uppercase font-bold mb-10 flex items-center gap-4">
                <div className="w-8 h-[1px] bg-purple-500/50" /> The Creed
              </div>
              <blockquote
                className="text-3xl md:text-5xl lg:text-[3.4rem] font-light text-white/90 leading-[1.2] tracking-tight max-w-4xl"
              >
                We occupy the space between{" "}
                <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-400">
                  what you envision
                </span>{" "}
                and what the world receives.
              </blockquote>
              <div className="mt-14 flex items-center gap-5">
                <div className="w-16 h-[1px] bg-gradient-to-r from-purple-500/60 to-transparent" />
                <span className="text-[8px] tracking-[0.4em] text-white/25 uppercase font-semibold">Prominence · Est. Operations</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SERVICES — Phase 01                                              */}
        {/* Color: Indigo / Blue-violet                                      */}
        {/* ================================================================ */}
        <section id="services" className="py-32 px-6 max-w-6xl mx-auto relative z-20 pl-6 md:pl-32">
          <div className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: "radial-gradient(ellipse 90% 70% at 10% 50%, rgba(79,70,229,0.18) 0%, transparent 65%)" }}
          />

          <div ref={addToRefs} className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-10">
            <div className="max-w-2xl">
              <div className={sectionLabel("indigo")}>
                <div className="w-12 h-[1px] bg-gradient-to-r from-indigo-500 to-transparent" />
                Phase 01: Architecture
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 drop-shadow-xl">Core Capacities</h2>
              <p className="text-white/60 text-sm md:text-base font-light leading-relaxed">
                We intercept and resolve the complexities of your operations. Focus on high-level growth, direction, and wealth creation. We handle the structure.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Development", desc: "Scalable frontend and backend architectures built by specialized engineers. Robust, exact, and future-proof." },
              { title: "Post-Production", desc: "Cinematic editing and visual workflows that elevate your brand's narrative to ultra-premium standards." },
              { title: "Creative Design", desc: "High-fidelity identity mapping, from asset creation to complete, immersive brand ecosystems." },
            ].map((service, i) => (
              <div key={i} ref={addToRefs} className={skeuoGlassCard}>
                <div className="absolute top-0 right-0 w-48 h-48 blur-[70px] group-hover:opacity-100 opacity-70 transition-opacity duration-1000 pointer-events-none"
                  style={{ background: "radial-gradient(circle at center, rgba(99,102,241,0.35) 0%, transparent 70%)" }} />
                <div className={`w-14 h-14 rounded-xl ${raisedTactileBox} flex items-center justify-center mb-8 relative z-10 group-hover:-translate-y-2 transition-all duration-500`}>
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-300 shadow-[0_0_20px_rgba(165,180,252,1)] group-hover:scale-150 transition-transform duration-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-medium mb-4 relative z-10 text-white/90 group-hover:text-white drop-shadow-md">{service.title}</h3>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed font-light relative z-10 group-hover:text-white/90 transition-colors duration-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* TEAM — Phase 02                                                  */}
        {/* Color: Fuchsia / Magenta                                         */}
        {/* ================================================================ */}
        <section id="team" className="py-32 px-6 max-w-6xl mx-auto relative z-20 pl-6 md:pl-32">
          <div className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: "radial-gradient(ellipse 80% 65% at 90% 40%, rgba(192,38,211,0.18) 0%, transparent 65%)" }}
          />

          <div ref={addToRefs} className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-10">
            <div className="max-w-2xl">
              <div className={sectionLabel("fuchsia")}>
                <div className="w-12 h-[1px] bg-gradient-to-r from-fuchsia-500 to-transparent" />
                Phase 02: The Engine
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 drop-shadow-xl">Intelligence Behind</h2>
              <p className="text-white/60 text-sm md:text-base font-light leading-relaxed">
                A curated syndicate of specialists operating as a unified control hub. Invisible, but immensely felt.
              </p>
            </div>
          </div>

          {/* CEO Highlight */}
          <div ref={addToRefs} className={`${skeuoGlassCard} mb-12 flex flex-col md:flex-row items-center gap-12 !p-10 md:!p-14`}>
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            <div className={`relative z-10 w-40 h-40 md:w-48 md:h-48 shrink-0 rounded-full ${recessedWell} p-3 group-hover:border-fuchsia-500/40 transition-colors duration-700`}>
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-900 to-black flex items-center justify-center text-4xl font-light text-white/30 overflow-hidden relative shadow-[inset_0_2px_15px_rgba(0,0,0,1),0_1px_1px_rgba(255,255,255,0.2)]">
                <span className="absolute tracking-[0.2em] font-bold">VA</span>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800')] bg-cover bg-center mix-blend-luminosity opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
              </div>
            </div>
            <div className="relative z-10 text-center md:text-left">
              <div className={`inline-flex px-5 py-2 rounded-full ${raisedTactileBox} text-fuchsia-200 text-[9px] font-bold tracking-[0.25em] uppercase mb-6`}>
                CEO & Founder
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6 drop-shadow-xl">Vien Abache</h3>
              <p className="text-white/70 text-sm md:text-base max-w-xl font-light leading-relaxed">
                Architecting operations and steering the central vision to deliver invisible infrastructure with compounding, visible results.
              </p>
            </div>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamData.map((member, i) => (
              <div key={i} ref={addToRefs} className={`${skeuoGlassCard} flex items-center gap-6 !p-6 group/member`}>
                <div className={`w-14 h-14 shrink-0 rounded-xl ${recessedWell} flex items-center justify-center text-2xl text-white/50 group-hover/member:text-fuchsia-400 group-hover/member:shadow-[inset_0_4px_10px_rgba(0,0,0,0.9),0_0_20px_rgba(217,70,239,0.4)] transition-all duration-500`}>
                  {member.icon}
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-medium text-white/90 group-hover/member:text-white transition-colors duration-300 mb-1">{member.name}</h4>
                  <div className="text-[9px] text-fuchsia-400/80 tracking-[0.2em] font-bold uppercase group-hover/member:text-fuchsia-300">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* TOOLS — Phase 03                                                 */}
        {/* Color: Royal indigo / Deep blue                                  */}
        {/* ================================================================ */}
        <section id="tools" className="py-32 px-6 relative z-20 pl-6 md:pl-32">
          <div className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(15,6,50,0.7) 40%, rgba(8,2,20,0.9) 60%, transparent)" }}
          />
          <div className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(67,56,202,0.2) 0%, transparent 70%)" }}
          />

          <div className="max-w-6xl mx-auto">
            <div ref={addToRefs} className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-10">
              <div className="max-w-2xl">
                <div className={sectionLabel("violet")}>
                  <div className="w-12 h-[1px] bg-gradient-to-r from-violet-500 to-transparent" />
                  Phase 03: Ecosystem
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 drop-shadow-xl">Stack & Frameworks</h2>
                <p className="text-white/60 text-sm md:text-base font-light leading-relaxed">
                  The foundational digital instruments empowering our silent operations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {techStack.map((category, idx) => (
                <div key={idx} ref={addToRefs} className={`${skeuoGlassCard} flex flex-col justify-between`}>
                  <div>
                    <div className="text-violet-300 text-[10px] font-bold tracking-[0.2em] uppercase mb-10 flex items-center gap-4">
                      <div className="flex-grow h-[1px] bg-gradient-to-r from-violet-500/50 to-transparent" />
                      {category.title}
                    </div>
                    <div className="flex flex-col gap-6">
                      {category.tools.map((tool, i) => (
                        <div key={i} className="flex items-center gap-5 group/item cursor-default">
                          <div className={`w-12 h-12 rounded-xl ${raisedTactileBox} flex items-center justify-center group-hover/item:border-violet-400/60 transition-all duration-300 group-hover/item:shadow-[0_6px_20px_rgba(139,92,246,0.5),inset_0_1px_2px_rgba(255,255,255,0.5)]`}>
                            <div className="text-white/50 group-hover/item:text-violet-300 transition-colors transform group-hover/item:scale-110 duration-300 text-xl">
                              {tool.icon}
                            </div>
                          </div>
                          <span className="text-sm md:text-base font-light text-white/70 group-hover/item:text-white transition-colors duration-300">
                            {tool.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* PROJECTS — Phase 04                                              */}
        {/* Color: Rich violet                                               */}
        {/* ================================================================ */}
        <section id="work" className="py-32 px-6 max-w-6xl mx-auto relative z-20 pl-6 md:pl-32">
          <div className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: "radial-gradient(ellipse 75% 55% at 15% 60%, rgba(124,58,237,0.15) 0%, transparent 65%)" }}
          />

          <div ref={addToRefs} className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/[0.05] pb-10">
            <div className="max-w-2xl">
              <div className={sectionLabel("purple")}>
                <div className="w-12 h-[1px] bg-gradient-to-r from-purple-500 to-transparent" />
                Phase 04: Archive
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 drop-shadow-xl">Executed Intelligence</h2>
              <p className="text-white/60 text-sm md:text-base font-light leading-relaxed">
                A curated glimpse into the robust systems and cinematic media we've successfully deployed.
              </p>
            </div>
            <button className={`${skeuoButton} self-start md:self-auto`}>Explore Archive</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { id: 1, img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", title: "Core Dashboard", subtitle: "Infrastructure" },
              { id: 2, img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop", title: "System Reel '25", subtitle: "Video Production" },
              { id: 3, img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2000&auto=format&fit=crop", title: "Identity Phase II", subtitle: "Creative Design" },
              { id: 4, img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop", title: "App Stack", subtitle: "Development" },
            ].map((project) => (
              <div key={project.id} ref={addToRefs} className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-[#020104] border border-white/10 border-b-black/80 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.15)] cursor-pointer hover:shadow-[0_35px_70px_rgba(168,85,247,0.4),inset_0_1px_3px_rgba(255,255,255,0.3)] hover:-translate-y-2 transition-all duration-700 perspective-[1000px]">
                <div
                  className="absolute inset-[-10%] bg-cover bg-center transform group-hover:scale-105 transition-transform duration-[3s] ease-out opacity-70 group-hover:opacity-100"
                  style={{ backgroundImage: `url(${project.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020104] via-[#020104]/80 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-1000" />
                <div className="absolute bottom-0 inset-x-0 p-8 md:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out z-20">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-purple-300 text-[9px] font-bold tracking-[0.3em] uppercase mb-3 opacity-80 group-hover:opacity-100 transition-opacity duration-700 delay-100">{project.subtitle}</div>
                      <h3 className="text-xl md:text-2xl font-medium text-white drop-shadow-lg">{project.title}</h3>
                    </div>
                    <div className={`w-10 h-10 rounded-full ${raisedTactileBox} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 group-hover:scale-110`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* TESTIMONIALS                                                      */}
        {/* Color: Deep plum / rose                                          */}
        {/* ================================================================ */}
        <section id="testimonials" className="py-32 px-6 max-w-6xl mx-auto relative z-20 pl-6 md:pl-32">
          <div className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: "radial-gradient(ellipse 80% 60% at 85% 45%, rgba(157,23,77,0.12) 0%, rgba(109,40,217,0.1) 40%, transparent 70%)" }}
          />

          <div ref={addToRefs} className="mb-20 flex flex-col items-center text-center border-b border-white/[0.05] pb-10">
            <div className="text-rose-400/70 text-[9px] font-bold tracking-[0.3em] uppercase mb-6">Impact Validation</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 drop-shadow-xl">Proven Elevation</h2>
            <p className="text-white/60 max-w-2xl text-sm md:text-base font-light">The mathematical results of diligent hands and unyielding service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "Prominence completely restructured our backend while flawlessly handling our media. True silent partners in our growth trajectory.", author: "Tech Startup CEO" },
              { quote: "Their work ethic aligns precisely with their values. Diligent, brilliant, and proactive. They don't just execute tasks; they elevate the standard.", author: "Agency Director" },
              { quote: "The video production quality was purely cinematic, and the web integration was seamless. A truly unified, ethereal service.", author: "E-Commerce Founder" },
            ].map((testimonial, i) => (
              <div key={i} ref={addToRefs} className={`${skeuoGlassCard} flex flex-col justify-between group`}>
                <div>
                  <Quotes className="w-10 h-10 text-purple-500/40 mb-8 group-hover:text-purple-400/80 transition-colors duration-500" weight="duotone" />
                  <p className="text-white/80 text-sm md:text-base leading-relaxed font-light mb-10 group-hover:text-white transition-colors duration-500">"{testimonial.quote}"</p>
                </div>
                <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-purple-400/90 group-hover:text-purple-300 transition-colors">
                  — {testimonial.author}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* CONTACT — Phase 05                                               */}
        {/* Color: Rich purple / gold warmth                                 */}
        {/* ================================================================ */}
        <section id="contact" className="py-32 px-6 max-w-6xl mx-auto relative z-20 pl-6 md:pl-32">
          <div ref={addToRefs} className="bg-gradient-to-b from-white/[0.04] to-[#010002]/95 backdrop-blur-[80px] border border-white/10 border-b-black/80 rounded-[3rem] p-10 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,1),inset_0_1px_3px_rgba(255,255,255,0.2)] relative overflow-hidden group perspective-[1000px]">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none group-hover:opacity-100 opacity-70 transition-opacity duration-1000"
              style={{ background: "radial-gradient(circle at center, rgba(109,40,217,0.35) 0%, transparent 70%)" }} />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity duration-1000"
              style={{ background: "radial-gradient(circle at center, rgba(67,56,202,0.3) 0%, transparent 70%)" }} />
            {/* Gold warmth hint */}
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[160px] pointer-events-none opacity-30"
              style={{ background: "radial-gradient(circle at center, rgba(251,191,36,0.12) 0%, transparent 70%)" }} />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" ref={addParallaxRef} data-speed="0.05">
              <div>
                <div className="text-white/70 text-[9px] font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-white/50" /> Phase 05: Engage
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-8 leading-[1.05] drop-shadow-2xl">Initiate <br /> Connection.</h2>
                <p className="text-white/60 text-sm md:text-base font-light leading-relaxed mb-12">
                  Ready to integrate Prominence into your ecosystem? Transmit your signal to schedule a high-level infrastructure review.
                </p>
                <div className="space-y-8">
                  <div className="flex items-center gap-6 text-sm font-light text-white/90">
                    <div className={`w-12 h-12 rounded-xl ${raisedTactileBox} flex items-center justify-center shadow-[0_4px_15px_rgba(217,70,239,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)]`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-fuchsia-300"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </div>
                    <span className="tracking-wide">System Priority Access</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm font-light text-white/90">
                    <div className={`w-12 h-12 rounded-xl ${raisedTactileBox} flex items-center justify-center shadow-[0_4px_15px_rgba(217,70,239,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)]`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-fuchsia-300"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </div>
                    <span className="tracking-wide">direct@prominence.co</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className={`space-y-6 ${recessedWell} p-8 md:p-12 rounded-[2.5rem]`}>
                <input type="text" placeholder="Nomenclature (Name)" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required
                  className={`w-full ${recessedWell} rounded-2xl px-6 py-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-fuchsia-500/60 focus:bg-white/[0.04] transition-all`} />
                <input type="email" placeholder="Transmission Vector (Email)" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} required
                  className={`w-full ${recessedWell} rounded-2xl px-6 py-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-fuchsia-500/60 focus:bg-white/[0.04] transition-all`} />
                <textarea placeholder="Operational Intent (Message)" rows={4} value={formData.message} onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))} required
                  className={`w-full ${recessedWell} rounded-2xl px-6 py-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-fuchsia-500/60 focus:bg-white/[0.04] transition-all resize-none`} />
                <button type="submit" disabled={formStatus === "sending"}
                  className={`${skeuoButton} w-full mt-4 py-4
                    ${formStatus === "sending" ? "opacity-60 cursor-wait" : ""}
                    ${formStatus === "success" ? "!from-emerald-400 !to-emerald-600 !text-white" : ""}
                    ${formStatus === "error" ? "!from-red-400 !to-red-600 !text-white" : ""}`}>
                  {formStatus === "idle" && "Transmit Signal"}
                  {formStatus === "sending" && "Transmitting..."}
                  {formStatus === "success" && "✓ Signal Received"}
                  {formStatus === "error" && "✗ Transmission Failed"}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SCRIPTURE BANNER — Foundation (anchored at end)                  */}
        {/* ================================================================ */}
        <div className="relative z-40 py-16 overflow-hidden">
          {/* Ambient glow above/below */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(49,10,101,0.12) 40%, rgba(49,10,101,0.12) 60%, transparent)" }}
          />
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-800/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-800/40 to-transparent" />

          {/* Label */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full border border-white/[0.06] bg-white/[0.02]">
              <div className="w-1 h-1 rounded-full bg-purple-500/60" />
              <span className="text-[8px] tracking-[0.5em] text-white/25 uppercase font-semibold">Foundation — The Word</span>
              <div className="w-1 h-1 rounded-full bg-purple-500/60" />
            </div>
          </div>

          {/* Marquee */}
          <div className="flex whitespace-nowrap overflow-hidden">
            <div ref={marqueeRef} className="flex gap-16 items-center px-8">
              {[...scriptures, ...scriptures].map((text, i) => (
                <span key={i} className="text-[9px] font-semibold tracking-[0.32em] text-white/30 uppercase">
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* FOOTER                                                            */}
        {/* ================================================================ */}
        <footer className="py-20 text-center text-white/50 text-[9px] tracking-[0.4em] uppercase relative z-10 bg-black">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/80 shadow-[0_0_20px_rgba(255,255,255,1)] animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </div>
          <p className="opacity-90 font-bold">© {new Date().getFullYear()} Prominence. All operational rights reserved.</p>
          <p className="mt-4 opacity-50">Olongapo City, 2200</p>
        </footer>
      </main>
    </>
  );
}