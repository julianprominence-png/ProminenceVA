"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight, Send,
  Palette, Layers, Eye, TrendingUp,
  MonitorSmartphone, Box, Sparkles as SparklesIcon, Award,
} from "lucide-react";
import Aurora from "../components/Aurora/Aurora";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// ─── DATA ───────────────────────────────────────────────────────────────────
const WORKS = [
  { title:"Aero Dynamics",  cat:"3D Visualization",img:"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=90" },
  { title:"Vanguard Motors",  cat:"Digital Campaign",img:"https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=90" },
  { title:"Kroma Architecture",cat:"Spatial Design", img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=90" },
  { title:"Maison Velour",    cat:"Brand Identity",  img:"https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=90" },
  { title:"Luxe Collective",  cat:"Visual Strategy", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90" },
  { title:"Nova Robotics",    cat:"Motion Graphics", img:"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=90" },
  { title:"Atelier & Co.",    cat:"Print Design",    img:"https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=90" },
  { title:"Aura Skincare",    cat:"Web Development", img:"https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=90" },
  { title:"Quantum Interface",cat:"UI/UX Design",    img:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=90" },
];

const SERVICES = [
  { icon: Palette,            title:"Brand Identity",   desc:"Identities so precise your audience recognizes you before reading a single word." },
  { icon: Layers,             title:"Print Design",     desc:"Luxury print materials people keep, frame, and refuse to throw away." },
  { icon: Eye,                title:"Visual Strategy",  desc:"Purpose behind every pixel. Powerful, intentional, and undeniably effective." },
  { icon: TrendingUp,         title:"Marketing Design", desc:"Campaigns that command attention and convert the curious into lifelong advocates." },
  { icon: MonitorSmartphone,  title:"Web Development",  desc:"Award-winning digital experiences blending fluid physics with elite UI/UX." },
  { icon: Box,                title:"3D Motion",        desc:"Immersive three-dimensional narratives that bring static concepts to life." },
  { icon: SparklesIcon,       title:"Social Media",     desc:"Visuals so magnetic, stopping the scroll isn't just possible — it's inevitable." },
  { icon: Award,              title:"Packaging",        desc:"Packaging that turns an unboxing into a luxury ritual your clients remember." },
];

const CARD_W = 340; // px
const GAP = 0; // px
const TOTAL_CARDS = WORKS.length;
const TRACK_W = (CARD_W + GAP) * TOTAL_CARDS;

export default function GraphicsPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll();
  const prog = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-elem", { 
        y: 30, 
        opacity: 0, 
        duration: 1.2, 
        stagger: 0.15, 
        ease: "power3.out", 
        delay: 0.2 
      });

      if (contactRef.current) {
        gsap.fromTo(contactRef.current, 
          { opacity: 0, y: 40 }, 
          {
            opacity: 1, 
            y: 0,
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: { trigger: contactRef.current, start: "top 80%" },
          }
        );
      }

      const footerEls = document.querySelectorAll(".footer-animate");
      footerEls.forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitStatus("sending");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSubmitStatus("sent");
    } catch {
      setSubmitStatus("sent");
    }
  };

  const carouselCards = [...WORKS, ...WORKS, ...WORKS];

  return (
    <main className="relative min-h-screen bg-[#07061A] text-white overflow-x-hidden selection:bg-purple-500/30">
      <style>{`
        @keyframes carousel-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${TRACK_W}px); }
        }
        .animate-carousel-scroll {
          animation: carousel-scroll 45s linear infinite;
        }
        .polaroid-font {
          font-family: "Inter", sans-serif;
        }
      `}</style>

      {/* Noise overlay */}
      <div 
        className="fixed inset-0 z-50 pointer-events-none mix-blend-overlay opacity-[0.03]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} 
      />

      {/* Scroll progress bar */}
      <motion.div 
        style={{ scaleX: prog }} 
        className="fixed top-0 left-0 right-0 h-1 z-50 origin-left bg-gradient-to-r from-purple-600 via-purple-400 to-purple-200"
      />

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* HERO                                                         */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section id="home" className="relative h-screen min-h-[850px] flex flex-col justify-center">
        
        {/* Aurora Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
          <Aurora colorStops={["#4c1d95", "#9333ea", "#c084fc"]} blend={0.5} amplitude={1.0} speed={0.5} />
        </div>
        
        {/* Deep gradient overlay to ensure text readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#07061A]/40 via-[#07061A]/60 to-[#07061A] pointer-events-none" />

        {/* Hero Content — Left Aligned with Right Preview */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 -mt-32">
          
          {/* LEFT: Text */}
          <div className="flex-1 max-w-2xl">
            <div className="hero-elem inline-flex items-center gap-3 px-5 py-2 mb-8 rounded-full border border-purple-500/20 bg-purple-500/10 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-purple-200 font-bold">Creative Studio</span>
            </div>

            <h1 className="hero-elem text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1] mb-6 drop-shadow-2xl">
              <span className="text-white">PROMINENCE</span>
              <br />
              <span className="bg-gradient-to-br from-purple-400 to-purple-100 bg-clip-text text-transparent">
                GRAPHICS
              </span>
            </h1>

            <p className="hero-elem text-white/60 text-sm sm:text-base lg:text-lg leading-relaxed mb-10 font-medium max-w-xl">
              We create visual identities so compelling, your audience can&apos;t look away. Precision design for founders who refuse average.
            </p>

            <div className="hero-elem">
              <button 
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} 
                className="group relative overflow-hidden bg-white text-black font-bold text-xs tracking-[0.2em] uppercase px-10 py-5 rounded-full flex items-center gap-4 transition-transform hover:scale-105"
              >
                <span className="relative z-10">Start a Project</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          {/* RIGHT: Preview Container */}
          <div className="hero-elem flex-shrink-0 w-full max-w-[340px] xl:max-w-[420px]">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-[0_20px_60px_-15px_rgba(124,58,237,0.3)] backdrop-blur-sm flex items-center justify-center group">
              {selectedCard === null ? (
                <div className="flex flex-col items-center gap-3 text-white/30">
                  <Eye className="w-8 h-8 opacity-50" />
                  <span className="font-bold tracking-[0.2em] uppercase text-xs">Select a Design</span>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={selectedCard}
                  className="absolute inset-0"
                >
                  <Image
                    src={WORKS[selectedCard].img}
                    alt={WORKS[selectedCard].title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-purple-300 text-[10px] tracking-[0.3em] uppercase font-bold mb-2 drop-shadow-md">
                      {WORKS[selectedCard].cat}
                    </p>
                    <h3 className="text-white text-2xl font-black tracking-tight leading-tight drop-shadow-lg">
                      {WORKS[selectedCard].title}
                    </h3>
                  </div>

                  <div className="absolute top-6 right-6">
                    <span className="text-white/20 text-4xl font-black leading-none drop-shadow-sm">
                      {String(selectedCard + 1).padStart(2, "0")}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom: Infinite Carousel — Polaroid Style */}
        {/* Positioned to overlap the boundary between Hero and Contact sections */}
        <div className="absolute -bottom-32 left-0 right-0 z-30 overflow-visible pt-6">
          <div className="flex w-max animate-carousel-scroll hover:[animation-play-state:paused]" style={{ gap: `${GAP}px` }}>
            {carouselCards.map((card, index) => {
              const actualIndex = index % TOTAL_CARDS;
              const isActive = actualIndex === selectedCard;
              
              return (
                <div
                  key={`${card.title}-${index}`}
                  onClick={() => setSelectedCard(actualIndex)}
                  className={`group relative flex-shrink-0 cursor-pointer transition-all duration-500 hover:-translate-y-6 hover:z-40 ${isActive ? '-translate-y-4 z-30' : ''}`}
                  style={{ width: `${CARD_W}px` }}
                >
                  {/* Polaroid Frame */}
                  <div className={`relative w-full bg-[#f8f9fa] p-3 pb-14 shadow-2xl transition-all duration-500 ${isActive ? 'shadow-[0_20px_50px_rgba(168,85,247,0.4)] z-10' : ''}`}>
                    {/* Image Area */}
                    <div className="relative w-full aspect-square overflow-hidden bg-gray-200 border border-gray-200">
                      <Image 
                        src={card.img} 
                        alt={card.title} 
                        fill 
                        style={{ objectFit: "cover" }} 
                        className={`transition-transform duration-700 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} 
                        unoptimized 
                      />
                      {/* Subtle overlay for non-active to simulate focus */}
                      {!isActive && <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />}
                    </div>
                    
                    {/* Text Area */}
                    <div className="absolute bottom-5 left-0 w-full text-center px-4">
                      <p className="polaroid-font text-gray-800 font-bold text-xs tracking-widest uppercase truncate opacity-90">
                        {card.title}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* CONTACT + SERVICES                                             */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section ref={contactRef} id="contact" className="relative z-10 pt-48 pb-32 px-6 sm:px-12 bg-transparent">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="mb-16">
            <p className="text-purple-300/80 text-[10px] tracking-[0.4em] uppercase font-black mb-4 drop-shadow-md">Get In Touch</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.06em] text-white/90 drop-shadow-sm">
              Start a <span className="text-purple-300">Project</span>
            </h2>
          </div>

          {/* 2-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* ── LEFT: Contact Form ── */}
            <div className="bg-white/[0.02] backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
              <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-md">
                Currently accepting bookings for cinematic campaigns. Provide your timeline and vision — we&apos;ll craft the rest.
              </p>

              {submitStatus === "sent" ? (
                <div className="border border-purple-400/30 bg-purple-500/10 rounded-2xl p-12 text-center shadow-inner">
                  <h3 className="text-xl font-black text-white mb-3 tracking-wide uppercase">Transmission Received</h3>
                  <p className="text-white/70 text-sm">We&apos;ll review your project brief and respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-purple-200 text-[10px] tracking-[0.3em] uppercase font-bold mb-2 drop-shadow-sm">Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl px-5 py-3.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-purple-400/50 transition-all border border-white/10 bg-black/30 placeholder-white/40"
                      />
                    </div>
                    <div>
                      <label className="block text-purple-200 text-[10px] tracking-[0.3em] uppercase font-bold mb-2 drop-shadow-sm">Email</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl px-5 py-3.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-purple-400/50 transition-all border border-white/10 bg-black/30 placeholder-white/40"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-purple-200 text-[10px] tracking-[0.3em] uppercase font-bold mb-2 drop-shadow-sm">Project Brief</label>
                    <textarea
                      rows={4}
                      placeholder="Describe your project vision, timeline, and deliverables..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl px-5 py-3.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-purple-400/50 transition-all border border-white/10 bg-black/30 placeholder-white/40 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitStatus === "sending"}
                    className="inline-flex items-center gap-3 px-10 py-4 rounded-full border border-purple-400/40 hover:border-purple-300 bg-purple-600/30 hover:bg-purple-500/40 text-white font-bold text-[10px] tracking-[0.2em] uppercase transition-all duration-300 shadow-xl"
                  >
                    {submitStatus === "sending" ? "Sending..." : "Send Message"}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* ── RIGHT: Services ── */}
            <div>
              <p className="text-purple-300/80 text-[10px] tracking-[0.4em] uppercase font-black mb-6 drop-shadow-md">Expertise</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICES.map((s, i) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    viewport={{ once: true }}
                    className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05] hover:border-purple-400/30 transition-all duration-300 shadow-xl"
                  >
                    <s.icon className="w-5 h-5 text-purple-300 mb-4 group-hover:text-purple-200 transition-colors drop-shadow-sm" />
                    <h3 className="text-white font-bold text-sm mb-1.5">{s.title}</h3>
                    <p className="text-white/50 text-xs leading-relaxed">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* FOOTER                                                         */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <footer ref={footerRef} className="relative z-10 overflow-hidden bg-transparent mt-12">
        {/* Summit Silhouette */}
        <svg className="w-full h-auto block" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ marginBottom: "-4px" }}>
          <defs>
            <linearGradient id="sg1g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="sg2g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0f0f1a" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="sg3g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.06" />
              <stop offset="60%" stopColor="#1a1a2e" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0a0a14" />
            </linearGradient>
            <linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="40%" stopColor="#07061A" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0a0a14" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="1440" height="320" fill="url(#skyg)" />
          <path d="M0,280 L80,240 L160,255 L240,210 L320,230 L400,185 L480,200 L560,160 L640,175 L680,140 L720,120 L760,140 L800,165 L880,190 L960,170 L1040,195 L1120,175 L1200,200 L1280,185 L1360,210 L1440,195 L1440,320 L0,320 Z" fill="url(#sg2g)" opacity="0.5" />
          <path d="M0,290 L60,270 L120,280 L200,245 L280,260 L340,220 L420,235 L480,195 L540,210 L600,175 L660,155 L720,100 L780,155 L820,180 L880,200 L940,185 L1000,210 L1060,195 L1120,215 L1180,200 L1240,225 L1320,210 L1380,230 L1440,220 L1440,320 L0,320 Z" fill="url(#sg1g)" opacity="0.75" />
          <path d="M0,300 L40,290 L100,295 L160,275 L220,285 L280,260 L340,270 L400,245 L440,255 L500,230 L560,240 L620,215 L680,195 L720,160 L760,195 L800,220 L840,235 L900,250 L960,240 L1020,255 L1060,245 L1120,260 L1180,250 L1240,265 L1300,255 L1360,270 L1400,260 L1440,265 L1440,320 L0,320 Z" fill="url(#sg3g)" />
        </svg>

        {/* Footer Content */}
        <div style={{ background: "linear-gradient(to bottom, #0a0a14, #0d0d1a 40%, #111126)" }} className="relative border-t border-white/5">
          <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 pt-16 pb-10">
            {/* Brand + Contact */}
            <div className="footer-animate flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 mb-16">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center relative" style={{ background: "rgba(147,51,234,0.12)", boxShadow: "0 0 30px rgba(147,51,234,0.15), inset 0 1px 1px rgba(255,255,255,0.05)" }}>
                  <img src="/images/icon-logo.png" alt="Prominence" className="w-full h-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                </div>
                <div>
                  <h4 className="font-black tracking-[0.25em] uppercase text-white/90 text-sm">Prominence</h4>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-purple-400/60 font-semibold mt-0.5">Virtual Assistance</p>
                </div>
              </div>
              <div className="flex items-center gap-5 flex-wrap">
                <span className="flex items-center gap-2.5 text-white/50 text-xs font-medium tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                  prominence.va@gmail.com
                </span>
                <span className="w-px h-3 bg-white/10 hidden sm:block" />
                <span className="flex items-center gap-2.5 text-white/50 text-xs font-medium tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                  09560542898
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="footer-animate w-full h-px mb-10" style={{ background: "linear-gradient(to right, transparent, rgba(147,51,234,0.25), rgba(255,255,255,0.06), rgba(147,51,234,0.25), transparent)" }} />

            {/* Links + Status */}
            <div className="footer-animate flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
              <nav className="flex flex-wrap items-center gap-6 text-[9px] tracking-[0.25em] uppercase font-bold">
                {["Services", "Portfolio", "Contact"].map((link) => (
                  <a key={link} href={`#${link.toLowerCase()}`} className="p-3 -m-3 text-white/30 hover:text-purple-400 transition-colors duration-300">
                    {link}
                  </a>
                ))}
                <a href="/" className="p-3 -m-3 text-white/30 hover:text-purple-400 transition-colors duration-300">Home</a>
              </nav>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)] animate-pulse" />
                <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 font-bold">Systems Operational</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="footer-animate flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] tracking-[0.3em] uppercase text-white/20 font-medium">
              <p>&copy; {new Date().getFullYear()} Prominence. All operational rights reserved.</p>
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 text-purple-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Olongapo City, 2200</span>
              </div>
            </div>
          </div>

          {/* Bottom glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] pointer-events-none" style={{ background: "linear-gradient(to right, transparent, rgba(147,51,234,0.4), transparent)" }} />
        </div>
      </footer>
    </main>
  );
}