"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Stack, TerminalWindow, Database, Cloud, FilmStrip, PlayCircle,
  VideoCamera, ImageSquare, PenNib, Layout, Quotes, Cpu,
  HardDrives, Code, Scissors, MagicWand
} from "@phosphor-icons/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  (window as any).globalScrollProgress = 0;
}

/* -------------------------------------------------------------------------- */
/* DATA                                                                        */
/* -------------------------------------------------------------------------- */
const scriptures = [
  `Matthew 20:26–28 — "Whoever wants to become great among you must be your servant…"`,
  `Mark 10:45 — "For even the Son of Man did not come to be served, but to serve…"`,
  `Proverbs 14:23 — "All hard work brings a profit, but mere talk leads only to poverty."`,
  `Proverbs 13:4 — "The soul of the sluggard craves and gets nothing, while the soul of the diligent is richly supplied."`,
  `Ecclesiastes 9:10 — "Whatever your hand finds to do, do it with all your might…"`,
  `Proverbs 10:4 — "Lazy hands make for poverty, but diligent hands bring wealth."`,
  `Deuteronomy 8:18 — "But remember the Lord your God, for it is He who gives you the ability to produce wealth..."`,
];

const techStack = [
  {
    title: "Development Stack",
    tools: [
      { name: "Next.js", icon: <Stack weight="duotone" /> },
      { name: "VS Code", icon: <TerminalWindow weight="duotone" /> },
      { name: "Firebase", icon: <Database weight="duotone" /> },
      { name: "Vercel", icon: <Cloud weight="duotone" /> },
    ],
  },
  {
    title: "Post-Production",
    tools: [
      { name: "Premiere", icon: <VideoCamera weight="duotone" /> },
      { name: "After Effects", icon: <FilmStrip weight="duotone" /> },
      { name: "CapCut", icon: <PlayCircle weight="duotone" /> },
    ],
  },
  {
    title: "Creative Design",
    tools: [
      { name: "Photoshop", icon: <ImageSquare weight="duotone" /> },
      { name: "Illustrator", icon: <PenNib weight="duotone" /> },
      { name: "Figma", icon: <Layout weight="duotone" /> },
    ],
  },
];

const teamData = [
  { name: "Vinz Ilagan", role: "Lead Architect", icon: <Cpu weight="duotone" /> },
  { name: "Giervan Sabalbero", role: "Backend Specialist", icon: <HardDrives weight="duotone" /> },
  { name: "Julian Tolentino", role: "Frontend Engineer", icon: <Code weight="duotone" /> },
  { name: "Gian Dethan Adamos", role: "Lead Editor", icon: <Scissors weight="duotone" /> },
  { name: "Russel Minimo", role: "VFX & Motion", icon: <MagicWand weight="duotone" /> },
];

/* -------------------------------------------------------------------------- */
/* LOADER COMPONENT                                                            */
/* -------------------------------------------------------------------------- */
const ProminenceLoader = ({ onComplete }: { onComplete: () => void }) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaderRef.current) return;
    const letters = loaderRef.current.querySelectorAll<HTMLElement>(".ll");

    const tl = gsap.timeline({
      delay: 0.3,
      onComplete: () => {
        gsap.to(loaderRef.current, {
          opacity: 0,
          scale: 1.04,
          duration: 0.9,
          ease: "power3.inOut",
          onComplete,
        });
      },
    });

    // Letters reveal with stagger
    tl.fromTo(
      letters,
      { opacity: 0, y: 20, filter: "blur(12px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.055, duration: 0.55, ease: "power3.out" },
      0
    );

    // Central glow blooms
    tl.fromTo(
      glowRef.current,
      { scale: 0.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" },
      0
    );

    // Progress bar fills
    tl.fromTo(
      progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.7, ease: "power2.inOut", transformOrigin: "left center" },
      0.2
    );

    // Status text swap
    tl.to(statusRef.current, { opacity: 0, duration: 0.15 }, 1.55);
    tl.call(
      () => {
        if (statusRef.current) {
          statusRef.current.textContent = "SYSTEMS ONLINE";
          statusRef.current.style.color = "rgba(134,239,172,0.65)";
        }
      },
      [],
      1.7
    );
    tl.to(statusRef.current, { opacity: 1, duration: 0.3 }, 1.7);
    tl.to({}, { duration: 0.55 });
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[200] bg-[#020104] flex flex-col items-center justify-center overflow-hidden">
      {/* Deep purple ambient */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(88,28,135,0.28) 0%, rgba(49,10,101,0.12) 50%, transparent 80%)",
        }}
      />

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Diagonal accent lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
        <div className="absolute top-0 left-[-20%] w-[140%] h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent rotate-[15deg] origin-center" style={{ top: "30%" }} />
        <div className="absolute top-0 left-[-20%] w-[140%] h-[1px] bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent rotate-[-12deg] origin-center" style={{ top: "65%" }} />
      </div>

      {/* Main branding */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Dot trio */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-1 rounded-full bg-purple-600/60" />
          <div className="w-[7px] h-[7px] rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,1),0_0_24px_rgba(217,70,239,0.5)]" />
          <div className="w-1 h-1 rounded-full bg-purple-600/60" />
        </div>

        {/* Letters */}
        <h1 className="flex" style={{ letterSpacing: "0.38em" }}>
          {"PROMINENCE".split("").map((ch, i) => (
            <span
              key={i}
              className="ll font-black text-transparent select-none"
              style={{
                fontSize: "clamp(2.8rem, 9vw, 7.5rem)",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.28)",
                textShadow: "0 0 50px rgba(168,85,247,0.35), 0 0 100px rgba(168,85,247,0.15)",
              }}
            >
              {ch}
            </span>
          ))}
        </h1>

        <p className="text-[8px] tracking-[0.55em] text-white/22 uppercase font-semibold">
          Invisible Architecture · Visible Results
        </p>
      </div>

      {/* Bottom progress */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-64 flex flex-col items-center gap-3">
        <p ref={statusRef} className="text-[8px] tracking-[0.45em] text-purple-400/50 uppercase font-semibold">
          INITIALIZING SYSTEMS
        </p>
        <div className="w-full h-[1px] bg-white/[0.05] overflow-hidden rounded-full relative">
          <div
            ref={progressRef}
            className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-indigo-700 via-fuchsia-500 to-purple-300"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* HERO ENERGY ARCS (SVG Overlay)                                             */
/* -------------------------------------------------------------------------- */
const HeroEnergyArcs = () => (
  <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
    <svg
      className="w-full h-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="arcGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>{`
          @keyframes travel1 {
            0%   { stroke-dashoffset: 1400; opacity: 0; }
            4%   { opacity: 1; }
            96%  { opacity: 0.75; }
            100% { stroke-dashoffset: -180; opacity: 0; }
          }
          @keyframes travel2 {
            0%   { stroke-dashoffset: 1100; opacity: 0; }
            4%   { opacity: 0.85; }
            96%  { opacity: 0.5; }
            100% { stroke-dashoffset: -150; opacity: 0; }
          }
          @keyframes travel3 {
            0%   { stroke-dashoffset: 1250; opacity: 0; }
            4%   { opacity: 0.6; }
            96%  { opacity: 0.35; }
            100% { stroke-dashoffset: -160; opacity: 0; }
          }
          @keyframes nodePing {
            0%   { transform: scale(1); opacity: 0.8; }
            60%  { transform: scale(4); opacity: 0; }
            100% { transform: scale(1); opacity: 0; }
          }
          @keyframes nodeBeat {
            0%,100% { opacity: 0.45; }
            50%     { opacity: 1; }
          }
        `}</style>
      </defs>

      {/* ── Base arcs (subtle static) ── */}
      <path d="M 70,220 C 330,90 680,190 990,330 C 1195,430 1370,370 1445,285" fill="none" stroke="rgba(168,85,247,0.08)" strokeWidth="1" />
      <path d="M 0,530 C 250,445 570,565 855,495 C 1090,430 1275,555 1445,600" fill="none" stroke="rgba(217,70,239,0.06)" strokeWidth="1" />
      <path d="M 1445,135 C 1155,65 850,210 555,155 C 295,100 95,250 0,315" fill="none" stroke="rgba(139,92,246,0.07)" strokeWidth="1" />

      {/* ── Traveling pulses ── */}
      {/* Arc 1 — fast fuchsia */}
      <path d="M 70,220 C 330,90 680,190 990,330 C 1195,430 1370,370 1445,285" fill="none" stroke="rgba(217,70,239,0.9)" strokeWidth="1.5" strokeDasharray="75 2000" filter="url(#arcGlow)" style={{ animation: "travel1 4.2s linear infinite" }} />
      <path d="M 70,220 C 330,90 680,190 990,330 C 1195,430 1370,370 1445,285" fill="none" stroke="rgba(168,85,247,0.5)" strokeWidth="1" strokeDasharray="38 2000" filter="url(#arcGlow)" style={{ animation: "travel1 4.2s linear infinite", animationDelay: "2.1s" }} />

      {/* Arc 2 — mid fuchsia */}
      <path d="M 0,530 C 250,445 570,565 855,495 C 1090,430 1275,555 1445,600" fill="none" stroke="rgba(192,38,211,0.75)" strokeWidth="1.5" strokeDasharray="58 2000" filter="url(#arcGlow)" style={{ animation: "travel2 5.4s linear infinite", animationDelay: "1.1s" }} />

      {/* Arc 3 — slower violet */}
      <path d="M 1445,135 C 1155,65 850,210 555,155 C 295,100 95,250 0,315" fill="none" stroke="rgba(139,92,246,0.6)" strokeWidth="1" strokeDasharray="48 2000" filter="url(#arcGlow)" style={{ animation: "travel3 6.1s linear infinite", animationDelay: "0.6s" }} />

      {/* ── Nodes ── */}
      {([[70, 220], [990, 330], [1445, 285], [855, 495], [555, 155]] as [number, number][]).map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="6" fill="none" stroke="rgba(217,70,239,0.45)" strokeWidth="0.8"
            style={{ transformOrigin: `${cx}px ${cy}px`, animation: `nodePing 2.8s ease-out infinite`, animationDelay: `${i * 0.55}s` }}
          />
          <circle cx={cx} cy={cy} r="2.2" fill="rgba(224,90,245,0.95)" filter="url(#arcGlow)"
            style={{ animation: `nodeBeat 3s ease-in-out infinite`, animationDelay: `${i * 0.42}s` }}
          />
        </g>
      ))}
    </svg>
  </div>
);

/* -------------------------------------------------------------------------- */
/* THREE.JS SHADER — Deep Root / Vine System                                  */
/* -------------------------------------------------------------------------- */
const ElectricVine = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const numBranches = 100;
  const segmentsPerBranch = 1000;
  const particleCount = numBranches * segmentsPerBranch;
  const vineLength = 120.0;

  const [positions, randoms] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const rnd = new Float32Array(particleCount);
    for (let b = 0; b < numBranches; b++) {
      const baseX = (Math.random() - 0.5) * 6.0;
      const baseZ = (Math.random() - 0.5) * 6.0;
      const bRandom = Math.random();
      for (let s = 0; s < segmentsPerBranch; s++) {
        const i = b * segmentsPerBranch + s;
        const normalizedY = s / segmentsPerBranch;
        pos[i * 3] = baseX;
        pos[i * 3 + 1] = 2.0 - normalizedY * vineLength;
        pos[i * 3 + 2] = baseZ;
        rnd[i] = bRandom;
      }
    }
    return [pos, rnd];
  }, []);

  useFrame((state) => {
    const scrollP = (window as any).globalScrollProgress || 0;
    state.camera.position.y = -scrollP * vineLength;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uHeadY.value = 1.0 - scrollP * vineLength;
    }
  });

  const vertexShader = `
    uniform float uTime;
    uniform float uHeadY;
    attribute float aRandom;
    varying vec3 vColor;
    varying float vAlphaMask;

    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

    float snoise(vec3 v){
      const vec2 C=vec2(1.0/6.0,1.0/3.0);
      const vec4 D=vec4(0.0,0.5,1.0,2.0);
      vec3 i=floor(v+dot(v,C.yyy));
      vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);
      vec3 l=1.0-g;
      vec3 i1=min(g.xyz,l.zxy);
      vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;
      vec3 x2=x0-i2+C.yyy;
      vec3 x3=x0-D.yyy;
      i=mod289(i);
      vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
      float n_=0.142857142857;
      vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.0*floor(p*ns.z*ns.z);
      vec4 x_=floor(j*ns.z);
      vec4 y_=floor(j-7.0*x_);
      vec4 x=x_*ns.x+ns.yyyy;
      vec4 y=y_*ns.x+ns.yyyy;
      vec4 h=1.0-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);
      vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.0+1.0;
      vec4 s1=floor(b1)*2.0+1.0;
      vec4 sh=-step(h,vec4(0.0));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
      vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);
      vec3 p1=vec3(a0.zw,h.y);
      vec3 p2=vec3(a1.xy,h.z);
      vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
      vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
      m=m*m;
      return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    vec3 snoiseVec3(vec3 x){
      return vec3(
        snoise(vec3(x)),
        snoise(vec3(x.y-19.1,x.z+33.4,x.x+47.2)),
        snoise(vec3(x.z+74.2,x.x-124.5,x.y+99.4))
      );
    }

    vec3 curlNoise(vec3 p){
      const float e=0.1;
      vec3 dx=vec3(e,0.0,0.0);
      vec3 dy=vec3(0.0,e,0.0);
      vec3 dz=vec3(0.0,0.0,e);
      vec3 px0=snoiseVec3(p-dx),px1=snoiseVec3(p+dx);
      vec3 py0=snoiseVec3(p-dy),py1=snoiseVec3(p+dy);
      vec3 pz0=snoiseVec3(p-dz),pz1=snoiseVec3(p+dz);
      float x=py1.z-py0.z-pz1.y+pz0.y;
      float y=pz1.x-pz0.x-px1.z+px0.z;
      float z=px1.y-px0.y-py1.x+py0.x;
      return normalize(vec3(x,y,z)*(1.0/(2.0*e)));
    }

    void main(){
      vec3 pos=position;
      float distToHead=pos.y-uHeadY;
      vAlphaMask=smoothstep(-2.0,2.0,distToHead);
      if(vAlphaMask==0.0){gl_PointSize=0.0;gl_Position=vec4(0.0);return;}
      float depthProgress=(2.0-pos.y)/120.0;
      float expansion=pow(depthProgress,1.2)*20.0*aRandom;
      vec2 dir=normalize(pos.xz+vec2(0.001));
      pos.xz+=dir*expansion;
      float noiseFreq=0.15;
      float timeScale=0.2;
      vec3 noisePos=vec3(pos.x,pos.y*0.5,pos.z)*noiseFreq+(aRandom*100.0);
      vec3 curl=curlNoise(noisePos-vec3(0.0,uTime*timeScale,0.0));
      pos+=curl*(2.0+depthProgress*6.0);
      vec3 colorTail=vec3(0.2,0.0,0.6);
      vec3 colorHead=vec3(0.9,0.4,1.0);
      float colorMix=smoothstep(0.0,15.0,distToHead);
      vColor=mix(colorHead,colorTail,colorMix);
      vec4 mvPosition=modelViewMatrix*vec4(pos,1.0);
      gl_PointSize=(4.0*vAlphaMask)*(15.0/-mvPosition.z);
      gl_Position=projectionMatrix*mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vAlphaMask;
    void main(){
      if(vAlphaMask==0.0)discard;
      vec2 uv=gl_PointCoord.xy-0.5;
      float dist=length(uv);
      if(dist>0.5)discard;
      float alpha=(0.5-dist)*2.0;
      gl_FragColor=vec4(vColor,alpha*0.08*vAlphaMask);
    }
  `;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={{ uTime: { value: 0 }, uHeadY: { value: 2.0 } }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN LANDING PAGE COMPONENT                                                */
/* -------------------------------------------------------------------------- */
export default function ProminenceLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const prominenceBrandRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const revealRefs = useRef<HTMLDivElement[]>([]);
  const fluidBlobsRef = useRef<HTMLDivElement[]>([]);
  const parallaxRefs = useRef<HTMLDivElement[]>([]);

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => { setMounted(true); }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormStatus("sending");
    try {
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp(),
      });
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 4000);
    } catch {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 4000);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => { (window as any).globalScrollProgress = self.progress; },
      });

      fluidBlobsRef.current.forEach((blob) => {
        gsap.to(blob, {
          x: "random(-400, 400)",
          y: "random(-400, 400)",
          rotation: "random(-180, 180)",
          scale: "random(1.1, 2.2)",
          duration: "random(20, 38)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      parallaxRefs.current.forEach((el) => {
        const speed = el.dataset.speed || "1";
        gsap.to(el, {
          y: () => -200 * parseFloat(speed),
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.to(heroBgRef.current, {
        y: "20%", opacity: 0, scale: 1.05, ease: "none",
        scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true },
      });

      gsap.to(prominenceBrandRef.current, {
        y: "-18%", opacity: 0, scale: 0.88, rotationX: 12,
        scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: 1 },
      });

      revealRefs.current.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 45, scale: 0.96, rotationX: 5 },
          {
            opacity: 1, y: 0, scale: 1, rotationX: 0,
            duration: 1.4, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          }
        );
      });

      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, { xPercent: -50, ease: "none", duration: 40, repeat: -1 });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (!prominenceBrandRef.current) return;
    const xPos = (e.clientX / window.innerWidth - 0.5) * 40;
    const yPos = (e.clientY / window.innerHeight - 0.5) * 40;
    gsap.to(prominenceBrandRef.current, {
      x: xPos, y: yPos, rotationX: -yPos / 3, rotationY: xPos / 3,
      duration: 1.0, ease: "power2.out",
    });
  };

  const handleHeroMouseLeave = () => {
    gsap.to(prominenceBrandRef.current, {
      x: 0, y: 0, rotationX: 0, rotationY: 0,
      duration: 1.2, ease: "power2.out",
    });
  };

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };
  const addFluidRef = (el: HTMLDivElement | null) => {
    if (el && !fluidBlobsRef.current.includes(el)) fluidBlobsRef.current.push(el);
  };
  const addParallaxRef = (el: HTMLDivElement | null) => {
    if (el && !parallaxRefs.current.includes(el)) parallaxRefs.current.push(el);
  };

  /* --- Design tokens --- */
  const skeuoGlassCard =
    "relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-[#020104]/80 backdrop-blur-[80px] border border-white/10 border-b-black/80 border-r-black/50 shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.5)] rounded-3xl p-8 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_rgba(168,85,247,0.25),inset_0_1px_2px_rgba(255,255,255,0.25)] transition-all duration-500 group";
  const skeuoButton =
    "bg-gradient-to-b from-white to-gray-300 text-black font-bold rounded-full px-8 py-3 text-[10px] uppercase tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_-2px_2px_rgba(0,0,0,0.15)] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4)] active:translate-y-1 hover:from-white hover:to-gray-100 transition-all";
  const recessedWell =
    "bg-[#010002]/80 border border-white/5 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)]";
  const raisedTactileBox =
    "bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 border-b-black/60 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)]";
  const sectionLabel = (color: string) =>
    `text-[9px] font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-4 text-${color}-400`;

  return (
    <>
      {/* ================================================================ */}
      {/* LOADER                                                            */}
      {/* ================================================================ */}
      {isLoading && <ProminenceLoader onComplete={() => setIsLoading(false)} />}

      <main
        ref={containerRef}
        className="relative bg-[#020104] text-white font-sans overflow-hidden selection:bg-fuchsia-500/40 selection:text-white"
      >
        {/* ── VINE ROOT SYSTEM (Three.js) ── */}
        {mounted && (
          <div className="fixed inset-0 w-full max-w-[800px] left-[-100px] z-10 pointer-events-none hidden md:block opacity-80 mix-blend-screen">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true, antialias: true }}>
              <ElectricVine />
            </Canvas>
          </div>
        )}

        {/* ── GLOBAL LAVA LAMP LAYER ── */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020104]">
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Orb 1 — deep violet */}
          <div ref={addFluidRef} className="absolute top-[-10%] left-[5%] w-[70vw] h-[70vw] max-w-[1100px] max-h-[1100px] rounded-full mix-blend-color-dodge blur-[120px]"
            style={{ background: "radial-gradient(circle at center, rgba(126,34,206,0.55) 0%, transparent 62%)" }} />
          {/* Orb 2 — fuchsia */}
          <div ref={addFluidRef} className="absolute bottom-[10%] right-[-10%] w-[80vw] h-[80vw] max-w-[1300px] max-h-[1300px] rounded-full mix-blend-screen blur-[140px]"
            style={{ background: "radial-gradient(circle at center, rgba(217,70,239,0.35) 0%, transparent 62%)" }} />
          {/* Orb 3 — indigo */}
          <div ref={addFluidRef} className="absolute top-[40%] left-[30%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full mix-blend-color-dodge blur-[130px]"
            style={{ background: "radial-gradient(circle at center, rgba(79,70,229,0.45) 0%, transparent 62%)" }} />
        </div>

        {/* ── FLOATING NAV ── */}
        <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="bg-gradient-to-b from-white/[0.08] to-[#020104]/80 backdrop-blur-3xl border border-white/10 border-b-black/80 shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] rounded-full px-6 py-3 w-full max-w-5xl flex items-center justify-between pointer-events-auto transition-all duration-500">
            <div className="font-bold tracking-[0.25em] uppercase text-[10px] flex items-center gap-3 text-white drop-shadow-md">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-3 h-3 rounded-full bg-fuchsia-500/60 animate-ping" />
                <div className="relative w-1.5 h-1.5 rounded-full bg-fuchsia-200 shadow-[0_0_15px_rgba(217,70,239,1)]" />
              </div>
              Prominence
            </div>
            <div className="hidden md:flex items-center gap-10 text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">
              <a href="#services" className="hover:text-white transition-all">Architecture</a>
              <a href="#team" className="hover:text-white transition-all">The Engine</a>
              <a href="#tools" className="hover:text-white transition-all">Ecosystem</a>
              <a href="#work" className="hover:text-white transition-all">Archive</a>
            </div>
            <a href="#contact" className={skeuoButton}>Engage</a>
          </div>
        </nav>

        {/* ================================================================ */}
        {/* HERO — Depth Layers                                              */}
        {/* ================================================================ */}
        <section
          className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden perspective-[1000px]"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
        >
          {/* LAYER 0 — Deep background radial (coolest, most distant) */}
          <div ref={heroBgRef} className="absolute inset-0 z-0 flex items-center justify-center opacity-90 pointer-events-none">
            <div
              className="w-[1600px] h-[1600px] rounded-full blur-[100px]"
              style={{ background: "radial-gradient(circle at center, rgba(88,28,135,0.45) 0%, rgba(49,10,101,0.2) 40%, transparent 68%)" }}
            />
          </div>

          {/* LAYER 1 — Golden hour warmth (warm light rising from below) */}
          <div className="absolute inset-0 z-[1] pointer-events-none"
            style={{ background: "radial-gradient(ellipse 130% 65% at 25% 115%, rgba(251,146,60,0.11) 0%, rgba(234,88,12,0.05) 38%, transparent 65%)" }}
          />

          {/* LAYER 2 — Perspective grid (midground) */}
          <div className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none [transform:rotateX(60deg)_translateY(-150px)_scale(1.8)] opacity-25">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
                maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 100%)",
              }}
            />
          </div>

          {/* LAYER 3 — Energy arcs (hero SVG pulse system) */}
          <HeroEnergyArcs />

          {/* LAYER 4 — Edge vignette / atmospheric fog */}
          <div className="absolute inset-0 z-[8] pointer-events-none"
            style={{ background: "radial-gradient(ellipse 92% 88% at 50% 50%, transparent 52%, rgba(2,1,4,0.5) 100%)" }}
          />
          {/* Bottom fog curl */}
          <div className="absolute bottom-0 left-0 right-0 h-56 z-[9] pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(2,1,4,0.7) 0%, transparent 100%)" }}
          />

          {/* LAYER 5 — Ghost brand typography (glassy watermark) */}
          <div
            ref={prominenceBrandRef}
            className="absolute inset-0 z-[20] flex items-center justify-center pointer-events-none select-none transform-gpu"
          >
            <h1
              className="font-black tracking-[0.1em] text-transparent opacity-35 mix-blend-plus-lighter"
              style={{
                fontSize: "clamp(3.5rem, 12vw, 13rem)",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.18)",
                textShadow: "0 0 60px rgba(168,85,247,0.35), 0 0 120px rgba(168,85,247,0.12)",
              }}
            >
              PROMINENCE
            </h1>
          </div>

          {/* LAYER 6 — Hero content (foreground) */}
          <div
            className="relative z-[30] text-center max-w-4xl px-6 flex flex-col items-center pl-0 md:pl-20"
            ref={addParallaxRef}
            data-speed="0.8"
          >
            <div className="inline-flex items-center gap-4 mb-8 px-6 py-2.5 rounded-full bg-[#0a0412]/80 border border-white/10 shadow-[inset_0_2px_5px_rgba(0,0,0,0.9),0_2px_4px_rgba(255,255,255,0.05)] text-fuchsia-200 text-[9px] font-bold tracking-[0.2em] uppercase backdrop-blur-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500 shadow-[0_0_10px_#f0abfc]" />
              </span>
              Invisible Architecture, Visible Results
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight leading-[1.05] mb-8 text-white drop-shadow-[0_15px_30px_rgba(0,0,0,1)]">
              Elevate your <br />
              <span className="font-medium bg-clip-text text-transparent bg-gradient-to-b from-white via-purple-200 to-fuchsia-500">
                digital reality.
              </span>
            </h2>
            <p className="text-xs md:text-sm text-white/80 max-w-xl font-light leading-relaxed backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] bg-black/40">
              We are the intelligence supporting your ascendancy. High-end virtual operations coordinating seamlessly in the void.
            </p>
          </div>
        </section>

        {/* ================================================================ */}
        {/* MANIFESTO — The Creed                                            */}
        {/* ================================================================ */}
        <section className="py-36 px-6 relative z-20 overflow-hidden">
          {/* Section ambient — warm gold-violet */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 60% at 60% 50%, rgba(109,40,217,0.14) 0%, transparent 70%)" }}
          />

          <div className="max-w-6xl mx-auto pl-6 md:pl-32">
            <div ref={addToRefs}>
              <div className="text-[9px] tracking-[0.5em] text-purple-400/50 uppercase font-bold mb-10 flex items-center gap-4">
                <div className="w-8 h-[1px] bg-purple-500/50" /> The Creed
              </div>
              <blockquote
                className="text-3xl md:text-5xl lg:text-[3.4rem] font-light text-white/90 leading-[1.2] tracking-tight max-w-4xl"
              >
                We occupy the space between{" "}
                <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-400">
                  what you envision
                </span>{" "}
                and what the world receives.
              </blockquote>
              <div className="mt-14 flex items-center gap-5">
                <div className="w-16 h-[1px] bg-gradient-to-r from-purple-500/60 to-transparent" />
                <span className="text-[8px] tracking-[0.4em] text-white/25 uppercase font-semibold">Prominence · Est. Operations</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SERVICES — Phase 01                                              */}
        {/* Color: Indigo / Blue-violet                                      */}
        {/* ================================================================ */}
        <section id="services" className="py-32 px-6 max-w-6xl mx-auto relative z-20 pl-6 md:pl-32">
          <div className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: "radial-gradient(ellipse 90% 70% at 10% 50%, rgba(79,70,229,0.18) 0%, transparent 65%)" }}
          />

          <div ref={addToRefs} className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-10">
            <div className="max-w-2xl">
              <div className={sectionLabel("indigo")}>
                <div className="w-12 h-[1px] bg-gradient-to-r from-indigo-500 to-transparent" />
                Phase 01: Architecture
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 drop-shadow-xl">Core Capacities</h2>
              <p className="text-white/60 text-sm md:text-base font-light leading-relaxed">
                We intercept and resolve the complexities of your operations. Focus on high-level growth, direction, and wealth creation. We handle the structure.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Development", desc: "Scalable frontend and backend architectures built by specialized engineers. Robust, exact, and future-proof." },
              { title: "Post-Production", desc: "Cinematic editing and visual workflows that elevate your brand's narrative to ultra-premium standards." },
              { title: "Creative Design", desc: "High-fidelity identity mapping, from asset creation to complete, immersive brand ecosystems." },
            ].map((service, i) => (
              <div key={i} ref={addToRefs} className={skeuoGlassCard}>
                <div className="absolute top-0 right-0 w-48 h-48 blur-[70px] group-hover:opacity-100 opacity-70 transition-opacity duration-1000 pointer-events-none"
                  style={{ background: "radial-gradient(circle at center, rgba(99,102,241,0.35) 0%, transparent 70%)" }} />
                <div className={`w-14 h-14 rounded-xl ${raisedTactileBox} flex items-center justify-center mb-8 relative z-10 group-hover:-translate-y-2 transition-all duration-500`}>
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-300 shadow-[0_0_20px_rgba(165,180,252,1)] group-hover:scale-150 transition-transform duration-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-medium mb-4 relative z-10 text-white/90 group-hover:text-white drop-shadow-md">{service.title}</h3>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed font-light relative z-10 group-hover:text-white/90 transition-colors duration-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* TEAM — Phase 02                                                  */}
        {/* Color: Fuchsia / Magenta                                         */}
        {/* ================================================================ */}
        <section id="team" className="py-32 px-6 max-w-6xl mx-auto relative z-20 pl-6 md:pl-32">
          <div className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: "radial-gradient(ellipse 80% 65% at 90% 40%, rgba(192,38,211,0.18) 0%, transparent 65%)" }}
          />

          <div ref={addToRefs} className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-10">
            <div className="max-w-2xl">
              <div className={sectionLabel("fuchsia")}>
                <div className="w-12 h-[1px] bg-gradient-to-r from-fuchsia-500 to-transparent" />
                Phase 02: The Engine
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 drop-shadow-xl">Intelligence Behind</h2>
              <p className="text-white/60 text-sm md:text-base font-light leading-relaxed">
                A curated syndicate of specialists operating as a unified control hub. Invisible, but immensely felt.
              </p>
            </div>
          </div>

          {/* CEO Highlight */}
          <div ref={addToRefs} className={`${skeuoGlassCard} mb-12 flex flex-col md:flex-row items-center gap-12 !p-10 md:!p-14`}>
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            <div className={`relative z-10 w-40 h-40 md:w-48 md:h-48 shrink-0 rounded-full ${recessedWell} p-3 group-hover:border-fuchsia-500/40 transition-colors duration-700`}>
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-900 to-black flex items-center justify-center text-4xl font-light text-white/30 overflow-hidden relative shadow-[inset_0_2px_15px_rgba(0,0,0,1),0_1px_1px_rgba(255,255,255,0.2)]">
                <span className="absolute tracking-[0.2em] font-bold">VA</span>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800')] bg-cover bg-center mix-blend-luminosity opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
              </div>
            </div>
            <div className="relative z-10 text-center md:text-left">
              <div className={`inline-flex px-5 py-2 rounded-full ${raisedTactileBox} text-fuchsia-200 text-[9px] font-bold tracking-[0.25em] uppercase mb-6`}>
                CEO & Founder
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6 drop-shadow-xl">Vien Abache</h3>
              <p className="text-white/70 text-sm md:text-base max-w-xl font-light leading-relaxed">
                Architecting operations and steering the central vision to deliver invisible infrastructure with compounding, visible results.
              </p>
            </div>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamData.map((member, i) => (
              <div key={i} ref={addToRefs} className={`${skeuoGlassCard} flex items-center gap-6 !p-6 group/member`}>
                <div className={`w-14 h-14 shrink-0 rounded-xl ${recessedWell} flex items-center justify-center text-2xl text-white/50 group-hover/member:text-fuchsia-400 group-hover/member:shadow-[inset_0_4px_10px_rgba(0,0,0,0.9),0_0_20px_rgba(217,70,239,0.4)] transition-all duration-500`}>
                  {member.icon}
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-medium text-white/90 group-hover/member:text-white transition-colors duration-300 mb-1">{member.name}</h4>
                  <div className="text-[9px] text-fuchsia-400/80 tracking-[0.2em] font-bold uppercase group-hover/member:text-fuchsia-300">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* TOOLS — Phase 03                                                 */}
        {/* Color: Royal indigo / Deep blue                                  */}
        {/* ================================================================ */}
        <section id="tools" className="py-32 px-6 relative z-20 pl-6 md:pl-32">
          <div className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(15,6,50,0.7) 40%, rgba(8,2,20,0.9) 60%, transparent)" }}
          />
          <div className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(67,56,202,0.2) 0%, transparent 70%)" }}
          />

          <div className="max-w-6xl mx-auto">
            <div ref={addToRefs} className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-10">
              <div className="max-w-2xl">
                <div className={sectionLabel("violet")}>
                  <div className="w-12 h-[1px] bg-gradient-to-r from-violet-500 to-transparent" />
                  Phase 03: Ecosystem
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 drop-shadow-xl">Stack & Frameworks</h2>
                <p className="text-white/60 text-sm md:text-base font-light leading-relaxed">
                  The foundational digital instruments empowering our silent operations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {techStack.map((category, idx) => (
                <div key={idx} ref={addToRefs} className={`${skeuoGlassCard} flex flex-col justify-between`}>
                  <div>
                    <div className="text-violet-300 text-[10px] font-bold tracking-[0.2em] uppercase mb-10 flex items-center gap-4">
                      <div className="flex-grow h-[1px] bg-gradient-to-r from-violet-500/50 to-transparent" />
                      {category.title}
                    </div>
                    <div className="flex flex-col gap-6">
                      {category.tools.map((tool, i) => (
                        <div key={i} className="flex items-center gap-5 group/item cursor-default">
                          <div className={`w-12 h-12 rounded-xl ${raisedTactileBox} flex items-center justify-center group-hover/item:border-violet-400/60 transition-all duration-300 group-hover/item:shadow-[0_6px_20px_rgba(139,92,246,0.5),inset_0_1px_2px_rgba(255,255,255,0.5)]`}>
                            <div className="text-white/50 group-hover/item:text-violet-300 transition-colors transform group-hover/item:scale-110 duration-300 text-xl">
                              {tool.icon}
                            </div>
                          </div>
                          <span className="text-sm md:text-base font-light text-white/70 group-hover/item:text-white transition-colors duration-300">
                            {tool.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* PROJECTS — Phase 04                                              */}
        {/* Color: Rich violet                                               */}
        {/* ================================================================ */}
        <section id="work" className="py-32 px-6 max-w-6xl mx-auto relative z-20 pl-6 md:pl-32">
          <div className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: "radial-gradient(ellipse 75% 55% at 15% 60%, rgba(124,58,237,0.15) 0%, transparent 65%)" }}
          />

          <div ref={addToRefs} className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/[0.05] pb-10">
            <div className="max-w-2xl">
              <div className={sectionLabel("purple")}>
                <div className="w-12 h-[1px] bg-gradient-to-r from-purple-500 to-transparent" />
                Phase 04: Archive
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 drop-shadow-xl">Executed Intelligence</h2>
              <p className="text-white/60 text-sm md:text-base font-light leading-relaxed">
                A curated glimpse into the robust systems and cinematic media we've successfully deployed.
              </p>
            </div>
            <button className={`${skeuoButton} self-start md:self-auto`}>Explore Archive</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { id: 1, img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", title: "Core Dashboard", subtitle: "Infrastructure" },
              { id: 2, img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop", title: "System Reel '25", subtitle: "Video Production" },
              { id: 3, img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2000&auto=format&fit=crop", title: "Identity Phase II", subtitle: "Creative Design" },
              { id: 4, img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop", title: "App Stack", subtitle: "Development" },
            ].map((project) => (
              <div key={project.id} ref={addToRefs} className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-[#020104] border border-white/10 border-b-black/80 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.15)] cursor-pointer hover:shadow-[0_35px_70px_rgba(168,85,247,0.4),inset_0_1px_3px_rgba(255,255,255,0.3)] hover:-translate-y-2 transition-all duration-700 perspective-[1000px]">
                <div
                  className="absolute inset-[-10%] bg-cover bg-center transform group-hover:scale-105 transition-transform duration-[3s] ease-out opacity-70 group-hover:opacity-100"
                  style={{ backgroundImage: `url(${project.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020104] via-[#020104]/80 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-1000" />
                <div className="absolute bottom-0 inset-x-0 p-8 md:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out z-20">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-purple-300 text-[9px] font-bold tracking-[0.3em] uppercase mb-3 opacity-80 group-hover:opacity-100 transition-opacity duration-700 delay-100">{project.subtitle}</div>
                      <h3 className="text-xl md:text-2xl font-medium text-white drop-shadow-lg">{project.title}</h3>
                    </div>
                    <div className={`w-10 h-10 rounded-full ${raisedTactileBox} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 group-hover:scale-110`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* TESTIMONIALS                                                      */}
        {/* Color: Deep plum / rose                                          */}
        {/* ================================================================ */}
        <section id="testimonials" className="py-32 px-6 max-w-6xl mx-auto relative z-20 pl-6 md:pl-32">
          <div className="absolute inset-0 pointer-events-none -z-10"
            style={{ background: "radial-gradient(ellipse 80% 60% at 85% 45%, rgba(157,23,77,0.12) 0%, rgba(109,40,217,0.1) 40%, transparent 70%)" }}
          />

          <div ref={addToRefs} className="mb-20 flex flex-col items-center text-center border-b border-white/[0.05] pb-10">
            <div className="text-rose-400/70 text-[9px] font-bold tracking-[0.3em] uppercase mb-6">Impact Validation</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 drop-shadow-xl">Proven Elevation</h2>
            <p className="text-white/60 max-w-2xl text-sm md:text-base font-light">The mathematical results of diligent hands and unyielding service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "Prominence completely restructured our backend while flawlessly handling our media. True silent partners in our growth trajectory.", author: "Tech Startup CEO" },
              { quote: "Their work ethic aligns precisely with their values. Diligent, brilliant, and proactive. They don't just execute tasks; they elevate the standard.", author: "Agency Director" },
              { quote: "The video production quality was purely cinematic, and the web integration was seamless. A truly unified, ethereal service.", author: "E-Commerce Founder" },
            ].map((testimonial, i) => (
              <div key={i} ref={addToRefs} className={`${skeuoGlassCard} flex flex-col justify-between group`}>
                <div>
                  <Quotes className="w-10 h-10 text-purple-500/40 mb-8 group-hover:text-purple-400/80 transition-colors duration-500" weight="duotone" />
                  <p className="text-white/80 text-sm md:text-base leading-relaxed font-light mb-10 group-hover:text-white transition-colors duration-500">"{testimonial.quote}"</p>
                </div>
                <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-purple-400/90 group-hover:text-purple-300 transition-colors">
                  — {testimonial.author}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* CONTACT — Phase 05                                               */}
        {/* Color: Rich purple / gold warmth                                 */}
        {/* ================================================================ */}
        <section id="contact" className="py-32 px-6 max-w-6xl mx-auto relative z-20 pl-6 md:pl-32">
          <div ref={addToRefs} className="bg-gradient-to-b from-white/[0.04] to-[#010002]/95 backdrop-blur-[80px] border border-white/10 border-b-black/80 rounded-[3rem] p-10 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,1),inset_0_1px_3px_rgba(255,255,255,0.2)] relative overflow-hidden group perspective-[1000px]">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none group-hover:opacity-100 opacity-70 transition-opacity duration-1000"
              style={{ background: "radial-gradient(circle at center, rgba(109,40,217,0.35) 0%, transparent 70%)" }} />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity duration-1000"
              style={{ background: "radial-gradient(circle at center, rgba(67,56,202,0.3) 0%, transparent 70%)" }} />
            {/* Gold warmth hint */}
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[160px] pointer-events-none opacity-30"
              style={{ background: "radial-gradient(circle at center, rgba(251,191,36,0.12) 0%, transparent 70%)" }} />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" ref={addParallaxRef} data-speed="0.05">
              <div>
                <div className="text-white/70 text-[9px] font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-white/50" /> Phase 05: Engage
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-8 leading-[1.05] drop-shadow-2xl">Initiate <br /> Connection.</h2>
                <p className="text-white/60 text-sm md:text-base font-light leading-relaxed mb-12">
                  Ready to integrate Prominence into your ecosystem? Transmit your signal to schedule a high-level infrastructure review.
                </p>
                <div className="space-y-8">
                  <div className="flex items-center gap-6 text-sm font-light text-white/90">
                    <div className={`w-12 h-12 rounded-xl ${raisedTactileBox} flex items-center justify-center shadow-[0_4px_15px_rgba(217,70,239,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)]`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-fuchsia-300"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </div>
                    <span className="tracking-wide">System Priority Access</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm font-light text-white/90">
                    <div className={`w-12 h-12 rounded-xl ${raisedTactileBox} flex items-center justify-center shadow-[0_4px_15px_rgba(217,70,239,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)]`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-fuchsia-300"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </div>
                    <span className="tracking-wide">direct@prominence.co</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className={`space-y-6 ${recessedWell} p-8 md:p-12 rounded-[2.5rem]`}>
                <input type="text" placeholder="Nomenclature (Name)" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required
                  className={`w-full ${recessedWell} rounded-2xl px-6 py-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-fuchsia-500/60 focus:bg-white/[0.04] transition-all`} />
                <input type="email" placeholder="Transmission Vector (Email)" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} required
                  className={`w-full ${recessedWell} rounded-2xl px-6 py-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-fuchsia-500/60 focus:bg-white/[0.04] transition-all`} />
                <textarea placeholder="Operational Intent (Message)" rows={4} value={formData.message} onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))} required
                  className={`w-full ${recessedWell} rounded-2xl px-6 py-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-fuchsia-500/60 focus:bg-white/[0.04] transition-all resize-none`} />
                <button type="submit" disabled={formStatus === "sending"}
                  className={`${skeuoButton} w-full mt-4 py-4
                    ${formStatus === "sending" ? "opacity-60 cursor-wait" : ""}
                    ${formStatus === "success" ? "!from-emerald-400 !to-emerald-600 !text-white" : ""}
                    ${formStatus === "error" ? "!from-red-400 !to-red-600 !text-white" : ""}`}>
                  {formStatus === "idle" && "Transmit Signal"}
                  {formStatus === "sending" && "Transmitting..."}
                  {formStatus === "success" && "✓ Signal Received"}
                  {formStatus === "error" && "✗ Transmission Failed"}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SCRIPTURE BANNER — Foundation (anchored at end)                  */}
        {/* ================================================================ */}
        <div className="relative z-40 py-16 overflow-hidden">
          {/* Ambient glow above/below */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(49,10,101,0.12) 40%, rgba(49,10,101,0.12) 60%, transparent)" }}
          />
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-800/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-800/40 to-transparent" />

          {/* Label */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full border border-white/[0.06] bg-white/[0.02]">
              <div className="w-1 h-1 rounded-full bg-purple-500/60" />
              <span className="text-[8px] tracking-[0.5em] text-white/25 uppercase font-semibold">Foundation — The Word</span>
              <div className="w-1 h-1 rounded-full bg-purple-500/60" />
            </div>
          </div>

          {/* Marquee */}
          <div className="flex whitespace-nowrap overflow-hidden">
            <div ref={marqueeRef} className="flex gap-16 items-center px-8">
              {[...scriptures, ...scriptures].map((text, i) => (
                <span key={i} className="text-[9px] font-semibold tracking-[0.32em] text-white/30 uppercase">
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* FOOTER                                                            */}
        {/* ================================================================ */}
        <footer className="py-20 text-center text-white/50 text-[9px] tracking-[0.4em] uppercase relative z-10 bg-black">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/80 shadow-[0_0_20px_rgba(255,255,255,1)] animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </div>
          <p className="opacity-90 font-bold">© {new Date().getFullYear()} Prominence. All operational rights reserved.</p>
          <p className="mt-4 opacity-50">Olongapo City, 2200</p>
        </footer>
      </main>
    </>
  );
}