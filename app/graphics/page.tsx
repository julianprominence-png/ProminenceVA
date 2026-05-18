"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence, Variants, MotionValue } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { 
  ArrowRight, ArrowUpRight, Menu, X, Zap, Palette, Layers, 
  TrendingUp, Eye, Award, Sparkles as SparklesIcon, Mail, Phone, MapPin, Globe,
  MonitorSmartphone, Box, Focus
} from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// ─── PALETTE & DATA ───────────────────────────────────────────────────────────
const V = {
  bg:     "#07061A",
  bg2:    "#0D0B26",
  bg3:    "#12103A",
  violet: "#7C3AED",
  neon:   "#A78BFA",
  pale:   "#C4B5FD",
  white:  "#F8F7FF",
  border: "rgba(167,139,250,0.18)",
} as const;

const NAV  = ["home", "services", "works", "about", "contact"];

const SERVICES = [
  { n:"01", icon:<Palette size={20}/>,    title:"Brand Identity",  desc:"Identities so precise your audience recognizes you before reading a single word." },
  { n:"02", icon:<Layers size={20}/>,     title:"Print Design",    desc:"Luxury print materials people keep, frame, and refuse to throw away." },
  { n:"03", icon:<Eye size={20}/>,        title:"Visual Strategy", desc:"Purpose behind every pixel. Powerful, intentional, and undeniably effective." },
  { n:"04", icon:<TrendingUp size={20}/>, title:"Marketing Design",desc:"Campaigns that command attention and convert the curious into lifelong advocates." },
  { n:"05", icon:<MonitorSmartphone size={20}/>, title:"Web Development",desc:"Award-winning digital experiences blending fluid physics with elite UI/UX." },
  { n:"06", icon:<Box size={20}/>,        title:"3D Motion",       desc:"Immersive three-dimensional narratives that bring static concepts to life." },
  { n:"07", icon:<SparklesIcon size={20}/>, title:"Social Media",    desc:"Visuals so magnetic, stopping the scroll isn't just possible — it's inevitable." },
  { n:"08", icon:<Award size={20}/>,      title:"Packaging",       desc:"Packaging that turns an unboxing into a luxury ritual your clients remember." },
];

const WORKS = [
  { title:"Aero Dynamics",    cat:"3D Visualization",img:"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=90" },
  { title:"Vanguard Motors",  cat:"Digital Campaign",img:"https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=90" },
  { title:"Kroma Architecture",cat:"Spatial Design", img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=90" },
  { title:"Maison Velour",    cat:"Brand Identity",  img:"https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=90" },
  { title:"Luxe Collective",  cat:"Visual Strategy", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90" },
  { title:"Nova Robotics",    cat:"Motion Graphics", img:"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=90" },
  { title:"Atelier & Co.",    cat:"Print Design",    img:"https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=90" },
  { title:"Aura Skincare",    cat:"Web Development", img:"https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=90" },
  { title:"Quantum Interface",cat:"UI/UX Design",    img:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=90" }, 
];

const STATS = [
  { n: 150, sym: "+", l:"Projects Delivered" },
  { n: 80,  sym: "+", l:"Global Brands" },
  { n: 12,  sym: "",  l:"Design Awards" },
  { n: 99,  sym: "%", l:"Client Satisfaction" }
];

// ─── 3D ENGINE CLASSES & TYPES (For the background canvas) ───────────────────
class Star {
  x: number; y: number; z: number; size: number; alpha: number; angle: number; radius: number; speed: number;
  constructor() {
    this.angle = Math.random() * Math.PI * 2;
    this.radius = Math.random() * 2000;
    this.y = (Math.random() - 0.5) * 1500; 
    this.x = Math.cos(this.angle) * this.radius;
    this.z = Math.sin(this.angle) * this.radius;
    this.size = Math.random() * 1.5 + 0.2;
    this.alpha = Math.random() * 0.8 + 0.2;
    this.speed = (Math.random() * 0.001 + 0.0005) * (1500 / (this.radius + 100)); 
  }
  update() {
    this.angle += this.speed;
    this.x = Math.cos(this.angle) * this.radius;
    this.z = Math.sin(this.angle) * this.radius;
    this.y += 0.8; 
    if (this.y > 1000) this.y = -1000; 
  }
}

class Planet {
  radius: number; size: number; angle: number; speed: number; color: string; yOffset: number;
  constructor(radius: number, size: number, speed: number, color: string, yOffset: number = 0) {
    this.radius = radius; this.size = size; this.speed = speed; this.color = color; this.yOffset = yOffset;
    this.angle = Math.random() * Math.PI * 2;
  }
  update() { this.angle += this.speed; }
  getPos() { return { x: Math.cos(this.angle) * this.radius, y: this.yOffset, z: Math.sin(this.angle) * this.radius }; }
}

class Comet {
  x: number = 0; y: number = 0; z: number = 0; 
  vx: number = 0; vy: number = 0; vz: number = 0; 
  tailLength: number = 0;
  
  constructor() { this.spawn(); }
  spawn() {
    this.x = (Math.random() - 0.5) * 3000;
    this.y = (Math.random() - 0.5) * 2000 - 1000;
    this.z = Math.random() * 2000 - 1000;
    this.vx = -20 - Math.random() * 15;
    this.vy = 8 + Math.random() * 8;
    this.vz = (Math.random() - 0.5) * 15;
    this.tailLength = 40 + Math.random() * 60;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.z += this.vz;
    if (this.x < -2000 || this.y > 2000) this.spawn();
  }
}

type Drawable = {
  type: 'sun' | 'planet' | 'star';
  x: number; y: number; z: number; s: number;
  star?: Star; planet?: Planet; index?: number;
};

// ─── UTILITY COMPONENTS ──────────────────────────────────────────────────────
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    setPos({ x: (clientX - (left + width / 2)) * 0.35, y: (clientY - (top + height / 2)) * 0.35 });
  };
  const reset = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={reset} animate={{ x: pos.x, y: pos.y }} transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }} style={{ display: "inline-block" }}>
      {children}
    </motion.div>
  );
}

function VioletCursor() {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const targ = useRef({ x: -200, y: -200 });
  const curr = useRef({ x: -200, y: -200 });
  const [hov, setHov] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => { targ.current = { x: e.clientX, y: e.clientY }; };
    const onOver = (e: MouseEvent) => { if ((e.target as HTMLElement).closest("button,a,[data-cur],.flip-card")) setHov(true); };
    const onOut = () => setHov(false);
    
    const tick = () => {
      curr.current.x += (targ.current.x - curr.current.x) * 0.15;
      curr.current.y += (targ.current.y - curr.current.y) * 0.15;
      if (outer.current) outer.current.style.transform = `translate(${curr.current.x}px,${curr.current.y}px) translate(-50%,-50%)`;
      if (inner.current) inner.current.style.transform = `translate(${targ.current.x}px,${targ.current.y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseover", onOver); window.removeEventListener("mouseout", onOut); };
  }, []);

  return (
    <>
      <div ref={outer} style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999, width: hov ? 64 : 32, height: hov ? 64 : 32, borderRadius: "50%", border: `1px solid ${V.neon}`, transition: "width .3s cubic-bezier(0.76, 0, 0.24, 1), height .3s cubic-bezier(0.76, 0, 0.24, 1), opacity .3s", opacity: hov ? 0.8 : 0.35, background: hov ? "rgba(124,58,237,0.15)" : "transparent", backdropFilter: hov ? "blur(2px)" : "none" }} />
      <div ref={inner} style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 10000, width: hov ? 4 : 6, height: hov ? 4 : 6, borderRadius: "50%", background: V.neon, boxShadow: `0 0 12px 3px ${V.neon}`, transition: "width .3s, height .3s, opacity .3s", opacity: hov ? 0.5 : 1 }} />
    </>
  );
}

function AnimatedCounter({ target, symbol }: { target: number, symbol: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.fromTo(ref.current, 
          { innerHTML: 0 }, 
          { innerHTML: target, duration: 2.5, ease: "expo.out", snap: { innerHTML: 1 }, 
            onUpdate: function() { if (ref.current) ref.current.innerHTML = Math.round(Number(this.targets()[0].innerHTML)) + symbol; }
          }
        );
      }
    });
  }, [target, symbol]);
  return <h4 ref={ref} style={{ fontSize: 40, fontWeight: 900, color: V.white, marginBottom: 8 }}>0{symbol}</h4>;
}

// ─── FLOATING ASTRONAUT ──────────────────────────────────────────────────────
function Astronaut({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  return (
    <motion.div
      style={{ position: "absolute", right: "8%", top: "15%", zIndex: 15, pointerEvents: "none", width: 140, height: 140, y: yParallax }}
    >
      <motion.div animate={{ y: [0, -40, 0], x: [0, 20, 0], rotateZ: [-5, 5, -5] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="url(#astroGlow)" opacity="0.3" />
          <rect x="75" y="40" width="50" height="55" rx="25" fill="#F8F7FF" stroke="#A78BFA" strokeWidth="4"/>
          <rect x="85" y="55" width="30" height="25" rx="10" fill="#07061A" stroke="#C4B5FD" strokeWidth="2"/>
          <path d="M88 60 Q100 55 112 60" stroke="#F8F7FF" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
          <path d="M75 100 C75 90, 125 90, 125 100 L130 140 C130 150, 70 150, 70 140 Z" fill="#F8F7FF" stroke="#A78BFA" strokeWidth="4"/>
          <path d="M70 100 Q40 100 50 130" fill="none" stroke="#F8F7FF" strokeWidth="16" strokeLinecap="round"/>
          <path d="M70 100 Q40 100 50 130" fill="none" stroke="#A78BFA" strokeWidth="4" strokeLinecap="round"/>
          <motion.g animate={{ rotateZ: [0, 30, -10, 30, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} style={{ transformOrigin: "130px 100px" }}>
            <path d="M130 100 Q160 80 150 50" fill="none" stroke="#F8F7FF" strokeWidth="16" strokeLinecap="round"/>
            <path d="M130 100 Q160 80 150 50" fill="none" stroke="#A78BFA" strokeWidth="4" strokeLinecap="round"/>
          </motion.g>
          <path d="M85 145 V170 M115 145 V170" stroke="#F8F7FF" strokeWidth="18" strokeLinecap="round"/>
          <path d="M85 145 V170 M115 145 V170" stroke="#A78BFA" strokeWidth="4" strokeLinecap="round"/>
          <rect x="60" y="60" width="80" height="60" rx="10" fill="none" stroke="#C4B5FD" strokeWidth="4" />
          <defs>
            <radialGradient id="astroGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
    </motion.div>
  );
}

// ─── 3D SPACE ENGINE CANVAS ──────────────────────────────────────────────────
function Space3DCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const resize = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouse.current.targetX = (e.clientX / W - 0.5) * 2; 
      mouse.current.targetY = (e.clientY / H - 0.5) * 2; 
    };
    window.addEventListener("mousemove", handleMouse);

    const stars = Array.from({ length: 2000 }, () => new Star());
    const planets = [
      new Planet(120,  3,  0.008, "#C4B5FD", 20), 
      new Planet(250,  6,  0.004, "#7C3AED", -30), 
      new Planet(450,  8,  0.002, "#A78BFA", 40), 
      new Planet(600,  4,  0.0015,"#F8F7FF", -10),
      new Planet(800,  12, 0.001, "#5B21B6", 60),
      new Planet(1100, 5,  0.0008,"#7EEB85", -50),
      new Planet(1400, 15, 0.0005,"#4C1D95", 100),
    ];
    const comets = Array.from({ length: 6 }, () => new Comet());
    const constellationPairs: [number, number][] = [];
    for(let i=0; i<80; i++) {
      for(let j=i+1; j<80; j++) {
        if(Math.random() > 0.94) constellationPairs.push([i, j]);
      }
    }

    let raf = 0;
    const fov = 800;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

      const rotX = mouse.current.y * 0.4 + 0.3; 
      const rotY = mouse.current.x * 0.4;

      const project = (x: number, y: number, z: number) => {
        const x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
        const z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
        const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
        const scale = fov / (fov + z2 + 800); 
        return { x: W / 2 + x1 * scale, y: H / 2 + y2 * scale, s: scale, z: z2 };
      };

      const drawables: Drawable[] = [];
      drawables.push({ type: 'sun', ...project(0, 0, 0) });

      planets.forEach(p => {
        p.update();
        const pos = p.getPos();
        drawables.push({ type: 'planet', planet: p, ...project(pos.x, pos.y, pos.z) });
      });

      const projectedStars: {x:number, y:number, z:number}[] = [];
      stars.forEach((s, index) => {
        s.update();
        const proj = project(s.x, s.y, s.z);
        projectedStars.push(proj);
        drawables.push({ type: 'star', star: s, index, ...proj });
      });

      ctx.strokeStyle = "rgba(167, 139, 250, 0.15)";
      ctx.lineWidth = 0.5;
      constellationPairs.forEach(([i, j]) => {
        const p1 = projectedStars[i];
        const p2 = projectedStars[j];
        if(p1 && p2 && p1.z > -fov+100 && p2.z > -fov+100) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      comets.forEach(c => {
        c.update();
        const head = project(c.x, c.y, c.z);
        if(head.z < -fov + 100) return;
        const tail = project(c.x - c.vx * c.tailLength, c.y - c.vy * c.tailLength, c.z - c.vz * c.tailLength);
        ctx.beginPath();
        ctx.moveTo(head.x, head.y);
        ctx.lineTo(tail.x, tail.y);
        const grad = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
        grad.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, 1 - head.z/2000)})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 3 * head.s;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(head.x, head.y, 3 * head.s, 0, Math.PI*2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      });

      drawables.sort((a, b) => b.z - a.z);

      drawables.forEach(d => {
        if (d.z < -fov + 100) return;
        if (d.type === 'star' && d.star) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, Math.max(0.1, d.star.size * d.s), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167, 139, 250, ${d.star.alpha * d.s})`;
          ctx.fill();
        } 
        else if (d.type === 'sun') {
          const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, 180 * d.s);
          grad.addColorStop(0, "rgba(255, 255, 255, 1)");
          grad.addColorStop(0.2, "rgba(167, 139, 250, 0.8)");
          grad.addColorStop(0.5, "rgba(124, 58, 237, 0.2)");
          grad.addColorStop(1, "rgba(124, 58, 237, 0)");
          ctx.beginPath();
          ctx.arc(d.x, d.y, 180 * d.s, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        } 
        else if (d.type === 'planet' && d.planet) {
          const pGrad = ctx.createLinearGradient(d.x - 15*d.s, d.y - 15*d.s, d.x + 15*d.s, d.y + 15*d.s);
          pGrad.addColorStop(0, d.planet.color);
          pGrad.addColorStop(1, "#03020A");
          ctx.beginPath();
          ctx.arc(d.x, d.y, Math.max(0.5, d.planet.size * d.s * 2), 0, Math.PI * 2);
          ctx.fillStyle = pGrad;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(d.x, d.y, Math.max(0.5, d.planet.size * d.s * 2.6), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(167, 139, 250, 0.3)`;
          ctx.lineWidth = 1 * d.s;
          ctx.stroke();
        }
      });
      raf = requestAnimationFrame(draw);
    };
    
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", handleMouse); };
  }, []);

  return (
    <motion.div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <canvas ref={ref} style={{ width: "100%", height: "100%", pointerEvents: "none" }} />
    </motion.div>
  );
}

// ─── 3D ROCKET MESHES & FIRE ──────────────────────────────────────────────────
function RocketModel() {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: V.white, roughness: 0.3, metalness: 0.8 }), []);
  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: V.violet, roughness: 0.4, metalness: 0.5 }), []);
  const windowMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#111", roughness: 0.1, metalness: 0.9 }), []);
  
  // Highly emissive material to trigger the bloom post-processing for a glowing thruster effect
  const flameMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: V.white, emissive: V.neon, emissiveIntensity: 4, toneMapped: false }), []);

  useFrame((state) => {
    // Flickering Flame effect for smooth cinematic realism
    if (flameRef.current) {
      const flicker = 1 + Math.sin(state.clock.elapsedTime * 40) * 0.15 + Math.random() * 0.1;
      flameRef.current.scale.set(flicker, flicker, flicker * (1 + Math.random() * 0.2));
    }
    // Dynamic Thruster Light
    if (lightRef.current) {
      lightRef.current.intensity = 5 + Math.random() * 3;
    }
  });

  return (
    <group>
      {/* Body */}
      <mesh material={bodyMaterial}>
        <cylinderGeometry args={[0.5, 0.5, 3, 32]} />
      </mesh>
      
      {/* Nose Cone */}
      <mesh position={[0, 2, 0]} material={bodyMaterial}>
        <coneGeometry args={[0.5, 1.5, 32]} />
      </mesh>

      {/* Window */}
      <mesh position={[0, 0.5, 0.45]} rotation={[0.1, 0, 0]} material={windowMaterial}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
      </mesh>
      <mesh position={[0, 0.5, 0.46]} material={accentMaterial}>
        <ringGeometry args={[0.3, 0.35, 32]} />
      </mesh>

      {/* Fins */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <group key={i} rotation={[0, angle, 0]}>
          <mesh position={[0.7, -1, 0]} rotation={[0, 0, -0.2]} material={accentMaterial}>
            <boxGeometry args={[0.8, 1.2, 0.1]} />
          </mesh>
        </group>
      ))}

      {/* Engine Base */}
      <mesh position={[0, -1.6, 0]} material={new THREE.MeshStandardMaterial({ color: "#333", roughness: 0.8 })}>
        <cylinderGeometry args={[0.5, 0.4, 0.3, 32]} />
      </mesh>

      {/* Animated Engine Flame */}
      <mesh ref={flameRef} position={[0, -2.4, 0]} material={flameMaterial}>
        <coneGeometry args={[0.35, 1.4, 16]} />
      </mesh>
      
      {/* Dynamic Thruster Light */}
      <pointLight ref={lightRef} position={[0, -2.5, 0]} color={V.neon} distance={15} />
    </group>
  );
}

// ─── 3D SCENE & ANIMATION LOGIC ──────────────────────────────────────────────
function Scene3D({ onTextFade, onIntroComplete }: { onTextFade: () => void, onIntroComplete: () => void }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const pivotRef = useRef<THREE.Group>(null);
  const gsapRocketRef = useRef<THREE.Group>(null);
  const spinRocketRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!pivotRef.current || !gsapRocketRef.current || !cameraRef.current) return;

    const tl = gsap.timeline();

    // 1. Initial State: Centered camera, rocket offset from pivot for orbit
    gsap.set(cameraRef.current.position, { z: 25, y: 2 });
    gsap.set(gsapRocketRef.current.position, { x: 8, y: 0, z: 0 }); // Orbit radius from the moon
    gsap.set(gsapRocketRef.current.rotation, { x: -Math.PI / 2, y: 0, z: 0 }); // Point forward along orbit path

    // 2. Smooth clean rotation around the moon (orbit)
    // Increased to 1.5 orbits (Math.PI * 3) for a longer, continuous build-up of momentum
    tl.to(pivotRef.current.rotation, {
      y: Math.PI * 3, 
      duration: 6,
      ease: "power2.inOut"
    }, 0);

    // 3. Trigger text fadeout smoothly midway
    tl.call(() => {
      onTextFade();
    }, undefined, 3.5);

    // 4. Pre-launch Anticipation Phase (Bank & Re-orient)
    // The rocket leans into the curve, then realistically straightens to aim at deep space
    tl.to(gsapRocketRef.current.rotation, {
      x: -Math.PI / 2.1, 
      y: Math.PI / 4,    
      z: -0.2, // Subtle roll for inertia
      duration: 3,
      ease: "sine.inOut"
    }, 3.0);

    // Subtle Engine Spool-up
    // Rocket pushes back slightly as it prepares to blast off (creates visual tension)
    tl.to(gsapRocketRef.current.position, {
      x: 7.8,
      z: 2, 
      duration: 1.5,
      ease: "power2.inOut"
    }, 3.5);

    // 5. Engage Hyperdrive / Warp Jump
    // Violent, exponential acceleration for true cinematic lightspeed effect
    tl.to(gsapRocketRef.current.position, {
      x: 100,
      y: 50,
      z: -1000, // Deepened the vanishing point dramatically
      duration: 1.5,
      ease: "power4.in" 
    }, 5.0);

    // Warp stretch effect - simulates extreme velocity
    tl.to(gsapRocketRef.current.scale, {
      y: 25, 
      x: 0.02,
      z: 0.02,
      duration: 1.2,
      ease: "power4.in"
    }, 5.2);

    // 6. Camera Shockwave (FOV / Pull back)
    // The camera slightly retreats and shifts upward to frame the dramatic exit
    tl.to(cameraRef.current.position, {
      z: 35,
      y: 5,
      duration: 2.5,
      ease: "power2.inOut"
    }, 4.5);

    // 7. Intro Complete, seamlessly reveal home page
    tl.call(() => {
      onIntroComplete();
    }, undefined, 7.0);

  }, [onIntroComplete, onTextFade]);

  useFrame(() => {
    // Continuous spinning components
    if (moonRef.current) moonRef.current.rotation.y += 0.002;
    
    // Apply continuous roll to an inner group so it doesn't fight GSAP updates!
    if (spinRocketRef.current) spinRocketRef.current.rotation.y += 0.02; 
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={45} />
      <ambientLight intensity={0.5} color={V.pale} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color={V.white} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color={V.violet} />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* The Moon */}
      <mesh ref={moonRef} position={[0, 0, 0]}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial color="#1b113d" metalness={0.2} roughness={0.9} />
      </mesh>
      
      {/* Moon Glow Additive Blending */}
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[4.2, 64, 64]} />
        <meshBasicMaterial color={V.neon} transparent opacity={0.15} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>

      {/* Pivot Group for Orbit */}
      <group ref={pivotRef}>
        <group ref={gsapRocketRef}>
          {/* Inner group purely for the constant spinning effect */}
          <group ref={spinRocketRef}>
            <RocketModel />
          </group>
        </group>
      </group>

      <EffectComposer>
        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.8} />
      </EffectComposer>
    </>
  );
}

// ─── ROCKET INTRO WRAPPER ────────────────────────────────────────────────────
function RocketIntro({ onTextFade, onComplete }: { onTextFade: () => void, onComplete: () => void }) {
  return (
    <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 10 }}>
      <Canvas dpr={[1, 2]}>
        <Scene3D onTextFade={onTextFade} onIntroComplete={onComplete} />
      </Canvas>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Page() {
  const [introTextVisible, setIntroTextVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActive] = useState("home");

  const { scrollYProgress } = useScroll();
  const prog = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      // Enhanced buttery smooth staggering for the hero section
      gsap.from(".hbadge, .hsub, .hcta", { y: 30, opacity: 0, duration: 1.5, stagger: 0.15, ease: "expo.out", delay: 0.2 });
      
      gsap.utils.toArray<HTMLElement>('.stagger-grid').forEach(grid => {
        const children = grid.querySelectorAll('.stagger-item');
        gsap.from(children, {
          scrollTrigger: { trigger: grid, start: "top 80%" },
          y: 50, opacity: 0, duration: 1.2, stagger: 0.1, ease: "expo.out"
        });
      });

      gsap.utils.toArray<HTMLElement>('.fade-up').forEach(el => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: "top 85%" }, y: 50, opacity: 0, duration: 1.4, ease: "expo.out" });
      });

      NAV.forEach(id => {
        ScrollTrigger.create({ trigger: `#${id}`, start: "top 50%", end: "bottom 50%", onEnter: () => setActive(id), onEnterBack: () => setActive(id) });
      });
    });
    return () => ctx.revert();
  }, [ready]);

  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  // Advanced Cinematic Blur Transitions for the text
  const sentence: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.08 } } };
  const letter: Variants = { hidden: { opacity: 0, y: 40, rotateX: -90, filter: "blur(5px)" }, visible: { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } } };

  return (
    <main style={{ background: V.bg, color: V.white, cursor: "none" }} className="overflow-x-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Inter',sans-serif;cursor:none;background:${V.bg};}
        ::selection{background:rgba(124,58,237,0.28);}
        ::-webkit-scrollbar{width:2px;}
        ::-webkit-scrollbar-track{background:${V.bg};}
        ::-webkit-scrollbar-thumb{background:${V.violet};border-radius:2px;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes glow{0%,100%{box-shadow:0 0 18px rgba(124,58,237,0.35)}50%{box-shadow:0 0 36px rgba(167,139,250,0.55)}}
        @keyframes breathe { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
        
        .nav-link::after{content:'';position:absolute;bottom:-3px;left:0;width:0;height:1px;background:linear-gradient(to right,${V.violet},${V.neon});transition:width .4s cubic-bezier(.76,0,.24,1);}
        .nav-link:hover::after,.nav-link.active::after{width:100%;}
        .glow-btn{position:relative; overflow:hidden;}
        .glow-btn::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);transition:left 0.7s ease;}
        .glow-btn:hover::before{left:100%;}
        .glow-btn:hover{box-shadow:0 0 32px rgba(124,58,237,0.65), 0 0 12px rgba(167,139,250,0.4);}
        
        /* Glass Input Fields */
        .glass-input { background: rgba(255,255,255,0.02); border: 1px solid rgba(167,139,250,0.2); border-radius: 8px; padding: 16px; color: #fff; font-size: 14px; outline: none; transition: all 0.3s ease; }
        .glass-input:focus, .glass-input:hover { background: rgba(255,255,255,0.06); border-color: ${V.neon}; transform: translateY(-2px); }

        /* Smoother hover curves for glass cards */
        .glass-card { background: rgba(13, 11, 38, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(167,139,250,0.1); border-radius: 16px; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.6s ease, box-shadow 0.6s ease; }
        .glass-card:hover { transform: translateY(-10px); border-color: rgba(167,139,250,0.4); box-shadow: 0 20px 40px rgba(124,58,237,0.15); }
        
        /* Typography Descender Fix */
        .text-reveal-wrap { overflow: hidden; display: inline-block; padding-bottom: 0.3em; margin-bottom: -0.3em; line-height: 1; }
        
        /* Breathing Animations */
        .breathe-element { animation: breathe 6s ease-in-out infinite; }

        /* 3D Flip Card Mechanics */
        .flip-card { perspective: 1000px; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1); transform-style: preserve-3d; }
        .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back { position: absolute; inset: 0; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; border-radius: 16px; overflow: hidden; }
        .flip-card-back { transform: rotateY(180deg); background: rgba(13, 11, 38, 0.85); backdrop-filter: blur(16px); border: 1px solid rgba(167,139,250,0.3); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 32px; text-align: center; }
      `}</style>

      <VioletCursor />

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 60, opacity: .018, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <motion.div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 55, scaleX: prog, transformOrigin: "left", background: `linear-gradient(to right,${V.violet},${V.neon},${V.pale})` }} />

      <AnimatePresence>
        {!ready && (
          <motion.div style={{ position: "fixed", inset: 0, zIndex: 100, background: V.bg }} exit={{ opacity: 0, transition: { duration: 2.5, ease: "easeInOut" } }}>
            <RocketIntro onTextFade={() => setIntroTextVisible(false)} onComplete={() => setReady(true)} />
            
            {/* The Text has its own AnimatePresence so it can blur/fade OUT before the canvas disappears */}
            <AnimatePresence>
              {introTextVisible && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(15px)", transition: { duration: 1.5, ease: "easeIn" } }}
                  style={{ position: "absolute", zIndex: 20, textAlign: "center", bottom: "15%", left: "50%", x: "-50%", pointerEvents: "none" }}
                >
                  <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1.5, ease: "easeOut" }} style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "0.2em", color: V.white, textTransform: "uppercase" }}>
                    Prominence
                  </motion.h1>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }} style={{ fontSize: "0.85rem", letterSpacing: "0.5em", color: V.neon, marginTop: 12, textTransform: "uppercase", fontWeight: 600 }}>
                    Launching Reality
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav initial={{ opacity: 0, y: -22 }} animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : -22 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(7,6,26,0.65)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: `1px solid rgba(124,58,237,0.08)` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", maxWidth: 1400, margin: "0 auto" }}>
          <Magnetic>
            <div onClick={() => go("home")} data-cur style={{ padding:"10px", cursor: "none", fontWeight: 900, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", userSelect: "none" }}>
              <span style={{ background: `linear-gradient(135deg,${V.pale},${V.neon})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PROMINENCE</span>
              <span style={{ color: "rgba(248,247,255,0.22)", WebkitTextFillColor: "rgba(248,247,255,0.22)" }}> GRAPHICS</span>
            </div>
          </Magnetic>

          <ul className="hidden md:flex items-center" style={{ gap: 36, listStyle: "none" }}>
            {NAV.map(item => (
              <li key={item} style={{ position: "relative" }}>
                <Magnetic>
                  <button data-cur onClick={() => go(item)} style={{ padding:"10px", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", background: "none", border: "none", color: activeNav === item ? V.neon : "rgba(196,181,253,0.38)", cursor: "none", transition: "color .3s", position: "relative" }} className={`nav-link ${activeNav === item ? "active" : ""}`}>
                    {item}
                    {activeNav === item && <motion.div layoutId="navU" transition={{ type: "spring", stiffness: 200, damping: 20 }} style={{ position: "absolute", bottom: 6, left: 10, right: 10, height: 1, background: `linear-gradient(to right,${V.violet},${V.neon})` }} />}
                  </button>
                </Magnetic>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center" style={{ gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7EEB85", boxShadow: "0 0 6px #7EEB85", animation: "glow 2.5s ease-in-out infinite" }} />
              <span style={{ fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(196,181,253,0.28)" }}>Live</span>
            </div>
            <Magnetic>
              <button data-cur onClick={() => go("contact")} className="glow-btn" style={{ background: `linear-gradient(135deg,${V.violet},#5B21B6)`, color: V.white, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 32px", border: "1px solid rgba(167,139,250,0.3)", cursor: "none", borderRadius: 30, transition: "all .4s cubic-bezier(0.76, 0, 0.24, 1)" }}>
                Start Project
              </button>
            </Magnetic>
          </div>

          <button style={{ color: V.white, background: "none", border: "none", cursor: "none" }} className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ clipPath: "circle(0% at 95% 4%)" }} animate={{ clipPath: "circle(160% at 95% 4%)" }} exit={{ clipPath: "circle(0% at 95% 4%)" }} transition={{ duration: .7, ease: [0.76, 0, 0.24, 1] }}
            style={{ position: "fixed", inset: 0, zIndex: 40, background: V.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
            {NAV.map((item, i) => (
              <motion.button key={item} onClick={() => go(item)} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .07 + .2 }}
                style={{ fontSize: 44, color: V.white, background: "none", border: "none", cursor: "none", fontWeight: 700, letterSpacing: "-0.02em", textTransform: "capitalize" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = V.neon; (e.target as HTMLElement).style.transform = "scale(1.1) skewX(-5deg)"; (e.target as HTMLElement).style.transition = "all 0.3s ease"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = V.white; (e.target as HTMLElement).style.transform = "scale(1) skewX(0deg)"; }}>
                {item}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <section id="home" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
        
        <AnimatePresence>
          {ready && (
            <>
              {/* Fallback persistent canvas behind content */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, ease: "easeInOut" }} style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                 <Space3DCanvas />
                 <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, #07061A 100%)", pointerEvents: "none" }} />
                 <Astronaut scrollYProgress={scrollYProgress} />
              </motion.div>

              <motion.div className="relative z-10 w-full px-6 md:px-14 lg:px-24 pt-36 pb-24">
                <div className="flex flex-col items-center justify-center text-center">
                  <div style={{ maxWidth: 1000, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    
                    <div className="hbadge breathe-element" style={{ display: "inline-flex", alignItems: "center", margin: "0 auto 32px auto", gap: 10, padding: "6px 18px 6px 8px", background: "rgba(124,58,237,0.05)", border: `1px solid rgba(167,139,250,0.2)`, borderRadius: 30, backdropFilter: "blur(10px)" }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Zap size={12} color={V.neon} />
                      </div>
                      <span style={{ fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: V.neon, fontWeight: 600 }}>Award-Winning Creative Studio</span>
                    </div>

                    <motion.h1 variants={sentence} initial="hidden" animate="visible" style={{ fontSize: "clamp(2.2rem, 5vw, 6rem)", fontWeight: 900, letterSpacing: "-.02em", marginBottom: 32, perspective: "1000px", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", rowGap: "0.2em", columnGap: "1.5vw" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                        <div className="text-reveal-wrap">
                          {["W", "E", "\u00A0", "D", "O", "N", "'", "T", "\u00A0"].map((char, i) => (<motion.span key={`wd-${i}`} variants={letter} style={{ display: "inline-block", color: V.white }}>{char}</motion.span>))}
                        </div>
                        <div className="text-reveal-wrap">
                          {["D", "E", "S", "I", "G", "N", ","].map((char, i) => (<motion.span key={`d-${i}`} variants={letter} style={{ display: "inline-block", background: `linear-gradient(135deg,${V.neon},${V.pale})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{char}</motion.span>))}
                        </div>
                      </div>
                      <br className="hidden lg:block" />
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                        <div className="text-reveal-wrap">
                          {["W", "E", "\u00A0", "A", "R", "C", "H", "I", "T", "E", "C", "T", "\u00A0"].map((char, i) => (<motion.span key={`wa-${i}`} variants={letter} style={{ display: "inline-block", color: V.white }}>{char}</motion.span>))}
                        </div>
                        <div className="text-reveal-wrap">
                          {["D", "E", "S", "I", "R", "E"].map((char, i) => (<motion.span key={`des-${i}`} variants={letter} style={{ display: "inline-block", background: `linear-gradient(135deg,${V.neon},${V.pale})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{char}</motion.span>))}
                        </div>
                      </div>
                    </motion.h1>

                    <p className="hsub" style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(196,181,253,0.6)", fontWeight: 400, maxWidth: 500, margin: "0 auto 40px auto" }}>
                      Prominence Graphics exists for founders who refuse average. We create visual identities so compelling, your audience can&apos;t look away.
                    </p>

                    <div className="hcta" style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "center" }}>
                      <Magnetic>
                        <button data-cur onClick={() => go("works")} className="glow-btn" style={{ background: `linear-gradient(135deg,${V.violet},#5B21B6)`, color: V.white, fontWeight: 700, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", padding: "16px 40px", border: "1px solid rgba(167,139,250,0.3)", display: "flex", alignItems: "center", gap: 12, cursor: "none", borderRadius: 40 }}>
                          Explore Our Work <ArrowRight size={14} />
                        </button>
                      </Magnetic>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>

      {ready && (
        <>
          <section id="services" style={{ padding: "120px 24px", maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 10, background: V.bg }}>
            <div className="fade-up" style={{ textAlign: "center", marginBottom: 80 }}>
              <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-.02em" }}>Our Expertise</h2>
              <p style={{ color: V.neon, textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 12, marginTop: 10 }}>What we deliver</p>
            </div>
            <div className="stagger-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              {SERVICES.map((s, i) => (
                <div key={i} className="glass-card stagger-item" style={{ padding: 40, position: "relative", overflow: "hidden" }}>
                  <div style={{ color: V.neon, marginBottom: 24 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>{s.title}</h3>
                  <p style={{ color: "rgba(196,181,253,0.6)", lineHeight: 1.6, fontSize: 14 }}>{s.desc}</p>
                  <span style={{ position: "absolute", top: 24, right: 24, fontSize: 40, fontWeight: 900, color: "rgba(124,58,237,0.06)" }}>{s.n}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="works" style={{ padding: "120px 24px", background: V.bg2, position: "relative", zIndex: 10 }}>
            <div style={{ maxWidth: 1400, margin: "0 auto" }}>
              <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80 }}>
                <div>
                  <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-.02em" }}>Selected Works</h2>
                  <p style={{ color: V.neon, textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 12, marginTop: 10 }}>Visions realized</p>
                </div>
                <Magnetic>
                  <button data-cur style={{ background: "none", border: "none", color: V.white, display: "flex", alignItems: "center", gap: 8, cursor: "none", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, fontWeight: 600 }}>
                    View All <ArrowUpRight size={16} color={V.neon} />
                  </button>
                </Magnetic>
              </div>
              
              <div className="stagger-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 32 }}>
                {WORKS.map((w, i) => (
                  <div key={i} className="flip-card stagger-item" style={{ position: "relative", borderRadius: 16, aspectRatio: "4/5", cursor: "none" }} data-cur>
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <Image src={w.img} alt={w.title} fill style={{ objectFit: "cover" }} unoptimized />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,6,26,0.95) 0%, rgba(7,6,26,0.2) 60%, transparent 100%)" }} />
                        <div style={{ position: "absolute", bottom: 30, left: 30, textAlign: "left" }}>
                          <p style={{ color: V.neon, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>{w.cat}</p>
                          <h3 style={{ fontSize: 26, fontWeight: 600 }}>{w.title}</h3>
                        </div>
                      </div>
                      <div className="flip-card-back">
                        <Focus color={V.neon} size={36} style={{ marginBottom: "20px" }} />
                        <h3 style={{ fontSize: 26, fontWeight: 600, marginBottom: "12px", color: V.white }}>{w.title}</h3>
                        <p style={{ color: "rgba(196,181,253,0.8)", fontSize: 14, lineHeight: 1.6, marginBottom: "30px", maxWidth: "85%" }}>
                          An exploration into redefining aesthetic boundaries through strategic {w.cat.toLowerCase()}.
                        </p>
                        <button className="glow-btn" style={{ background: "transparent", border: `1px solid ${V.violet}`, color: V.white, padding: "12px 28px", borderRadius: "30px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 8, cursor: "none" }}>
                          View Case Study <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="about" style={{ padding: "150px 24px", maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 10, background: V.bg }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 60, alignItems: "center" }}>
              <div style={{ flex: "1 1 500px" }} className="fade-up">
                <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
                  We forge brands that dictate the market.
                </h2>
                <p style={{ color: "rgba(196,181,253,0.7)", fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                  Prominence is an independent creative studio operating at the intersection of strategy and high-end aesthetic. We don&apos;t just follow trends; we engineer the visual frameworks that define them.
                </p>
                <Magnetic>
                  <button data-cur className="glow-btn" style={{ background: "transparent", border: `1px solid ${V.violet}`, color: V.white, padding: "14px 32px", borderRadius: 30, cursor: "none", textTransform: "uppercase", letterSpacing: "0.15em", fontSize: 10, fontWeight: 700 }}>
                    Read Our Story
                  </button>
                </Magnetic>
              </div>
              
              <div className="stagger-grid" style={{ flex: "1 1 400px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {STATS.map((st, i) => (
                  <div key={i} className="glass-card stagger-item" style={{ padding: 30, textAlign: "center" }}>
                    <AnimatedCounter target={st.n} symbol={st.sym} />
                    <p style={{ fontSize: 11, color: V.neon, textTransform: "uppercase", letterSpacing: "0.1em" }}>{st.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" style={{ padding: "120px 24px 60px", background: V.bg2, borderTop: `1px solid rgba(124,58,237,0.1)`, position: "relative", zIndex: 10 }}>
            <div style={{ maxWidth: 1400, margin: "0 auto" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 60, marginBottom: 100 }}>
                <div style={{ flex: "1 1 400px" }} className="fade-up">
                  <h2 style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 0.9, marginBottom: 30 }}>Let&apos;s Build<br/><span style={{ color: V.neon }}>Something.</span></h2>
                  <p style={{ color: "rgba(196,181,253,0.6)", fontSize: 16, marginBottom: 40, maxWidth: 350 }}>Ready to elevate your brand to undisputed prominence? Reach out to us.</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <a href="#" data-cur style={{ display: "flex", alignItems: "center", gap: 16, color: V.white, textDecoration: "none", fontSize: 14, fontWeight: 500 }}><Mail size={18} color={V.neon}/> Prominence.VA</a>
                    <a href="#" data-cur style={{ display: "flex", alignItems: "center", gap: 16, color: V.white, textDecoration: "none", fontSize: 14, fontWeight: 500 }}><Phone size={18} color={V.neon}/> 09560542898</a>
                    <span style={{ display: "flex", alignItems: "center", gap: 16, color: V.white, fontSize: 14, fontWeight: 500 }}><MapPin size={18} color={V.neon}/> Olongapo City,Philippines</span>
                  </div>
                </div>

                <div style={{ flex: "1 1 400px" }} className="fade-up">
                  <form className="glass-card" style={{ padding: 40, display: "flex", flexDirection: "column", gap: 24 }}>
                    <input className="glass-input" type="text" placeholder="Your Name" />
                    <input className="glass-input" type="email" placeholder="Email Address" />
                    <textarea className="glass-input" placeholder="Project Details" rows={4} style={{ resize: "none" }} />
                    <Magnetic>
                      <button data-cur type="button" className="glow-btn" style={{ background: V.white, color: V.bg, width: "100%", padding: 16, borderRadius: 8, border: "none", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "none", marginTop: 10 }}>Send Message</button>
                    </Magnetic>
                  </form>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, borderTop: `1px solid rgba(167,139,250,0.1)`, paddingTop: 40 }}>
                <div style={{ fontWeight: 900, fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase" }}>
                  <span style={{ color: V.white }}>PROMINENCE</span><span style={{ color: "rgba(248,247,255,0.22)" }}> GRAPHICS</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(196,181,253,0.4)" }}>© {new Date().getFullYear()} Prominence Graphics. All Rights Reserved.</p>
                <div style={{ display: "flex", gap: 16 }}>
                  <Globe size={18} color="rgba(196,181,253,0.4)" />
                  <Zap size={18} color="rgba(196,181,253,0.4)" />
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}