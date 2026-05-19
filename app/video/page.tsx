"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar/Navbar";
import {
  Play,
  Send,
  Scissors,
  Palette,
  Layers,
  Cpu,
  Smartphone,
  Eye,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/* HERO CARD DATA                                                             */
/* -------------------------------------------------------------------------- */
const heroCards = [
  {
    num: "01",
    title: "Cinematic Narratives\nthat Captivate",
    date: "Featured · 2024",
    img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    num: "02",
    title: "Mountain Sounds",
    date: "Short Film · 2024",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
  },
  {
    num: "03",
    title: "The Bahamas",
    date: "Travel Reel · 2024",
    img: "https://images.unsplash.com/photo-1505881502353-a1986add3762?q=80&w=800&auto=format&fit=crop",
  },
  {
    num: "04",
    title: "Urban Pulse",
    date: "Documentary · 2023",
    img: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=800&auto=format&fit=crop",
  },
  {
    num: "05",
    title: "Neon Solstice",
    date: "Music Video · 2023",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
  },
];

/* -------------------------------------------------------------------------- */
/* SERVICE DATA                                                               */
/* -------------------------------------------------------------------------- */
const services = [
  { icon: Scissors, title: "Narrative Editing", desc: "Shaping the emotional arc with precise cuts, rhythm, and story progression." },
  { icon: Palette, title: "Color Grading", desc: "Elevating visual tone through professional color science and mood matching." },
  { icon: Layers, title: "Motion Design", desc: "Kinetic typography and contextual motion graphics that elevate flow." },
  { icon: Cpu, title: "Soundscapes", desc: "Multi-track depth, foley, and score mixes for an organic heartbeat." },
  { icon: Smartphone, title: "Social Formats", desc: "Re-envisioning cinematic narratives into native vertical form factors." },
  { icon: Eye, title: "Compositing", desc: "Seamless cleanups, tracking, rotoscoping, and multi-plate integration." },
];

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */
export default function VideoPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  /* ── Animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero cards stagger
      gsap.fromTo(
        ".hero-card",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.3 }
      );
      // Contact fade
      if (contactRef.current) {
        gsap.fromTo(contactRef.current, { opacity: 0 }, {
          opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: contactRef.current, start: "top 85%" },
        });
      }
      // Footer
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

      {/* Global Wrapper with Vertical Radiant Gradient */}
      <div
        className="relative min-h-screen text-white overflow-x-hidden selection:bg-purple-500/20"
        style={{ background: "linear-gradient(180deg, #ffffff 0%, #000000ff 15%, #000000ff 50%, #2e1065 75%, #0a0814 100%)" }}
      >
        {/* Starfield */}
        <div className="starfield fixed inset-0 z-0 opacity-40 mix-blend-screen" />

        {/* Navbar */}
        <Navbar />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* HERO — FULLSCREEN BG + OVERLAID CARD COLUMN               */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative z-10 h-screen min-h-[600px] overflow-hidden">

          {/* ── Full-screen background image ── */}
          <img
            src={heroCards[featuredIndex].img}
            alt={heroCards[featuredIndex].title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.2s] ease-out scale-105"
          />

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent opacity-50" />

          {/* ── Bottom-left: Title + CTA content ── */}
          <div className="absolute bottom-0 left-0 right-0 lg:right-[380px] p-8 sm:p-12 lg:p-16 z-10">
            <span
              className="block text-white/[0.07] font-black leading-none mb-4"
              style={{ fontSize: "clamp(5rem, 12vw, 10rem)", fontFamily: "Inter, sans-serif" }}
            >
              {heroCards[featuredIndex].num}
            </span>
            <h1
              className="font-black leading-[1.05] text-white mb-4 max-w-2xl drop-shadow-lg"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              {heroCards[featuredIndex].title.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h1>
            <p className="text-white/60 text-sm font-medium tracking-wide mb-8">{heroCards[featuredIndex].date}</p>
            <button className="inline-flex items-center gap-3 text-white/90 hover:text-white transition-colors group/btn">
              <span className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center group-hover/btn:border-purple-400 group-hover/btn:bg-purple-500/20 transition-all shadow-lg bg-black/30 backdrop-blur-sm">
                <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
              </span>
              <span className="text-sm font-bold tracking-[0.15em] uppercase drop-shadow-md">Watch Promo</span>
            </button>
          </div>

          {/* ── RIGHT: Overlaid card column ── */}
          <div
            className="absolute top-0 right-0 bottom-0 w-full lg:w-[380px] z-20 flex flex-col overflow-y-auto"
            style={{ scrollbarWidth: 'none', background: 'linear-gradient(to left, rgba(0,0,0,0.5), rgba(0,0,0,0.2))' }}
          >
            {/* Spacer to push cards below navbar */}
            <div className="flex-shrink-0 h-20" />

            {heroCards.map((card, index) => {
              const isActive = index === featuredIndex;
              return (
                <div
                  key={card.num}
                  className={`hero-card relative overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-500 ${isActive ? 'pointer-events-none' : 'group'}`}
                  style={{
                    height: isActive ? '160px' : '130px',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                  }}
                  onClick={() => !isActive && setFeaturedIndex(index)}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Darken overlay — active card is brighter */}
                  <div className={`absolute inset-0 transition-all duration-500 ${isActive ? 'bg-black/30' : 'bg-black/50 group-hover:bg-black/30'}`} />

                  {/* Active indicator — left purple accent bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-purple-400 z-10" />
                  )}

                  <div className="absolute inset-0 flex items-center justify-between px-5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-full border flex items-center justify-center backdrop-blur-sm transition-all ${isActive ? 'border-purple-400/60 bg-purple-500/20' : 'border-white/20 bg-black/30 group-hover:border-purple-400/40 group-hover:bg-purple-500/10'}`}>
                        <Play className="w-3.5 h-3.5 ml-0.5 text-white/90" fill="currentColor" />
                      </span>
                      <div>
                        <p className={`font-bold text-sm drop-shadow-md ${isActive ? 'text-white' : 'text-white/80'}`}>{card.title}</p>
                        <p className={`text-[11px] font-medium ${isActive ? 'text-white/70' : 'text-white/40'}`}>{card.date}</p>
                      </div>
                    </div>
                    <span
                      className={`font-black leading-none ${isActive ? 'text-white/[0.12]' : 'text-white/[0.08]'}`}
                      style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontFamily: "Inter, sans-serif" }}
                    >
                      {card.num}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* CONTACT + SERVICES — UNIFIED 2-COL                        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section ref={contactRef} id="contact" className="relative z-10 py-32 px-6 sm:px-12 bg-transparent">
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
              <div className="bg-black/10 backdrop-blur-lg p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
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
                      className="inline-flex items-center gap-3 px-10 py-4 rounded-full border border-purple-400/40 hover:border-purple-300 bg-purple-600/30 hover:bg-purple-500/40 text-white font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-xl"
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
        {/* Background removed, defaults to global #0a0814 at the bottom */}
        <footer ref={footerRef} className="relative z-10 overflow-hidden bg-transparent">
          {/* Summit Silhouette */}
          <svg className="w-full h-auto block" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ marginBottom: "-4px" }}>
            <defs>
              <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9333ea" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0f0f1a" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="sg3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.06" />
                <stop offset="60%" stopColor="#1a1a2e" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0a0a14" />
              </linearGradient>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="40%" stopColor="#0d0b1a" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0a0a14" stopOpacity="1" />
              </linearGradient>
            </defs>
            <rect width="1440" height="320" fill="url(#sky)" />
            <path d="M0,280 L80,240 L160,255 L240,210 L320,230 L400,185 L480,200 L560,160 L640,175 L680,140 L720,120 L760,140 L800,165 L880,190 L960,170 L1040,195 L1120,175 L1200,200 L1280,185 L1360,210 L1440,195 L1440,320 L0,320 Z" fill="url(#sg2)" opacity="0.5" />
            <path d="M0,290 L60,270 L120,280 L200,245 L280,260 L340,220 L420,235 L480,195 L540,210 L600,175 L660,155 L720,100 L780,155 L820,180 L880,200 L940,185 L1000,210 L1060,195 L1120,215 L1180,200 L1240,225 L1320,210 L1380,230 L1440,220 L1440,320 L0,320 Z" fill="url(#sg1)" opacity="0.75" />
            <path d="M0,300 L40,290 L100,295 L160,275 L220,285 L280,260 L340,270 L400,245 L440,255 L500,230 L560,240 L620,215 L680,195 L720,160 L760,195 L800,220 L840,235 L900,250 L960,240 L1020,255 L1060,245 L1120,260 L1180,250 L1240,265 L1300,255 L1360,270 L1400,260 L1440,265 L1440,320 L0,320 Z" fill="url(#sg3)" />
          </svg>

          {/* Footer Content */}
          <div style={{ background: "linear-gradient(to bottom, #0a0a14, #0d0d1a 40%, #111126)" }} className="relative">
            <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 pt-16 pb-10">
              {/* Brand + Contact */}
              <div className="footer-animate flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 mb-16">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center relative" style={{ background: "rgba(147,51,234,0.12)", boxShadow: "0 0 30px rgba(147,51,234,0.15), inset 0 1px 1px rgba(255,255,255,0.05)" }}>
                    <img src="/images/icon-logo.png" alt="Prominence" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
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
      </div>
    </>
  );
}