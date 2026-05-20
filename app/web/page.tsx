"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Code2, Monitor, Smartphone, Tablet } from "lucide-react";
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
  const [activeProject, setActiveProject] = useState(webProjects[0]);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isLoading, setIsLoading] = useState(true);

  // Device width mapping for the iframe container
  const deviceWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <div className="relative min-h-screen text-white bg-black selection:bg-blue-500/30 overflow-hidden font-sans flex flex-col pt-24 pb-0 md:pb-12">
      
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

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col lg:flex-row gap-6 lg:gap-10 h-full">
        
        {/* ── LEFT COLUMN: INFO & LIST ── */}
        <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col h-auto lg:h-[calc(100vh-8rem)]">
          {/* Header Area */}
          <div className="mb-6 flex-shrink-0 pt-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md mb-6"
            >
              <Code2 className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-blue-200">
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
              Web <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Works</span>
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
                      ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]" 
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-blue-400">
                      {project.num} // {project.sub}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="active-dot"
                        className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]"
                      />
                    )}
                  </div>
                  <h3 className={`text-xl font-black uppercase tracking-wider mb-2 transition-colors duration-300 ${isActive ? "text-white" : "text-white/80 group-hover:text-blue-300"}`}>
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
                <span className="text-[10px] font-mono text-blue-400/80 uppercase">https://</span>
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
                        ? "bg-white/10 text-blue-400 shadow-sm" 
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
                className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 border border-blue-500/30"
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
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                </div>
                <span className="mt-4 text-[10px] uppercase tracking-[0.2em] font-bold text-blue-400 animate-pulse">
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
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
}
