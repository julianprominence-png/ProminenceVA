"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Send,
  Palette,
  Layers,
  Eye,
  TrendingUp,
  MonitorSmartphone,
  Box,
  Sparkles as SparklesIcon,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/* HERO CARD DATA                                                             */
/* -------------------------------------------------------------------------- */
const heroCards = [
  {
    num: "01",
    title: "Aero Dynamics",
    sub: "3D Visualization",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=90",
    featured: true,
  },
  {
    num: "02",
    title: "Vanguard Motors",
    sub: "Digital Campaign",
    img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=90",
  },
  {
    num: "03",
    title: "Kroma Architecture",
    sub: "Spatial Design",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=90",
  },
  {
    num: "04",
    title: "Maison Velour",
    sub: "Brand Identity",
    img: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=90",
  },
  {
    num: "05",
    title: "Nova Robotics",
    sub: "Motion Graphics",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=90",
  },
];

/* -------------------------------------------------------------------------- */
/* SERVICES DATA                                                              */
/* -------------------------------------------------------------------------- */
const services = [
  { icon: Palette, title: "Brand Identity", desc: "Identities so precise your audience recognizes you before reading a single word." },
  { icon: Layers, title: "Print Design", desc: "Luxury print materials people keep, frame, and refuse to throw away." },
  { icon: Eye, title: "Visual Strategy", desc: "Purpose behind every pixel. Powerful, intentional, and undeniably effective." },
  { icon: TrendingUp, title: "Marketing Design", desc: "Campaigns that command attention and convert the curious into lifelong advocates." },
  { icon: MonitorSmartphone, title: "Web Development", desc: "Award-winning digital experiences blending fluid physics with elite UI/UX." },
  { icon: Box, title: "3D Motion", desc: "Immersive three-dimensional narratives that bring static concepts to life." },
  { icon: SparklesIcon, title: "Social Media", desc: "Visuals so magnetic, stopping the scroll isn't just possible — it's inevitable." },
  { icon: Award, title: "Packaging", desc: "Packaging that turns an unboxing into a luxury ritual your clients remember." },
];

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */
export default function GraphicsPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  /* ── Animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-card",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.3 }
      );
      if (contactRef.current) {
        gsap.fromTo(contactRef.current, { opacity: 0 }, {
          opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: contactRef.current, start: "top 85%" },
        });
      }
      const footerEls = document.querySelectorAll(".footer-animate");
      footerEls.forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  /* ── Carousel nav ── */
  const goPrev = () => setFeaturedIndex((i) => (i === 0 ? heroCards.length - 1 : i - 1));
  const goNext = () => setFeaturedIndex((i) => (i === heroCards.length - 1 ? 0 : i + 1));

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

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      <div
        className="relative min-h-screen text-white overflow-x-hidden selection:bg-purple-500/20"
        style={{ background: "linear-gradient(180deg, #ffffff 0%, #000000ff 15%, #000000ff 50%, #2e1065 75%, #0a0814 100%)" }}
      >
        {/* Starfield */}
        <div className="starfield fixed inset-0 z-0 opacity-40 mix-blend-screen" />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* HERO — FULLSCREEN BG + BOTTOM CARD CAROUSEL               */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative z-10 h-screen min-h-[650px] overflow-hidden flex flex-col">

          {/* ── Full-screen background image ── */}
          <img
            src={heroCards[featuredIndex].img}
            alt={heroCards[featuredIndex].title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.2s] ease-out scale-[1.03]"
          />

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

          {/* ── Left-center: Title + CTA ── */}
          <div className="relative z-10 flex-1 flex items-center">
            <div className="px-8 sm:px-12 lg:px-16 max-w-[55%] pb-[220px] lg:pb-[200px]">
              {/* Decorative dash + subtitle */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-[2px] bg-white/60" />
                <p className="text-white/70 text-xs tracking-[0.15em] font-medium">
                  Prominence Graphics
                </p>
              </div>

              {/* Large title */}
              <h1
                className="font-black leading-[0.95] text-white mb-6 drop-shadow-lg uppercase"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", letterSpacing: "-0.02em" }}
              >
                {heroCards[featuredIndex].title.split(" ").map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h1>

              {/* Description */}
              <p className="text-white/50 text-[13px] leading-relaxed max-w-sm mb-8">
                Prominence Graphics exists for founders who refuse average. We create visual identities so compelling, your audience can&apos;t look away.
              </p>

              {/* CTA — orange accent circle + label */}
              <a
                href="#contact"
                className="inline-flex items-center gap-4 group/cta"
              >
                <span className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover/cta:scale-110 transition-transform duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
                <span className="text-white/80 text-[11px] font-bold tracking-[0.2em] uppercase border-b border-white/20 pb-0.5 group-hover/cta:border-white/50 transition-colors">
                  Start a Project
                </span>
              </a>
            </div>
          </div>

          {/* ── Bottom: Horizontal card carousel + nav ── */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            {/* Subtle gradient behind cards */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

            <div className="relative flex items-end gap-0 px-6 sm:px-10 lg:px-14 pb-6">

              {/* ── Cards row ── */}
              <div className="flex gap-4 overflow-x-auto flex-1 pb-2 pr-4" style={{ scrollbarWidth: "none", marginLeft: "clamp(0px, 30vw, 420px)" }}>
                {heroCards.map((card, index) => {
                  const isActive = index === featuredIndex;
                  return (
                    <div
                      key={card.num}
                      className={`hero-card flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${isActive ? "ring-2 ring-white/30 scale-[1.02]" : "hover:scale-[1.02]"}`}
                      style={{ width: "180px" }}
                      onClick={() => setFeaturedIndex(index)}
                    >
                      {/* Card image */}
                      <div className="relative h-[130px] overflow-hidden">
                        <img
                          src={card.img}
                          alt={card.title}
                          className={`w-full h-full object-cover transition-transform duration-700 ${!isActive ? "group-hover:scale-110" : ""}`}
                        />
                        {!isActive && <div className="absolute inset-0 bg-black/20" />}
                      </div>
                      {/* Card text — frosted glass */}
                      <div
                        className="px-4 py-3"
                        style={{
                          background: isActive
                            ? "rgba(255,255,255,0.95)"
                            : "rgba(255,255,255,0.85)",
                          backdropFilter: "blur(12px)",
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-3 h-[2px] bg-amber-500 rounded-full" />
                          <p className="text-black/40 text-[9px] tracking-[0.1em] font-medium truncate">
                            {card.sub}
                          </p>
                        </div>
                        <p className="text-black/80 font-black text-[12px] uppercase tracking-[0.04em] leading-tight">
                          {card.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Bottom bar: arrows + progress + number ── */}
            <div className="relative flex items-center justify-center gap-5 px-8 sm:px-12 pb-6 pt-2">
              <button onClick={goPrev} className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center hover:border-white/50 hover:bg-white/10 transition-all backdrop-blur-sm">
                <ChevronLeft className="w-4 h-4 text-white/70" />
              </button>
              <button onClick={goNext} className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center hover:border-white/50 hover:bg-white/10 transition-all backdrop-blur-sm">
                <ChevronRight className="w-4 h-4 text-white/70" />
              </button>

              {/* Progress bar */}
              <div className="flex-1 max-w-[220px] h-[2px] bg-white/10 rounded-full overflow-hidden ml-6">
                <div
                  className="h-full bg-white/50 rounded-full transition-all duration-500"
                  style={{ width: `${((featuredIndex + 1) / heroCards.length) * 100}%` }}
                />
              </div>

              {/* Slide number */}
              <span className="text-white/25 font-black text-3xl ml-4 select-none" style={{ fontFamily: "Inter, sans-serif" }}>
                {String(featuredIndex + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* CONTACT + SERVICES — UNIFIED 2-COL                        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section ref={contactRef} id="contact" className="relative z-10 py-32 px-6 sm:px-12 bg-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <p className="text-purple-300/80 text-[10px] tracking-[0.4em] uppercase font-black mb-4 drop-shadow-md">Get In Touch</p>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.06em] text-white/90 drop-shadow-sm">
                Start a <span className="text-purple-300">Project</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* ── LEFT: Contact Form ── */}
              <div className="bg-black/10 backdrop-blur-lg p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
                <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-md">
                  Currently accepting bookings for premium visual campaigns. Provide your timeline and vision — we&apos;ll architect the rest.
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
                        <input type="text" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl px-5 py-3.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-purple-400/50 transition-all border border-white/10 bg-black/30 placeholder-white/40" />
                      </div>
                      <div>
                        <label className="block text-purple-200 text-[10px] tracking-[0.3em] uppercase font-bold mb-2 drop-shadow-sm">Email</label>
                        <input type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl px-5 py-3.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-purple-400/50 transition-all border border-white/10 bg-black/30 placeholder-white/40" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-purple-200 text-[10px] tracking-[0.3em] uppercase font-bold mb-2 drop-shadow-sm">Project Brief</label>
                      <textarea rows={4} placeholder="Describe your project vision, timeline, and deliverables..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full rounded-xl px-5 py-3.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-purple-400/50 transition-all border border-white/10 bg-black/30 placeholder-white/40 resize-none" />
                    </div>
                    <button type="submit" disabled={submitStatus === "sending"} className="inline-flex items-center gap-3 px-10 py-4 rounded-full border border-purple-400/40 hover:border-purple-300 bg-purple-600/30 hover:bg-purple-500/40 text-white font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-xl">
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
                  {services.map((s, i) => (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      viewport={{ once: true }}
                      className="group p-6 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md hover:bg-black/30 hover:border-purple-400/40 transition-all duration-300 shadow-xl"
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

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* FOOTER                                                    */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <footer ref={footerRef} className="relative z-10 overflow-hidden bg-transparent">
          <svg className="w-full h-auto block" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ marginBottom: "-4px" }}>
            <defs>
              <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" /><stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.95" /></linearGradient>
              <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9333ea" stopOpacity="0.08" /><stop offset="100%" stopColor="#0f0f1a" stopOpacity="0.85" /></linearGradient>
              <linearGradient id="sg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c084fc" stopOpacity="0.06" /><stop offset="60%" stopColor="#1a1a2e" stopOpacity="0.5" /><stop offset="100%" stopColor="#0a0a14" /></linearGradient>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="transparent" /><stop offset="40%" stopColor="#0d0b1a" stopOpacity="0.5" /><stop offset="100%" stopColor="#0a0a14" stopOpacity="1" /></linearGradient>
            </defs>
            <rect width="1440" height="320" fill="url(#sky)" />
            <path d="M0,280 L80,240 L160,255 L240,210 L320,230 L400,185 L480,200 L560,160 L640,175 L680,140 L720,120 L760,140 L800,165 L880,190 L960,170 L1040,195 L1120,175 L1200,200 L1280,185 L1360,210 L1440,195 L1440,320 L0,320 Z" fill="url(#sg2)" opacity="0.5" />
            <path d="M0,290 L60,270 L120,280 L200,245 L280,260 L340,220 L420,235 L480,195 L540,210 L600,175 L660,155 L720,100 L780,155 L820,180 L880,200 L940,185 L1000,210 L1060,195 L1120,215 L1180,200 L1240,225 L1320,210 L1380,230 L1440,220 L1440,320 L0,320 Z" fill="url(#sg1)" opacity="0.75" />
            <path d="M0,300 L40,290 L100,295 L160,275 L220,285 L280,260 L340,270 L400,245 L440,255 L500,230 L560,240 L620,215 L680,195 L720,160 L760,195 L800,220 L840,235 L900,250 L960,240 L1020,255 L1060,245 L1120,260 L1180,250 L1240,265 L1300,255 L1360,270 L1400,260 L1440,265 L1440,320 L0,320 Z" fill="url(#sg3)" />
          </svg>

          <div style={{ background: "linear-gradient(to bottom, #0a0a14, #0d0d1a 40%, #111126)" }} className="relative">
            <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 pt-16 pb-10">
              <div className="footer-animate flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 mb-16">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center relative" style={{ background: "rgba(147,51,234,0.12)", boxShadow: "0 0 30px rgba(147,51,234,0.15), inset 0 1px 1px rgba(255,255,255,0.05)" }}>
                    <img src="/images/icon-logo.png" alt="Prominence" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                  </div>
                  <div>
                    <h4 className="font-black tracking-[0.25em] uppercase text-white/90 text-sm">Prominence</h4>
                    <p className="text-[9px] tracking-[0.3em] uppercase text-purple-400/60 font-semibold mt-0.5">Graphics Design</p>
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

              <div className="footer-animate w-full h-px mb-10" style={{ background: "linear-gradient(to right, transparent, rgba(147,51,234,0.25), rgba(255,255,255,0.06), rgba(147,51,234,0.25), transparent)" }} />

              <div className="footer-animate flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
                <nav className="flex flex-wrap items-center gap-6 text-[9px] tracking-[0.25em] uppercase font-bold">
                  {["Services", "Portfolio", "Contact"].map((link) => (
                    <a key={link} href={`#${link.toLowerCase()}`} className="p-3 -m-3 text-white/30 hover:text-purple-400 transition-colors duration-300">{link}</a>
                  ))}
                  <a href="/" className="p-3 -m-3 text-white/30 hover:text-purple-400 transition-colors duration-300">Home</a>
                </nav>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)] animate-pulse" />
                  <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 font-bold">Systems Operational</span>
                </div>
              </div>

              <div className="footer-animate flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] tracking-[0.3em] uppercase text-white/20 font-medium">
                <p>&copy; {new Date().getFullYear()} Prominence. All operational rights reserved.</p>
                <div className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-purple-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span>Olongapo City, 2200</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] pointer-events-none" style={{ background: "linear-gradient(to right, transparent, rgba(147,51,234,0.4), transparent)" }} />
          </div>
        </footer>
      </div>
    </>
  );
}