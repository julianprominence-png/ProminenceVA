"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion, useScroll, useTransform, AnimatePresence,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight, ArrowUpRight, Menu, X, Star,
  Heart, Globe, Share2, Mail, Phone, MapPin,
  Sparkles, Layers, Palette, TrendingUp, Eye, Award,
} from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const EASE = [0.76, 0, 0.24, 1] as const;
const NAV  = ["home", "services", "works", "about", "contact"];

const SERVICES = [
  { n:"01", icon:<Palette size={20}/>,   title:"Brand Identity",   desc:"We sculpt identities so distinct, your audience doesn't just recognize you — they remember you forever.",              img:"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=90" },
  { n:"02", icon:<Layers size={20}/>,    title:"Print Design",      desc:"Luxury in every fiber. Print materials so refined, people keep, frame, and refuse to throw them away.",              img:"https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500&q=90" },
  { n:"03", icon:<Eye size={20}/>,       title:"Visual Strategy",   desc:"Purpose behind every pixel. We don't create pretty — we create powerful, intentional, and undeniable.",             img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=90" },
  { n:"04", icon:<TrendingUp size={20}/>,title:"Marketing Design",  desc:"Campaigns that don't beg for attention. They command it — and convert the curious into devoted advocates.",         img:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=90" },
  { n:"05", icon:<Sparkles size={20}/>,  title:"Social Media",      desc:"Visuals so magnetic, stopping the scroll isn't just possible — it's inevitable.",                                  img:"https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=90" },
  { n:"06", icon:<Award size={20}/>,     title:"Packaging Design",  desc:"The unboxing is the brand experience. We design packaging that makes the moment feel like a luxury ritual.",        img:"https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=500&q=90" },
];

const WORKS = [
  { title:"Maison Velour",   cat:"Brand Identity",  year:"2024", img:"https://images.unsplash.com/photo-1634942537034-2531766767d1?w=700&q=90" },
  { title:"Terroir Label",   cat:"Packaging",       year:"2024", img:"https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=700&q=90" },
  { title:"Atelier & Co.",   cat:"Print Design",    year:"2023", img:"https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=700&q=90" },
  { title:"Luxe Collective", cat:"Visual Strategy", year:"2023", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=90" },
  { title:"Bloom & Noir",    cat:"Social Media",    year:"2024", img:"https://images.unsplash.com/photo-1558655146-d09347e92766?w=700&q=90" },
  { title:"Nomad Bureau",    cat:"Marketing",       year:"2023", img:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&q=90" },
];

const TESTIMONIALS = [
  { name:"Sarah Chen",    role:"CEO, Maison Velour",           result:"340% increase in brand recall",  img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=90", text:"They didn't just redesign our brand — they redefined how the world sees us. The single best investment we have ever made." },
  { name:"Marcus Rivera", role:"Founder, Terroir Label",       result:"2× revenue in 6 months",         img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=90", text:"I've worked with agencies across three continents. None saw our vision the way Prominence did. The result was nothing short of perfect." },
  { name:"Amara Osei",    role:"Creative Director, Luxe Co.",  result:"Awarded Best Rebrand 2024",      img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=90", text:"Their strategic instinct is razor-sharp. Every visual decision was backed by intent and beauty in equal measure. A brand that cannot be ignored." },
];

const STATS   = [{n:150,s:"+",l:"Projects Delivered"},{n:80,s:"+",l:"Brands Elevated"},{n:5,s:"+",l:"Years of Mastery"},{n:12,s:"",l:"Awards Won"}];
const MARQUEE = ["Brand Identity","·","Print Design","·","Packaging","·","Social Media","·","Visual Strategy","·","Marketing","·","Photography","·","Typography"];

// ─── COFFEE CURSOR ────────────────────────────────────────────────────────────

function CoffeeCursor() {
  const cupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cx = -200, cy = -200, tx = -200, ty = -200;
    let raf = 0, lastSmoke = 0;

    const smoke = (x: number, y: number) => {
      const now = Date.now();
      if (now - lastSmoke < 55) return;
      lastSmoke = now;
      for (let i = 0; i < 3; i++) {
        const p = document.createElement("div");
        const sz  = 4 + Math.random() * 5;
        const ox  = (Math.random() - 0.5) * 14;
        p.style.cssText = `position:fixed;left:${x + ox}px;top:${y - 32}px;width:${sz}px;height:${sz}px;border-radius:50%;background:rgba(200,149,108,0.5);pointer-events:none;z-index:9997;filter:blur(2.5px);transform:translate(-50%,-50%);will-change:transform,opacity;`;
        document.body.appendChild(p);
        gsap.to(p, {
          y: -(28 + Math.random() * 22),
          x: (Math.random() - 0.5) * 16,
          opacity: 0, scale: 1.6 + Math.random() * 0.7,
          duration: 0.7 + Math.random() * 0.45, ease: "power1.out",
          onComplete: () => p.parentNode?.removeChild(p),
        });
      }
    };

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; smoke(e.clientX, e.clientY); };

    const tick = () => {
      cx += (tx - cx) * 0.11;
      cy += (ty - cy) * 0.11;
      if (cupRef.current) cupRef.current.style.transform = `translate(${cx - 16}px,${cy - 36}px)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={cupRef} className="fixed top-0 left-0 pointer-events-none z-[9999]" style={{ willChange:"transform" }}>
      <svg width="32" height="36" viewBox="0 0 32 36" fill="none">
        <ellipse cx="16" cy="33" rx="13" ry="2.5" fill="#8B5E3C" opacity="0.45"/>
        <path d="M5 12 Q4 31 16 31 Q28 31 27 12 Z" fill="#C8956C"/>
        <path d="M5 12 Q4 31 9 31 Q7 24 8 12 Z" fill="#B8845C" opacity="0.35"/>
        <rect x="4" y="9" width="24" height="4" rx="2" fill="#A0714A"/>
        <path d="M27 15 C35 15 35 26 27 26" stroke="#A0714A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="16" cy="11" rx="10" ry="2" fill="#5C3317"/>
        <ellipse cx="13" cy="10.5" rx="4" ry="1" fill="#8B5E3C" opacity="0.45"/>
      </svg>
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

// Text reveal (clip-path slide up — Lusion style)
const TR = ({ children, delay = 0, cls = "" }: { children: React.ReactNode; delay?: number; cls?: string }) => (
  <div style={{ overflow:"hidden" }}>
    <motion.div className={cls} initial={{ y:"112%" }} whileInView={{ y:"0%" }} viewport={{ once:true, margin:"-60px" }} transition={{ duration:1, ease:EASE, delay }}>
      {children}
    </motion.div>
  </div>
);

// Section label
const Label = ({ children, center = false }: { children: string; center?: boolean }) => (
  <motion.div
    initial={{ opacity:0, x: center ? 0 : -16 }} whileInView={{ opacity:1, x:0 }}
    viewport={{ once:true }} transition={{ duration:0.7, ease:EASE }}
    className={`flex items-center gap-3 mb-5 ${center ? "justify-center" : ""}`}
  >
    <div style={{ width:20, height:1, background:"#C8956C" }} />
    <span style={{ color:"#C8956C", fontSize:9, letterSpacing:"0.45em" }} className="uppercase">{children}</span>
    {center && <div style={{ width:20, height:1, background:"#C8956C" }} />}
  </motion.div>
);

// Animated counter
const Counter = ({ n, s }: { n:number; s:string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el, start:"top 88%", once:true,
      onEnter: () => gsap.to(obj, { val:n, duration:2, ease:"power2.out", onUpdate:() => { if (el) el.textContent = Math.round(obj.val) + s; } }),
    });
  }, [n, s]);
  return <span ref={ref}>0{s}</span>;
};

// Magnetic button
const MagBtn = ({ children, onClick, gold = true, className = "" }: { children:React.ReactNode; onClick?:()=>void; gold?:boolean; className?:string }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const move = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    gsap.to(ref.current, { x:(e.clientX-r.left-r.width/2)*0.26, y:(e.clientY-r.top-r.height/2)*0.26, duration:0.3, ease:"power2.out" });
  };
  const leave = () => gsap.to(ref.current, { x:0, y:0, duration:0.8, ease:"elastic.out(1,0.5)" });
  return (
    <button ref={ref} onClick={onClick} onMouseMove={move} onMouseLeave={leave} className={className}
      style={gold ? { background:"#C8956C", color:"#0C0401" } : { border:"1px solid #C8956C", color:"#C8956C", background:"transparent" }}>
      {children}
    </button>
  );
};

// Work card with image parallax
const WorkCard = ({ w, idx }: { w: typeof WORKS[0]; idx:number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLDivElement>(null);
  const move  = (e: React.MouseEvent) => { const r = cardRef.current!.getBoundingClientRect(); gsap.to(imgRef.current, { x:((e.clientX-r.left)/r.width-0.5)*16, y:((e.clientY-r.top)/r.height-0.5)*16, duration:0.5, ease:"power2.out" }); };
  const leave = () => gsap.to(imgRef.current, { x:0, y:0, duration:0.9, ease:"power3.out" });
  return (
    <motion.div ref={cardRef} className="work-item group relative overflow-hidden"
      style={{ aspectRatio: idx % 3 === 0 ? "3/4" : "4/5" }}
      onMouseMove={move} onMouseLeave={leave}
      initial={{ opacity:0, y:65 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:"-80px" }}
      transition={{ duration:0.9, ease:EASE, delay:(idx%3)*0.12 }}
    >
      <div ref={imgRef} className="absolute" style={{ inset:"-8%", width:"116%", height:"116%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={w.img} alt={w.title} className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0" style={{ background:"linear-gradient(to top,#0C0401f0 0%,#0C040122 45%,transparent 100%)" }} />

      <div className="absolute top-5 right-5 px-3 py-1 text-[8px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background:"#C8956C", color:"#0C0401" }}>{w.year}</div>

      <div className="absolute bottom-0 left-0 right-0 p-7 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
        <p className="text-[8px] tracking-[0.4em] uppercase mb-2" style={{ color:"#C8956C88" }}>{w.cat}</p>
        <div className="flex items-end justify-between">
          <h3 className="serif text-2xl italic font-light" style={{ color:"#F5EDD8" }}>{w.title}</h3>
          <ArrowUpRight size={18} color="#C8956C" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75" />
        </div>
      </div>
      <div className="absolute top-5 left-5 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderTop:"1px solid #C8956C", borderLeft:"1px solid #C8956C" }} />
      <div className="absolute bottom-5 right-5 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderBottom:"1px solid #C8956C", borderRight:"1px solid #C8956C" }} />
    </motion.div>
  );
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [ready,    setReady]    = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroY       = useTransform(scrollYProgress, [0, 0.4],  [0, -160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);

  // Intro reveal
  useEffect(() => { const t = setTimeout(() => setReady(true), 1700); return () => clearTimeout(t); }, []);

  // GSAP — hero + global effects
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      // Hero
      gsap.from(".hl", { y:"115%", opacity:0, duration:1.2, ease:"power4.out", stagger:0.1, delay:0.15 });
      gsap.from([".hb",".hs",".hc"], { y:28, opacity:0, duration:1, ease:"power3.out", stagger:0.16, delay:0.35 });
      gsap.from(".fi-1", { x:180, opacity:0, duration:1.4, ease:"power3.out", delay:0.5 });
      gsap.from(".fi-2", { x:110, y:70,  opacity:0, duration:1.4, ease:"power3.out", delay:0.7 });
      gsap.from(".fi-3", { x:70,  y:-45, opacity:0, duration:1.4, ease:"power3.out", delay:0.9 });

      // Float loops
      gsap.to(".fi-1", { y:-22, duration:3.4, ease:"sine.inOut", yoyo:true, repeat:-1 });
      gsap.to(".fi-2", { y: 16, duration:3.9, ease:"sine.inOut", yoyo:true, repeat:-1, delay:0.4 });
      gsap.to(".fi-3", { y:-12, duration:3.1, ease:"sine.inOut", yoyo:true, repeat:-1, delay:0.9 });
      gsap.to(".fi-1", { rotation:1.5, duration:6, ease:"sine.inOut", yoyo:true, repeat:-1 });

      // Service cards
      gsap.from(".svc-card", { scrollTrigger:{ trigger:".svc-grid", start:"top 82%" }, y:70, opacity:0, duration:0.85, stagger:0.1, ease:"power3.out" });

      // About images
      gsap.from(".aimg", { scrollTrigger:{ trigger:".aimgs", start:"top 80%" }, scale:0.9, opacity:0, duration:1, stagger:0.2, ease:"power3.out" });
      gsap.from(".aline", { scrollTrigger:{ trigger:".aline", start:"top 82%" }, scaleX:0, transformOrigin:"left", duration:1.4, ease:"power3.out" });

      // Parallax images
      gsap.utils.toArray<HTMLElement>(".par").forEach(el => {
        gsap.to(el, { scrollTrigger:{ trigger:el, start:"top bottom", end:"bottom top", scrub:2 }, y:-80, ease:"none" });
      });

      // Stats
      gsap.from(".stt", { scrollTrigger:{ trigger:".strow", start:"top 86%" }, y:40, opacity:0, duration:0.7, stagger:0.1, ease:"power3.out" });
    });
    return () => ctx.revert();
  }, [ready]);

  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setMenuOpen(false); };

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <main style={{ background:"#0C0401", color:"#F5EDD8", cursor:"none" }} className="overflow-x-hidden">

      {/* ── STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Inter',sans-serif;cursor:none;}
        .serif{font-family:'Cormorant Garamond',serif;}
        ::selection{background:#C8956C22;}
        ::-webkit-scrollbar{width:2px;}
        ::-webkit-scrollbar-track{background:#0C0401;}
        ::-webkit-scrollbar-thumb{background:#7B4A2D;}
        @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .mqrun{animation:mq 32s linear infinite;width:max-content;}
        .mqrun:hover{animation-play-state:paused;}
        input::placeholder,textarea::placeholder{color:#F5EDD81A;}
        .nav-link{position:relative;}
        .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:#C8956C;transition:width 0.4s cubic-bezier(0.76,0,0.24,1);}
        .nav-link:hover::after{width:100%;}
        .svc-card:hover .svc-bot{width:100%;}
        .svc-bot{position:absolute;bottom:0;left:0;height:1px;width:0;background:linear-gradient(to right,#C8956C,transparent);transition:width 0.7s cubic-bezier(0.76,0,0.24,1);}
        @media(prefers-reduced-motion:reduce){.mqrun{animation:none;}}
      `}</style>

      <CoffeeCursor />

      {/* ── NOISE GRAIN ── */}
      <div className="fixed inset-0 pointer-events-none z-[70]" style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, opacity:0.02 }} />

      {/* ── SCROLL BAR ── */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] z-[60]" style={{ scaleX:scrollYProgress, transformOrigin:"left", background:"#C8956C" }} />

      {/* ── INTRO CURTAIN ── */}
      <AnimatePresence>
        {!ready && (
          <>
            <motion.div className="fixed inset-x-0 top-0 z-[100] flex items-end justify-center pb-6" style={{ background:"#0C0401", height:"50vh" }} exit={{ y:"-100%", transition:{ duration:0.9, ease:EASE, delay:0.35 } }}>
              <motion.span initial={{ opacity:0, letterSpacing:"0.3em" }} animate={{ opacity:1, letterSpacing:"0.55em" }} transition={{ duration:0.9 }} style={{ color:"#C8956C", fontSize:9 }} className="uppercase tracking-widest">Prominence Graphics</motion.span>
            </motion.div>
            <motion.div className="fixed inset-x-0 bottom-0 z-[100]" style={{ background:"#0C0401", height:"50vh" }} exit={{ y:"100%", transition:{ duration:0.9, ease:EASE, delay:0.35 } }} />
          </>
        )}
      </AnimatePresence>

      {/* ══ NAV ══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-14">
        <motion.div
          initial={{ opacity:0, y:-20 }}
          animate={{ opacity:ready?1:0, y:ready?0:-20 }}
          transition={{ duration:0.9, ease:EASE }}
          className="flex items-center justify-between py-5"
          style={{ borderBottom:"1px solid #C8956C0C" }}
        >
          <div onClick={() => go("home")} style={{ cursor:"none" }} className="text-[11px] font-black tracking-[0.3em] uppercase select-none">
            <span style={{ color:"#C8956C" }}>PROMINENCE</span>
            <span style={{ color:"#F5EDD833" }}> GRAPHICS</span>
          </div>

          <ul className="hidden md:flex gap-10 text-[10px] tracking-[0.25em] uppercase">
            {NAV.map(item => (
              <li key={item}>
                <button onClick={() => go(item)} style={{ color:"#F5EDD844" }} className="nav-link capitalize hover:text-[#C8956C] transition-colors duration-300">{item}</button>
              </li>
            ))}
          </ul>

          <MagBtn onClick={() => go("contact")} className="hidden md:block px-7 py-2.5 text-[10px] font-black tracking-[0.25em] uppercase hover:bg-[#F5EDD8] transition-colors duration-300">
            Start a Project
          </MagBtn>

          <button style={{ color:"#F5EDD8" }} className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </motion.div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath:"circle(0% at 95% 4%)" }}
            animate={{ clipPath:"circle(150% at 95% 4%)" }}
            exit={{ clipPath:"circle(0% at 95% 4%)" }}
            transition={{ duration:0.6, ease:EASE }}
            style={{ background:"#0C0401" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10"
          >
            {NAV.map((item,i) => (
              <motion.button key={item} onClick={() => go(item)}
                initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07+0.2, ease:EASE }}
                style={{ color:"#F5EDD8" }}
                className="serif text-5xl italic hover:text-[#C8956C] transition-colors capitalize"
              >
                {item}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ HERO ══ */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse 100% 90% at 65% 30%,#3D1A0B20,transparent 70%),#0C0401" }} />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[180px] pointer-events-none" style={{ background:"#7B4A2D16" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"linear-gradient(#C8956C04 1px,transparent 1px),linear-gradient(90deg,#C8956C04 1px,transparent 1px)", backgroundSize:"80px 80px" }} />

        <motion.div style={{ y:heroY, opacity:heroOpacity }} className="relative z-10 w-full px-6 md:px-14 lg:px-24 pt-36 pb-24">
          <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-0">

            {/* LEFT */}
            <div className="flex-1 max-w-2xl">
              <div className="hb flex items-center gap-3 mb-9">
                <div style={{ width:18, height:1, background:"#C8956C" }} />
                <span style={{ color:"#C8956C", fontSize:9, letterSpacing:"0.48em" }} className="uppercase">Award-Winning Creative Studio</span>
              </div>

              <h1 className="font-black leading-[0.92] mb-9 tracking-tight" style={{ fontSize:"clamp(3rem,9vw,7rem)" }}>
                {[
                  { t:"We Don't",      serif:false, gold:false },
                  { t:"Design.",       serif:false, gold:true  },
                  { t:"We Architect",  serif:false, gold:false },
                  { t:"Desire.",       serif:true,  gold:true  },
                ].map(({t,serif,gold},i) => (
                  <div key={i} style={{ overflow:"hidden" }}>
                    <div className={`hl inline-block ${serif?"serif italic":""}`} style={{ color:gold?"#C8956C":"#F5EDD8" }}>{t}</div>
                  </div>
                ))}
              </h1>

              <p className="hs text-sm md:text-[15px] leading-[1.95] mb-10 max-w-sm font-light" style={{ color:"#F5EDD855" }}>
                Prominence Graphics is for brands that refuse to be average.
                We create visual identities so compelling, your audience
                can&apos;t look away — and never forgets you.
              </p>

              <div className="hc flex flex-wrap items-center gap-5">
                <MagBtn onClick={() => go("works")} className="group flex items-center gap-3 px-10 py-4 text-[10px] font-black tracking-[0.28em] uppercase hover:bg-[#F5EDD8] transition-colors duration-300">
                  Explore Our Work <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300"/>
                </MagBtn>
                <motion.button whileHover={{ x:6 }} onClick={() => go("contact")} style={{ color:"#F5EDD844" }} className="group flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase hover:text-[#C8956C] transition-colors duration-300">
                  Start a Conversation <ArrowUpRight size={11} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300"/>
                </motion.button>
              </div>

              {/* Social proof */}
              <div className="hc flex items-center gap-6 mt-10 pt-9" style={{ borderTop:"1px solid #C8956C10" }}>
                <div className="flex -space-x-2">
                  {["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80","https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&q=80"].map((src,i) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img key={i} src={src} alt="client" className="w-8 h-8 rounded-full object-cover" style={{ border:"2px solid #0C0401" }}/>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-1">{[...Array(5)].map((_,i) => <Star key={i} size={9} fill="#C8956C" color="#C8956C"/>)}</div>
                  <p style={{ fontSize:10, color:"#F5EDD844" }}>Trusted by <span style={{ color:"#C8956C" }}>80+ premium brands</span></p>
                </div>
              </div>
            </div>

            {/* RIGHT — floating image stack */}
            <div className="flex-1 relative h-[520px] w-full hidden lg:block">
              <div className="fi-1 absolute top-0 right-0 w-[290px] h-[350px] overflow-hidden shadow-2xl" style={{ border:"1px solid #C8956C14" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=90" alt="Brand" className="w-full h-full object-cover scale-105"/>
                <div className="absolute inset-0" style={{ background:"linear-gradient(to top,#0C0401cc,transparent 55%)" }}/>
              </div>
              <div className="fi-2 absolute top-28 right-56 w-[200px] h-[250px] overflow-hidden shadow-2xl z-10" style={{ border:"1px solid #C8956C20" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&q=90" alt="Print" className="w-full h-full object-cover scale-105"/>
              </div>
              <div className="fi-3 absolute bottom-8 right-20 w-[165px] h-[205px] overflow-hidden shadow-2xl z-20" style={{ border:"1px solid #7B4A2D2A" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=600&q=90" alt="Packaging" className="w-full h-full object-cover scale-105"/>
              </div>

              {/* Rating badge */}
              <motion.div
                initial={{ opacity:0, scale:0.5, y:20 }}
                animate={{ opacity:ready?1:0, scale:ready?1:0.5, y:ready?0:20 }}
                transition={{ duration:0.7, delay:1.9, type:"spring" }}
                className="absolute bottom-28 left-0 z-30 px-5 py-4"
                style={{ background:"#1A0905", border:"1px solid #C8956C28" }}
              >
                <div className="flex gap-0.5 mb-2">{[...Array(5)].map((_,i) => <Star key={i} size={9} fill="#C8956C" color="#C8956C"/>)}</div>
                <p className="font-black text-2xl leading-none" style={{ color:"#C8956C" }}>4.9<span className="text-sm font-light ml-1" style={{ color:"#F5EDD422" }}>/5</span></p>
                <p style={{ fontSize:9, color:"#F5EDD433", letterSpacing:"0.22em" }} className="mt-1 uppercase">Client Rating</p>
              </motion.div>

              <div className="serif absolute -bottom-4 right-0 text-[160px] font-bold leading-none select-none pointer-events-none" style={{ color:"#C8956C06" }}>PG</div>
            </div>
          </div>

          {/* Scroll cue */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:ready?1:0 }} transition={{ delay:3 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color:"#C8956C2A" }}>
            <span style={{ fontSize:8, letterSpacing:"0.5em" }} className="uppercase">Scroll</span>
            <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2, repeat:Infinity }}>
              <span style={{ fontSize:14 }}>↓</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className="overflow-hidden py-4" style={{ borderTop:"1px solid #C8956C0A", borderBottom:"1px solid #C8956C0A" }}>
        <div className="mqrun flex gap-10">
          {[...MARQUEE,...MARQUEE,...MARQUEE].map((item,i) => (
            <span key={i} style={{ color:item==="·"?"#C8956C":"#F5EDD81A", fontSize:9, letterSpacing:"0.35em" }} className="uppercase whitespace-nowrap">{item}</span>
          ))}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <section className="py-24 px-6 md:px-14 lg:px-24" style={{ borderBottom:"1px solid #C8956C08" }}>
        <div className="strow grid grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {STATS.map((s,i) => (
            <div key={i} className="stt text-center group">
              <div className="serif font-light mb-3 leading-none" style={{ fontSize:"clamp(3rem,7vw,5rem)", color:"#C8956C" }}>
                <Counter n={s.n} s={s.s}/>
              </div>
              <div className="w-5 h-px mx-auto mb-3 group-hover:w-10 transition-all duration-500" style={{ background:"#C8956C44" }}/>
              <div style={{ fontSize:9, color:"#F5EDD833", letterSpacing:"0.35em" }} className="uppercase">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section id="services" className="py-28 px-6 md:px-14 lg:px-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[200px] pointer-events-none" style={{ background:"#7B4A2D0C" }}/>

        <div className="mb-20">
          <Label>What We Do</Label>
          <h2 className="text-4xl md:text-6xl font-black leading-tight" style={{ color:"#F5EDD8" }}>
            <TR>Services Built for</TR>
            <TR delay={0.08}><span className="serif italic" style={{ color:"#C8956C" }}>the Extraordinary.</span></TR>
          </h2>
        </div>

        <div className="svc-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ border:"1px solid #C8956C08", borderRight:"none", borderBottom:"none" }}>
          {SERVICES.map((s,i) => (
            <motion.div key={i} className="svc-card group relative overflow-hidden p-9" style={{ background:"#0C0401", borderRight:"1px solid #C8956C08", borderBottom:"1px solid #C8956C08" }} whileHover={{ backgroundColor:"#110705" }} transition={{ duration:0.3 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.1] transition-opacity duration-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt={s.title} className="w-full h-full object-cover"/>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background:"linear-gradient(135deg,transparent,#0C0401dd)" }}/>

              <div className="relative z-10">
                <div className="serif text-6xl font-light leading-none mb-7" style={{ color:"#C8956C08" }}>{s.n}</div>
                <div className="flex items-center gap-3 mb-5">
                  <div style={{ color:"#C8956C" }}>{s.icon}</div>
                  <h3 className="text-base font-bold" style={{ color:"#F5EDD8" }}>{s.title}</h3>
                </div>
                <p className="text-xs leading-[1.95] mb-7 font-light" style={{ color:"#F5EDD844" }}>{s.desc}</p>
                <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400" style={{ color:"#C8956C" }}>
                  Explore <ArrowRight size={10}/>
                </div>
              </div>
              <div className="svc-bot"/>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ PHILOSOPHY DIVIDER ══ */}
      <div className="relative h-[260px] overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3">
          {["https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&q=90","https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=90","https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=90"].map((src,i) => (
            <div key={i} className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="par w-full h-full object-cover scale-110"/>
              <div className="absolute inset-0" style={{ background:"#0C040188" }}/>
            </div>
          ))}
        </div>
        <div className="absolute inset-0" style={{ background:"linear-gradient(to right,#0C0401,transparent 28%,transparent 72%,#0C0401),linear-gradient(to bottom,#0C0401,transparent 24%,transparent 76%,#0C0401)" }}/>
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <TR><p className="serif text-2xl md:text-4xl italic font-light text-center" style={{ color:"#F5EDD8EE" }}>&ldquo;Great design is not seen &mdash; it is <em style={{ color:"#C8956C" }}>felt.</em>&rdquo;</p></TR>
        </div>
      </div>

      {/* ══ WORKS ══ */}
      <section id="works" className="py-28 px-6 md:px-14 lg:px-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <Label>Selected Works</Label>
            <h2 className="text-4xl md:text-6xl font-black leading-tight" style={{ color:"#F5EDD8" }}>
              <TR>Proof That Beauty</TR>
              <TR delay={0.08}><span className="serif italic" style={{ color:"#C8956C" }}>Converts.</span></TR>
            </h2>
          </div>
          <MagBtn gold={false} onClick={() => go("contact")} className="group hidden md:flex items-center gap-2 px-7 py-3 text-[9px] tracking-[0.3em] uppercase hover:bg-[#C8956C] hover:text-[#0C0401] transition-all duration-300">
            Full Portfolio <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform"/>
          </MagBtn>
        </div>
        <div className="works-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {WORKS.map((w,i) => <WorkCard key={i} w={w} idx={i}/>)}
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="py-28 px-6 md:px-14 lg:px-24 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[200px] pointer-events-none" style={{ background:"#C8956C06" }}/>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Images */}
          <div className="aimgs relative h-[520px]">
            <div className="aimg absolute top-0 left-0 overflow-hidden shadow-2xl" style={{ width:235, height:300, border:"1px solid #C8956C14" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=90" alt="Studio" className="w-full h-full object-cover"/>
            </div>
            <div className="aimg absolute top-16 left-44 w-52 h-64 overflow-hidden shadow-2xl z-10" style={{ border:"1px solid #C8956C20" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=90" alt="Team" className="w-full h-full object-cover"/>
            </div>
            <div className="aimg absolute bottom-4 left-4 w-40 h-40 overflow-hidden shadow-2xl z-20" style={{ border:"1px solid #7B4A2D2A" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&q=90" alt="Design" className="w-full h-full object-cover"/>
            </div>
            <motion.div initial={{ opacity:0, scale:0.7 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ duration:0.7, type:"spring" }} className="absolute bottom-4 right-10 z-30 px-7 py-5" style={{ background:"#C8956C", color:"#0C0401" }}>
              <p className="serif text-5xl font-light leading-none">5<span className="text-2xl">+</span></p>
              <p className="font-bold uppercase mt-1" style={{ fontSize:9, letterSpacing:"0.25em" }}>Years of Mastery</p>
            </motion.div>
            <div className="aline absolute bottom-0 left-0 right-0 h-px" style={{ background:"linear-gradient(to right,#C8956C33,transparent)" }}/>
            <div className="serif absolute -bottom-6 right-0 text-[150px] font-bold leading-none select-none pointer-events-none" style={{ color:"#C8956C05" }}>PG</div>
          </div>

          {/* Text */}
          <div>
            <Label>Who We Are</Label>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight" style={{ color:"#F5EDD8" }}>
              <TR>Not an Agency.</TR>
              <TR delay={0.08}><span className="serif italic" style={{ color:"#C8956C" }}>Your Brand&apos;s Secret Weapon.</span></TR>
            </h2>

            <motion.p initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.8, delay:0.2, ease:EASE }} className="text-sm leading-[2] mb-5 font-light" style={{ color:"#F5EDD855" }}>
              Prominence Graphics isn&apos;t for everyone &mdash; and we&apos;re proud of that.
              We exist for founders who understand that the right design commands respect,
              signals quality, and opens doors that cold calls never will.
            </motion.p>
            <motion.p initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.8, delay:0.3, ease:EASE }} className="text-sm leading-[2] mb-10 font-light" style={{ color:"#F5EDD855" }}>
              No assembly lines. No templates. No compromise.
              Just deliberate, strategic design crafted to make your brand unforgettable.
            </motion.p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-7 mb-12">
              {[
                { n:"01", t:"Uncompromising Quality", d:"We don't ship until it's exceptional." },
                { n:"02", t:"Strategic Precision",     d:"Every choice is intentional." },
                { n:"03", t:"True Collaboration",      d:"Your vision, amplified by our expertise." },
                { n:"04", t:"Timeless Aesthetic",      d:"Trends fade. We design for longevity." },
              ].map((item,i) => (
                <motion.div key={i} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1+0.3, ease:EASE }}>
                  <p className="serif text-3xl font-light leading-none mb-1.5" style={{ color:"#C8956C0C" }}>{item.n}</p>
                  <h4 className="font-bold mb-1" style={{ fontSize:11, color:"#C8956C" }}>{item.t}</h4>
                  <p style={{ fontSize:11, color:"#F5EDD833", lineHeight:1.8 }}>{item.d}</p>
                </motion.div>
              ))}
            </div>

            <MagBtn gold={false} onClick={() => go("contact")} className="group flex items-center gap-3 px-10 py-4 text-[10px] font-black tracking-[0.28em] uppercase hover:bg-[#C8956C] hover:text-[#0C0401] transition-all duration-300">
              Partner With Us <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform"/>
            </MagBtn>
          </div>
        </div>
      </section>

      {/* ══ QUOTE DIVIDER ══ */}
      <div className="relative h-52 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2000&q=90" alt="" className="par w-full h-full object-cover scale-110"/>
        <div className="absolute inset-0" style={{ background:"linear-gradient(to right,#0C0401,#0C040177 35%,#0C040177 65%,#0C0401),linear-gradient(to bottom,#0C0401,transparent 22%,transparent 78%,#0C0401)" }}/>
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <p className="serif text-xl md:text-3xl font-light italic text-center" style={{ color:"#F5EDD8CC" }}>
            &ldquo;A brand is the promise you make.<br/>
            <em style={{ color:"#C8956C" }}>Great design is the promise kept.&rdquo;</em>
          </p>
        </div>
      </div>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-28 px-6 md:px-14 lg:px-24" style={{ background:"#090301" }}>
        <div className="text-center mb-20">
          <Label center>Client Love</Label>
          <h2 className="text-4xl md:text-6xl font-black" style={{ color:"#F5EDD8" }}>
            <TR>Words From Those</TR>
            <TR delay={0.08}><span className="serif italic" style={{ color:"#C8956C" }}>Who Know Best.</span></TR>
          </h2>
        </div>

        <div className="testi-grid grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background:"#C8956C08" }}>
          {TESTIMONIALS.map((t,i) => (
            <motion.div key={i} className="relative p-10" style={{ background:"#090301" }}
              initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.8, ease:EASE, delay:i*0.14 }}
              whileHover={{ y:-4, transition:{ duration:0.3 } }}
            >
              <div className="serif text-[100px] leading-none select-none absolute top-3 right-5" style={{ color:"#C8956C06" }}>&ldquo;</div>
              <div className="flex gap-0.5 mb-7">{[...Array(5)].map((_,j) => <Star key={j} size={10} fill="#C8956C" color="#C8956C"/>)}</div>
              <p className="text-sm leading-[2] mb-7 font-light relative z-10" style={{ color:"#F5EDD877" }}>&ldquo;{t.text}&rdquo;</p>
              <div className="inline-block px-3 py-1.5 mb-8 uppercase" style={{ background:"#C8956C10", border:"1px solid #C8956C22", color:"#C8956C", fontSize:8, letterSpacing:"0.3em" }}>{t.result}</div>
              <div className="flex items-center gap-4 pt-6" style={{ borderTop:"1px solid #C8956C0C" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" style={{ border:"1.5px solid #C8956C33" }}/>
                <div>
                  <p className="text-sm font-semibold" style={{ color:"#F5EDD8" }}>{t.name}</p>
                  <p style={{ fontSize:10, color:"#C8956C55", marginTop:2 }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="py-28 px-6 md:px-14 lg:px-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse 80% 80% at 50% 50%,#3D1A0B0E,transparent),#0C0401" }}/>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"linear-gradient(#C8956C03 1px,transparent 1px),linear-gradient(90deg,#C8956C03 1px,transparent 1px)", backgroundSize:"80px 80px" }}/>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <Label center>Let&apos;s Collaborate</Label>
            <h2 className="serif text-5xl md:text-7xl font-light italic mb-6 leading-tight" style={{ color:"#F5EDD8" }}>
              <TR>Your Brand Deserves</TR>
              <TR delay={0.08}><span style={{ color:"#C8956C" }}>to Be Extraordinary.</span></TR>
            </h2>
            <motion.p initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.8, delay:0.3, ease:EASE }} className="text-sm leading-[2] max-w-sm mx-auto font-light" style={{ color:"#F5EDD844" }}>
              Reach out &mdash; we respond to every serious inquiry within 24 hours.
            </motion.p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["Your Name","Your Email"].map(ph => (
                <div key={ph} className="relative">
                  <label style={{ position:"absolute", left:20, top:12, fontSize:8, letterSpacing:"0.3em", color:"#C8956C44" }} className="uppercase pointer-events-none">{ph}</label>
                  <input type="text" className="w-full pt-8 pb-4 px-5 text-sm focus:outline-none bg-transparent" style={{ border:"1px solid #C8956C12", color:"#F5EDD8", transition:"border-color 0.3s" }}
                    onFocus={e => { e.target.style.borderColor="#C8956C44"; }} onBlur={e => { e.target.style.borderColor="#C8956C12"; }}/>
                </div>
              ))}
            </div>
            <div className="relative">
              <label style={{ position:"absolute", left:20, top:12, fontSize:8, letterSpacing:"0.3em", color:"#C8956C44" }} className="uppercase pointer-events-none">Project Type</label>
              <input type="text" className="w-full pt-8 pb-4 px-5 text-sm focus:outline-none bg-transparent" style={{ border:"1px solid #C8956C12", color:"#F5EDD8", transition:"border-color 0.3s" }}
                onFocus={e => { e.target.style.borderColor="#C8956C44"; }} onBlur={e => { e.target.style.borderColor="#C8956C12"; }}/>
            </div>
            <div className="relative">
              <label style={{ position:"absolute", left:20, top:12, fontSize:8, letterSpacing:"0.3em", color:"#C8956C44" }} className="uppercase pointer-events-none">Your Vision</label>
              <textarea rows={5} className="w-full pt-8 pb-4 px-5 text-sm focus:outline-none bg-transparent resize-none" style={{ border:"1px solid #C8956C12", color:"#F5EDD8", transition:"border-color 0.3s" }}
                onFocus={e => { e.target.style.borderColor="#C8956C44"; }} onBlur={e => { e.target.style.borderColor="#C8956C12"; }}/>
            </div>
          </div>

          <MagBtn className="w-full mt-3 py-5 text-[11px] font-black tracking-[0.35em] uppercase hover:bg-[#F5EDD8] transition-colors duration-300">
            Send My Inquiry
          </MagBtn>

          <div className="flex flex-wrap justify-center gap-10 mt-14">
            {[{ icon:<Mail size={12}/>, t:"hello@prominencegraphics.com" },{ icon:<Phone size={12}/>, t:"+1 (555) 000-0000" },{ icon:<MapPin size={12}/>, t:"New York, NY" }].map((item,i) => (
              <motion.span key={i} whileHover={{ y:-2 }} className="flex items-center gap-2 hover:text-[#C8956C] transition-colors duration-300" style={{ fontSize:10, letterSpacing:"0.2em", color:"#F5EDD822" }}>
                {item.icon} {item.t}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="px-6 md:px-14 lg:px-24 pt-16 pb-8" style={{ borderTop:"1px solid #C8956C0A", background:"#080200" }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">
          <div className="md:col-span-5">
            <div className="font-black tracking-[0.28em] uppercase mb-5 select-none" style={{ fontSize:11, cursor:"none" }} onClick={() => go("home")}>
              <span style={{ color:"#C8956C" }}>PROMINENCE</span><span style={{ color:"#F5EDD822" }}> GRAPHICS</span>
            </div>
            <p className="text-xs leading-[2] max-w-xs font-light" style={{ color:"#F5EDD822" }}>
              A boutique design studio for brands that refuse to be ordinary.
              We don&apos;t follow trends &mdash; we set the standard.
            </p>
            <div className="flex gap-5 mt-7">
              {[Heart,Globe,Share2].map((Icon,i) => (
                <motion.a key={i} href="#" whileHover={{ y:-3 }} style={{ color:"#F5EDD81A" }} className="hover:text-[#C8956C] transition-colors duration-300"><Icon size={15}/></motion.a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold uppercase mb-6" style={{ fontSize:9, color:"#F5EDD833", letterSpacing:"0.35em" }}>Services</h4>
            <ul className="space-y-3">
              {["Brand Identity","Print Design","Packaging","Social Media","Visual Strategy","Marketing"].map(s => (
                <li key={s}><span className="text-xs font-light hover:text-[#C8956C] transition-colors duration-300" style={{ color:"#F5EDD822" }}>{s}</span></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold uppercase mb-6" style={{ fontSize:9, color:"#F5EDD833", letterSpacing:"0.35em" }}>Studio</h4>
            <ul className="space-y-3">
              {["About","Our Work","Process","Contact"].map(s => (
                <li key={s}><span className="text-xs font-light hover:text-[#C8956C] transition-colors duration-300" style={{ color:"#F5EDD822" }}>{s}</span></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold uppercase mb-6" style={{ fontSize:9, color:"#F5EDD833", letterSpacing:"0.35em" }}>Contact</h4>
            <p className="text-xs leading-[2] font-light" style={{ color:"#F5EDD822" }}>
              hello@prominencegraphics.com<br/>+1 (555) 000-0000<br/>New York, NY
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop:"1px solid #C8956C08" }}>
          <p style={{ fontSize:9, color:"#F5EDD81A", letterSpacing:"0.2em" }}>&#169; 2024 Prominence Graphics. All rights reserved.</p>
          <p className="serif italic" style={{ fontSize:11, color:"#C8956C22" }}>Where vision meets excellence.</p>
        </div>
      </footer>
    </main>
  );
}