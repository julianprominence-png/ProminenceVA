"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Code2, Monitor, Smartphone, Tablet, Send, Zap, Layers, Server } from "lucide-react";
import Aurora from "../components/Aurora/Aurora";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/* WEB PROJECTS DATA                                                          */
/* -------------------------------------------------------------------------- */
const webProjects = [
  {
    num: "01",
    title: "Wedesiqn",
    sub: "Digital Agency",
    url: "https://wedesiqn.vercel.app",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=90",
    description: "A sleek, modern portfolio for a digital agency, showcasing cutting-edge web design aesthetics.",
  },
  {
    num: "02",
    title: "EV Studios",
    sub: "Creative Platform",
    url: "https://evstudios.vercel.app",
    img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&q=90",
    description: "An immersive digital experience built for a creative studio to highlight their visual projects.",
  },
  {
    num: "03",
    title: "Art Masons",
    sub: "E-Commerce",
    url: "https://artmasons.com",
    img: "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?w=1200&q=90",
    description: "A robust e-commerce platform crafted for artisans to sell their high-quality creations online.",
  },
  {
    num: "04",
    title: "Chef GK",
    sub: "Culinary Portfolio",
    url: "https://chefgk.com",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=90",
    description: "A premium, mouth-watering digital presence for a renowned chef, featuring elegant typography and layouts.",
  },
  {
    num: "05",
    title: "Bluepeak Delivery",
    sub: "Logistics Platform",
    url: "https://bluepeak-delivery.vercel.app",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=90",
    description: "A fast, responsive, and highly optimized web app for a modern delivery and logistics company.",
  },
  {
    num: "06",
    title: "It's All Woods",
    sub: "Brand Identity",
    url: "https://itsallwoods.vercel.app",
    img: "https://images.unsplash.com/photo-1611149959648-52c1e6e0d9b5?w=1200&q=90",
    description: "A rustic yet refined web experience focusing on high-end woodworking and nature-inspired crafts.",
  },
];

/* -------------------------------------------------------------------------- */
/* SERVICE DATA                                                               */
/* -------------------------------------------------------------------------- */
const services = [
  { icon: Code2, title: "Frontend Engineering", desc: "Crafting fluid, interactive interfaces using modern frameworks and refined state management." },
  { icon: Monitor, title: "Responsive Architecture", desc: "Ensuring pixel-perfect experiences across all device ecosystems and aspect ratios." },
  { icon: Zap, title: "Performance Optimization", desc: "Architecting lightning-fast web applications with elite Lighthouse scores." },
  { icon: Server, title: "Backend Integration", desc: "Seamlessly connecting visual frontends with robust, scalable backend services." },
];

export default function WebPortfolioPage() {
  const [activeProject, setActiveProject] = useState(webProjects[0]);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isLoading, setIsLoading] = useState(true);

  // Contact form state
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent">("idle");

  // Device width mapping for the iframe container
  const deviceWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

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
    <div className="relative min-h-screen text-white bg-black selection:bg-purple-500/30 overflow-x-hidden font-sans flex flex-col pt-24 pb-0">
      
      {/* ── BACKGROUND EFFECTS ── */}
      <div className="fixed inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none starfield" />
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <Aurora 
          colorStops={["#a855f7", "#9333ea", "#7e22ce"]} 
          blend={0.6} 
          amplitude={1.2} 
          speed={0.4} 
        />
      </div>

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col lg:flex-row gap-6 lg:gap-10 min-h-[calc(100vh-6rem)]">
        
        {/* ── LEFT COLUMN: INFO & LIST ── */}
        <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col h-auto lg:h-[calc(100vh-8rem)]">
          {/* Header Area */}
          <div className="mb-6 flex-shrink-0 pt-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md mb-6"
            >
              <Code2 className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-purple-200">
                Web Development
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-4xl xl:text-5xl font-black uppercase tracking-tight text-white drop-shadow-2xl mb-4"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Web <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-300">Works</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/60 text-sm leading-relaxed"
            >
              Select a project to experience the live preview. We build interactive platforms that merge high-end aesthetics with elite performance.
            </motion.p>
          </div>

          {/* Project List */}
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 pb-6 lg:pb-0">
            {webProjects.map((project, idx) => {
              const isActive = activeProject.num === project.num;
              return (
                <motion.button
                  key={project.num}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * idx }}
                  onClick={() => {
                    if (!isActive) setIsLoading(true);
                    setActiveProject(project);
                  }}
                  className={`group relative p-5 rounded-2xl text-left transition-all duration-500 border ${
                    isActive 
                      ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]" 
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-purple-400">
                      {project.num} // {project.sub}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="active-dot"
                        className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)]"
                      />
                    )}
                  </div>
                  <h3 className={`text-xl font-black uppercase tracking-wider mb-2 transition-colors duration-300 ${isActive ? "text-white" : "text-white/80 group-hover:text-purple-300"}`}>
                    {project.title}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT COLUMN: INTERACTIVE PREVIEW ── */}
        <div className="w-full lg:w-2/3 xl:w-3/4 flex flex-col h-[600px] lg:h-[calc(100vh-8rem)] min-h-[500px]">
          
          {/* Browser Toolbar */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-between p-3 sm:p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-t-2xl z-20"
          >
            {/* Window Controls */}
            <div className="flex items-center gap-2 pr-4 border-r border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>

            {/* URL Display */}
            <div className="hidden sm:flex flex-1 items-center justify-center mx-4">
              <div className="w-full max-w-lg px-4 py-2 bg-white/5 rounded-full border border-white/5 flex items-center justify-center gap-2">
                <span className="text-[10px] font-mono text-purple-400/80 uppercase">https://</span>
                <span className="text-xs text-white/70 truncate font-mono tracking-wide">
                  {activeProject.url.replace("https://", "")}
                </span>
              </div>
            </div>

            {/* Controls Right */}
            <div className="flex items-center gap-3 pl-4 border-l border-transparent sm:border-white/10">
              {/* Device Toggles */}
              <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                {(["desktop", "tablet", "mobile"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setDevice(type)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      device === type 
                        ? "bg-white/10 text-purple-400 shadow-sm" 
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                    title={`View in ${type} mode`}
                  >
                    {type === "desktop" && <Monitor className="w-4 h-4" />}
                    {type === "tablet" && <Tablet className="w-4 h-4" />}
                    {type === "mobile" && <Smartphone className="w-4 h-4" />}
                  </button>
                ))}
              </div>

              {/* Visit Link */}
              <a
                href={activeProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white transition-all duration-300 border border-purple-500/30"
                title="Open live site in new tab"
              >
                <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-wider">Live Site</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Iframe Viewport */}
          <div className="flex-1 bg-black/80 backdrop-blur-sm border-x border-b border-white/10 rounded-b-2xl overflow-hidden relative flex justify-center items-start lg:items-center p-0 sm:p-4 lg:p-8 transition-all duration-500">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse" />
                </div>
                <span className="mt-4 text-[10px] uppercase tracking-[0.2em] font-bold text-purple-400 animate-pulse">
                  Loading Live Preview
                </span>
              </div>
            )}

            {/* Animated Device Container */}
            <motion.div 
              layout
              className={`relative h-full w-full transition-all duration-700 ease-[0.16,1,0.3,1] bg-white sm:rounded-xl shadow-2xl overflow-hidden ${
                device === "mobile" ? "sm:max-h-[800px]" : ""
              }`}
              style={{ maxWidth: deviceWidths[device] }}
            >
              <iframe
                key={activeProject.url} // Forces remount to trigger onLoad properly
                src={activeProject.url}
                className="w-full h-full border-none bg-white"
                onLoad={() => setIsLoading(false)}
                title={`Live Preview of ${activeProject.title}`}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CONTACT + SERVICES — UNIFIED 2-COL                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="contact" className="relative z-10 py-32 px-6 sm:px-12 bg-transparent mt-12 lg:mt-0">
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
                Currently accepting bookings for digital web platforms. Provide your timeline and vision — we'll engineer the rest.
              </p>

              {submitStatus === "sent" ? (
                <div className="border border-purple-400/30 bg-purple-500/10 rounded-2xl p-12 text-center shadow-inner">
                  <h3 className="text-xl font-black text-white mb-3 tracking-wide uppercase">Transmission Received</h3>
                  <p className="text-white/70 text-sm">We'll review your project brief and respond within 24 hours.</p>
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
      <footer className="relative z-10 overflow-hidden bg-transparent">
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
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 mb-16"
            >
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
            </motion.div>

            {/* Divider */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="w-full h-px mb-10" 
              style={{ background: "linear-gradient(to right, transparent, rgba(147,51,234,0.25), rgba(255,255,255,0.06), rgba(147,51,234,0.25), transparent)" }} 
            />

            {/* Links + Status */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10"
            >
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
            </motion.div>

            {/* Copyright */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] tracking-[0.3em] uppercase text-white/20 font-medium"
            >
              <p>&copy; {new Date().getFullYear()} Prominence. All operational rights reserved.</p>
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 text-purple-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Olongapo City, 2200</span>
              </div>
            </motion.div>
          </div>

          {/* Bottom glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] pointer-events-none" style={{ background: "linear-gradient(to right, transparent, rgba(147,51,234,0.4), transparent)" }} />
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </div>
  );
}
