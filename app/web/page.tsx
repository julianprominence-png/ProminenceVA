"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Monitor, Code2, Zap } from "lucide-react";
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
    title: "Chef GPK",
    sub: "Culinary Portfolio",
    url: "https://chefgpk.com",
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

export default function WebPortfolioPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative min-h-screen text-white bg-black selection:bg-blue-500/30 overflow-hidden font-sans">
      
      {/* ── BACKGROUND EFFECTS ── */}
      <div className="fixed inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none starfield" />
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <Aurora 
          colorStops={["#3b82f6", "#2563eb", "#1d4ed8"]} 
          blend={0.6} 
          amplitude={1.2} 
          speed={0.4} 
        />
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-20 pt-32 pb-16 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md mb-8"
        >
          <Code2 className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-blue-200">
            Web Development
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white drop-shadow-2xl mb-6"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Experiences</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="max-w-2xl text-white/60 text-sm md:text-base leading-relaxed"
        >
          We architect award-winning web platforms that blend fluid aesthetics with elite performance. 
          Explore our latest interactive projects crafted for founders who refuse average.
        </motion.p>
      </header>

      {/* ── PROJECTS GRID ── */}
      <section className="relative z-10 px-6 sm:px-12 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {webProjects.map((project, idx) => (
            <motion.a
              key={project.num}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: (idx % 2) * 0.2, ease: "easeOut" }}
              className="group block relative rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-black/50">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                <motion.img 
                  src={project.img} 
                  alt={project.title}
                  className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                
                {/* Floating Tags */}
                <div className="absolute top-6 left-6 z-20 flex gap-2">
                  <span className="px-3 py-1 text-[9px] font-bold tracking-widest uppercase bg-black/60 backdrop-blur-md text-white/80 rounded-full border border-white/10">
                    {project.num}
                  </span>
                  <span className="px-3 py-1 text-[9px] font-bold tracking-widest uppercase bg-blue-500/20 backdrop-blur-md text-blue-200 rounded-full border border-blue-500/30">
                    {project.sub}
                  </span>
                </div>

                {/* View Project Button */}
                <div className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8 relative z-20 bg-gradient-to-b from-transparent to-black/40">
                <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed mb-6">
                  {project.description}
                </p>
                <div className="flex items-center text-[10px] uppercase tracking-[0.2em] font-bold text-blue-400 gap-2 group-hover:gap-4 transition-all duration-300">
                  <span>Visit Website</span>
                  <div className="w-8 h-[1px] bg-blue-500/50 group-hover:w-12 transition-all duration-300" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="relative z-10 py-32 px-6 bg-black/40 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <Zap className="w-8 h-8 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            Ready to build your <span className="text-blue-400">digital presence?</span>
          </h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Let's create a platform that doesn't just look incredible, but performs flawlessly. Contact us to start your next web project.
          </p>
          <Link 
            href="/#contact"
            className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1"
          >
            Start a Project
          </Link>
        </div>
      </section>
      
      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
}
