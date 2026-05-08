"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Menu,
  X,
  Star,
  ChevronDown,
  Share2,
  Send,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Layers,
  Palette,
  TrendingUp,
  Eye,
  Award,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = ["home", "services", "works", "about", "contact"];

const SERVICES = [
  {
    icon: <Palette size={26} />,
    title: "Brand Identity",
    desc: "Distinctive visual identities that speak volumes about who you are and where you're going.",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
  },
  {
    icon: <Layers size={26} />,
    title: "Print Design",
    desc: "Stunning print materials that leave a lasting impression in the physical world.",
    img: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&q=80",
  },
  {
    icon: <Eye size={26} />,
    title: "Visual Strategy",
    desc: "Strategic visual storytelling that connects your brand directly to your audience.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
  {
    icon: <TrendingUp size={26} />,
    title: "Marketing Design",
    desc: "Compelling marketing collaterals that drive engagement and real conversions.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
  },
  {
    icon: <Sparkles size={26} />,
    title: "Social Media",
    desc: "Eye-catching social content that stops the scroll and sparks conversation.",
    img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
  },
  {
    icon: <Award size={26} />,
    title: "Packaging Design",
    desc: "Beautiful packaging that makes your product impossible to ignore on shelves.",
    img: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=400&q=80",
  },
];

const WORKS = [
  { title: "Velour Co.", cat: "Brand Identity", img: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=600&q=80" },
  { title: "The Brown Label", cat: "Packaging", img: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&q=80" },
  { title: "Artisanal Co.", cat: "Print Design", img: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80" },
  { title: "Luxe Studio", cat: "Visual Strategy", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { title: "Bloom Brand", cat: "Social Media", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80" },
  { title: "Nomad Creative", cat: "Marketing", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80" },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen", role: "CEO, Velour Co.",
    text: "Prominence Graphics transformed our brand completely. Their attention to detail and aesthetic sensibility is truly unmatched.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    name: "Marcus Rivera", role: "Founder, The Brown Label",
    text: "Working with them was an absolute breeze. They captured our vision perfectly and delivered way beyond our expectations.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    name: "Amara Osei", role: "Marketing Dir., Luxe Studio",
    text: "Our engagement skyrocketed after the rebrand. The visual strategy they developed was absolutely spot on and measurable.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80",
  },
];

const STATS = [
  { num: "150+", label: "Projects Done" },
  { num: "80+", label: "Happy Clients" },
  { num: "5+", label: "Years Experience" },
  { num: "12", label: "Awards Won" },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // ── GSAP SETUP ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text stagger
      gsap.from(".hero-word", {
        y: 110,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "power4.out",
        delay: 0.5,
      });
      gsap.from(".hero-sub", {
        y: 28,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 1.1,
      });
      gsap.from(".hero-cta", {
        y: 28,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 1.4,
      });

      // Floating hero images entrance
      gsap.from(".fi-1", { x: 160, opacity: 0, duration: 1.3, ease: "power3.out", delay: 0.9 });
      gsap.from(".fi-2", { x: 100, y: 60, opacity: 0, duration: 1.3, ease: "power3.out", delay: 1.1 });
      gsap.from(".fi-3", { x: 70, y: -40, opacity: 0, duration: 1.3, ease: "power3.out", delay: 1.3 });

      // Continuous float
      gsap.to(".fi-1", { y: -18, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });
      gsap.to(".fi-2", { y: 14, duration: 3.7, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.3 });
      gsap.to(".fi-3", { y: -10, duration: 2.9, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.1 });

      // Subtle rotation on fi-1
      gsap.to(".fi-1", { rotation: 1.5, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });

      // Services cards
      gsap.from(".svc-card", {
        scrollTrigger: { trigger: ".svc-grid", start: "top 82%" },
        y: 70,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
      });

      // Section headings
      gsap.utils.toArray<HTMLElement>(".sec-title").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      });

      // Works grid
      gsap.from(".work-item", {
        scrollTrigger: { trigger: ".works-grid", start: "top 78%" },
        scale: 0.88,
        opacity: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Stats
      gsap.from(".stat-item", {
        scrollTrigger: { trigger: ".stats-row", start: "top 84%" },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });

      // Testimonials
      gsap.from(".testi-card", {
        scrollTrigger: { trigger: ".testi-grid", start: "top 82%" },
        x: -45,
        opacity: 0,
        duration: 0.8,
        stagger: 0.18,
        ease: "power3.out",
      });

      // About images
      gsap.from(".about-img", {
        scrollTrigger: { trigger: ".about-imgs", start: "top 80%" },
        scale: 0.92,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Parallax scrub on divider images
      gsap.utils.toArray<HTMLElement>(".par-img").forEach((el) => {
        gsap.to(el, {
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.8 },
          y: -70,
          ease: "none",
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <main
      style={{ background: "#100501", color: "#F5EDD8" }}
      className="overflow-x-hidden"
    >
      {/* ══ FONT inject ══ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .serif { font-family: 'Cormorant Garamond', serif; }
        ::selection { background: #C8956C44; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #100501; }
        ::-webkit-scrollbar-thumb { background: #7B4A2D; }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div
          style={{ background: "linear-gradient(to bottom, #100501ee, transparent)" }}
          className="absolute inset-0 backdrop-blur-md"
        />
        <div className="relative z-10 px-6 md:px-14 py-5 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="text-sm font-black tracking-[0.25em] uppercase cursor-pointer"
            onClick={() => scrollTo("home")}
          >
            <span style={{ color: "#C8956C" }}>PROMINENCE</span>
            <span style={{ color: "#F5EDD8" }}> GRAPHICS</span>
          </motion.div>

          {/* Desktop links */}
          <motion.ul
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex gap-8 text-xs tracking-[0.22em] uppercase"
          >
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <button
                  onClick={() => scrollTo(item)}
                  style={{ color: "#F5EDD880" }}
                  className="capitalize transition-colors duration-300 hover:text-[#C8956C]"
                >
                  {item}
                </button>
              </li>
            ))}
          </motion.ul>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => scrollTo("contact")}
            style={{ background: "#C8956C", color: "#100501" }}
            className="hidden md:block px-6 py-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300 hover:bg-[#F5EDD8]"
          >
            Let's Work
          </motion.button>

          {/* Hamburger */}
          <button
            style={{ color: "#F5EDD8" }}
            className="md:hidden relative z-10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ background: "#100501" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-9"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item}
                onClick={() => scrollTo(item)}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{ color: "#F5EDD8" }}
                className="text-3xl uppercase tracking-[0.2em] font-bold hover:text-[#C8956C] transition-colors capitalize"
              >
                {item}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ HERO ══ */}
      <section
        id="home"
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* BG blobs */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 70% 40%, #3D1F0D33, transparent), radial-gradient(ellipse 50% 60% at 20% 80%, #7B4A2D18, transparent), #100501",
          }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none"
          style={{ background: "#7B4A2D22" }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full px-6 md:px-14 lg:px-24 pt-28 pb-16"
        >
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0">
            {/* LEFT text */}
            <div className="flex-1 max-w-xl">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{
                  color: "#C8956C",
                  border: "1px solid #C8956C44",
                }}
                className="inline-block mb-6 px-4 py-1.5 text-[10px] tracking-[0.35em] uppercase"
              >
                Creative Design Studio
              </motion.span>

              <h1 className="text-[clamp(3rem,8vw,6rem)] font-black leading-[1.0] mb-7 tracking-tight">
                {[
                  { w: "We", c: "#F5EDD8" },
                  { w: "Make", c: "#C8956C" },
                  { w: "Brands", c: "#F5EDD8" },
                  { w: "Look", c: "#C8956C" },
                  { w: "Stunning.", c: "#F5EDD8" },
                ].map(({ w, c }, i) => (
                  <span key={i} className="block overflow-hidden">
                    <span className="hero-word inline-block" style={{ color: c }}>
                      {w}
                    </span>
                  </span>
                ))}
              </h1>

              <p
                className="hero-sub text-base leading-relaxed mb-9 max-w-sm"
                style={{ color: "#C8956CAA" }}
              >
                We craft visual experiences that elevate brands, tell stories,
                and leave lasting impressions. Design that doesn't just look
                good — it&nbsp;works.
              </p>

              <div className="hero-cta flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.04, x: 3 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => scrollTo("works")}
                  style={{ background: "#C8956C", color: "#100501" }}
                  className="group flex items-center gap-2 px-8 py-4 text-xs font-bold tracking-[0.22em] uppercase transition-colors duration-300 hover:bg-[#F5EDD8]"
                >
                  View Our Work
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => scrollTo("contact")}
                  style={{
                    border: "1px solid #C8956C55",
                    color: "#F5EDD8CC",
                  }}
                  className="px-8 py-4 text-xs font-semibold tracking-[0.22em] uppercase transition-all duration-300 hover:border-[#C8956C] hover:text-[#C8956C]"
                >
                  Get In Touch
                </motion.button>
              </div>
            </div>

            {/* RIGHT overlapping images */}
            <div className="flex-1 relative h-[480px] w-full hidden lg:block">
              {/* Image 1 — large back */}
              <div
                className="fi-1 absolute top-0 right-0 w-72 h-80 overflow-hidden shadow-2xl"
                style={{ border: "1px solid #C8956C22" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80"
                  alt="Brand work"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, #100501aa, transparent)",
                  }}
                />
              </div>

              {/* Image 2 — mid overlap */}
              <div
                className="fi-2 absolute top-28 right-56 w-52 h-64 overflow-hidden shadow-2xl z-10"
                style={{ border: "1px solid #C8956C33" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&q=80"
                  alt="Packaging"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, #2C120688, transparent)",
                  }}
                />
              </div>

              {/* Image 3 — small front */}
              <div
                className="fi-3 absolute bottom-4 right-20 w-44 h-52 overflow-hidden shadow-2xl z-20"
                style={{ border: "1px solid #7B4A2D55" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=600&q=80"
                  alt="Packaging design"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Rating badge — magazine style */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, duration: 0.5, type: "spring" }}
                style={{
                  background: "#1E0A04",
                  border: "1px solid #C8956C44",
                }}
                className="absolute bottom-24 left-2 px-5 py-4 z-30"
              >
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} fill="#C8956C" color="#C8956C" />
                  ))}
                </div>
                <p
                  className="font-black text-xl leading-none"
                  style={{ color: "#C8956C" }}
                >
                  4.9
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#F5EDD855" }}>
                  80+ happy clients
                </p>
              </motion.div>

              {/* Big PG watermark */}
              <div
                className="serif absolute bottom-0 right-0 text-[140px] font-bold leading-none select-none pointer-events-none z-0"
                style={{ color: "#C8956C08" }}
              >
                PG
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ color: "#C8956C55" }}
          >
            <span className="text-[9px] tracking-[0.35em] uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              <ChevronDown size={14} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ TAG STRIP ══ */}
      <div
        className="relative z-20 border-y"
        style={{ borderColor: "#C8956C15", background: "#100501" }}
      >
        <div className="px-6 md:px-14 py-4 flex flex-wrap gap-3 justify-center md:justify-start overflow-hidden">
          {[
            "Brand Identity",
            "Print Design",
            "Packaging",
            "Social Media",
            "Visual Strategy",
            "Marketing",
            "Photography",
            "Typography",
          ].map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              style={{ color: "#C8956C77", border: "1px solid #C8956C22" }}
              className="px-4 py-1.5 text-[9px] tracking-[0.3em] uppercase whitespace-nowrap"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <section
        style={{ borderBottom: "1px solid #C8956C12" }}
        className="py-20 px-6 md:px-14 lg:px-24"
      >
        <div className="stats-row grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {STATS.map((s, i) => (
            <div key={i} className="stat-item text-center">
              <div
                className="serif text-5xl md:text-6xl font-bold mb-2"
                style={{ color: "#C8956C" }}
              >
                {s.num}
              </div>
              <div
                className="text-[10px] tracking-[0.3em] uppercase"
                style={{ color: "#F5EDD855" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section
        id="services"
        className="py-24 px-6 md:px-14 lg:px-24 relative overflow-hidden"
      >
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none blur-[140px]"
          style={{ background: "#7B4A2D15" }}
        />

        <div className="mb-16">
          <p
            className="sec-title text-[10px] tracking-[0.4em] uppercase mb-4"
            style={{ color: "#C8956C" }}
          >
            What We Do
          </p>
          <h2
            className="sec-title text-4xl md:text-6xl font-extrabold max-w-xl leading-tight"
            style={{ color: "#F5EDD8" }}
          >
            Services That{" "}
            <span style={{ color: "#C8956C" }}>Drive</span> Results
          </h2>
        </div>

        <div className="svc-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <motion.div
              key={i}
              className="svc-card group relative overflow-hidden p-7 cursor-pointer"
              style={{
                background: "#1E0B04",
                border: "1px solid #C8956C14",
              }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
            >
              {/* Hover bg image */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.18] transition-opacity duration-500">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(to top, #2C1206ee, transparent)",
                }}
              />

              <div className="relative z-10">
                <div
                  style={{ color: "#C8956C" }}
                  className="mb-5 group-hover:scale-110 transition-transform duration-300 inline-block"
                >
                  {s.icon}
                </div>
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ color: "#F5EDD8" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#F5EDD855" }}>
                  {s.desc}
                </p>
                <div
                  style={{ color: "#C8956C" }}
                  className="mt-5 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.25em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"
                >
                  Explore <ArrowRight size={11} />
                </div>
              </div>

              {/* Bottom line reveal */}
              <div
                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                style={{ background: "#C8956C" }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ MAGAZINE DIVIDER — overlapping images strip ══ */}
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3">
          {[
            "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80",
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
          ].map((src, i) => (
            <div key={i} className="relative overflow-hidden">
              <img
                src={src}
                alt="Divider"
                className="par-img w-full h-full object-cover scale-110"
              />
              <div
                className="absolute inset-0"
                style={{ background: "#10050199" }}
              />
            </div>
          ))}
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #100501 0%, transparent 25%, transparent 75%, #100501 100%), linear-gradient(to bottom, #100501 0%, transparent 20%, transparent 80%, #100501 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <h2
            className="serif text-3xl md:text-5xl font-bold text-center italic"
            style={{ color: "#F5EDD8" }}
          >
            Crafting Visual{" "}
            <span style={{ color: "#C8956C" }}>Excellence</span>, One Brand at a
            Time
          </h2>
        </div>
      </div>

      {/* ══ WORKS ══ */}
      <section
        id="works"
        className="py-24 px-6 md:px-14 lg:px-24 relative"
      >
        <div className="flex items-end justify-between mb-16">
          <div>
            <p
              className="sec-title text-[10px] tracking-[0.4em] uppercase mb-4"
              style={{ color: "#C8956C" }}
            >
              Portfolio
            </p>
            <h2
              className="sec-title text-4xl md:text-6xl font-extrabold"
              style={{ color: "#F5EDD8" }}
            >
              Selected <span style={{ color: "#C8956C" }}>Works</span>
            </h2>
          </div>
          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => scrollTo("contact")}
            style={{ color: "#C8956C" }}
            className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase transition-all hover:gap-4"
          >
            All Projects <ArrowRight size={13} />
          </motion.button>
        </div>

        <div className="works-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORKS.map((w, i) => (
            <motion.div
              key={i}
              className="work-item group relative overflow-hidden cursor-pointer"
              style={{
                aspectRatio: i === 0 || i === 3 ? "4/5" : "3/4",
                border: "1px solid #C8956C11",
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.4 } }}
            >
              <img
                src={w.img}
                alt={w.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div
                className="absolute inset-0 transition-opacity duration-400 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(to top, #100501ee 0%, #10050144 50%, transparent 100%)",
                  opacity: 0.65,
                }}
              />

              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
                <p
                  className="text-[9px] tracking-[0.3em] uppercase mb-1.5"
                  style={{ color: "#C8956C" }}
                >
                  {w.cat}
                </p>
                <h3
                  className="text-lg font-bold"
                  style={{ color: "#F5EDD8" }}
                >
                  {w.title}
                </h3>
                <div
                  style={{ color: "#F5EDD877" }}
                  className="flex items-center gap-2 mt-2 text-[9px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity delay-100"
                >
                  View Project <ArrowRight size={11} color="#C8956C" />
                </div>
              </div>

              {/* Corner brackets */}
              <div
                className="absolute top-4 right-4 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{
                  borderTop: "1.5px solid #C8956C",
                  borderRight: "1.5px solid #C8956C",
                }}
              />
              <div
                className="absolute bottom-4 left-4 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{
                  borderBottom: "1.5px solid #C8956C",
                  borderLeft: "1.5px solid #C8956C",
                }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section
        id="about"
        className="py-24 px-6 md:px-14 lg:px-24 relative overflow-hidden"
      >
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none blur-[140px]"
          style={{ background: "#C8956C08" }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <div className="about-imgs relative h-[480px]">
            <div
              className="about-img absolute top-0 left-0 w-60 h-76 overflow-hidden shadow-2xl"
              style={{ border: "1px solid #C8956C22", height: "300px" }}
            >
              <img
                src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80"
                alt="Studio"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "#2C120633" }}
              />
            </div>

            <div
              className="about-img absolute top-20 left-36 w-52 h-64 overflow-hidden shadow-2xl z-10"
              style={{ border: "1px solid #C8956C33" }}
            >
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80"
                alt="Team"
                className="w-full h-full object-cover"
              />
            </div>

            <div
              className="about-img absolute bottom-0 left-8 w-44 h-44 overflow-hidden shadow-2xl z-20"
              style={{ border: "1px solid #7B4A2D55" }}
            >
              <img
                src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&q=80"
                alt="Design"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Years badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring" }}
              style={{ background: "#C8956C", color: "#100501" }}
              className="absolute bottom-0 right-12 px-6 py-5 z-30"
            >
              <p className="text-4xl font-black leading-none">5+</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5">
                Years Creating
              </p>
            </motion.div>

            <div
              className="serif absolute bottom-8 right-0 text-[130px] font-bold leading-none select-none pointer-events-none"
              style={{ color: "#C8956C07" }}
            >
              PG
            </div>
          </div>

          {/* Text */}
          <div>
            <p
              className="sec-title text-[10px] tracking-[0.4em] uppercase mb-4"
              style={{ color: "#C8956C" }}
            >
              Who We Are
            </p>
            <h2
              className="sec-title text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
              style={{ color: "#F5EDD8" }}
            >
              Design Studio Built on{" "}
              <span style={{ color: "#C8956C" }}>Passion</span>
            </h2>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#F5EDD877" }}>
              Prominence Graphics is a boutique design studio dedicated to
              crafting compelling visual identities for brands that refuse to
              blend in. We combine strategy with artistry to deliver designs
              that don't just look beautiful — they work.
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "#F5EDD877" }}>
              Every project is a deep collaboration. We immerse ourselves in
              your brand, understand your audience, and create visuals that
              speak directly to them. From concept to final delivery, we're
              your creative partners.
            </p>

            <div className="grid grid-cols-2 gap-5 mb-10">
              {[
                { t: "Brand-First Approach", d: "Every design decision serves your brand goals" },
                { t: "Strategic Thinking", d: "Beauty backed by purpose and deep research" },
                { t: "Detail Obsessed", d: "Perfection in every pixel and proportion" },
                { t: "Fast Turnaround", d: "Quality work delivered on time, every time" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <h4
                    className="text-xs font-semibold mb-1"
                    style={{ color: "#C8956C" }}
                  >
                    {item.t}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: "#F5EDD844" }}>
                    {item.d}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.03, x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo("contact")}
              style={{
                border: "1px solid #C8956C",
                color: "#C8956C",
              }}
              className="group flex items-center gap-2 px-8 py-4 text-xs font-bold tracking-[0.22em] uppercase transition-all duration-300 hover:bg-[#C8956C] hover:text-[#100501]"
            >
              Work With Us
              <ArrowRight
                size={13}
                className="group-hover:translate-x-1 transition-transform"
              />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ══ QUOTE DIVIDER ══ */}
      <div className="relative h-44 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80"
          alt="Quote bg"
          className="par-img w-full h-full object-cover scale-110"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #100501, #10050188 40%, #10050188 60%, #100501), linear-gradient(to bottom, #100501, transparent 20%, transparent 80%, #100501)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <p
            className="serif text-lg md:text-2xl font-normal text-center italic max-w-2xl"
            style={{ color: "#F5EDD8CC" }}
          >
            "Design is not just what it looks like and feels like.{" "}
            <em style={{ color: "#C8956C" }}>Design is how it works.</em>"
          </p>
        </div>
      </div>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-24 px-6 md:px-14 lg:px-24">
        <div className="text-center mb-16">
          <p
            className="sec-title text-[10px] tracking-[0.4em] uppercase mb-4"
            style={{ color: "#C8956C" }}
          >
            Client Love
          </p>
          <h2
            className="sec-title text-4xl md:text-6xl font-extrabold"
            style={{ color: "#F5EDD8" }}
          >
            What They <span style={{ color: "#C8956C" }}>Say</span>
          </h2>
        </div>

        <div className="testi-grid grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              className="testi-card relative p-8 transition-all duration-400"
              style={{
                background: "#1A0804",
                border: "1px solid #C8956C14",
              }}
              whileHover={{ y: -5 }}
            >
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={12} fill="#C8956C" color="#C8956C" />
                ))}
              </div>
              <p
                className="text-sm leading-relaxed mb-7 italic"
                style={{ color: "#F5EDD877" }}
              >
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover"
                  style={{ border: "1px solid #C8956C44" }}
                />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#F5EDD8" }}
                  >
                    {t.name}
                  </p>
                  <p className="text-[10px]" style={{ color: "#C8956C88" }}>
                    {t.role}
                  </p>
                </div>
              </div>
              <div
                className="serif absolute top-5 right-6 text-7xl font-bold leading-none select-none pointer-events-none"
                style={{ color: "#C8956C0D" }}
              >
                "
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ CONTACT / CTA ══ */}
      <section id="contact" className="py-24 px-6 md:px-14 lg:px-24 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "#1A0804" }}
        />
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none blur-[160px]"
          style={{ background: "#C8956C07" }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p
            className="sec-title text-[10px] tracking-[0.4em] uppercase mb-4"
            style={{ color: "#C8956C" }}
          >
            Let's Collaborate
          </p>
          <h2
            className="sec-title serif text-4xl md:text-7xl font-bold mb-5 leading-tight italic"
            style={{ color: "#F5EDD8" }}
          >
            Ready to Make Something{" "}
            <span style={{ color: "#C8956C" }}>Remarkable?</span>
          </h2>
          <p
            className="text-sm mb-12 max-w-md mx-auto leading-relaxed"
            style={{ color: "#F5EDD855" }}
          >
            Let's build a brand that turns heads and opens doors. Reach out and let's start the conversation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-left">
            <input
              type="text"
              placeholder="Your Name"
              style={{
                background: "#2C120644",
                border: "1px solid #C8956C22",
                color: "#F5EDD8",
              }}
              className="px-5 py-4 text-sm w-full placeholder:text-[#F5EDD833] focus:outline-none focus:border-[#C8956C88] transition-colors"
            />
            <input
              type="email"
              placeholder="Your Email"
              style={{
                background: "#2C120644",
                border: "1px solid #C8956C22",
                color: "#F5EDD8",
              }}
              className="px-5 py-4 text-sm w-full placeholder:text-[#F5EDD833] focus:outline-none focus:border-[#C8956C88] transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="Project Type (Brand Identity, Print, Packaging…)"
            style={{
              background: "#2C120644",
              border: "1px solid #C8956C22",
              color: "#F5EDD8",
            }}
            className="px-5 py-4 text-sm w-full placeholder:text-[#F5EDD833] focus:outline-none focus:border-[#C8956C88] transition-colors mb-3"
          />
          <textarea
            placeholder="Tell us about your project…"
            rows={4}
            style={{
              background: "#2C120644",
              border: "1px solid #C8956C22",
              color: "#F5EDD8",
            }}
            className="px-5 py-4 text-sm w-full placeholder:text-[#F5EDD833] focus:outline-none focus:border-[#C8956C88] transition-colors mb-6 resize-none"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ background: "#C8956C", color: "#100501" }}
            className="w-full md:w-auto px-16 py-5 text-xs font-black tracking-[0.25em] uppercase transition-colors duration-300 hover:bg-[#F5EDD8]"
          >
            Send Message
          </motion.button>

          <div
            className="flex flex-wrap justify-center gap-8 mt-12 text-xs"
            style={{ color: "#F5EDD844" }}
          >
            {[
              { icon: <Mail size={12} />, text: "hello@prominencegraphics.com" },
              { icon: <Phone size={12} />, text: "+1 (555) 000-0000" },
              { icon: <MapPin size={12} />, text: "New York, NY" },
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2 hover:text-[#C8956C] transition-colors cursor-pointer">
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer
        className="px-6 md:px-14 lg:px-24 pt-14 pb-8"
        style={{ borderTop: "1px solid #C8956C14" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand col */}
          <div className="md:col-span-2">
            <div
              className="text-sm font-black tracking-[0.25em] uppercase mb-4 cursor-pointer"
              onClick={() => scrollTo("home")}
            >
              <span style={{ color: "#C8956C" }}>PROMINENCE</span>
              <span style={{ color: "#F5EDD8" }}> GRAPHICS</span>
            </div>
            <p
              className="text-xs leading-relaxed max-w-xs"
              style={{ color: "#F5EDD844" }}
            >
              A boutique design studio creating visual experiences that make
              brands unforgettable. Strategy meets artistry, every time.
            </p>
            <div className="flex gap-4 mt-6">
              {[Share2, Send, MessageCircle].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  style={{ color: "#F5EDD833" }}
                  className="hover:text-[#C8956C] transition-colors"
                  whileHover={{ y: -2 }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4
              className="text-[10px] font-bold tracking-[0.3em] uppercase mb-5"
              style={{ color: "#F5EDD8" }}
            >
              Services
            </h4>
            <ul className="space-y-2.5">
              {["Brand Identity", "Print Design", "Packaging", "Social Media", "Visual Strategy"].map((s) => (
                <li key={s}>
                  <span
                    className="text-xs cursor-pointer hover:text-[#C8956C] transition-colors"
                    style={{ color: "#F5EDD844" }}
                  >
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-[10px] font-bold tracking-[0.3em] uppercase mb-5"
              style={{ color: "#F5EDD8" }}
            >
              Studio
            </h4>
            <ul className="space-y-2.5">
              {["About Us", "Our Work", "Process", "Testimonials", "Contact"].map((s) => (
                <li key={s}>
                  <span
                    className="text-xs cursor-pointer hover:text-[#C8956C] transition-colors"
                    style={{ color: "#F5EDD844" }}
                  >
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid #C8956C10" }}
        >
          <p className="text-[10px]" style={{ color: "#F5EDD833" }}>
            © 2024 Prominence Graphics. All rights reserved.
          </p>
          <p className="text-[10px] italic" style={{ color: "#F5EDD822" }}>
            Crafted with passion & precision
          </p>
        </div>
      </footer>
    </main>
  );
}