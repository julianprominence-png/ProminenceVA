'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Box, Code, Flame, Triangle,
  Scissors, Video, Film,
  Paintbrush, ImageIcon, PenTool, Layers
} from 'lucide-react';
import './about.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */
const teamData = {
  ceo: {
    name: 'Vien Abache',
    role: 'CEO & Founder',
    image: '/images/team-vien.png',
    about:
      'Visionary leader driving innovation and pushing the boundaries of digital architecture. Orchestrating the intersection of design and robust engineering to build systems that scale.',
  },
  members: [
    { name: 'Vinz Iligan',       role: 'Lead Engineer',    image: '/images/team-vinz.png',    about: 'Architecting scalable backend systems and ensuring seamless data pipelines.' },
    { name: 'Julian Tolentino',  role: 'Frontend Wizard',  image: '/images/team-julian.png',  about: 'Crafting pixel-perfect, interactive user interfaces with modern frameworks.' },
    { name: 'Giervan Sabalbero', role: 'Fullstack Dev',    image: '/images/team-giervan.png', about: 'Bridging the gap between intuitive frontends and powerful server logic.' },
    { name: 'Andrea Turalba',    role: 'UI/UX Dev',        image: '/images/team-andrea.png',  about: 'Translating complex user journeys into elegant, accessible web experiences.' },
    { name: 'Gian Cruz',         role: 'Senior Editor',    image: '/images/team-gian.png',    about: 'Transforming raw concepts into cinematic, narrative-driven visual stories.' },
    { name: 'Russel Minimo',     role: 'Motion Graphics',  image: '/images/team-russel.png',  about: 'Breathing life into static assets through fluid motion and dynamic effects.' },
  ],
};

const allMembers = [
  { ...teamData.ceo },
  ...teamData.members,
];

type TechCategory = 'web' | 'graphics' | 'video';

interface TechTool {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const techStacks: Record<TechCategory, TechTool[]> = {
  web: [
    { name: 'Next.js',   icon: <Box size={22} color="#ffffff" />,         color: '255,255,255' },
    { name: 'VS Code',   icon: <Code size={22} color="#007ACC" />,        color: '0,122,204' },
    { name: 'Firebase',  icon: <Flame size={22} color="#FFA000" />,       color: '255,160,0' },
    { name: 'Vercel',    icon: <Triangle size={22} color="#cccccc" fill="#cccccc" />, color: '204,204,204' },
  ],
  graphics: [
    { name: 'Canva',       icon: <Paintbrush size={22} color="#00C4CC" />, color: '0,196,204' },
    { name: 'Photoshop',   icon: <ImageIcon size={22} color="#31A8FF" />,  color: '49,168,255' },
    { name: 'Illustrator', icon: <PenTool size={22} color="#FF9A00" />,    color: '255,154,0' },
    { name: 'Figma',       icon: <Layers size={22} color="#A259FF" />,      color: '162,89,255' },
  ],
  video: [
    { name: 'CapCut',          icon: <Scissors size={22} color="#a855f7" />,  color: '168,85,247' },
    { name: 'Adobe Premiere',  icon: <Video size={22} color="#9999FF" />,     color: '153,153,255' },
    { name: 'DaVinci Resolve', icon: <Film size={22} color="#2dd4bf" />,      color: '45,212,191' },
    { name: 'After Effects',   icon: <Box size={22} color="#9999FF" />,       color: '153,153,255' },
  ],
};

const tabLabels: Record<TechCategory, string> = {
  web: 'Web Development',
  graphics: 'Graphics Design',
  video: 'Video Editing',
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */
export default function AboutPage() {
  /* ── Team character selection state ── */
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = allMembers[selectedIdx];
  const portraitRef = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  /* ── Tech stack filter state ── */
  const [activeTab, setActiveTab] = useState<TechCategory>('web');
  const gridRef = useRef<HTMLDivElement>(null);

  /* ── Section refs for scroll animations ── */
  const heroRef = useRef<HTMLDivElement>(null);
  const teamSectionRef = useRef<HTMLDivElement>(null);
  const techSectionRef = useRef<HTMLDivElement>(null);

  /* ── Character selection animation ── */
  const handleSelectMember = (idx: number) => {
    if (idx === selectedIdx) return;

    // Animate out
    const tl = gsap.timeline();

    if (portraitRef.current) {
      tl.to(portraitRef.current, { opacity: 0, scale: 0.95, duration: 0.25, ease: 'power2.in' }, 0);
    }
    if (infoRef.current) {
      tl.to(infoRef.current, { opacity: 0, x: 20, duration: 0.2, ease: 'power2.in' }, 0);
    }

    tl.call(() => setSelectedIdx(idx));

    // Animate in
    tl.call(() => {
      if (portraitRef.current) {
        gsap.fromTo(portraitRef.current,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
        );
      }
      if (infoRef.current) {
        gsap.fromTo(infoRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out', delay: 0.05 }
        );
      }
    });
  };

  /* ── Tech tab switch animation ── */
  const handleTabSwitch = (tab: TechCategory) => {
    if (tab === activeTab) return;

    if (gridRef.current) {
      gsap.to(gridRef.current, {
        opacity: 0,
        y: 12,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setActiveTab(tab);
          gsap.fromTo(gridRef.current,
            { opacity: 0, y: -12 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
          );
          // Stagger cards
          const cards = gridRef.current?.querySelectorAll('.techstack-card');
          if (cards) {
            gsap.fromTo(cards,
              { opacity: 0, scale: 0.92, y: 16 },
              { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'back.out(1.4)', delay: 0.05 }
            );
          }
        },
      });
    } else {
      setActiveTab(tab);
    }
  };

  /* ── Scroll-triggered entrance animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero fade-in
      if (heroRef.current) {
        const els = heroRef.current.querySelectorAll('.about-animate');
        gsap.fromTo(els,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.3 }
        );
      }

      // Team section
      if (teamSectionRef.current) {
        gsap.fromTo(teamSectionRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: teamSectionRef.current, start: 'top 80%' } }
        );
      }

      // Tech section
      if (techSectionRef.current) {
        gsap.fromTo(techSectionRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: techSectionRef.current, start: 'top 80%' } }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen font-sans selection:bg-fuchsia-500/30" style={{ background: 'linear-gradient(180deg, #0a0814 0%, #100e24 30%, #161330 50%, #100e24 80%, #0a0814 100%)' }}>

      {/* ── Starfield ── */}
      <div className="starfield" />

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* COMPANY OVERVIEW                                                      */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="about-hero">
        <div className="about-hero-glow" />

        {/* Overline badge */}
        <p className="about-animate about-overline">Who We Are</p>

        {/* Large title */}
        <h1 className="about-animate about-title">PROMINENCE</h1>

        {/* Detail pills row */}
        <div className="about-animate" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(168,85,247,0.5)', fontWeight: 800 }}>Creative Agency</span>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>Olongapo City, PH</span>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>Est. 2024</span>
        </div>

        {/* Thin horizontal rule */}
        <div className="about-animate" style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.3), transparent)', marginBottom: '2.5rem' }} />

        {/* Description card */}
        <div className="about-animate about-description-card">
          <p className="about-subtitle" style={{ margin: 0, maxWidth: '100%', textAlign: 'center' }}>
            We build digital experiences that elevate brands — from pixel-perfect web architectures
            to cinematic post-production and striking visual identities. Purpose, precision,
            and a relentless pursuit of excellence.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TEAM — VIDEO GAME CHARACTER SELECTION                                 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section ref={teamSectionRef} className="team-section">
        <div className="team-header">
          <p style={{ fontSize: '0.56rem', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(168,85,247,0.5)', marginBottom: '0.75rem' }}>
            Select Your Champion
          </p>
          <h2>The Roster</h2>
          <p>Hover or tap to switch characters</p>
        </div>

        {/* Main character display */}
        <div className="char-display">
          {/* Portrait */}
          <div className="char-portrait-wrapper">
            <img
              ref={portraitRef}
              src={selected.image}
              alt={selected.name}
              className="char-portrait"
            />
            <div className="char-portrait-glow" />
            <div className="char-portrait-ring" />
          </div>

          {/* Info panel */}
          <div ref={infoRef} className="char-info">
            <span className="char-role-badge">{selected.role}</span>
            <h3 className="char-name">{selected.name}</h3>
            <p className="char-bio">{selected.about}</p>
          </div>
        </div>

        {/* Character roster selector */}
        <div className="char-roster">
          {allMembers.map((member, idx) => (
            <div
              key={member.name}
              className={`char-slot ${idx === selectedIdx ? 'active' : ''}`}
              onMouseEnter={() => handleSelectMember(idx)}
              onClick={() => handleSelectMember(idx)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${member.name}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectMember(idx); }}
            >
              <img src={member.image} alt={member.name} />
              <span className="char-slot-name">{member.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TECH STACK & METHODOLOGY                                              */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section ref={techSectionRef} className="techstack-section">
        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(147,51,234,0.2), transparent)', marginBottom: '4rem' }} />

        <div className="techstack-header">
          <p style={{ fontSize: '0.56rem', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(168,85,247,0.5)', marginBottom: '0.75rem' }}>
            Our Arsenal
          </p>
          <h2>How We Do It</h2>
          <p>
            We leverage industry-leading tools tailored for each discipline.
            Select a service below to explore our technology stack.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="techstack-tabs">
          {(Object.keys(tabLabels) as TechCategory[]).map((tab) => (
            <button
              key={tab}
              className={`techstack-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabSwitch(tab)}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* Tool cards grid */}
        <div ref={gridRef} className="techstack-grid">
          {techStacks[activeTab].map((tool) => (
            <div key={tool.name} className="techstack-card">
              <div className="techstack-card-icon" style={{ background: `rgba(${tool.color}, 0.08)` }}>
                {tool.icon}
              </div>
              <span className="techstack-card-name">{tool.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom gradient fade into footer ── */}
      <div style={{ height: '8rem', background: 'linear-gradient(to bottom, transparent, #0a0814)' }} />
    </div>
  );
}
