"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Clapperboard,
  Clock3,
  Code2,
  ExternalLink,
  Layers,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

const services = [
  {
    title: "Video Editing",
    description: "Story-driven edits for reels, ads, and branded content with fast turnarounds.",
    icon: Clapperboard,
  },
  {
    title: "Web Development",
    description: "Modern sites and landing pages built for speed, clarity, and conversion.",
    icon: Code2,
  },
  {
    title: "Virtual Assistance",
    description: "Reliable admin support, communication workflows, and business organization.",
    icon: Briefcase,
  },
  {
    title: "Creative Support",
    description: "Design support for content systems, brand assets, and social media kits.",
    icon: Sparkles,
  },
];

const team = [
  { name: "Vien Abache", role: "CEO" },
  { name: "Gian", role: "Video Editor" },
  { name: "Russel", role: "Video Editor" },
  { name: "Vinz", role: "Developer" },
  { name: "Giervan", role: "Developer" },
  { name: "Julian", role: "Developer" },
];

const projects = [
  {
    title: "Creator Launch Campaign",
    type: "Editing",
    summary: "Multi-format short-form package for social launch week.",
    gradient: "from-purple-500/30 via-fuchsia-500/20 to-transparent",
  },
  {
    title: "Service Booking Website",
    type: "Coding",
    summary: "Clean booking flow and polished mobile-first landing page.",
    gradient: "from-indigo-500/30 via-purple-500/20 to-transparent",
  },
  {
    title: "Operations Dashboard",
    type: "Virtual Assistance",
    summary: "Task system and reporting setup to streamline daily operations.",
    gradient: "from-violet-500/30 via-pink-500/15 to-transparent",
  },
  {
    title: "Brand Kit Sprint",
    type: "Creative",
    summary: "Quick-turn visual assets, templates, and campaign directions.",
    gradient: "from-fuchsia-500/25 via-purple-500/20 to-transparent",
  },
];

const stack = [
  "Next.js",
  "Tailwind CSS",
  "Premiere Pro",
  "After Effects",
  "VS Code",
  "TypeScript",
  "Figma",
  "Notion",
];

const scriptures = [
  {
    text: "Commit your work to the Lord, and your plans will be established.",
    ref: "Proverbs 16:3",
  },
  {
    text: "Whatever you do, work heartily, as for the Lord and not for men.",
    ref: "Colossians 3:23",
  },
  {
    text: "For God gave us a spirit not of fear but of power and love and self-control.",
    ref: "2 Timothy 1:7",
  },
  {
    text: "But remember the Lord your God, for it is he who gives you the ability to produce wealth.",
    ref: "Deuteronomy 8:18",
  },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ScriptureBanner() {
  const [scriptureIndex, setScriptureIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setScriptureIndex((prev) => (prev + 1) % scriptures.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="scripture-banner py-10">
      <div className="mx-auto w-[94%] max-w-4xl">
        <div className="scripture-glass w-full text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={scriptureIndex}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.45 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <BookOpen size={14} className="text-purple-300/80" />
                <p className="leading-relaxed opacity-85">{scriptures[scriptureIndex].text}</p>
                <BookOpen size={14} className="text-purple-300/80" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-purple-200/80">
                {scriptures[scriptureIndex].ref}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { scrollY } = useScroll();
  const orbSlow = useTransform(scrollY, [0, 1000], [0, 160]);
  const orbMid = useTransform(scrollY, [0, 1000], [0, -100]);
  const orbFast = useTransform(scrollY, [0, 1000], [0, 220]);
  const heroCardFloat = useTransform(scrollY, [0, 500], [0, -35]);

  return (
    <main className="noise-overlay relative overflow-hidden bg-[var(--background)] text-[var(--foreground)] scroll-smooth">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <motion.div style={{ y: orbSlow }} className="depth-layer absolute -top-28 left-[-10%] h-72 w-72 bg-purple-400/18 blur-[110px]" />
        <motion.div style={{ y: orbMid }} className="depth-layer absolute top-[18%] right-[-8%] h-80 w-80 bg-fuchsia-300/14 blur-[120px]" />
        <motion.div style={{ y: orbFast }} className="depth-layer absolute bottom-[-6%] left-[20%] h-80 w-80 bg-amber-300/12 blur-[120px]" />
        <div className="grid-pattern absolute inset-0 opacity-25" />
      </div>

      <header className="sticky top-4 z-40 mx-auto mt-4 flex w-[94%] max-w-5xl items-center justify-between rounded-2xl border border-white/10 bg-[var(--surface-1)]/85 px-5 py-3 backdrop-blur-md">
        <a href="#home" className="text-sm font-semibold tracking-wide text-purple-200">
          Prominence VA
        </a>
        <nav className="hidden items-center gap-5 text-xs font-medium opacity-80 sm:flex">
          <a href="#about" className="transition-colors hover:text-purple-300">About</a>
          <a href="#about-info" className="transition-colors hover:text-purple-300">About Info</a>
          <a href="#services" className="transition-colors hover:text-purple-300">Services</a>
          <a href="#projects" className="transition-colors hover:text-purple-300">Projects</a>
          <a href="#contact" className="transition-colors hover:text-purple-300">Contact</a>
        </nav>
      </header>

      <section id="home" className="mx-auto flex min-h-[96vh] w-[94%] max-w-5xl items-center py-20">
        <FadeIn>
          <div className="relative grid w-full gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative z-10">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-purple-200">
                <Layers size={14} /> Cozy Digital Operations
              </p>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Elevate Your Workflow with Prominence
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 opacity-80 sm:text-base">
                Prominence Virtual Assistance delivers high-quality virtual support, creative production, and technical execution for clients worldwide.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-300 px-5 py-3 text-sm font-bold text-zinc-900 transition hover:scale-[1.03]"
                >
                  Work With Us <ArrowRight size={16} />
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  View Services
                </a>
              </div>
            </div>

            <motion.div
              style={{ y: heroCardFloat }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel relative rounded-3xl p-6"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-purple-300/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-fuchsia-300/15 blur-2xl" />

              <div className="relative mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-purple-200/80">About Prominence</p>
                  <p className="mt-1 text-sm font-semibold">Your Digital Support Partner</p>
                </div>
                <Briefcase className="text-purple-200" size={20} />
              </div>
              <div className="relative rounded-xl bg-black/30 p-4">
                <div className="mb-2 flex items-center justify-between text-xs opacity-70">
                  <span>Global Service Coverage</span>
                  <span>24/7 Collaboration</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/15">
                  <div className="h-1.5 w-4/5 rounded-full bg-purple-300" />
                </div>
              </div>
              <p className="mt-4 text-xs leading-6 opacity-75">
                Prominence helps founders and teams stay efficient with dependable virtual assistance, creative execution, and modern web support.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="glass-accent absolute -bottom-8 left-0 hidden rounded-xl px-4 py-3 lg:block"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-purple-200/80">Trusted by founders</p>
              <p className="text-xs font-semibold">Reliable, creative, and efficient delivery</p>
            </motion.div>
          </div>
        </FadeIn>
      </section>

      <section id="about" className="mx-auto w-[94%] max-w-5xl py-12">
        <FadeIn>
          <div className="glass-panel rounded-3xl p-7 sm:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-200/80">About Prominence</p>
            <p className="mt-4 max-w-3xl text-sm leading-7 opacity-85 sm:text-base">
              Prominence Virtual Assistance is a dynamic digital team dedicated to helping businesses scale through creative, technical, and administrative support.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                "Reliability in every deliverable",
                "Creativity that feels on-brand",
                "Efficiency through clear systems",
              ].map((value, index) => (
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-medium"
                >
                  {value}
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      <section id="about-info" className="mx-auto w-[94%] max-w-5xl py-12">
        <FadeIn>
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-200/80">About Info</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Inside the Prominence Process</h2>
          </div>
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Reliable Systems",
              text: "Clear timelines, structured task tracking, and transparent communication from kickoff to delivery.",
              icon: ShieldCheck,
            },
            {
              title: "Creative Execution",
              text: "Content, visuals, and technical outputs built with both audience impact and business goals in mind.",
              icon: Sparkles,
            },
            {
              title: "Fast Response",
              text: "Responsive collaboration windows and practical updates to keep momentum high every week.",
              icon: Clock3,
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass-panel rounded-2xl p-6"
              >
                <div className="mb-4 inline-flex rounded-lg bg-purple-300/15 p-2 text-purple-200">
                  <Icon size={18} />
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 opacity-75">{item.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="services" className="mx-auto w-[94%] max-w-5xl py-14">
        <FadeIn>
          <h2 className="text-2xl font-black sm:text-3xl">Services</h2>
        </FadeIn>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="group rounded-2xl border border-white/10 bg-[var(--surface-2)]/60 p-6 transition hover:-translate-y-1 hover:border-purple-300/40 hover:shadow-lg hover:shadow-purple-300/10"
              >
                <div className="mb-4 inline-flex rounded-lg bg-purple-300/15 p-2 text-purple-200">
                  <Icon size={18} />
                </div>
                <h3 className="text-lg font-bold">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 opacity-75">{service.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="projects" className="mx-auto w-[94%] max-w-5xl py-14">
        <FadeIn>
          <h2 className="text-2xl font-black sm:text-3xl">Projects and Work</h2>
        </FadeIn>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.09, duration: 0.55 }}
              className="project-card h-[240px]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
              <div className="card-content">
                <div className="mb-3 inline-flex rounded-full border border-purple-300/30 bg-purple-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-purple-200">
                  {project.type}
                </div>
                <h3 className="text-lg font-bold text-white">{project.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/80">{project.summary}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="team" className="mx-auto w-[94%] max-w-5xl py-14">
        <FadeIn>
          <div className="mb-6 flex items-center gap-2">
            <Users size={18} className="text-purple-200" />
            <h2 className="text-2xl font-black sm:text-3xl">Team</h2>
          </div>
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="rounded-2xl border border-white/10 bg-[var(--surface-1)]/60 p-5 transition hover:scale-[1.01] hover:border-purple-200/35"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-300/20 text-sm font-black text-purple-200">
                {member.name.charAt(0)}
              </div>
              <h3 className="text-base font-bold">{member.name}</h3>
              <p className="text-sm opacity-70">{member.role}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[94%] max-w-5xl py-14">
        <FadeIn>
          <div className="mb-5 flex items-center gap-2">
            <Wrench size={17} className="text-purple-200" />
            <h2 className="text-2xl font-black sm:text-3xl">Tech Stack</h2>
          </div>
        </FadeIn>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface-1)]/60 py-4">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="flex w-max gap-3 px-3"
          >
            {[...stack, ...stack].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="contact" className="mx-auto w-[94%] max-w-5xl py-16">
        <FadeIn>
          <div className="rounded-3xl border border-purple-300/30 bg-gradient-to-br from-purple-300/20 via-transparent to-pink-300/10 p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-200/80">Call to Action</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Let&apos;s Build Something Great Together</h2>
            <a
              href="mailto:hello@prominenceva.com"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-300 px-5 py-3 text-sm font-bold text-zinc-900 transition hover:scale-[1.03]"
            >
              Contact Us <Mail size={16} />
            </a>
          </div>
        </FadeIn>
      </section>

      <ScriptureBanner />

      <footer className="border-t border-white/10 bg-[var(--surface-1)]/80 py-8">
        <div className="mx-auto flex w-[94%] max-w-5xl flex-col gap-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-purple-200">Prominence Virtual Assistance</p>
            <p className="text-xs opacity-70">hello@prominenceva.com</p>
          </div>

          <div className="flex items-center gap-4 text-xs opacity-80">
            <a href="#home" className="transition-colors hover:text-purple-300">Home</a>
            <a href="#services" className="transition-colors hover:text-purple-300">Services</a>
            <a href="#projects" className="transition-colors hover:text-purple-300">Projects</a>
            <a href="#" className="inline-flex items-center gap-1 transition-colors hover:text-purple-300">
              Socials <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
