"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import EtherealCanvas from "../components/ui/EtherealCanvas";
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
  TrendingUp,
  Star,
  Zap,
} from "lucide-react";

/* ─── DATA ──────────────────────────────────────────────── */

const HERO_WORD = "PROMINENCE";

const services = [
  {
    _id: "svc-1",
    title: "Video Editing",
    description:
      "Story-driven edits for reels, ads, and branded content that convert and captivate.",
    sub: "Short-form · Long-form · Motion",
    Icon: Clapperboard,
  },
  {
    _id: "svc-2",
    title: "Web Development",
    description:
      "Modern sites engineered for speed, clarity, and measurable conversion.",
    sub: "Next.js · React · Tailwind",
    Icon: Code2,
  },
  {
    _id: "svc-3",
    title: "Virtual Assistance",
    description:
      "Admin workflows, communications, and daily operations — handled seamlessly.",
    sub: "Ops · Inbox · Scheduling",
    Icon: Users,
  },
  {
    _id: "svc-4",
    title: "Creative Support",
    description:
      "Brand assets, content systems, and social media kits built to your vision.",
    sub: "Branding · Social · Assets",
    Icon: Sparkles,
  },
];

const projects = [
  {
    _id: "prj-1",
    title: "Creator Launch Campaign",
    type: "Video",
    summary:
      "Multi-format short-form package for a 7-day social launch week.",
    image: "/images/video.png",
  },
  {
    _id: "prj-2",
    title: "Service Booking Website",
    type: "Web",
    summary:
      "Clean booking flow and polished mobile-first landing page.",
    image: "/images/ecommerce.png",
  },
  {
    _id: "prj-3",
    title: "Operations Dashboard",
    type: "VA",
    summary: "Task system and reporting setup that cut response time by half.",
    image: "/images/dashboard.png",
  },
  {
    _id: "prj-4",
    title: "Brand Sprint",
    type: "Creative",
    summary:
      "Quick-turn visual assets, templates, and campaign direction.",
    image: "/images/brand.png",
  },
];

const team = [
  {
    _id: "tm-1",
    name: "Vien Abache",
    role: "CEO & Founder",
    bio: "Visionary leader driving Prominence VA's growth and ensuring top-tier service delivery.",
    photo: "/images/video.png",
    socials: [
      { platform: "LinkedIn", Icon: Linkedin },
      { platform: "Twitter", Icon: Twitter },
    ],
  },
  {
    _id: "tm-2",
    name: "Gian",
    role: "Video Editor",
    bio: "Expert in narrative pacing and creating highly engaging visual content.",
    photo: "/images/video.png",
    socials: [{ platform: "Instagram", Icon: Instagram }],
  },
  {
    _id: "tm-3",
    name: "Russel",
    role: "Video Editor",
    bio: "Specializes in motion graphics, color grading, and dynamic short-form edits.",
    photo: "/images/video.png",
    socials: [{ platform: "Instagram", Icon: Instagram }],
  },
  {
    _id: "tm-4",
    name: "Vinz",
    role: "Full-Stack Developer",
    bio: "Architects scalable systems and smooth user experiences from front to back.",
    photo: "/images/dashboard.png",
    socials: [
      { platform: "LinkedIn", Icon: Linkedin },
      { platform: "Website", Icon: Globe },
    ],
  },
  {
    _id: "tm-5",
    name: "Giervan",
    role: "Back-End Developer",
    bio: "Database logic and API wizard ensuring performance and robust security.",
    photo: "/images/dashboard.png",
    socials: [{ platform: "LinkedIn", Icon: Linkedin }],
  },
  {
    _id: "tm-6",
    name: "Julian",
    role: "Front-End Developer",
    bio: "Crafts GSAP-powered cinematic interfaces and responsive, accessible layouts.",
    photo: "/images/dashboard.png",
    socials: [
      { platform: "LinkedIn", Icon: Linkedin },
      { platform: "Twitter", Icon: Twitter },
    ],
  },
];

const processSteps = [
  {
    _id: "ps-1",
    step: "01",
    title: "Discover",
    description:
      "We align on your goals, audience, and success metrics before a single pixel is moved.",
    Icon: Search,
  },
  {
    _id: "ps-2",
    step: "02",
    title: "Plan",
    description:
      "Scope, timeline, and deliverables are locked in writing before work begins — no surprises.",
    Icon: Target,
  },
  {
    _id: "ps-3",
    step: "03",
    title: "Execute",
    description:
      "Your project is built, edited, or managed with full transparency and daily updates.",
    Icon: Rocket,
  },
  {
    _id: "ps-4",
    step: "04",
    title: "Deliver",
    description:
      "Clean handoff with all assets, documentation, and follow-up support included.",
    Icon: Wrench,
  },
];

const toolsData = [
  {
    category: "Development",
    items: [
      { id: "t-1", name: "Next.js",      desc: "React Framework",    Icon: Code2    },
      { id: "t-2", name: "Tailwind CSS", desc: "Utility Styling",    Icon: Palette  },
      { id: "t-3", name: "VS Code",      desc: "Code Editor",        Icon: Terminal },
    ],
  },
  {
    category: "Creative",
    items: [
      { id: "t-4", name: "Premiere Pro",  desc: "Video Editing",      Icon: Video  },
      { id: "t-5", name: "After Effects", desc: "Motion Graphics",    Icon: Layers },
    ],
  },
  {
    category: "Productivity",
    items: [
      { id: "t-6", name: "Notion",            desc: "Workspace & Docs",     Icon: BookOpen },
      { id: "t-7", name: "Google Workspace",  desc: "Cloud Collaboration",  Icon: Cloud    },
    ],
  },
];

const scriptures = [
  {
    _id: "sc-1",
    text: "Commit your work to the Lord, and your plans will be established.",
    ref: "Proverbs 16:3",
  },
  {
    _id: "sc-2",
    text: "Whatever you do, work heartily, as for the Lord and not for men.",
    ref: "Colossians 3:23",
  },
  {
    _id: "sc-3",
    text: "For God gave us a spirit not of fear but of power and love and self-control.",
    ref: "2 Timothy 1:7",
  },
  {
    _id: "sc-4",
    text: "But remember the Lord your God, for it is He who gives you the ability to produce wealth.",
    ref: "Deuteronomy 8:18",
  },
];

const tickerItems = [
  "Video Editing",
  "Web Development",
  "Virtual Assistance",
  "Creative Direction",
  "Motion Graphics",
  "Brand Systems",
  "Content Strategy",
  "Operations",
  "UI Design",
  "Growth Support",
];

const barHeights = [40, 65, 50, 80, 55, 95, 70, 85];

/* ─── Circular Stat Component ──────────────────────────── */
function CircularStat({
  value,
  label,
  size = 100,
}: {
  value: number;
  label: string;
  size?: number;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (value / 100) * circumference;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, {
            strokeDashoffset: dashOffset,
            duration: 2.5,
            ease: "power2.out",
            delay: 0.2,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [dashOffset]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(180,167,214,0.1)" strokeWidth="6" />
          <circle
            ref={ref}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="url(#ethereal-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
          <defs>
            <linearGradient id="ethereal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b4a7d6" />
              <stop offset="100%" stopColor="#a8c8e8" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl text-[var(--foreground)] leading-none">{value}+</span>
        </div>
      </div>
      <p className="text-[10px] uppercase tracking-[0.22em] opacity-50">{label}</p>
    </div>
  );
}

/* ─── Scripture Banner ─────────────────────────────────── */
function ScriptureBanner() {
  const [idx, setIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const el = containerRef.current;
      if (!el) return;
      gsap.to(el, {
        opacity: 0,
        y: -10,
        filter: "blur(8px)",
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          setIdx((prev) => (prev + 1) % scriptures.length);
          gsap.fromTo(
            el,
            { opacity: 0, y: 12, filter: "blur(8px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" }
          );
        },
      });
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="scripture-banner py-16 relative z-20">
      <div className="mx-auto w-[94%] max-w-3xl text-center">
        <div className="scripture-glass inline-block w-full">
          <div ref={containerRef} className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 text-sm sm:text-base">
              <BookOpen size={14} className="shrink-0 text-[var(--accent-lavender)] hidden sm:block opacity-60" />
              <p className="leading-relaxed opacity-80 italic font-display tracking-wide text-lg">&ldquo;{scriptures[idx].text}&rdquo;</p>
              <BookOpen size={14} className="shrink-0 text-[var(--accent-lavender)] hidden sm:block opacity-60" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--accent-blue)] mt-1 opacity-70">
              — {scriptures[idx].ref}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Ticker / Marquee ─────────────────────────────────── */
function Ticker() {
  const doubled = [...tickerItems, ...tickerItems];
  return (
    <div className="relative overflow-hidden border-y border-[var(--glass-border)] py-5 z-20 glass-heavy rounded-none !border-x-0">
      <div className="ticker-track flex">
        {doubled.map((item, i) => (
          <div key={i} className="ticker-item">
            <span className="ticker-dot" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Animated Mini Bar Chart ──────────────────────────── */
function MiniBarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mini-bar-chart">
      {barHeights.map((h, i) => (
        <div
          key={i}
          className={`mini-bar ${animated ? "animated" : ""}`}
          style={{
            height: `${h}%`,
            transitionDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function HomePage() {
  const mainRef           = useRef<HTMLElement>(null);
  const servicesPinRef    = useRef<HTMLElement>(null);
  const servicesScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* ── Hero Entrance ── */
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .from(".hero-badge",    { opacity: 0, y: 20, filter: "blur(10px)", duration: 0.8, ease: "power2.out" })
        .from(".hero-letter",   { opacity: 0, y: 60, filter: "blur(10px)", stagger: { amount: 0.8 }, duration: 1.2, ease: "power3.out" }, "-=0.4")
        .from(".hero-subtitle", { opacity: 0, y: 20, filter: "blur(10px)", duration: 0.8, ease: "power2.out" }, "-=0.6")
        .from(".hero-desc",     { opacity: 0, y: 15, filter: "blur(10px)", duration: 0.8, ease: "power2.out" }, "-=0.6")
        .from(".hero-cta",      { opacity: 0, y: 15, filter: "blur(10px)", stagger: 0.15, duration: 0.8, ease: "power2.out" }, "-=0.6")
        .from(".hero-stat",     { opacity: 0, y: 20, filter: "blur(10px)", stagger: 0.15, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .from(".hero-float",    { opacity: 0, x: 30, filter: "blur(10px)", stagger: 0.2, duration: 1, ease: "power2.out" }, "-=0.8");

      /* ── Hero Scroll Fade ── */
      gsap.to(".hero-scroll-fade", {
        opacity: 0,
        y: -100,
        filter: "blur(20px)",
        ease: "none",
        scrollTrigger: { trigger: "#home", start: "top top", end: "75% top", scrub: true },
      });

      /* ── Section Depth Reveals ── */
      gsap.utils.toArray<HTMLElement>(".depth-section").forEach((sec) => {
        gsap.from(sec, {
          opacity: 0,
          y: 60,
          filter: "blur(12px)",
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: sec, start: "top 85%" },
        });
      });

      /* ── Services Horizontal Pin ── */
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
          },
        });
      }

      /* ── Project Cards ── */
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 80,
          scale: 0.95,
          filter: "blur(10px)",
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });

      /* ── Team Cards ── */
      gsap.utils.toArray<HTMLElement>(".team-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 40,
          filter: "blur(10px)",
          delay: i * 0.1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });

      /* ── Timeline Steps ── */
      gsap.utils.toArray<HTMLElement>(".timeline-step").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          x: -40,
          filter: "blur(10px)",
          duration: 1.2,
          delay: i * 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      /* ── Tool Cards ── */
      gsap.utils.toArray<HTMLElement>(".tool-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 20,
          filter: "blur(5px)",
          delay: (i % 3) * 0.1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 92%" },
        });
      });

      /* ── About values ── */
      gsap.utils.toArray<HTMLElement>(".about-value").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          x: 20,
          filter: "blur(5px)",
          delay: i * 0.15,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
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
      <EtherealCanvas />

      {/* ── Sticky Nav ── */}
      <header className="sticky top-6 z-40 mx-auto mt-6 flex w-[94%] max-w-5xl items-center justify-between glass-accent px-6 py-4 shadow-2xl">
        <a href="#home" className="font-display text-lg tracking-[0.2em] ethereal-text">
          PROMINENCE
        </a>
        <nav className="hidden items-center gap-1 sm:flex">
          {["about", "services", "projects", "team", "process"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full px-4 py-2 text-[10.5px] font-medium uppercase tracking-[0.15em] opacity-60 transition hover:bg-[var(--accent-lavender)]/10 hover:opacity-100 hover:text-[var(--accent-lavender)] capitalize"
            >
              {id}
            </a>
          ))}
          <a href="#contact" className="pill-btn-solid ml-4 !py-[8px] !px-[20px] !text-[10px]">
            Contact
          </a>
        </nav>
      </header>

      {/* ══════════════════════════════════════════
          HERO
          ══════════════════════════════════════════ */}
      <section
        id="home"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden px-[5vw] py-32 lg:py-0"
      >
        {/* Ghost background word */}
        <span
          className="mag-bg-type absolute top-1/2 -left-[2vw] -translate-y-[48%] select-none pointer-events-none -z-10"
          aria-hidden
        >
          PROM<br />INENCE
        </span>

        {/* Hero asymm grid */}
        <div className="hero-scroll-fade relative z-10 w-full max-w-5xl mx-auto">
          <div className="asymm-hero-grid">
            {/* Left: editorial content */}
            <div>
              <span className="hero-badge pill-tag mb-10">
                Premium Digital Services
              </span>

              <h1
                className="font-display text-[clamp(4.5rem,11vw,9rem)] leading-[0.9] text-[var(--foreground)] overflow-hidden pb-4"
                aria-label={HERO_WORD}
              >
                {HERO_WORD.split("").map((char, i) => (
                  <span key={i} className="hero-letter inline-block">
                    {char}
                  </span>
                ))}
              </h1>

              <p className="hero-subtitle mt-6 text-[11px] font-semibold uppercase tracking-[0.4em] ethereal-text opacity-90">
                Virtual Assistance Studio
              </p>

              <p className="hero-desc mt-8 max-w-lg text-[1.65rem] font-medium leading-snug sm:text-[2rem] opacity-90">
                Scale your vision with seamless virtual support
              </p>
              <p className="hero-desc mt-5 max-w-sm text-[0.95rem] leading-[1.8] opacity-60">
                Video, web, admin, and creative services — elevating your brand without the heavy overhead.
              </p>

              <div className="mt-12 flex flex-wrap gap-5">
                <a href="#contact" className="hero-cta pill-btn-solid">
                  Work With Us <ArrowRight size={14} />
                </a>
                <a href="#services" className="hero-cta pill-btn">
                  View Services
                </a>
              </div>

              {/* Stats */}
              <div className="mt-16 flex flex-wrap gap-12">
                {[
                  { num: "50+", label: "Projects Delivered" },
                  { num: "3+",  label: "Years Active"       },
                  { num: "6",   label: "Team Members"       },
                ].map((stat) => (
                  <div key={stat.label} className="hero-stat">
                    <p className="chrome-text font-display text-[2.75rem] leading-none mb-2">{stat.num}</p>
                    <p className="text-[9.5px] uppercase tracking-[0.25em] opacity-50">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: floating stat cards */}
            <div className="hidden lg:flex flex-col gap-6 pl-12 pt-12 animate-float">
              {/* Floating card 1 — mini bar chart */}
              <div className="hero-float stat-float-card w-[240px] self-end chrome-border">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-semibold">Growth</p>
                  <TrendingUp size={14} className="text-[var(--accent-lavender)]" />
                </div>
                <MiniBarChart />
                <p className="mt-3 text-[9px] opacity-40 tracking-wider">Client results · 2024</p>
              </div>

              {/* Floating card 2 — rating */}
              <div className="hero-float stat-float-card w-[190px] self-start" style={{ animationDelay: '1s' }}>
                <div className="flex gap-1 mb-3">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} size={12} className="fill-[var(--accent-blue)] text-[var(--accent-blue)] opacity-80" />
                  ))}
                </div>
                <p className="font-display text-3xl">5.0</p>
                <p className="text-[9.5px] uppercase tracking-[0.2em] opacity-50 mt-1">
                  Client Rating
                </p>
              </div>

              {/* Floating card 3 — active projects */}
              <div className="hero-float stat-float-card w-[220px] self-end" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-blush)] animate-pulse" />
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-semibold">Active</p>
                </div>
                <p className="font-display text-[2.5rem] mt-2">12</p>
                <p className="text-[9.5px] opacity-50 tracking-wider mt-1">Projects in flight</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-[5vw] flex flex-col items-start gap-3 opacity-40">
          <div className="h-12 w-px bg-gradient-to-b from-[var(--accent-lavender)] to-transparent" />
          <p className="text-[9px] uppercase tracking-[0.4em]">Scroll</p>
        </div>
      </section>

      {/* ── Ticker ── */}
      <Ticker />

      {/* ══════════════════════════════════════════
          ABOUT
          ══════════════════════════════════════════ */}
      <section
        id="about"
        className="depth-section mx-auto w-[94%] max-w-5xl py-28 relative z-10"
      >
        <span className="mag-bg-type absolute -top-12 right-0 opacity-[0.02]" aria-hidden>
          ABOUT
        </span>

        <div className="ethereal-card p-10 sm:p-16 corner-accent">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div>
              <p className="pill-tag mb-6">About Prominence</p>
              <h2 className="mt-4 text-[2.5rem] font-display leading-[1.1] sm:text-[3.5rem]">
                Elevating visions for those <br /> <span className="ethereal-text">who move fast.</span>
              </h2>
              <p className="mt-6 text-[0.95rem] leading-[1.9] opacity-70">
                We&rsquo;re a dedicated digital collective that handles the orchestration behind your growth —
                video, web, admin, and creative systems, all gracefully managed in one place.
              </p>

              {/* Values */}
              <div className="mt-10 flex flex-col gap-4">
                {[
                  { label: "Reliable Delivery",  sub: "On time, every time — seamless execution."  },
                  { label: "On-Brand Creative",  sub: "Assets that resonate with your ethereal vision."  },
                  { label: "Clear Systems",       sub: "Intuitive workflows from day one."     },
                ].map((v, i) => (
                  <div
                    key={v.label}
                    className="about-value neu-pressed flex items-start gap-5 px-6 py-5"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-lavender)]/10 border border-[var(--accent-lavender)]/20">
                      <Zap size={14} className="text-[var(--accent-lavender)]" />
                    </div>
                    <div>
                      <p className="text-[0.95rem] font-semibold">{v.label}</p>
                      <p className="mt-1.5 text-[0.8rem] leading-relaxed opacity-60">{v.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="mt-10 inline-flex items-center gap-3 text-sm font-semibold ethereal-text transition-all hover:gap-4"
              >
                Start a journey <ArrowRight size={14} />
              </a>
            </div>

            {/* Right: circular stats */}
            <div className="flex flex-col items-center gap-10">
              <div className="flex gap-10 justify-center">
                <CircularStat value={50} label="Projects" size={120} />
                <CircularStat value={98} label="Satisfaction" size={120} />
              </div>
              <div className="flex gap-10 justify-center">
                <CircularStat value={75} label="On-Time Rate" size={120} />
                <CircularStat value={60} label="Repeat Clients" size={120} />
              </div>
              <p className="text-[9.5px] uppercase tracking-[0.25em] opacity-40 text-center mt-4">
                Performance metrics · 2024
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SERVICES — Pinned Horizontal Scroll
          ══════════════════════════════════════════ */}
      <section
        id="services"
        ref={servicesPinRef}
        className="relative h-screen w-full overflow-hidden z-10"
      >
        <div
          ref={servicesScrollRef}
          className="absolute flex h-full w-[280vw] sm:w-[220vw] lg:w-[160vw] items-center px-[5vw]"
        >
          {/* Intro */}
          <div className="w-[90vw] sm:w-[52vw] lg:w-[38vw] shrink-0 pr-12">
            <p className="pill-tag mb-6">What We Do</p>
            <h2 className="mt-3 font-display text-[clamp(3.5rem,8vw,6rem)] leading-[0.9]">
              OUR<br />SERVICES
            </h2>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-[1.9] opacity-70">
              Drift through to explore how we elevate and scale your digital presence.
            </p>
            <div className="mt-10 flex gap-2 text-[var(--accent-lavender)]/50">
              {[0, 0.2, 0.4].map((d, i) => (
                <ArrowRight key={i} size={24} className="animate-pulse" style={{ animationDelay: `${d}s` }} />
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="flex shrink-0 gap-8 sm:gap-10">
            {services.map(({ _id, title, description, sub, Icon }, i) => (
              <article
                key={_id}
                className="service-card group glass-panel flex h-[420px] w-[300px] sm:w-[360px] flex-col justify-between p-10 hover:border-[var(--accent-blue)]/40 hover:shadow-[0_20px_60px_rgba(168,200,232,0.15)]"
              >
                {/* Icon */}
                <div className="flex flex-col gap-6">
                  <div className="skeuo-icon text-[var(--accent-lavender)] group-hover:text-[var(--accent-blue)] group-hover:scale-110">
                    <Icon size={24} />
                  </div>
                  {/* Number */}
                  <span className="font-display text-[3.5rem] opacity-20 leading-none chrome-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <h3 className="text-[1.35rem] font-semibold tracking-wide">{title}</h3>
                  <p className="mt-3 text-[0.9rem] leading-relaxed opacity-60">{description}</p>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] ethereal-text opacity-80">
                    {sub}
                  </p>
                  <span className="pill-btn mt-8 !py-[8px] !px-[16px] !text-[9px]">Explore</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROJECTS
          ══════════════════════════════════════════ */}
      <section
        id="projects"
        className="depth-section mx-auto w-[94%] max-w-5xl py-28 relative z-10"
      >
        <span className="mag-bg-type absolute -top-8 right-0 opacity-[0.02]" aria-hidden>
          WORK
        </span>
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="pill-tag mb-5">Our Work</p>
            <h2 className="mt-3 font-display text-[clamp(3rem,7vw,5rem)] leading-none">
              PROJECTS
            </h2>
          </div>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60 hover:opacity-100 hover:text-[var(--accent-lavender)] transition"
          >
            View all <ArrowRight size={13} />
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project._id} className="project-card group h-[360px]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover opacity-40 transition duration-[1s] group-hover:scale-105 group-hover:opacity-70"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Corner marker */}
              <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition duration-500">
                <div className="flex h-10 w-10 items-center justify-center rounded-full glass-accent text-[var(--accent-lavender)]">
                  <ExternalLink size={14} />
                </div>
              </div>
              <div className="card-content absolute bottom-0 left-0 right-0 p-8 z-10">
                <span className="pill-tag mb-4 !bg-black/20 !border-white/10">{project.type}</span>
                <h3 className="text-[1.4rem] font-display tracking-wide text-white">{project.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-[1.8] text-white/70">{project.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TEAM
          ══════════════════════════════════════════ */}
      <section
        id="team"
        className="depth-section mx-auto w-[94%] max-w-5xl py-28 relative z-10"
      >
        <span className="mag-bg-type absolute -top-8 left-0 opacity-[0.02]" aria-hidden>
          TEAM
        </span>
        <div className="mb-14">
          <p className="pill-tag mb-5">Our People</p>
          <h2 className="mt-3 font-display text-[clamp(3rem,7vw,5rem)] leading-none">
            THE TEAM
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map(({ _id, name, role, bio, socials }) => (
            <article
              key={_id}
              className="team-card group ethereal-card p-8 transition duration-500 hover:-translate-y-2"
            >
              {/* Main content */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl glass-accent font-display text-2xl text-[var(--accent-lavender)] transition duration-500 group-hover:scale-110">
                {name.charAt(0)}
              </div>
              <p className="text-[1.1rem] font-semibold tracking-wide">{name}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] opacity-50">{role}</p>

              {/* Bio overlay on hover */}
              <div className="team-bio-overlay">
                <p className="text-[10px] uppercase tracking-[0.2em] ethereal-text mb-3">{role}</p>
                <p className="font-semibold text-[1.1rem] mb-4">{name}</p>
                <p className="text-[0.85rem] leading-[1.8] opacity-70">{bio}</p>
                <div className="mt-6 flex gap-3">
                  {socials.map(({ platform, Icon }) => (
                    <a
                      key={platform}
                      href="#"
                      className="flex h-9 w-9 items-center justify-center rounded-full glass-accent text-[var(--foreground)] opacity-70 transition hover:opacity-100 hover:text-[var(--accent-lavender)] hover:scale-110"
                    >
                      <Icon size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROCESS — Cinematic Vertical Timeline
          ══════════════════════════════════════════ */}
      <section
        id="process"
        className="depth-section mx-auto w-[94%] max-w-5xl py-28 relative z-10"
      >
        <div className="glass-heavy p-10 sm:p-16 border-none">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            {/* Left: heading */}
            <div className="lg:sticky lg:top-32">
              <p className="pill-tag mb-6">How We Work</p>
              <h2 className="mt-3 font-display text-[clamp(3rem,7vw,5rem)] leading-none">
                THE<br />PROCESS
              </h2>
              <p className="mt-8 text-[0.95rem] leading-[1.9] opacity-70 max-w-sm">
                A serene, repeatable flow designed to manifest outcomes — effortlessly bringing ideas into reality.
              </p>

              {/* Decorative globe */}
              <div className="dotted-globe mt-12 h-[200px] w-[200px] opacity-60" />
            </div>

            {/* Right: timeline */}
            <div className="timeline-container mt-8 lg:mt-0">
              {processSteps.map(({ _id, step, title, description, Icon }) => (
                <div key={_id} className="timeline-step">
                  <div className="step-dot" />
                  <div className="group transition duration-500 hover:translate-x-2">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="font-display text-[var(--accent-lavender)]/40 text-[1.75rem]">{step}</span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl glass-accent text-[var(--foreground)] opacity-60 transition duration-400 group-hover:opacity-100 group-hover:text-[var(--accent-lavender)] group-hover:scale-110">
                        <Icon size={16} />
                      </div>
                    </div>
                    <h3 className="text-[1.2rem] font-semibold tracking-wide">{title}</h3>
                    <p className="mt-3 text-[0.95rem] leading-[1.9] opacity-60">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TOOLS & TECHNOLOGIES
          ══════════════════════════════════════════ */}
      <section
        id="tools"
        className="depth-section mx-auto w-[94%] max-w-5xl py-28 relative z-10"
      >
        <div className="mb-14">
          <p className="pill-tag mb-5">Our Stack</p>
          <h2 className="mt-3 font-display text-[clamp(3rem,7vw,5rem)] leading-none">
            TOOLS &amp;<br />TECH
          </h2>
        </div>
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3">
          {toolsData.map((group) => (
            <div key={group.category} className="flex flex-col gap-6">
              <h3 className="overline-label chrome-text !opacity-100">{group.category}</h3>
              <div className="flex flex-col gap-4">
                {group.items.map((tool) => (
                  <article
                    key={tool.id}
                    className="tool-card group neu-flat flex items-center gap-5 p-5"
                  >
                    <div className="skeuo-icon !w-12 !h-12 !rounded-xl text-[var(--foreground)] opacity-60 group-hover:opacity-100 group-hover:text-[var(--accent-lavender)]">
                      <tool.Icon size={18} />
                    </div>
                    <div>
                      <p className="text-[0.95rem] font-semibold tracking-wide">{tool.name}</p>
                      <p className="mt-1 text-[0.75rem] opacity-50">{tool.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA / CONTACT
          ══════════════════════════════════════════ */}
      <section
        id="contact"
        className="depth-section mx-auto w-[94%] max-w-5xl py-28 relative z-10"
      >
        <div className="glass-panel relative overflow-hidden p-14 text-center sm:p-24 border-none !bg-[var(--glass-heavy)]">
          {/* Glow blobs */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full bg-[var(--accent-lavender)]/20 blur-[120px] animate-pulse-glow" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[var(--accent-blue)]/15 blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

          <span
            className="mag-bg-type absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015]"
            aria-hidden
          >
            GROW
          </span>

          {/* Top decorative line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-lavender)]/60 to-transparent" />

          <p className="relative pill-tag mb-8 chrome-border !bg-transparent">Ready to Ascend?</p>
          <h2 className="relative font-display text-[clamp(3rem,8vw,6rem)] leading-none">
            Let&rsquo;s Create Something{" "}
            <span className="ethereal-text">Ethereal</span>
          </h2>
          <p className="relative mx-auto mt-8 max-w-lg text-[1rem] leading-[1.9] opacity-70">
            Share your vision with us. We&rsquo;ll gently weave it into reality — elegant, seamless, and beautifully on-brand.
          </p>

          {/* Email CTA */}
          <a
            href="mailto:hello@prominenceva.com"
            className="relative mt-12 inline-flex"
          >
            <span className="pill-btn-solid gap-4 text-[0.95rem] !px-[36px] !py-[16px]">
              <Mail size={16} />
              hello@prominenceva.com
            </span>
          </a>

          {/* Quick trust signals */}
          <div className="relative mt-16 flex flex-wrap justify-center gap-8">
            {[
              "Response within 24h",
              "No heavy contracts",
              "Curated for visionaries",
            ].map((t) => (
              <div key={t} className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-50">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-lavender)] shadow-[0_0_8px_var(--accent-lavender)]" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scripture Banner ── */}
      <ScriptureBanner />

      {/* ══════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════ */}
      <footer className="border-t border-[var(--glass-border)] bg-[var(--surface-1)] py-16 relative z-20">
        <div className="mx-auto w-[94%] max-w-5xl">
          <div className="mb-14 grid gap-10 sm:grid-cols-3">
            {/* Brand */}
            <div>
              <p className="font-display text-[1.1rem] tracking-[0.25em] ethereal-text">PROMINENCE VA</p>
              <p className="mt-4 text-[0.85rem] leading-[1.9] opacity-50 max-w-[220px]">
                Ethereal virtual services for creators and visionary brands.
              </p>
              <p className="mt-4 text-[0.85rem] opacity-50">hello@prominenceva.com</p>
            </div>

            {/* Links */}
            <div>
              <p className="overline-label mb-6">Navigation</p>
              <div className="flex flex-col gap-3">
                {["about", "services", "projects", "team", "process", "contact"].map((id) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="text-[0.85rem] font-medium capitalize opacity-60 transition hover:text-[var(--accent-lavender)] hover:opacity-100"
                  >
                    {id}
                  </a>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="overline-label mb-6">Follow Along</p>
              <div className="flex flex-wrap gap-3">
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
                    className="pill-btn !py-[8px] !px-[16px] !text-[9.5px] opacity-70 hover:opacity-100"
                  >
                    {s.label} <ExternalLink size={10} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="section-divider-subtle mb-8" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] uppercase tracking-[0.25em] opacity-40">
              &copy; {new Date().getFullYear()} Prominence VA. All rights reserved.
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] opacity-40">
              Crafted with ether &amp; intent.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}