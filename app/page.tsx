"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Clapperboard,
  Code2,
  ExternalLink,
  Mail,
  Rocket,
  Search,
  Sparkles,
  Target,
  Users,
  Wrench,
  Palette,
  Terminal,
  Video,
  Layers,
  Cloud,
  Camera as Instagram,
  Briefcase as Linkedin,
  Hash as Twitter,
  Globe,
} from "lucide-react";

/*
 * ─── SANITY-READY DATA ────────────────────────────────────────
 * All data below mirrors Sanity document schemas.
 * When Sanity is configured, replace with:
 *
 *   import { client } from "@/sanity/client";
 *   const services = await client.fetch(groq`*[_type == "service"]`);
 *
 * Schemas: service, project, teamMember, processStep, scripture
 * ─────────────────────────────────────────────────────────────
 */

const HERO_WORD = "PROMINENCE";

const services = [
  { _id: "svc-1", title: "Video Editing",       description: "Story-driven edits for reels, ads, and branded content.",          Icon: Clapperboard },
  { _id: "svc-2", title: "Web Development",      description: "Modern sites built for speed, clarity, and conversion.",            Icon: Code2        },
  { _id: "svc-3", title: "Virtual Assistance",   description: "Admin workflows, communications, and daily operations.",            Icon: Users        },
  { _id: "svc-4", title: "Creative Support",     description: "Brand assets, content systems, and social media kits.",            Icon: Sparkles     },
];

const projects = [
  { _id: "prj-1", title: "Creator Launch Campaign",  type: "Video",    summary: "Multi-format short-form package for a 7-day social launch week.",    image: "/images/video.png"     },
  { _id: "prj-2", title: "Service Booking Website",  type: "Web",      summary: "Clean booking flow and polished mobile-first landing page.",          image: "/images/ecommerce.png" },
  { _id: "prj-3", title: "Operations Dashboard",     type: "VA",       summary: "Task system and reporting setup that cut response time by half.",     image: "/images/dashboard.png" },
  { _id: "prj-4", title: "Brand Sprint",             type: "Creative", summary: "Quick-turn visual assets, templates, and campaign direction.",        image: "/images/brand.png"     },
];

const team = [
  { 
    _id: "tm-1", 
    name: "Vien Abache", 
    role: "CEO & Founder",
    photo: "/images/video.png",
    bio: "Visionary leader driving Prominence VA's growth and ensuring top-tier service delivery.",
    socials: [
      { platform: "LinkedIn", url: "#", Icon: Linkedin },
      { platform: "Twitter", url: "#", Icon: Twitter }
    ]
  },
  { 
    _id: "tm-2", 
    name: "Gian", 
    role: "Video Editor",
    photo: "/images/video.png",
    bio: "Expert in narrative pacing and creating highly engaging visual content.",
    socials: [
      { platform: "Instagram", url: "#", Icon: Instagram }
    ]
  },
  { 
    _id: "tm-3", 
    name: "Russel", 
    role: "Video Editor",
    photo: "/images/video.png",
    bio: "Specializes in motion graphics, color grading, and dynamic short-form edits.",
    socials: [
      { platform: "Instagram", url: "#", Icon: Instagram }
    ]
  },
  { 
    _id: "tm-4", 
    name: "Vinz", 
    role: "Full-Stack Developer",
    photo: "/images/dashboard.png",
    bio: "Architects scalable systems and smooth user experiences from front to back.",
    socials: [
      { platform: "LinkedIn", url: "#", Icon: Linkedin },
      { platform: "Website", url: "#", Icon: Globe }
    ]
  },
  { 
    _id: "tm-5", 
    name: "Giervan", 
    role: "Back-End Developer",
    photo: "/images/dashboard.png",
    bio: "Database logic and API wizard ensuring performance and robust security.",
    socials: [
      { platform: "LinkedIn", url: "#", Icon: Linkedin }
    ]
  },
  { 
    _id: "tm-6", 
    name: "Julian", 
    role: "Front-End Developer",
    photo: "/images/dashboard.png",
    bio: "Crafts beautiful, GSAP-powered cinematic interfaces and responsive layouts.",
    socials: [
      { platform: "LinkedIn", url: "#", Icon: Linkedin },
      { platform: "Twitter", url: "#", Icon: Twitter }
    ]
  },
];

const processSteps = [
  { _id: "ps-1", step: "01", title: "Discover", description: "We align on your goals, audience, and success metrics.",               Icon: Search  },
  { _id: "ps-2", step: "02", title: "Plan",     description: "Scope, timeline, and deliverables locked before work begins.",         Icon: Target  },
  { _id: "ps-3", step: "03", title: "Execute",  description: "Your project is built, edited, or managed — start to finish.",         Icon: Rocket  },
  { _id: "ps-4", step: "04", title: "Deliver",  description: "Clean handoff with assets, documentation, and follow-up support.",     Icon: Wrench  },
];

const toolsData = [
  {
    category: "Development",
    items: [
      { id: "t-1", name: "Next.js", desc: "React Framework", Icon: Code2 },
      { id: "t-2", name: "Tailwind CSS", desc: "Utility Styling", Icon: Palette },
      { id: "t-3", name: "VS Code", desc: "Code Editor", Icon: Terminal },
    ],
  },
  {
    category: "Creative",
    items: [
      { id: "t-4", name: "Premiere Pro", desc: "Video Editing", Icon: Video },
      { id: "t-5", name: "After Effects", desc: "Motion Graphics", Icon: Layers },
    ],
  },
  {
    category: "Productivity",
    items: [
      { id: "t-6", name: "Notion", desc: "Workspace & Docs", Icon: BookOpen },
      { id: "t-7", name: "Google Workspace", desc: "Cloud Collaboration", Icon: Cloud },
    ],
  },
];

const scriptures = [
  { _id: "sc-1", text: "Commit your work to the Lord, and your plans will be established.",                                       ref: "Proverbs 16:3"     },
  { _id: "sc-2", text: "Whatever you do, work heartily, as for the Lord and not for men.",                                        ref: "Colossians 3:23"   },
  { _id: "sc-3", text: "For God gave us a spirit not of fear but of power and love and self-control.",                            ref: "2 Timothy 1:7"     },
  { _id: "sc-4", text: "But remember the Lord your God, for it is he who gives you the ability to produce wealth.",               ref: "Deuteronomy 8:18"  },
];

/* ─── Scripture Banner ─────────────────────────────────── */
function ScriptureBanner() {
  const [idx, setIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const el = containerRef.current;
      if (!el) return;
      gsap.to(el, {
        opacity: 0, y: -8, filter: "blur(4px)", duration: 0.4,
        onComplete: () => {
          setIdx((prev) => (prev + 1) % scriptures.length);
          gsap.fromTo(el,
            { opacity: 0, y: 8, filter: "blur(4px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power2.out" }
          );
        },
      });
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="scripture-banner py-10 relative z-20">
      <div className="mx-auto w-[94%] max-w-3xl text-center">
        <div className="scripture-glass inline-block w-full">
          <div ref={containerRef} className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <BookOpen size={13} className="shrink-0 text-purple-300/70" />
              <p className="leading-relaxed opacity-80">{scriptures[idx].text}</p>
              <BookOpen size={13} className="shrink-0 text-purple-300/70" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-purple-200/70">
              {scriptures[idx].ref}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Galaxy Background ─────────────────────────────────── */
function GalaxyBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Twinkle stars
      gsap.to(".galaxy-star", {
        opacity: "random(0.15, 0.7)",
        duration: "random(2, 4)",
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // Float particles
      gsap.utils.toArray<HTMLElement>(".galaxy-particle").forEach((particle) => {
        gsap.to(particle, {
          y: "random(-60, 60)",
          x: "random(-40, 40)",
          duration: "random(12, 25)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // Parallax Nebula (Far Background)
      gsap.to(".galaxy-nebula", {
        y: "-10%",
        scale: 1.05,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom top", scrub: 1 },
      });

      // Parallax Stars (Mid Layer)
      gsap.to(".galaxy-layer-mid", {
        y: "-20%",
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom top", scrub: 1 },
      });

      // Parallax Particles (Foreground Layer)
      gsap.to(".galaxy-layer-fg", {
        y: "-35%",
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom top", scrub: 1 },
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Generate random stars (only on client to prevent hydration mismatch)
  const [stars, setStars] = useState<React.ReactNode[]>([]);
  const [particles, setParticles] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 60 }).map((_, i) => {
      const size = Math.random() * 2 + 0.5;
      return (
        <div
          key={`star-${i}`}
          className="galaxy-star absolute rounded-full bg-white"
          style={{
            width: size,
            height: size,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1,
            boxShadow: `0 0 ${Math.random() * 4 + 1}px rgba(255,255,255,0.6)`,
          }}
        />
      );
    });

    const generatedParticles = Array.from({ length: 15 }).map((_, i) => {
      const size = Math.random() * 4 + 2;
      return (
        <div
          key={`particle-${i}`}
          className="galaxy-particle absolute rounded-full bg-purple-200/40"
          style={{
            width: size,
            height: size,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: `blur(${Math.random() * 2 + 1}px)`,
          }}
        />
      );
    });
    // eslint-disable-next-line
    setStars(generatedStars);
    // eslint-disable-next-line
    setParticles(generatedParticles);
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 -z-30 h-[130vh] w-full overflow-hidden bg-[#05020a]">
      {/* ── Far Background: Nebula Clouds ── */}
      <div className="galaxy-nebula absolute inset-0">
        <div className="absolute -top-[20%] -left-[10%] h-[70vh] w-[70vw] rounded-full bg-indigo-900/20 blur-[130px]" />
        <div className="absolute top-[30%] -right-[20%] h-[80vh] w-[80vw] rounded-full bg-purple-900/15 blur-[150px]" />
        <div className="absolute -bottom-[20%] left-[10%] h-[60vh] w-[60vw] rounded-full bg-fuchsia-900/10 blur-[120px]" />
        <div className="absolute top-[50%] left-[40%] h-[50vh] w-[50vw] rounded-full bg-blue-900/10 blur-[140px]" />
      </div>

      {/* ── Mid Layer: Star Clusters ── */}
      <div className="galaxy-layer-mid absolute inset-0">
        {stars}
      </div>

      {/* ── Foreground Layer: Floating Particles ── */}
      <div className="galaxy-layer-fg absolute inset-0">
        {particles}
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null);
  const servicesPinRef = useRef<HTMLElement>(null);
  const servicesScrollRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      /* ── 1. Hero Entrance Timeline ── */
      const heroTl = gsap.timeline({ delay: 0.15 });
      heroTl
        .from(".hero-badge",    { opacity: 0, y: 16,                                     duration: 0.5, ease: "power3.out" })
        .from(".hero-letter",   { opacity: 0, y: 70, stagger: { amount: 0.45 },          duration: 0.65, ease: "power4.out" }, "-=0.2")
        .from(".hero-subtitle", { opacity: 0, y: 18,                                     duration: 0.5, ease: "power3.out" }, "-=0.3")
        .from(".hero-desc",     { opacity: 0, y: 14,                                     duration: 0.5, ease: "power3.out" }, "-=0.35")
        .from(".hero-cta",      { opacity: 0, y: 14, stagger: 0.12,                      duration: 0.45, ease: "power3.out" }, "-=0.3")
        .from(".hero-stat",     { opacity: 0, y: 18, stagger: 0.1,                       duration: 0.45, ease: "power3.out" }, "-=0.25");



      /* ── 4. Hero Scroll Fade-Out ── */
      gsap.to(".hero-scroll-fade", {
        opacity: 0, y: -60, filter: "blur(8px)", ease: "none",
        scrollTrigger: { trigger: "#home", start: "top top", end: "60% top", scrub: true },
      });

      /* ── 5. Advanced Depth Reveal for Sections ── */
      const depthSections = gsap.utils.toArray<HTMLElement>(".depth-section");
      depthSections.forEach((sec) => {
        gsap.from(sec, {
          opacity: 0,
          scale: 0.96,
          filter: "blur(8px)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 85%",
          },
        });
      });

      /* ── 6. Services Horizontal Pinned Scroll ── */
      if (servicesScrollRef.current && servicesPinRef.current) {
        gsap.to(servicesScrollRef.current, {
          x: () => -(servicesScrollRef.current!.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: servicesPinRef.current,
            start: "top top",
            end: () => `+=${servicesScrollRef.current!.scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            // invalidateOnRefresh: true, // Helpful if layout changes
          },
        });
      }

      /* ── 7. Staggered Reveals for Cards ── */
      // Project cards (with slight parallax stagger)
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0, y: 60 + (i % 2) * 30, scale: 0.95, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });

      // Team cards
      gsap.utils.toArray<HTMLElement>(".team-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0, y: 30, delay: i * 0.08, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });

      // Process steps
      gsap.utils.toArray<HTMLElement>(".process-step").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0, x: i % 2 === 0 ? -40 : 40, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      // Tools cards
      gsap.utils.toArray<HTMLElement>(".tool-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0, y: 20, delay: (i % 3) * 0.08, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 92%" },
        });
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={mainRef}
      className="noise-overlay relative overflow-hidden bg-transparent text-[var(--foreground)]"
    >
      <GalaxyBackground />

      {/* ── Sticky Nav ── */}
      <header className="sticky top-4 z-40 mx-auto mt-4 flex w-[94%] max-w-5xl items-center justify-between rounded-2xl border border-white/10 bg-[var(--surface-1)]/85 px-5 py-3 backdrop-blur-md shadow-2xl shadow-black/20">
        <a href="#home" className="text-sm font-black tracking-widest text-purple-200">
          PROMINENCE
        </a>
        <nav className="hidden items-center gap-5 text-xs font-medium opacity-75 sm:flex">
          <a href="#about"    className="transition-colors hover:text-purple-300">About</a>
          <a href="#services" className="transition-colors hover:text-purple-300">Services</a>
          <a href="#projects" className="transition-colors hover:text-purple-300">Projects</a>
          <a href="#team"     className="transition-colors hover:text-purple-300">Team</a>
          <a href="#process"  className="transition-colors hover:text-purple-300">Process</a>
          <a href="#contact"  className="rounded-lg bg-purple-300/20 px-3 py-1.5 text-purple-200 transition hover:bg-purple-300/30">
            Contact
          </a>
        </nav>
      </header>

      {/* ════════════════════════════════════════
          HERO — centered monumental statement
          ════════════════════════════════════════ */}
      <section
        id="home"
        className="relative flex min-h-screen flex-col items-center justify-center px-6 py-28 text-center"
      >
        {/* Decorative breathing rings */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-breathe h-[480px] w-[480px] rounded-full border border-purple-500/10" />
          <div className="animate-breathe absolute h-[700px] w-[700px] rounded-full border border-purple-500/6" style={{ animationDelay: "1.2s" }} />
        </div>

        <div className="hero-scroll-fade relative z-10 flex flex-col items-center">
          {/* Badge */}
          <span className="hero-badge mb-8 inline-flex items-center gap-2 rounded-full border border-purple-300/25 bg-purple-300/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-200 backdrop-blur-sm">
            Premium Digital Services
          </span>

          {/* PROMINENCE — each letter animated individually by GSAP */}
          <h1
            className="text-[clamp(3rem,10.5vw,8.5rem)] font-black leading-none tracking-[-0.025em]"
            aria-label={HERO_WORD}
          >
            {HERO_WORD.split("").map((char, i) => (
              <span key={i} className="hero-letter gradient-text inline-block">
                {char}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle mt-5 text-sm font-semibold uppercase tracking-[0.45em] opacity-55 sm:text-xl">
            Virtual Assistance
          </p>

          {/* Value proposition */}
          <p className="hero-desc mt-6 max-w-2xl text-xl font-bold leading-snug sm:text-3xl">
            Scale your business with seamless virtual support
          </p>

          {/* Supporting description */}
          <p className="hero-desc mt-4 max-w-md text-sm leading-7 opacity-60 sm:text-base">
            Video, web, admin, and creative services — built to help you grow without the overhead.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="hero-cta inline-flex items-center gap-2 rounded-xl bg-purple-300 px-6 py-3.5 text-sm font-bold text-zinc-900 shadow-[0_0_20px_rgba(216,180,254,0.3)] transition hover:scale-[1.04] hover:bg-purple-200"
            >
              Work With Us <ArrowRight size={15} />
            </a>
            <a
              href="#services"
              className="hero-cta inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold backdrop-blur-md transition hover:bg-white/10"
            >
              View Services
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-10 sm:gap-16">
            {[
              { num: "50+", label: "Projects"       },
              { num: "3+",  label: "Years Active"   },
              { num: "6",   label: "Team Members"   },
            ].map((stat) => (
              <div key={stat.label} className="hero-stat text-center">
                <p className="gradient-text text-3xl font-black sm:text-4xl">{stat.num}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] opacity-55">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-40">
          <div className="h-8 w-px bg-gradient-to-b from-purple-400 to-transparent" />
          <p className="text-[9px] uppercase tracking-[0.35em]">Scroll</p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ABOUT
          ════════════════════════════════════════ */}
      <section id="about" className="depth-section mx-auto w-[94%] max-w-5xl py-20 relative z-10">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-purple-200/70">About Prominence</p>
              <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                Built for those<br />who move fast.
              </h2>
              <p className="mt-4 text-sm leading-7 opacity-75">
                We&apos;re a lean digital team that handles the work behind your growth —
                video, web, admin, and creative systems all in one place.
              </p>
              <a href="#contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-purple-300 transition hover:gap-3">
                Start a project <ArrowRight size={14} />
              </a>
            </div>
            <div className="grid gap-3">
              {[
                { label: "Reliable Delivery",  sub: "On time, every time — no surprises."    },
                { label: "On-Brand Creative",  sub: "Assets that fit your vision exactly."    },
                { label: "Clear Systems",       sub: "Efficient workflows from day one."       },
              ].map((v) => (
                <div key={v.label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition duration-300 hover:scale-[1.02] hover:border-purple-300/30 hover:bg-white/10">
                  <p className="text-sm font-bold">{v.label}</p>
                  <p className="mt-1 text-xs leading-5 opacity-60">{v.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SERVICES (Pinned Horizontal Scroll)
          ════════════════════════════════════════ */}
      <section id="services" ref={servicesPinRef} className="relative h-screen w-full overflow-hidden z-10">
        <div ref={servicesScrollRef} className="absolute flex h-full w-[250vw] sm:w-[200vw] lg:w-[150vw] items-center px-[5vw]">
          {/* Section Intro (pinned left) */}
          <div className="w-[90vw] sm:w-[50vw] lg:w-[40vw] shrink-0 pr-10">
            <p className="text-[11px] uppercase tracking-[0.22em] text-purple-200/70">What We Do</p>
            <h2 className="mt-2 text-3xl font-black sm:text-5xl">Services</h2>
            <p className="mt-4 max-w-sm text-sm leading-7 opacity-75">
              Scroll horizontally to explore how we streamline and scale your digital operations.
            </p>
            <div className="mt-6 flex gap-2 text-purple-300/50">
              <ArrowRight size={24} className="animate-pulse" />
              <ArrowRight size={24} className="animate-pulse" style={{ animationDelay: "0.2s" }} />
              <ArrowRight size={24} className="animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
          
          {/* Service Cards Container */}
          <div className="flex shrink-0 gap-6 sm:gap-10">
            {services.map(({ _id, title, description, Icon }) => (
              <article
                key={_id}
                className="service-card group flex h-[340px] w-[280px] sm:w-[320px] flex-col justify-center rounded-3xl border border-white/10 bg-[var(--surface-2)]/70 p-8 shadow-2xl backdrop-blur-xl transition duration-500 hover:-translate-y-4 hover:border-purple-300/40 hover:bg-[var(--surface-2)]/90 hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)]"
              >
                <div className="mb-6 inline-flex w-max rounded-2xl bg-purple-300/10 p-4 text-purple-200 transition duration-300 group-hover:scale-110 group-hover:bg-purple-300/20 group-hover:text-white">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-black tracking-wide">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-65">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PROJECTS
          ════════════════════════════════════════ */}
      <section id="projects" className="depth-section mx-auto w-[94%] max-w-5xl py-20 relative z-10">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-purple-200/70">Our Work</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">Projects</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project._id} className="project-card group h-[300px] overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface-1)] shadow-2xl transition duration-500 hover:-translate-y-2 hover:border-purple-300/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-70"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-1)] via-transparent to-transparent opacity-90" />
              <div className="card-content absolute bottom-0 left-0 right-0 p-8 transition duration-500 group-hover:translate-y-[-8px]">
                <span className="mb-3 inline-block rounded-full border border-purple-300/35 bg-purple-300/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-purple-200 backdrop-blur-md">
                  {project.type}
                </span>
                <h3 className="text-xl font-black tracking-wide text-white drop-shadow-md">{project.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{project.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          TEAM
          ════════════════════════════════════════ */}
      <section id="team" className="depth-section mx-auto w-[94%] max-w-5xl py-20 relative z-10">
        <div className="mb-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-purple-200/70">Our People</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">Team</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map(({ _id, name, role }) => (
            <article
              key={_id}
              className="team-card group rounded-2xl border border-white/10 bg-[var(--surface-1)]/40 p-6 backdrop-blur-md transition duration-300 hover:-translate-y-1.5 hover:border-purple-300/40 hover:bg-[var(--surface-1)]/80 hover:shadow-[0_10px_30px_rgba(168,85,247,0.1)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-300/10 text-base font-black text-purple-200 transition duration-300 group-hover:scale-110 group-hover:bg-purple-300/20 group-hover:text-white">
                {name.charAt(0)}
              </div>
              <p className="text-base font-bold tracking-wide">{name}</p>
              <p className="mt-1 text-xs uppercase tracking-wider opacity-50">{role}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          PROCESS
          ════════════════════════════════════════ */}
      <section id="process" className="depth-section mx-auto w-[94%] max-w-5xl py-20 relative z-10">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-purple-200/70">How We Work</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">Process</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map(({ _id, step, title, description, Icon }) => (
            <article
              key={_id}
              className="process-step group glass-panel rounded-3xl p-8 transition duration-500 hover:-translate-y-2 hover:border-purple-300/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-purple-300/50">{step}</span>
              <div className="my-5 inline-flex rounded-2xl bg-purple-300/10 p-3 text-purple-200 transition duration-300 group-hover:scale-110 group-hover:bg-purple-300/20 group-hover:text-white">
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold tracking-wide">{title}</h3>
              <p className="mt-3 text-sm leading-6 opacity-60">{description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          TOOLS & TECHNOLOGIES
          ════════════════════════════════════════ */}
      <section id="tools" className="depth-section mx-auto w-[94%] max-w-5xl py-20 relative z-10">
        <div className="mb-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-purple-200/70">Our Stack</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">Tools & Technologies</h2>
        </div>
        
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {toolsData.map((group) => (
            <div key={group.category} className="flex flex-col gap-6">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] opacity-40">{group.category}</h3>
              <div className="flex flex-col gap-4">
                {group.items.map((tool) => (
                  <article
                    key={tool.id}
                    className="tool-card group flex items-center gap-5 rounded-2xl border border-white/5 bg-[var(--surface-2)]/30 p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:border-purple-300/30 hover:bg-[var(--surface-2)]/80 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-purple-200/80 shadow-inner transition duration-300 group-hover:bg-purple-300/20 group-hover:text-white group-hover:shadow-purple-300/20">
                      <tool.Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-wide">{tool.name}</p>
                      <p className="mt-1 text-[11px] opacity-55">{tool.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA
          ════════════════════════════════════════ */}
      <section id="contact" className="depth-section mx-auto w-[94%] max-w-5xl py-20 relative z-10">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-purple-300/25 bg-gradient-to-br from-purple-500/20 via-purple-400/10 to-fuchsia-500/10 p-12 text-center shadow-[0_0_60px_rgba(168,85,247,0.15)] sm:p-20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-purple-400/20 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-fuchsia-400/15 blur-[80px]" />

          <p className="relative text-[11px] uppercase tracking-[0.25em] text-purple-200/70">Ready to Scale?</p>
          <h2 className="relative mt-4 text-4xl font-black leading-tight sm:text-6xl">
            Let&apos;s Build Something{" "}
            <span className="gradient-text">Great Together</span>
          </h2>
          <p className="relative mx-auto mt-6 max-w-md text-base leading-relaxed opacity-70">
            Tell us what you need. We&apos;ll handle the rest.
          </p>
          <a
            href="mailto:hello@prominenceva.com"
            className="relative mt-10 inline-flex items-center gap-3 rounded-2xl bg-purple-300 px-10 py-5 text-sm font-black text-zinc-900 shadow-[0_0_30px_rgba(216,180,254,0.3)] transition duration-300 hover:scale-[1.05] hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
          >
            <Mail size={18} /> hello@prominenceva.com
          </a>
        </div>
      </section>

      {/* ── Scripture Banner ── */}
      <ScriptureBanner />

      {/* ════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════ */}
      <footer className="border-t border-white/8 bg-[var(--surface-1)]/80 py-10 relative z-20">
        <div className="mx-auto w-[94%] max-w-5xl">
          {/* Brand + socials */}
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.25em] text-purple-200">PROMINENCE VA</p>
              <p className="mt-2 text-xs opacity-50">hello@prominenceva.com</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { label: "Instagram", href: "https://instagram.com" },
                { label: "Facebook",  href: "https://facebook.com"  },
                { label: "LinkedIn",  href: "https://linkedin.com"  },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold tracking-wide opacity-60 transition duration-300 hover:border-purple-300/35 hover:bg-white/10 hover:opacity-100"
                >
                  {s.label} <ExternalLink size={10} />
                </a>
              ))}
            </div>
          </div>
          {/* Nav + copyright */}
          <div className="flex flex-col gap-5 border-t border-white/6 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold uppercase tracking-widest opacity-60">
              <a href="#about"    className="transition duration-300 hover:text-purple-300">About</a>
              <a href="#services" className="transition duration-300 hover:text-purple-300">Services</a>
              <a href="#projects" className="transition duration-300 hover:text-purple-300">Projects</a>
              <a href="#team"     className="transition duration-300 hover:text-purple-300">Team</a>
              <a href="#process"  className="transition duration-300 hover:text-purple-300">Process</a>
              <a href="#contact"  className="transition duration-300 hover:text-purple-300">Contact</a>
            </div>
            <p className="text-[10px] uppercase tracking-widest opacity-35">
              © {new Date().getFullYear()} Prominence VA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
