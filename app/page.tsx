"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, Variants, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import {
  Code2, Video, Palette, Mail, ChevronDown, Star,
  Menu, X, Terminal, MonitorPlay, PenTool, LayoutTemplate,
  Zap, Layout, MessageSquare, ArrowRight, Layers, Sparkles,
  Globe, Database, Server, Smartphone, Box,
  Film, Camera, Wand2, Paintbrush, MousePointerClick,
  Scissors, Image, Type, ExternalLink, Layers2,
  Phone, MapPin, Clock, Send, BookOpen, Sun, Moon
} from 'lucide-react';

/* ─── scripture verses ─── */
const SCRIPTURES = [
  {
    text: "But remember the Lord your God, for it is he who gives you the ability to produce wealth, and so confirms his covenant, which he swore to your ancestors, as it is today.",
    ref: "Deuteronomy 8:18"
  },
  {
    text: "Commit your work to the Lord, and your plans will be established.",
    ref: "Proverbs 16:3"
  },
  {
    text: "Whatever you do, work heartily, as for the Lord and not for men.",
    ref: "Colossians 3:23"
  },
  {
    text: "For God gave us a spirit not of fear but of power and love and self-control.",
    ref: "2 Timothy 1:7"
  }
];

/* ─── project data ─── */
const projects = [
  { title: "E-Commerce Architecture", category: "Web Development", tech: ["Next.js", "TypeScript", "Stripe"], image: "/images/ecommerce.png" },
  { title: "Cinematic Reel Suite", category: "Video Production", tech: ["After Effects", "DaVinci Resolve"], image: "/images/video.png" },
  { title: "Brand Identity System", category: "Visual Design", tech: ["Illustrator", "Figma"], image: "/images/brand.png" },
  { title: "Fitness App UI", category: "Mobile Design", tech: ["React Native", "Expo"], image: "/images/mobile.png" },
  { title: "SaaS Analytics Dashboard", category: "Web Application", tech: ["Next.js", "D3.js", "Supabase"], image: "/images/dashboard.png" },
];

/* ─── tools data ─── */
const toolCategories = [
  {
    title: "Development", icon: Terminal, accent: "from-purple-500/40 to-violet-600/20",
    tools: [
      { name: "Next.js / React", icon: Globe }, { name: "TypeScript", icon: Code2 }, { name: "Node.js", icon: Server },
      { name: "Firebase / Supabase", icon: Database }, { name: "Vercel Deployment", icon: Zap }, { name: "VS Code", icon: MonitorPlay },
    ],
  },
  {
    title: "Video & Editing", icon: Video, accent: "from-pink-500/40 to-purple-600/20",
    tools: [
      { name: "CapCut Pro", icon: Film }, { name: "DaVinci Resolve", icon: Camera }, { name: "After Effects", icon: Wand2 }, { name: "Motion Graphics", icon: Sparkles },
    ],
  },
  {
    title: "Visual Design", icon: Palette, accent: "from-indigo-500/40 to-purple-600/20",
    tools: [
      { name: "Adobe Photoshop", icon: Image }, { name: "Adobe Illustrator", icon: PenTool }, { name: "Figma", icon: Box },
      { name: "Canva Professional", icon: Paintbrush }, { name: "UI/UX Prototyping", icon: MousePointerClick },
    ],
  },
];

/* ═══════════════════════════════════
   SCRIPTURE ROTATOR COMPONENT
   ═══════════════════════════════════ */
function ScriptureFooter() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SCRIPTURES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="scripture-banner py-10 relative z-50">
      <div className="max-w-5xl mx-auto px-6 flex justify-center">
        <div className="scripture-glass min-h-[140px] md:min-h-[110px] flex items-center justify-center w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="flex items-center gap-4">
                <BookOpen size={16} className="text-purple-500/70 flex-shrink-0 hidden sm:block" />
                <p className="text-xs md:text-sm leading-relaxed font-medium italic opacity-80">
                  &ldquo;{SCRIPTURES[index].text}&rdquo;
                </p>
                <BookOpen size={16} className="text-purple-500/70 flex-shrink-0 hidden sm:block" />
              </div>
              <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-purple-500/90 font-bold">
                — {SCRIPTURES[index].ref}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   LOADING COMPONENT
   ═══════════════════════════════════ */
function InitialLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none"
      style={{ background: 'var(--background)' }}
    >
      {/* Background Logo Removed */}

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          className="magazine-font text-5xl md:text-7xl font-black tracking-widest mb-4 flex gap-1"
          initial={{ opacity: 0, y: 20, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.25em' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="gradient-text font-black">PROMI</span>
          <span className="text-[var(--foreground)] font-black">NENCE</span>
        </motion.div>

        <motion.div
          className="text-xs md:text-sm uppercase tracking-[0.4em] font-bold text-[var(--foreground)] opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Business Services
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════
   AUDIO LOGIC (Bubbly Clicks)
   ═══════════════════════════════════ */
const playBloop = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch(e) {}
};

/* ═══════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════ */
export default function PortfolioPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  // Loading Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800); // Intro screen duration

    return () => clearTimeout(timer);
  }, []);

  // Theme Logic
  useEffect(() => {
    // Check locally or default to dark
    const stored = localStorage.getItem('prominence-theme');
    if (stored === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('prominence-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('prominence-theme', 'light');
    }
  };

  /* ── motion variants ── */
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
  };
  const fadeScale: Variants = {
    hidden: { opacity: 0, scale: 0.88, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
  };
  const slideLeft: Variants = {
    hidden: { opacity: 0, x: -70, skewX: 2 },
    visible: { opacity: 1, x: 0, skewX: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
  };
  const slideRight: Variants = {
    hidden: { opacity: 0, x: 70, skewX: -2 },
    visible: { opacity: 1, x: 0, skewX: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
  };
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.2 } }
  };
  const staggerItem: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };
  const powerEntrance: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 30, filter: 'blur(10px)' },
    visible: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
  };

  /* ── GSAP floating orbs ── */
  useEffect(() => {
    if (isLoading) return; // Wait for load to finish

    const orbs = document.querySelectorAll('.depth-layer');
    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        y: `random(-40, 40)`,
        x: `random(-30, 30)`,
        scale: `random(0.85, 1.15)`,
        duration: `random(4, 8)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.5,
      });
    });

    const title = document.querySelector('.hero-title');
    if (title) {
      gsap.to(title, {
        textShadow: '0 0 30px rgba(168, 85, 247, 0.4), 0 0 70px rgba(168, 85, 247, 0.15)',
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <InitialLoader key="loader" />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full min-h-screen text-[var(--foreground)] noise-overlay overflow-hidden"
        >

          {/* ═══ BACKGROUND DEPTH LAYERS ═══ */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="depth-layer w-[700px] h-[700px] bg-purple-500/10 top-[-15%] left-[-10%] animate-pulse-glow" />
            <div className="depth-layer w-[550px] h-[550px] bg-pink-500/5 top-[25%] right-[-12%] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
            <div className="depth-layer w-[450px] h-[450px] bg-fuchsia-500/5 bottom-[5%] left-[15%] animate-pulse-glow" style={{ animationDelay: '3s' }} />
            <div className="depth-layer w-[350px] h-[350px] bg-indigo-500/10 top-[55%] right-[25%] animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
            <div className="grid-pattern fixed inset-0 opacity-[0.25]" />
          </div>

          {/* ═══ NAVIGATION ═══ */}
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }} 
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl bg-[var(--surface-1)]/60 backdrop-blur-xl border border-purple-500/20 rounded-[2rem] shadow-xl shadow-purple-500/5 px-3 py-2.5 flex justify-between items-center"
          >
            <motion.div
              className="flex items-center gap-3 cursor-pointer pl-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { playBloop(); window.scrollTo(0,0); }}
            >
              <div className="skeuo-icon !w-9 !h-9 !rounded-[10px] overflow-hidden p-1.5 flex-shrink-0 relative group">
                <img src="/images/Logo.svg" alt="Logo" className="w-full h-full object-contain grayscale dark:invert opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>

            <div className="flex items-center">
              <div className="hidden md:flex items-center gap-1.5">
                {['Projects', 'Tools', 'About', 'Contact'].map((item) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => playBloop()}
                    className="px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-bold opacity-70 rounded-full
                      hover:text-purple-500 hover:bg-purple-500/10 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>

              <div className="flex items-center gap-1 ml-4 pl-4 border-l border-purple-500/10">
                <motion.button
                  onClick={() => { playBloop(); toggleTheme(); }}
                  className="p-2.5 rounded-full hover:bg-purple-500/10 text-purple-500 dark:text-purple-400 transition-colors"
                  whileHover={{ scale: 1.15, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {isDarkMode ? (
                      <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                        <Moon size={16} />
                      </motion.div>
                    ) : (
                      <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                        <Sun size={16} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button 
                  className="md:hidden p-2.5 rounded-full hover:bg-purple-500/10 text-purple-500 transition-colors" 
                  onClick={() => { playBloop(); setIsNavOpen(!isNavOpen); }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isNavOpen ? <X size={18} /> : <Menu size={18} />}
                </motion.button>
              </div>
            </div>
            
            {/* Mobile menu dropdown */}
            <AnimatePresence>
              {isNavOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-[120%] left-0 right-0 bg-[var(--surface-1)]/95 backdrop-blur-2xl border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl md:hidden origin-top"
                >
                  <div className="p-2 flex flex-col">
                    {['Projects', 'Tools', 'About', 'Contact'].map((item) => (
                      <motion.a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        onClick={() => { playBloop(); setIsNavOpen(false); }}
                        className="px-6 py-4 text-xs uppercase tracking-[0.2em] font-bold opacity-80 text-center
                          hover:text-purple-500 hover:bg-purple-500/10 rounded-xl transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {item}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>

          {/* ═══ HERO SECTION ═══ */}
          <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden px-6">
            {/* Concentric rings & Background Layers */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
              <div className="w-[400px] h-[400px] rounded-full border border-purple-500/10 animate-breathe" />
              <div className="absolute w-[600px] h-[600px] rounded-full border border-pink-500/10 animate-breathe" style={{ animationDelay: '0.8s' }} />
              <div className="absolute w-[800px] h-[800px] rounded-full border border-purple-500/5 animate-breathe" style={{ animationDelay: '1.6s' }} />
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center z-10 max-w-4xl"
              style={{ y: heroParallax }}
            >
              <motion.div variants={staggerItem} className="mb-6">
                <motion.span
                  className="glass-accent inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] md:text-xs uppercase tracking-[0.3em] font-bold text-purple-600 dark:text-purple-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Sparkles size={14} className="animate-float" />
                  Elevating Digital Presence
                </motion.span>
              </motion.div>

              <motion.h1
                variants={powerEntrance}
                className="hero-title text-7xl md:text-[11rem] font-black magazine-font leading-[0.82] mb-8 tracking-tight"
              >
                <span className="gradient-text">PROMI</span>
                <span>NENCE</span>
              </motion.h1>

              <motion.p variants={staggerItem} className="text-base md:text-lg opacity-80 max-w-xl mx-auto mb-12 leading-relaxed font-medium">
                Crafting premium digital experiences at the intersection of code, design, and creative storytelling.
              </motion.p>

              <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                <motion.a
                  href="#projects"
                  onClick={playBloop}
                  className="neu-button px-10 py-4 font-black tracking-[0.15em] uppercase text-sm flex items-center justify-center gap-3 text-purple-600 dark:text-purple-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  View Work <ArrowRight size={18} />
                </motion.a>
                <motion.a
                  href="#contact"
                  onClick={playBloop}
                  className="glass-panel px-10 py-4 rounded-2xl font-bold tracking-[0.1em] uppercase text-sm opacity-80
                    flex items-center justify-center gap-3 hover:text-purple-500 hover:opacity-100 transition-colors duration-300 relative overflow-hidden group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Mail size={18} /> Get in Touch
                  <motion.div className="absolute inset-0 bg-purple-500/10 scale-0 group-hover:scale-100 rounded-2xl transition-transform duration-300" />
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute bottom-10 flex flex-col items-center gap-2"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-50">Scroll</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown size={22} className="text-purple-500" />
              </motion.div>
            </motion.div>
          </section>

          <div className="section-divider" />

          {/* ═══ PROJECTS SECTION ═══ */}
          <section id="projects" className="py-28 px-6 max-w-7xl mx-auto relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={staggerContainer}>
              <motion.div variants={slideLeft} className="mb-20">
                <span className="text-[11px] uppercase tracking-[0.3em] text-purple-500 font-bold mb-4 block">Portfolio</span>
                <h2 className="text-5xl md:text-7xl magazine-font font-black">
                  Selected <span className="gradient-text italic">Works</span>
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Project 1 */}
                <motion.div 
                  variants={fadeScale} 
                  className="md:col-span-8 project-card cursor-pointer group h-[400px] md:h-[520px]"
                  whileHover={{ scale: 1.02, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={playBloop}
                >
                  <motion.img src={projects[0].image} className="w-full h-full object-cover origin-center" alt={projects[0].title} whileHover={{ scale: 1.05 }} transition={{ duration: 0.8, ease: "easeOut" }} />
                  <div className="card-content">
                    <div className="bg-[var(--background)] backdrop-blur-md inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-purple-500 shadow-sm border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                      {projects[0].category}
                    </div>
                    <h3 className="text-2xl md:text-3xl magazine-font font-bold mb-2 text-white drop-shadow-md group-hover:text-purple-300 transition-colors duration-300">{projects[0].title}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {projects[0].tech.map(t => (
                        <span key={t} className="text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Project 2 & 3 */}
                <div className="md:col-span-4 flex flex-col gap-8">
                  <motion.div 
                    variants={slideRight} 
                    className="project-card cursor-pointer group h-[240px]"
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    onClick={playBloop}
                  >
                    <motion.img src={projects[1].image} className="w-full h-full object-cover origin-center" alt={projects[1].title} whileHover={{ scale: 1.05 }} transition={{ duration: 0.8, ease: "easeOut" }} />
                    <div className="card-content !p-6">
                      <div className="bg-[var(--background)] backdrop-blur-md inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] mb-2 text-purple-500 shadow-sm border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                        {projects[1].category}
                      </div>
                      <h3 className="text-lg magazine-font font-bold text-white drop-shadow-md">{projects[1].title}</h3>
                    </div>
                  </motion.div>
                  <motion.div 
                    variants={slideRight} 
                    className="project-card cursor-pointer group h-[240px]"
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    onClick={playBloop}
                  >
                    <motion.img src={projects[2].image} className="w-full h-full object-cover origin-center" alt={projects[2].title} whileHover={{ scale: 1.05 }} transition={{ duration: 0.8, ease: "easeOut" }} />
                    <div className="card-content !p-6">
                      <div className="bg-[var(--background)] backdrop-blur-md inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] mb-2 text-purple-500 shadow-sm border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                        {projects[2].category}
                      </div>
                      <h3 className="text-lg magazine-font font-bold text-white drop-shadow-md">{projects[2].title}</h3>
                    </div>
                  </motion.div>
                </div>

                {/* Project 4 */}
                <motion.div 
                  variants={slideLeft} 
                  className="md:col-span-5 project-card cursor-pointer group h-[360px]"
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={playBloop}
                >
                  <motion.img src={projects[3].image} className="w-full h-full object-cover origin-center" alt={projects[3].title} whileHover={{ scale: 1.05 }} transition={{ duration: 0.8, ease: "easeOut" }} />
                  <div className="card-content">
                    <div className="bg-[var(--background)] backdrop-blur-md inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-purple-500 shadow-sm border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                      {projects[3].category}
                    </div>
                    <h3 className="text-xl md:text-2xl magazine-font font-bold mb-2 text-white drop-shadow-md">{projects[3].title}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {projects[3].tech.map(t => (
                        <span key={t} className="text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Project 5 */}
                <motion.div 
                  variants={slideRight} 
                  className="md:col-span-7 project-card cursor-pointer group h-[360px]"
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={playBloop}
                >
                  <motion.img src={projects[4].image} className="w-full h-full object-cover origin-center" alt={projects[4].title} whileHover={{ scale: 1.05 }} transition={{ duration: 0.8, ease: "easeOut" }} />
                  <div className="card-content">
                    <div className="bg-[var(--background)] backdrop-blur-md inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-purple-500 shadow-sm border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                      {projects[4].category}
                    </div>
                    <h3 className="text-xl md:text-2xl magazine-font font-bold mb-2 text-white drop-shadow-md">{projects[4].title}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {projects[4].tech.map(t => (
                        <span key={t} className="text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>

          <div className="section-divider" />

          {/* ═══ TOOLS SECTION ═══ */}
          <section id="tools" className="py-32 px-6 relative">
            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={staggerContainer}>
                <motion.div variants={fadeUp} className="mb-20 text-center">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-purple-500 font-bold mb-4 block">Expertise</span>
                  <h2 className="text-5xl md:text-7xl magazine-font font-black">
                    Tools & <span className="gradient-text italic">Stack</span>
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {toolCategories.map((cat, ci) => (
                    <motion.div
                      key={cat.title}
                      variants={fadeScale}
                      whileHover={{ y: -6, transition: { duration: 0.4 } }}
                      className="glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden group"
                    >
                      <div className={`absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br ${cat.accent} rounded-full blur-[60px] opacity-40
                        group-hover:opacity-80 transition-opacity duration-700 pointer-events-none`} />

                      <div className="flex items-center gap-4 mb-8 relative z-10">
                        <motion.div
                          className="skeuo-icon"
                          whileHover={{ rotate: 8, scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <cat.icon size={24} className="text-purple-500" />
                        </motion.div>
                        <h3 className="text-2xl magazine-font font-bold">{cat.title}</h3>
                      </div>

                      <div className="space-y-3 relative z-10">
                        {cat.tools.map((tool, ti) => (
                          <motion.div
                            key={tool.name}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: ci * 0.12 + ti * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="tool-item"
                          >
                            <div className="tool-icon">
                              <tool.icon size={16} className="text-purple-500" />
                            </div>
                            {tool.name}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          <div className="section-divider" />

          {/* ═══ ABOUT & TESTIMONIALS ═══ */}
          <section id="about" className="py-28 px-6 max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

              {/* Left — The Story */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={staggerContainer}>
                <motion.div variants={slideLeft}>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-purple-500 font-bold mb-4 block">About</span>
                  <h2 className="text-5xl md:text-6xl magazine-font font-black mb-10">
                    The <span className="gradient-text italic">Story</span>
                  </h2>
                </motion.div>

                <motion.div variants={fadeScale} className="glass-panel p-10 md:p-12 rounded-3xl">
                  <p className="leading-relaxed text-lg mb-6 font-medium opacity-90">
                    Specializing in the intersection of code and aesthetics, I provide comprehensive virtual assistance and technical development for creators and founders who demand excellence.
                  </p>
                  <p className="leading-relaxed opacity-70">
                    From architecting scalable web applications to producing cinematic visual content, every project is approached with meticulous attention to detail and a relentless pursuit of quality.
                  </p>
                  <div className="mt-8 flex gap-8">
                    {[
                      { num: "50+", label: "Projects" },
                      { num: "3+", label: "Years" },
                      { num: "100%", label: "Satisfaction" },
                    ].map((stat, i) => (
                      <React.Fragment key={stat.label}>
                        {i > 0 && <div className="w-px bg-purple-500/20" />}
                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="text-3xl font-black gradient-text magazine-font">{stat.num}</div>
                          <div className="text-[10px] uppercase tracking-[0.2em] mt-1 font-bold opacity-60">{stat.label}</div>
                        </motion.div>
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Right — Testimonials */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={staggerContainer} className="space-y-6">
                <motion.div variants={slideRight}>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-purple-500 font-bold mb-4 block">Testimonials</span>
                  <h2 className="text-3xl magazine-font font-black mb-8">
                    Client <span className="gradient-text italic">Voices</span>
                  </h2>
                </motion.div>

                {[
                  { quote: "A true professional who understands both the technical and creative aspects of a project. Delivered beyond expectations.", name: "Sarah Chen", role: "Startup Founder" },
                  { quote: "The attention to detail is unmatched. Our brand identity was transformed into something we're truly proud of.", name: "Marcus Rivera", role: "Creative Director" },
                  { quote: "Fast, reliable, and incredibly talented. The e-commerce platform they built increased our conversion rate by 40%.", name: "Emily Tanaka", role: "E-Commerce Manager" },
                ].map((testimonial, i) => (
                  <motion.div
                    key={i}
                    variants={fadeScale}
                    whileHover={{ scale: 1.02, y: -3 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="neu-pressed p-8 relative overflow-hidden cursor-default"
                  >
                    <MessageSquare className="absolute top-6 right-6 opacity-10" size={50} />
                    <div className="flex text-purple-400 mb-4 gap-0.5">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <p className="italic mb-5 leading-relaxed font-medium opacity-80">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="skeuo-icon !w-10 !h-10 !rounded-xl">
                        <span className="text-sm font-black text-purple-500">{testimonial.name[0]}</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold">{testimonial.name}</div>
                        <div className="text-[11px] font-semibold opacity-60">{testimonial.role}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          <div className="section-divider" />

          {/* ═══ CONTACT SECTION ═══ */}
          <section id="contact" className="py-32 px-6 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-2)] to-transparent pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={staggerContainer}>
                <motion.div variants={fadeUp} className="text-center mb-16">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-purple-500 font-bold mb-4 block">Connect</span>
                  <h2 className="text-5xl md:text-7xl magazine-font font-black mb-4">
                    Let&apos;s <span className="gradient-text italic">Build</span>
                  </h2>
                  <p className="max-w-lg mx-auto font-medium opacity-80">
                    Have a project in mind? Let&apos;s create something beautiful and extraordinary together.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  {/* Contact Info Cards */}
                  <motion.div variants={slideLeft} className="lg:col-span-2 space-y-6">
                    {[
                      { icon: Mail, label: "Email", value: "hello@prominence.dev", desc: "Drop a line anytime" },
                      { icon: Phone, label: "Phone", value: "+1 (555) 000-0000", desc: "Mon–Fri, 9am–6pm" },
                      { icon: MapPin, label: "Location", value: "Remote — Worldwide", desc: "Available globally" },
                      { icon: Clock, label: "Response Time", value: "Within 24 hours", desc: "Guaranteed reply" },
                    ].map((contact, i) => (
                      <motion.div
                        key={contact.label}
                        variants={fadeScale}
                        whileHover={{ x: 6, transition: { duration: 0.3 } }}
                        className="glass-panel p-6 rounded-2xl flex items-center gap-5 group cursor-default"
                      >
                        <motion.div
                          className="skeuo-icon !w-12 !h-12 !rounded-xl flex-shrink-0"
                          whileHover={{ rotate: 10 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <contact.icon size={20} className="text-purple-500" />
                        </motion.div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-purple-500 font-bold mb-0.5 opacity-80">{contact.label}</div>
                          <div className="text-sm font-bold">{contact.value}</div>
                          <div className="text-[11px] font-medium mt-0.5 opacity-60">{contact.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Contact Form */}
                  <motion.div
                    variants={slideRight}
                    className="lg:col-span-3 glass-heavy p-10 md:p-12 rounded-[2rem] relative overflow-hidden"
                  >
                    {/* Decorative glow */}
                    <div className="absolute -top-24 -right-24 w-56 h-56 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/10 rounded-full blur-[50px] pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="skeuo-icon !w-12 !h-12 !rounded-xl">
                          <Send size={20} className="text-purple-500" />
                        </div>
                        <div>
                          <h3 className="text-xl magazine-font font-black">Send a Message</h3>
                          <p className="text-[11px] font-bold opacity-60">Fill out the form below</p>
                        </div>
                      </div>

                      <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <input type="text" placeholder="Your Name" className="form-input" />
                          <input type="email" placeholder="Email Address" className="form-input" />
                        </div>
                        <input type="text" placeholder="Subject" className="form-input" />
                        <textarea placeholder="Tell me about your project, goals, and timeline..." rows={5} className="form-input resize-none" />

                        <motion.button
                          onClick={playBloop}
                          className="neu-button w-full py-5 font-black tracking-[0.15em] uppercase text-sm flex items-center justify-center gap-3 relative overflow-hidden group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                          <span className="text-purple-600 dark:text-purple-400 relative z-10 transition-colors group-hover:text-purple-300">Send Message</span>
                          <motion.div
                            className="relative z-10 text-purple-600 dark:text-purple-400 transition-colors group-hover:text-purple-300"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <ArrowRight size={18} />
                          </motion.div>
                        </motion.button>
                      </form>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          <div className="section-divider" />

          {/* ═══ SCRIPTURE FOOTER ═══ */}
          <ScriptureFooter />

          {/* ═══ FOOTER ═══ */}
          <footer className="relative z-10 border-t border-purple-500/20 bg-[var(--surface-2)]">
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="skeuo-icon !w-8 !h-8 !rounded-lg overflow-hidden p-1.5 bg-[var(--surface-1)] shadow-sm">
                  <img src="/images/Logo.svg" alt="Logo" className="w-full h-full object-contain grayscale dark:invert" />
                </div>
                <span className="text-xs tracking-[0.2em] uppercase font-bold opacity-60">
                  © 2026 Prominence VA
                </span>
              </div>
              <div className="flex gap-4">
                {[Layers2, ExternalLink, Mail].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    className="skeuo-icon !w-10 !h-10 !rounded-xl"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon size={16} className="opacity-80" />
                  </motion.a>
                ))}
              </div>
            </div>
          </footer>

        </motion.div>
      )}
    </>
  );
}
