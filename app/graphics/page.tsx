"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  ArrowRight, ArrowUpRight, Menu, X, Star, ChevronDown,
  Heart, Globe, Share2, Mail, Phone, MapPin,
  Sparkles, Layers, Palette, TrendingUp, Eye, Award,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS = ["home", "services", "works", "about", "contact"];

const SERVICES = [
  {
    num: "01", icon: <Palette size={22} />, title: "Brand Identity",
    tagline: "Your brand, immortalized.",
    desc: "We sculpt identities so distinct, so deliberate, that your audience doesn't just recognize you — they remember you long after the moment has passed.",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=90",
  },
  {
    num: "02", icon: <Layers size={22} />, title: "Print Design",
    tagline: "Tangible luxury.",
    desc: "In a digital world, the physical still commands reverence. We craft print collateral that people hold onto, display proudly, and refuse to throw away.",
    img: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500&q=90",
  },
  {
    num: "03", icon: <Eye size={22} />, title: "Visual Strategy",
    tagline: "Intention before aesthetics.",
    desc: "Every color, every curve, every negative space — meticulously chosen with strategic purpose. We don't create pretty; we create powerful.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=90",
  },
  {
    num: "04", icon: <TrendingUp size={22} />, title: "Marketing Design",
    tagline: "Desire, engineered.",
    desc: "Marketing materials that don't beg for attention — they command it. Campaigns built to convert the merely curious into devoted, lifelong advocates.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=90",
  },
  {
    num: "05", icon: <Sparkles size={22} />, title: "Social Media",
    tagline: "Stop the scroll. Own the moment.",
    desc: "In the war for three seconds of attention, we arm your brand with visuals so arresting, so undeniably magnetic, that scrolling becomes impossible.",
    img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=90",
  },
  {
    num: "06", icon: <Award size={22} />, title: "Packaging Design",
    tagline: "The first touch is everything.",
    desc: "Packaging that doesn't just protect your product — it elevates it. Because the unboxing experience is the brand experience, and yours should be unforgettable.",
    img: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=500&q=90",
  },
];

const WORKS = [
  { title: "Maison Velour",   cat: "Brand Identity",  year:"2024", img: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=700&q=90" },
  { title: "Terroir Label",   cat: "Packaging",       year:"2024", img: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=700&q=90" },
  { title: "Atelier & Co.",   cat: "Print Design",    year:"2023", img: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=700&q=90" },
  { title: "Luxe Collective",  cat: "Visual Strategy", year:"2023", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=90" },
  { title: "Bloom & Noir",    cat: "Social Media",    year:"2024", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=700&q=90" },
  { title: "Nomad Bureau",    cat: "Marketing",       year:"2023", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&q=90" },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen", role: "CEO, Maison Velour",
    text: "They didn't just redesign our brand — they redefined how the world sees us. Working with Prominence was the single best investment we have ever made in our company's history.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=90",
    result: "340% increase in brand recall",
  },
  {
    name: "Marcus Rivera", role: "Founder, Terroir Label",
    text: "I've worked with agencies across three continents. None of them saw our vision the way Prominence did. They delivered something we didn't even know we needed — and it was perfect.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=90",
    result: "2× revenue within 6 months",
  },
  {
    name: "Amara Osei", role: "Creative Director, Luxe Collective",
    text: "Their strategic instinct is razor-sharp. Every single visual decision they made was backed by intent and beauty in equal measure. The result? A brand that truly cannot be ignored.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=90",
    result: "Awarded Best Rebrand 2024",
  },
];

const STATS = [
  { num: 150, suffix:"+", label: "Projects Delivered" },
  { num: 80,  suffix:"+", label: "Brands Elevated" },
  { num: 5,   suffix:"+", label: "Years of Mastery" },
  { num: 12,  suffix:"",  label: "Industry Awards" },
];

const MARQUEE_ITEMS = ["Brand Identity","·","Print Design","·","Packaging","·","Social Media","·","Visual Strategy","·","Marketing","·","Photography","·","Typography","·","Brand Identity","·","Print Design","·","Packaging","·","Social Media","·","Visual Strategy","·","Marketing"];

// ─── CURSOR ───────────────────────────────────────────────────────────────────

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    const over = (e: MouseEvent) => { if ((e.target as HTMLElement).closest("button,a,[data-cursor]")) setHovered(true); };
    const out  = ()               => setHovered(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout",  out);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); window.removeEventListener("mouseout", out); };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        style={{ x: springX, y: springY, translateX:"-50%", translateY:"-50%", background:"#C8956C" }}
        animate={{ scale: hovered ? 2.8 : 1, opacity: hovered ? 0.18 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999]"
      />
      <motion.div
        style={{ x: springX, y: springY, translateX:"-50%", translateY:"-50%", background:"#C8956C" }}
        animate={{ scale: hovered ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
      />
    </>
  );
}

// ─── COUNTER ──────────────────────────────────────────────────────────────────

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    ScrollTrigger.create({
      trigger: el, start: "top 85%", once: true,
      onEnter: () => gsap.to({ val: 0 }, {
        val: target, duration: 2, ease: "power2.out",
        onUpdate: function() { if (el) el.textContent = Math.round(this.targets()[0].val) + suffix; },
      }),
    });
  }, [target, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef  = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY       = useTransform(scrollYProgress, [0, 0.4], [0, -160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const progressW   = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Hero headline split ──
      const heroH = document.querySelectorAll(".hero-line");
      heroH.forEach((el, i) => {
        gsap.from(el, { y: "110%", opacity: 0, duration: 1.2, ease: "power4.out", delay: 0.6 + i * 0.12 });
      });
      gsap.from(".hero-badge",  { opacity:0, y:20, duration:0.8, delay:0.4 });
      gsap.from(".hero-sub",    { opacity:0, y:20, duration:0.9, delay:1.5 });
      gsap.from(".hero-cta",    { opacity:0, y:20, duration:0.9, delay:1.75 });
      gsap.from(".hero-scroll", { opacity:0,       duration:1.0, delay:2.5 });

      // ── Floating images ──
      gsap.from(".fi-1", { x:200, opacity:0, duration:1.4, ease:"power3.out", delay:1.0 });
      gsap.from(".fi-2", { x:120, y:80,  opacity:0, duration:1.4, ease:"power3.out", delay:1.2 });
      gsap.from(".fi-3", { x:80,  y:-50, opacity:0, duration:1.4, ease:"power3.out", delay:1.4 });
      gsap.from(".fi-badge", { opacity:0, scale:0.5, duration:0.6, delay:2.0, type:"spring" });

      gsap.to(".fi-1", { y:-22, duration:3.4, ease:"sine.inOut", yoyo:true, repeat:-1 });
      gsap.to(".fi-2", { y: 16, duration:3.9, ease:"sine.inOut", yoyo:true, repeat:-1, delay:0.5 });
      gsap.to(".fi-3", { y:-12, duration:3.0, ease:"sine.inOut", yoyo:true, repeat:-1, delay:1.0 });
      gsap.to(".fi-1", { rotation:1.8, duration:6, ease:"sine.inOut", yoyo:true, repeat:-1 });

      // ── Service cards ──
      gsap.from(".svc-card", {
        scrollTrigger:{ trigger:".svc-grid", start:"top 80%" },
        y:80, opacity:0, duration:0.85, stagger:0.1, ease:"power3.out",
      });

      // ── Section labels ──
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach(el => {
        gsap.from(el, {
          scrollTrigger:{ trigger:el, start:"top 90%" },
          y:60, opacity:0, duration:1.0, ease:"power3.out",
        });
      });

      // ── Works ──
      gsap.from(".work-item", {
        scrollTrigger:{ trigger:".works-grid", start:"top 80%" },
        scale:0.85, opacity:0, duration:0.9, stagger:0.13, ease:"power3.out",
      });

      // ── Stats ──
      gsap.from(".stat-item", {
        scrollTrigger:{ trigger:".stats-row", start:"top 85%" },
        y:50, opacity:0, duration:0.7, stagger:0.12, ease:"power3.out",
      });

      // ── Testimonials ──
      gsap.from(".testi-card", {
        scrollTrigger:{ trigger:".testi-grid", start:"top 82%" },
        y:60, opacity:0, duration:0.85, stagger:0.18, ease:"power3.out",
      });

      // ── About images ──
      gsap.from(".about-img", {
        scrollTrigger:{ trigger:".about-imgs", start:"top 82%" },
        scale:0.9, opacity:0, duration:1.0, stagger:0.22, ease:"power3.out",
      });

      // ── Parallax divider images ──
      gsap.utils.toArray<HTMLElement>(".par-img").forEach(el => {
        gsap.to(el, {
          scrollTrigger:{ trigger:el, start:"top bottom", end:"bottom top", scrub:2 },
          y:-90, ease:"none",
        });
      });

      // ── About line draw ──
      gsap.from(".about-line", {
        scrollTrigger:{ trigger:".about-line", start:"top 80%" },
        scaleX:0, transformOrigin:"left", duration:1.4, ease:"power3.out",
      });

      // ── Contact section reveal ──
      gsap.from(".contact-title", {
        scrollTrigger:{ trigger:".contact-title", start:"top 85%" },
        y:80, opacity:0, duration:1.1, ease:"power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    setMenuOpen(false);
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <main style={{ background:"#0C0401", color:"#F5EDD8" }} className="overflow-x-hidden">

      {/* ── STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Inter',sans-serif; cursor:none; }
        .serif  { font-family:'Cormorant Garamond',serif; }
        .clip   { overflow:hidden; }
        ::selection { background:#C8956C33; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-track { background:#0C0401; }
        ::-webkit-scrollbar-thumb { background:#7B4A2D; border-radius:2px; }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-inner { animation: marquee 28s linear infinite; }
        .marquee-inner:hover { animation-play-state:paused; }
        input::placeholder, textarea::placeholder { color:#F5EDD822; }
      `}</style>

      {/* ── CUSTOM CURSOR ── */}
      <CustomCursor />

      {/* ── SCROLL PROGRESS BAR ── */}
      <motion.div
        style={{ scaleX: progressW, transformOrigin:"left", background:"#C8956C", height:"2px" }}
        className="fixed top-0 left-0 right-0 z-[60]"
      />

      {/* ══ NAV ══ */}
      <nav className="fixed top-2 left-0 right-0 z-50 px-6 md:px-14">
        <motion.div
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:1, ease:"easeOut" }}
          style={{ background:"#0C040199", border:"1px solid #C8956C18" }}
          className="backdrop-blur-xl rounded-none flex items-center justify-between px-7 py-4"
        >
          <div
            className="text-xs font-black tracking-[0.28em] uppercase cursor-pointer select-none"
            onClick={() => scrollTo("home")}
          >
            <span style={{ color:"#C8956C" }}>PROMINENCE</span>
            <span style={{ color:"#F5EDD8AA" }}> GRAPHICS</span>
          </div>

          <ul className="hidden md:flex gap-9 text-[10px] tracking-[0.25em] uppercase">
            {NAV_ITEMS.map(item => (
              <li key={item}>
                <button
                  onClick={() => scrollTo(item)}
                  style={{ color:"#F5EDD855" }}
                  className="capitalize relative transition-colors duration-300 hover:text-[#C8956C] group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-400" style={{ background:"#C8956C" }} />
                </button>
              </li>
            ))}
          </ul>

          <motion.button
            whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={() => scrollTo("contact")}
            style={{ background:"#C8956C", color:"#0C0401" }}
            className="hidden md:block px-7 py-2.5 text-[10px] font-black tracking-[0.25em] uppercase transition-all duration-300 hover:bg-[#F5EDD8]"
          >
            Start a Project
          </motion.button>

          <button style={{ color:"#F5EDD8" }} className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath:"circle(0% at 95% 5%)" }}
            animate={{ clipPath:"circle(150% at 95% 5%)" }}
            exit={{ clipPath:"circle(0% at 95% 5%)" }}
            transition={{ duration:0.55, ease:[0.76,0,0.24,1] }}
            style={{ background:"#0C0401" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item} onClick={() => scrollTo(item)}
                initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.07 + 0.2 }}
                style={{ color:"#F5EDD8" }}
                className="serif text-5xl italic tracking-wide hover:text-[#C8956C] transition-colors capitalize"
              >
                {item}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ HERO ══ */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Deep ambient bg */}
        <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse 100% 90% at 65% 30%,#3D1A0B28,transparent 70%),radial-gradient(ellipse 60% 70% at 10% 90%,#7B4A2D12,transparent 70%),#0C0401" }} />
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none" style={{ background:"#7B4A2D1A" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[150px] pointer-events-none" style={{ background:"#C8956C0A" }} />

        {/* Subtle grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"linear-gradient(#C8956C06 1px,transparent 1px),linear-gradient(90deg,#C8956C06 1px,transparent 1px)", backgroundSize:"80px 80px" }} />

        <motion.div style={{ y:heroY, opacity:heroOpacity }} className="relative z-10 w-full px-6 md:px-14 lg:px-24 pt-36 pb-20">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-0">

            {/* ── LEFT ── */}
            <div className="flex-1 max-w-2xl">
              <div className="hero-badge inline-flex items-center gap-3 mb-9">
                <div className="w-8 h-px" style={{ background:"#C8956C" }} />
                <span className="text-[10px] tracking-[0.45em] uppercase" style={{ color:"#C8956C" }}>Award-Winning Creative Studio</span>
              </div>

              <h1 className="font-black leading-[0.95] mb-8 tracking-tight" style={{ fontSize:"clamp(3.2rem,9vw,7rem)" }}>
                {[
                  { text:"We Don't",    serif:false, gold:false },
                  { text:"Design.",     serif:false, gold:true  },
                  { text:"We Architect",serif:false, gold:false },
                  { text:"Desire.",     serif:true,  gold:true  },
                ].map(({ text, serif, gold }, i) => (
                  <span key={i} className="block clip">
                    <span
                      className={`hero-line inline-block ${serif ? "serif italic" : ""}`}
                      style={{ color: gold ? "#C8956C" : "#F5EDD8" }}
                    >
                      {text}
                    </span>
                  </span>
                ))}
              </h1>

              <p className="hero-sub text-sm md:text-base leading-[1.9] mb-10 max-w-md font-light" style={{ color:"#F5EDD866" }}>
                Not every studio understands the weight of a great brand. We do.
                Prominence Graphics exists for the rare few who refuse to be ordinary —
                brands that demand to be felt, remembered, and talked about.
              </p>

              <div className="hero-cta flex flex-wrap items-center gap-5">
                <motion.button
                  data-cursor
                  whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  onClick={() => scrollTo("works")}
                  style={{ background:"#C8956C", color:"#0C0401" }}
                  className="group flex items-center gap-3 px-10 py-4 text-[11px] font-black tracking-[0.28em] uppercase transition-colors duration-300 hover:bg-[#F5EDD8]"
                >
                  Explore Our Work
                  <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </motion.button>
                <motion.button
                  data-cursor
                  whileHover={{ x:6 }}
                  onClick={() => scrollTo("contact")}
                  style={{ color:"#F5EDD855" }}
                  className="group flex items-center gap-2.5 text-[10px] tracking-[0.28em] uppercase hover:text-[#C8956C] transition-colors duration-300"
                >
                  <span>Start a Conversation</span>
                  <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </motion.button>
              </div>

              {/* Micro credibility */}
              <div className="hero-cta flex items-center gap-6 mt-10 pt-10" style={{ borderTop:"1px solid #C8956C15" }}>
                <div className="flex -space-x-2">
                  {["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80","https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&q=80"].map((src,i) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img key={i} src={src} alt="client" className="w-8 h-8 rounded-full object-cover" style={{ border:"2px solid #0C0401" }} />
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[...Array(5)].map((_,i) => <Star key={i} size={9} fill="#C8956C" color="#C8956C" />)}
                  </div>
                  <p className="text-[10px]" style={{ color:"#F5EDD844" }}>Trusted by <span style={{ color:"#C8956C" }}>80+ premium brands</span></p>
                </div>
              </div>
            </div>

            {/* ── RIGHT — overlapping images ── */}
            <div className="flex-1 relative h-[520px] w-full hidden lg:block">
              {/* Main large */}
              <div className="fi-1 absolute top-0 right-0 w-[300px] h-[360px] overflow-hidden shadow-2xl" style={{ border:"1px solid #C8956C1A" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=90" alt="Brand work" className="w-full h-full object-cover scale-105" />
                <div className="absolute inset-0" style={{ background:"linear-gradient(to top,#0C0401cc,transparent 55%)" }} />
              </div>
              {/* Mid */}
              <div className="fi-2 absolute top-32 right-60 w-[210px] h-[260px] overflow-hidden shadow-2xl z-10" style={{ border:"1px solid #C8956C28" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&q=90" alt="Packaging" className="w-full h-full object-cover scale-105" />
                <div className="absolute inset-0" style={{ background:"linear-gradient(to top,#2C120677,transparent 55%)" }} />
              </div>
              {/* Small front */}
              <div className="fi-3 absolute bottom-8 right-24 w-[170px] h-[210px] overflow-hidden shadow-2xl z-20" style={{ border:"1px solid #7B4A2D44" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=600&q=90" alt="Packaging design" className="w-full h-full object-cover scale-105" />
              </div>

              {/* Rating badge */}
              <motion.div
                className="fi-badge absolute bottom-32 left-0 z-30 px-5 py-4"
                initial={{ opacity:0, scale:0.6, y:20 }}
                animate={{ opacity:1, scale:1, y:0 }}
                transition={{ delay:2.1, duration:0.6, type:"spring" }}
                style={{ background:"#1A0905", border:"1px solid #C8956C33" }}
              >
                <div className="flex gap-0.5 mb-1.5">
                  {[...Array(5)].map((_,i) => <Star key={i} size={9} fill="#C8956C" color="#C8956C" />)}
                </div>
                <p className="font-black text-2xl leading-none" style={{ color:"#C8956C" }}>4.9 <span className="text-sm font-light" style={{ color:"#F5EDD844" }}>/5</span></p>
                <p className="text-[9px] mt-1 tracking-[0.2em]" style={{ color:"#F5EDD844" }}>CLIENT SATISFACTION</p>
              </motion.div>

              {/* Decorative PG watermark */}
              <div className="serif absolute -bottom-4 right-0 text-[160px] font-bold leading-none select-none pointer-events-none" style={{ color:"#C8956C07" }}>PG</div>

              {/* Gold corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none z-30">
                <div className="absolute top-4 right-4 w-8 h-8" style={{ borderTop:"1px solid #C8956C66", borderRight:"1px solid #C8956C66" }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={{ color:"#C8956C44" }}
        >
          <span className="text-[8px] tracking-[0.5em] uppercase">Scroll</span>
          <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}>
            <ChevronDown size={13} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══ MARQUEE STRIP ══ */}
      <div className="relative z-20 py-4 overflow-hidden" style={{ borderTop:"1px solid #C8956C10", borderBottom:"1px solid #C8956C10", background:"#0C0401" }}>
        <div className="marquee-inner flex gap-10 whitespace-nowrap" style={{ width:"max-content" }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-[9px] tracking-[0.35em] uppercase" style={{ color: item === "·" ? "#C8956C" : "#F5EDD822" }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <section className="py-24 px-6 md:px-14 lg:px-24" style={{ borderBottom:"1px solid #C8956C0A" }}>
        <div className="stats-row grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {STATS.map((s, i) => (
            <div key={i} className="stat-item text-center group">
              <div className="serif text-6xl md:text-7xl font-light mb-3" style={{ color:"#C8956C" }}>
                <Counter target={s.num} suffix={s.suffix} />
              </div>
              <div className="w-6 h-px mx-auto mb-3 transition-all duration-500 group-hover:w-12" style={{ background:"#C8956C55" }} />
              <div className="text-[9px] tracking-[0.35em] uppercase" style={{ color:"#F5EDD844" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section id="services" className="py-28 px-6 md:px-14 lg:px-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none blur-[200px]" style={{ background:"#7B4A2D0E" }} />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <div className="reveal-up flex items-center gap-3 mb-5">
              <div className="w-6 h-px" style={{ background:"#C8956C" }} />
              <span className="text-[9px] tracking-[0.45em] uppercase" style={{ color:"#C8956C" }}>What We Do</span>
            </div>
            <h2 className="reveal-up text-4xl md:text-6xl font-black leading-tight max-w-lg" style={{ color:"#F5EDD8" }}>
              Services Built for<br />
              <span className="serif italic" style={{ color:"#C8956C" }}>the Extraordinary.</span>
            </h2>
          </div>
          <p className="reveal-up text-xs leading-relaxed max-w-xs text-right hidden md:block" style={{ color:"#F5EDD844" }}>
            Every offering is a deliberate discipline.<br />Each one refined over years of practice.
          </p>
        </div>

        <div className="svc-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background:"#C8956C0A" }}>
          {SERVICES.map((s, i) => (
            <motion.div
              key={i}
              className="svc-card group relative overflow-hidden p-8 transition-all duration-500"
              style={{ background:"#0C0401" }}
              whileHover={{ y:-4 }}
            >
              {/* Hover image */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.12] transition-opacity duration-700 scale-105 group-hover:scale-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background:"linear-gradient(135deg,#0C040100,#0C0401cc)" }} />

              <div className="relative z-10">
                {/* Number */}
                <div className="serif text-5xl font-light mb-6 leading-none" style={{ color:"#C8956C15" }}>{s.num}</div>

                {/* Icon + title row */}
                <div className="flex items-start gap-4 mb-4">
                  <div style={{ color:"#C8956C" }} className="mt-0.5 flex-shrink-0">{s.icon}</div>
                  <div>
                    <p className="text-[9px] tracking-[0.35em] uppercase mb-1" style={{ color:"#C8956C88" }}>{s.tagline}</p>
                    <h3 className="text-lg font-bold" style={{ color:"#F5EDD8" }}>{s.title}</h3>
                  </div>
                </div>

                <p className="text-xs leading-[1.85] mb-6" style={{ color:"#F5EDD844" }}>{s.desc}</p>

                <div
                  style={{ color:"#C8956C" }}
                  className="flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400"
                >
                  Discover More <ArrowRight size={10} />
                </div>
              </div>

              {/* Top-right corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none">
                <div className="absolute top-4 right-4 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderTop:"1px solid #C8956C", borderRight:"1px solid #C8956C" }} />
              </div>
              {/* Bottom fill line */}
              <div className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-700" style={{ background:"linear-gradient(to right,#C8956C,transparent)" }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ MAGAZINE DIVIDER ══ */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3">
          {[
            "https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&q=90",
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=90",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=90",
          ].map((src, i) => (
            <div key={i} className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="par-img w-full h-full object-cover scale-110" />
              <div className="absolute inset-0" style={{ background:"#0C040188" }} />
            </div>
          ))}
        </div>
        <div className="absolute inset-0" style={{ background:"linear-gradient(to right,#0C0401 0%,transparent 30%,transparent 70%,#0C0401 100%),linear-gradient(to bottom,#0C0401 0%,transparent 25%,transparent 75%,#0C0401 100%)" }} />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <p className="text-[9px] tracking-[0.5em] uppercase mb-4" style={{ color:"#C8956C88" }}>Our Philosophy</p>
            <h2 className="serif text-3xl md:text-5xl italic font-light" style={{ color:"#F5EDD8EE" }}>
              &ldquo;Great design is not seen &mdash;<br />it is <em style={{ color:"#C8956C" }}>felt</em>.&rdquo;
            </h2>
          </div>
        </div>
      </div>

      {/* ══ WORKS ══ */}
      <section id="works" className="py-28 px-6 md:px-14 lg:px-24 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <div className="reveal-up flex items-center gap-3 mb-5">
              <div className="w-6 h-px" style={{ background:"#C8956C" }} />
              <span className="text-[9px] tracking-[0.45em] uppercase" style={{ color:"#C8956C" }}>Selected Works</span>
            </div>
            <h2 className="reveal-up text-4xl md:text-6xl font-black leading-tight" style={{ color:"#F5EDD8" }}>
              Proof That<br />
              <span className="serif italic" style={{ color:"#C8956C" }}>Beauty Converts.</span>
            </h2>
          </div>
          <div className="reveal-up text-right">
            <p className="text-[10px] mb-3" style={{ color:"#F5EDD833" }}>6 of 150+ projects</p>
            <motion.button
              whileHover={{ x:5 }}
              onClick={() => scrollTo("contact")}
              style={{ color:"#C8956C" }}
              className="group flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase ml-auto"
            >
              View Full Portfolio <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>

        <div className="works-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {WORKS.map((w, i) => (
            <motion.div
              key={i}
              className="work-item group relative overflow-hidden cursor-pointer"
              style={{ aspectRatio: i === 0 || i === 3 ? "3/4" : "4/5", background:"#1A0904" }}
              whileHover={{ scale:1.01, transition:{ duration:0.5 } }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.img} alt={w.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                style={{ transition:"transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)" }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0" style={{ background:"linear-gradient(to top,#0C0401ee 0%,#0C040133 45%,transparent 100%)", opacity:0.8 }} />

              {/* Year pill top right */}
              <div className="absolute top-5 right-5 px-3 py-1 text-[8px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{ background:"#C8956C", color:"#0C0401" }}>
                {w.year}
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-7 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[8px] tracking-[0.38em] uppercase mb-2" style={{ color:"#C8956C99" }}>{w.cat}</p>
                <div className="flex items-end justify-between">
                  <h3 className="serif text-2xl italic font-light" style={{ color:"#F5EDD8" }}>{w.title}</h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-400 delay-100">
                    <ArrowUpRight size={18} color="#C8956C" />
                  </div>
                </div>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-5 left-5 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" style={{ borderTop:"1px solid #C8956C", borderLeft:"1px solid #C8956C" }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="py-28 px-6 md:px-14 lg:px-24 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none blur-[200px]" style={{ background:"#C8956C06" }} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Images mosaic */}
          <div className="about-imgs relative h-[520px]">
            <div className="about-img absolute top-0 left-0 overflow-hidden shadow-2xl" style={{ width:"240px", height:"310px", border:"1px solid #C8956C1A" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=90" alt="Studio" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background:"#0C040122" }} />
            </div>
            <div className="about-img absolute top-16 left-44 w-52 h-64 overflow-hidden shadow-2xl z-10" style={{ border:"1px solid #C8956C28" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=90" alt="Team" className="w-full h-full object-cover" />
            </div>
            <div className="about-img absolute bottom-4 left-4 w-40 h-40 overflow-hidden shadow-2xl z-20" style={{ border:"1px solid #7B4A2D44" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&q=90" alt="Design" className="w-full h-full object-cover" />
            </div>

            {/* Gold badge */}
            <motion.div
              initial={{ opacity:0, scale:0.7 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ duration:0.7, type:"spring" }}
              style={{ background:"#C8956C", color:"#0C0401" }}
              className="absolute bottom-4 right-10 z-30 px-7 py-5"
            >
              <p className="serif text-5xl font-light leading-none">5<span className="text-2xl">+</span></p>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] mt-1">Years of Mastery</p>
            </motion.div>

            {/* Line detail */}
            <div className="about-line absolute bottom-0 left-0 right-0 h-px" style={{ background:"linear-gradient(to right,#C8956C44,transparent)", transformOrigin:"left" }} />

            {/* Ghost letters */}
            <div className="serif absolute -bottom-6 right-0 text-[150px] font-bold leading-none select-none pointer-events-none" style={{ color:"#C8956C06" }}>PG</div>
          </div>

          {/* Text */}
          <div>
            <div className="reveal-up flex items-center gap-3 mb-6">
              <div className="w-6 h-px" style={{ background:"#C8956C" }} />
              <span className="text-[9px] tracking-[0.45em] uppercase" style={{ color:"#C8956C" }}>Who We Are</span>
            </div>

            <h2 className="reveal-up text-4xl md:text-5xl font-black mb-8 leading-tight" style={{ color:"#F5EDD8" }}>
              We Are Not an Agency.<br />
              <span className="serif italic" style={{ color:"#C8956C" }}>We Are Your Brand&apos;s Secret Weapon.</span>
            </h2>

            <p className="text-sm leading-[2] mb-6 font-light" style={{ color:"#F5EDD855" }}>
              Prominence Graphics isn&apos;t for everyone — and we&apos;re proud of that.
              We exist for founders who understand that the right design doesn&apos;t
              just look good; it commands respect, signals quality, and opens doors
              that cold calls never will.
            </p>
            <p className="text-sm leading-[2] mb-10 font-light" style={{ color:"#F5EDD855" }}>
              Every client we partner with receives our absolute focus. No assembly
              lines. No templates. No compromise. Just deliberate, strategic design
              crafted to make your brand unforgettable.
            </p>

            {/* Pillars */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-7 mb-12">
              {[
                { n:"01", t:"Uncompromising Quality",  d:"We don&apos;t ship until it&apos;s exceptional." },
                { n:"02", t:"Strategic Precision",      d:"Every choice is intentional and purposeful." },
                { n:"03", t:"Radical Collaboration",   d:"Your vision, amplified by our expertise." },
                { n:"04", t:"Timeless Aesthetic",      d:"Trends fade. We design for longevity." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <p className="serif text-3xl font-light mb-1 leading-none" style={{ color:"#C8956C14" }}>{item.n}</p>
                  <h4 className="text-xs font-bold mb-1" style={{ color:"#C8956C" }}>{item.t}</h4>
                  <p className="text-[11px] leading-relaxed" style={{ color:"#F5EDD833" }} dangerouslySetInnerHTML={{ __html: item.d }} />
                </motion.div>
              ))}
            </div>

            <motion.button
              data-cursor
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={() => scrollTo("contact")}
              style={{ border:"1px solid #C8956C", color:"#C8956C" }}
              className="group flex items-center gap-3 px-10 py-4 text-[10px] font-black tracking-[0.28em] uppercase transition-all duration-400 hover:bg-[#C8956C] hover:text-[#0C0401]"
            >
              Partner With Us
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ══ QUOTE DIVIDER ══ */}
      <div className="relative h-52 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2000&q=90" alt="" className="par-img w-full h-full object-cover scale-110" />
        <div className="absolute inset-0" style={{ background:"linear-gradient(to right,#0C0401,#0C040177 35%,#0C040177 65%,#0C0401),linear-gradient(to bottom,#0C0401,transparent 22%,transparent 78%,#0C0401)" }} />
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <p className="serif text-xl md:text-3xl font-light text-center italic leading-relaxed" style={{ color:"#F5EDD8CC" }}>
            &ldquo;A brand is the promise you make.<br />
            <em style={{ color:"#C8956C" }}>Great design is the promise kept.&rdquo;</em>
          </p>
        </div>
      </div>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-28 px-6 md:px-14 lg:px-24" style={{ background:"#0A0301" }}>
        <div className="text-center mb-20">
          <div className="reveal-up flex items-center justify-center gap-3 mb-5">
            <div className="w-6 h-px" style={{ background:"#C8956C" }} />
            <span className="text-[9px] tracking-[0.45em] uppercase" style={{ color:"#C8956C" }}>What They Say</span>
            <div className="w-6 h-px" style={{ background:"#C8956C" }} />
          </div>
          <h2 className="reveal-up text-4xl md:text-6xl font-black" style={{ color:"#F5EDD8" }}>
            Words From Those<br />
            <span className="serif italic" style={{ color:"#C8956C" }}>Who Know Best.</span>
          </h2>
        </div>

        <div className="testi-grid grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background:"#C8956C0A" }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              className="testi-card relative p-10"
              style={{ background:"#0A0301" }}
              whileHover={{ y:-4, transition:{ duration:0.3 } }}
            >
              {/* Open quote */}
              <div className="serif text-[100px] leading-none select-none absolute top-4 right-6" style={{ color:"#C8956C08" }}>&ldquo;</div>

              <div className="flex gap-0.5 mb-7">
                {[...Array(5)].map((_,j) => <Star key={j} size={11} fill="#C8956C" color="#C8956C" />)}
              </div>

              <p className="text-sm leading-[2] mb-8 font-light relative z-10" style={{ color:"#F5EDD877" }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Result badge */}
              <div className="inline-block px-3 py-1.5 mb-8 text-[8px] tracking-[0.3em] uppercase" style={{ background:"#C8956C11", border:"1px solid #C8956C33", color:"#C8956C" }}>
                {t.result}
              </div>

              <div className="flex items-center gap-4 pt-6" style={{ borderTop:"1px solid #C8956C10" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt={t.name} className="w-11 h-11 rounded-full object-cover" style={{ border:"1.5px solid #C8956C44" }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color:"#F5EDD8" }}>{t.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color:"#C8956C66" }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="py-28 px-6 md:px-14 lg:px-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse 80% 80% at 50% 50%,#3D1A0B14,transparent),#0C0401" }} />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none blur-[250px]" style={{ background:"#C8956C07" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"linear-gradient(#C8956C04 1px,transparent 1px),linear-gradient(90deg,#C8956C04 1px,transparent 1px)", backgroundSize:"80px 80px" }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="contact-title">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-6 h-px" style={{ background:"#C8956C" }} />
              <span className="text-[9px] tracking-[0.45em] uppercase" style={{ color:"#C8956C" }}>Let&apos;s Collaborate</span>
              <div className="w-6 h-px" style={{ background:"#C8956C" }} />
            </div>
            <h2 className="serif text-5xl md:text-7xl font-light italic mb-6 leading-tight" style={{ color:"#F5EDD8" }}>
              Your Brand Deserves<br />
              <span style={{ color:"#C8956C" }}>to Be Extraordinary.</span>
            </h2>
            <p className="text-sm leading-[2] mb-14 max-w-lg mx-auto font-light" style={{ color:"#F5EDD855" }}>
              If you&apos;ve made it this far, you already know what you want.
              Let&apos;s make it real. Reach out — we respond to every serious inquiry
              within 24 hours.
            </p>
          </div>

          <div className="text-left space-y-3 mb-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <label className="absolute left-5 top-3 text-[8px] tracking-[0.3em] uppercase" style={{ color:"#C8956C55" }}>Your Name</label>
                <input type="text" className="w-full pt-8 pb-4 px-5 text-sm bg-transparent focus:outline-none" style={{ background:"#1A090522", border:"1px solid #C8956C18", color:"#F5EDD8", transition:"border-color 0.3s" }}
                  onFocus={e => (e.target.style.borderColor="#C8956C55")} onBlur={e => (e.target.style.borderColor="#C8956C18")} />
              </div>
              <div className="relative">
                <label className="absolute left-5 top-3 text-[8px] tracking-[0.3em] uppercase" style={{ color:"#C8956C55" }}>Your Email</label>
                <input type="email" className="w-full pt-8 pb-4 px-5 text-sm bg-transparent focus:outline-none" style={{ background:"#1A090522", border:"1px solid #C8956C18", color:"#F5EDD8", transition:"border-color 0.3s" }}
                  onFocus={e => (e.target.style.borderColor="#C8956C55")} onBlur={e => (e.target.style.borderColor="#C8956C18")} />
              </div>
            </div>
            <div className="relative">
              <label className="absolute left-5 top-3 text-[8px] tracking-[0.3em] uppercase" style={{ color:"#C8956C55" }}>Project Type</label>
              <input type="text" className="w-full pt-8 pb-4 px-5 text-sm bg-transparent focus:outline-none" style={{ background:"#1A090522", border:"1px solid #C8956C18", color:"#F5EDD8", transition:"border-color 0.3s" }}
                onFocus={e => (e.target.style.borderColor="#C8956C55")} onBlur={e => (e.target.style.borderColor="#C8956C18")} />
            </div>
            <div className="relative">
              <label className="absolute left-5 top-3 text-[8px] tracking-[0.3em] uppercase" style={{ color:"#C8956C55" }}>Tell Us About Your Vision</label>
              <textarea rows={5} className="w-full pt-8 pb-4 px-5 text-sm bg-transparent focus:outline-none resize-none" style={{ background:"#1A090522", border:"1px solid #C8956C18", color:"#F5EDD8", transition:"border-color 0.3s" }}
                onFocus={e => (e.target.style.borderColor="#C8956C55")} onBlur={e => (e.target.style.borderColor="#C8956C18")} />
            </div>
          </div>

          <motion.button
            data-cursor
            whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            style={{ background:"#C8956C", color:"#0C0401" }}
            className="w-full py-5 text-[11px] font-black tracking-[0.35em] uppercase transition-colors duration-300 hover:bg-[#F5EDD8] mb-14"
          >
            Send My Inquiry
          </motion.button>

          <div className="flex flex-wrap justify-center gap-10" style={{ color:"#F5EDD833" }}>
            {[
              { icon:<Mail size={13} />,   text:"hello@prominencegraphics.com" },
              { icon:<Phone size={13} />,  text:"+1 (555) 000-0000" },
              { icon:<MapPin size={13} />, text:"New York, NY" },
            ].map((item, i) => (
              <motion.span
                key={i}
                whileHover={{ y:-2, color:"#C8956C" }}
                className="flex items-center gap-2.5 text-[10px] tracking-[0.2em] cursor-pointer transition-colors"
              >
                {item.icon} {item.text}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="px-6 md:px-14 lg:px-24 pt-16 pb-8" style={{ borderTop:"1px solid #C8956C0A", background:"#080301" }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">

          {/* Brand */}
          <div className="md:col-span-5">
            <div className="text-sm font-black tracking-[0.28em] uppercase mb-5 cursor-pointer" onClick={() => scrollTo("home")}>
              <span style={{ color:"#C8956C" }}>PROMINENCE</span>
              <span style={{ color:"#F5EDD833" }}> GRAPHICS</span>
            </div>
            <p className="text-xs leading-[2] max-w-xs font-light" style={{ color:"#F5EDD833" }}>
              A boutique design studio for brands that refuse to be ordinary.
              We don&apos;t follow trends &mdash; we set the standard.
            </p>
            <div className="flex gap-5 mt-7">
              {[Heart, Globe, Share2].map((Icon, i) => (
                <motion.a key={i} href="#" whileHover={{ y:-3, color:"#C8956C" }} style={{ color:"#F5EDD822" }} className="transition-colors duration-300">
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[9px] font-bold tracking-[0.35em] uppercase mb-6" style={{ color:"#F5EDD844" }}>Services</h4>
            <ul className="space-y-3">
              {["Brand Identity","Print Design","Packaging","Social Media","Visual Strategy","Marketing"].map(s => (
                <li key={s}><span className="text-xs cursor-pointer hover:text-[#C8956C] transition-colors duration-300 font-light" style={{ color:"#F5EDD833" }}>{s}</span></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[9px] font-bold tracking-[0.35em] uppercase mb-6" style={{ color:"#F5EDD844" }}>Studio</h4>
            <ul className="space-y-3">
              {["About","Our Work","Process","Testimonials","Contact"].map(s => (
                <li key={s}><span className="text-xs cursor-pointer hover:text-[#C8956C] transition-colors duration-300 font-light" style={{ color:"#F5EDD833" }}>{s}</span></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[9px] font-bold tracking-[0.35em] uppercase mb-6" style={{ color:"#F5EDD844" }}>Get In Touch</h4>
            <p className="text-[10px] leading-relaxed font-light" style={{ color:"#F5EDD833" }}>
              hello@prominencegraphics.com<br />+1 (555) 000-0000<br />New York, NY
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop:"1px solid #C8956C08" }}>
          <p className="text-[9px] tracking-[0.2em]" style={{ color:"#F5EDD822" }}>&#169; 2024 Prominence Graphics. All rights reserved.</p>
          <p className="serif text-[11px] italic" style={{ color:"#C8956C33" }}>Where vision meets excellence.</p>
        </div>
      </footer>
    </main>
  );
}