"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import ScrollVelocity from "./components/ScrollVelocity/ScrollVelocity";
import dynamic from "next/dynamic";

const CircularGallery = dynamic(
  () => import("./components/CircularGallery/CircularGallery"),
  { ssr: false }
);

const SplashCursor = dynamic(
  () => import("./components/SplashCursor/SplashCursor"),
  { ssr: false }
);

const MagicBento = dynamic(
  () => import("./components/MagicBento/MagicBento"),
  { ssr: false }
);

import { Box, Code, Flame, Triangle, Scissors, Video, Film, Paintbrush, ImageIcon, PenTool } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------- */
/* TEAM DATA                                                                  */
/* -------------------------------------------------------------------------- */
const teamData = {
  ceo: {
    name: "Vien Abache",
    role: "CEO & Founder",
    image: "/images/team-vien.png",
    about:
      "Visionary leader driving innovation and pushing the boundaries of digital architecture. Orchestrating the intersection of design and robust engineering to build systems that scale.",
  },
  members: [
    { name: "Vinz Iligan",       role: "Lead Engineer",    image: "/images/team-vinz.png",    about: "Architecting scalable backend systems and ensuring seamless data pipelines." },
    { name: "Julian Tolentino",  role: "Frontend Wizard",  image: "/images/team-julian.png",  about: "Crafting pixel-perfect, interactive user interfaces with modern frameworks." },
    { name: "Giervan Sabalbero", role: "Fullstack Dev",    image: "/images/team-giervan.png", about: "Bridging the gap between intuitive frontends and powerful server logic." },
    { name: "Andrea Turalba",    role: "UI/UX Dev",        image: "/images/team-andrea.png",  about: "Translating complex user journeys into elegant, accessible web experiences." },
    { name: "Gian Cruz",         role: "Senior Editor",    image: "/images/team-gian.png",    about: "Transforming raw concepts into cinematic, narrative-driven visual stories." },
    { name: "Russel Minimo",     role: "Motion Graphics",  image: "/images/team-russel.png",  about: "Breathing life into static assets through fluid motion and dynamic effects." },
  ],
};

/* Gallery items derived from team data for CircularGallery */
const teamGalleryItems = [
  { image: teamData.ceo.image, text: `${teamData.ceo.name} — ${teamData.ceo.role}` },
  ...teamData.members.map(m => ({ image: m.image, text: `${m.name} — ${m.role}` })),
];

/* -------------------------------------------------------------------------- */
/* PROCEDURAL CLOUD DENSITY MAP                                               */
/* -------------------------------------------------------------------------- */
const createProceduralCloudTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);
    const drawPuff = (x: number, y: number, radius: number, opacity: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0,    `rgba(255,255,255,${opacity})`);
      gradient.addColorStop(0.3,  `rgba(255,255,255,${opacity * 0.9})`);
      gradient.addColorStop(0.6,  `rgba(255,255,255,${opacity * 0.6})`);
      gradient.addColorStop(0.85, `rgba(255,255,255,${opacity * 0.2})`);
      gradient.addColorStop(1,    "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };
    drawPuff(256, 256, 240, 0.85);
    drawPuff(180, 220, 180, 0.75);
    drawPuff(340, 280, 200, 0.70);
    drawPuff(260, 160, 170, 0.65);
    drawPuff(200, 340, 190, 0.80);
    drawPuff(310, 180, 140, 0.50);
    drawPuff(190, 280, 160, 0.65);
    drawPuff(380, 200, 150, 0.55);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
};

/* -------------------------------------------------------------------------- */
/* ENHANCED CLOUD SHADERS                                                     */
/* -------------------------------------------------------------------------- */
const cloudVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vViewPos;
  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    vec4 viewPos = viewMatrix * worldPosition;
    vViewPos = viewPos.xyz;
    gl_Position = projectionMatrix * viewPos;
  }
`;

const cloudFragmentShader = `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec3 uBaseColor;
  uniform vec3 uSunColor;
  uniform vec3 uShadowColor;
  uniform float uOpacity;
  uniform float uLightIntensity;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vViewPos;
  float noise(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main() {
    float t = uTime * 0.15 + (vWorldPos.x * 0.03) + (vWorldPos.y * 0.03);
    vec2 morphUv = vUv;
    morphUv.x += sin(vUv.y * 4.5 + t) * 0.025;
    morphUv.y += cos(vUv.x * 4.5 + t) * 0.025;
    morphUv.x += sin(vUv.y * 8.0 - t * 0.5) * 0.012;
    morphUv.y += cos(vUv.x * 8.0 - t * 0.5) * 0.012;
    vec4 texColor = texture2D(uMap, morphUv);
    float density = texColor.a;
    density = clamp(density * 1.5, 0.0, 1.0);
    float dist = length(vUv - 0.5) * 2.0;
    float edgeFade = smoothstep(0.95, 0.4, dist);
    density *= edgeFade;
    float sunDot = smoothstep(0.3, 1.0, morphUv.y + (morphUv.x * 0.1));
    float shadowCore = smoothstep(0.0, 0.8, 1.0 - morphUv.y);
    float depthFade = smoothstep(0.0, 60.0, -vViewPos.z);
    vec3 color = mix(uBaseColor, uShadowColor, shadowCore * 0.5);
    color = mix(color, uSunColor, sunDot * uLightIntensity * density);
    color += vec3(1.0, 1.0, 1.0) * (1.0 - density) * 0.05;
    float alpha = density * uOpacity;
    alpha *= smoothstep(0.0, 0.1, density);
    alpha *= (1.0 - depthFade * 0.2);
    gl_FragColor = vec4(color, alpha);
  }
`;

/* -------------------------------------------------------------------------- */
/* TRIANGLE LOADER                                                            */
/* -------------------------------------------------------------------------- */
const TriangleLoader = ({ onComplete }: { onComplete: () => void }) => {
  const loaderRef  = useRef<HTMLDivElement>(null);
  const tri1Ref    = useRef<SVGPolygonElement>(null);
  const tri2Ref    = useRef<SVGPolygonElement>(null);
  const shadowRef  = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    if (!loaderRef.current || !tri1Ref.current || !tri2Ref.current) return;
    gsap.set(tri1Ref.current,  { x: -38, y: 0, transformOrigin: "center center" });
    gsap.set(tri2Ref.current,  { x:  38, y: 0, rotation: 180, transformOrigin: "center center" });
    gsap.set(shadowRef.current,{ scaleX: 1, opacity: 0.35, transformOrigin: "center center" });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.1 });
    tl.to(tri1Ref.current,  { x: 0,   y: -52, rotation:   15, duration: 0.32, ease: "power2.out"  }, 0)
      .to(shadowRef.current,{ scaleX: 0.6, opacity: 0.18,     duration: 0.32, ease: "power2.out"  }, 0)
      .to(tri1Ref.current,  { x: 38,  y: 0,   rotation:    0, duration: 0.28, ease: "bounce.out"  }, 0.32)
      .to(shadowRef.current,{ scaleX: 1,   opacity: 0.35,     duration: 0.28, ease: "power2.out"  }, 0.32)
      .to(tri2Ref.current,  { x: 0,   y: -52, rotation:  165, duration: 0.32, ease: "power2.out"  }, 0.72)
      .to(shadowRef.current,{ scaleX: 0.6, opacity: 0.18,     duration: 0.32, ease: "power2.out"  }, 0.72)
      .to(tri2Ref.current,  { x: -38, y: 0,   rotation:  180, duration: 0.28, ease: "bounce.out"  }, 1.04)
      .to(shadowRef.current,{ scaleX: 1,   opacity: 0.35,     duration: 0.28, ease: "power2.out"  }, 1.04)
      .to({}, { duration: 0.45 });
    const exitTimer = setTimeout(() => {
      tl.kill();
      gsap.to(loaderRef.current, { opacity: 0, scale: 1.06, duration: 0.85, ease: "power3.inOut", onComplete });
    }, 2800);
    return () => { tl.kill(); clearTimeout(exitTimer); };
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden" style={{ background: "#000000" }}>
      <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, transparent 30%, rgba(0,0,0,0.88) 100%)" }} />
      <div className="relative z-10 flex flex-col items-center gap-10">
        <svg width="180" height="110" viewBox="-90 -70 180 110" overflow="visible">
          <ellipse ref={shadowRef} cx="0" cy="30" rx="72" ry="14" fill="#c084fc" style={{ filter: "blur(18px)" }} opacity="0.35" />
          <polygon ref={tri1Ref}  points="0,-38 34,22 -34,22" fill="#7c3aed" stroke="#a855f7" strokeWidth="1.5" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 12px rgba(168,85,247,0.75))" }} />
          <polygon ref={tri2Ref}  points="0,-38 34,22 -34,22" fill="#ffffff" stroke="rgba(255,255,255,0.55)" strokeWidth="1" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.55))" }} transform="translate(38,0) rotate(180)" />
        </svg>
        <p className="font-black tracking-[0.45em] text-transparent uppercase select-none" style={{ fontSize: "clamp(1.1rem,4vw,1.55rem)", WebkitTextStroke: "1px rgba(255,255,255,0.18)", textShadow: "0 0 40px rgba(168,85,247,0.45)" }}>
          PROMINENCE
        </p>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN PAGE                                                                  */
/* -------------------------------------------------------------------------- */
export default function MountainLanding() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [showPage,   setShowPage]   = useState(false);

  const [formData,     setFormData]     = useState({ name: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle"|"sending"|"delivered"|"received"|"error">("idle");
  const [submitError,  setSubmitError]  = useState("");

  const mountainBgRef   = useRef<HTMLDivElement>(null);
  const uiWrapperRef    = useRef<HTMLDivElement>(null);
  const heroSectionRef  = useRef<HTMLDivElement>(null);

  const heroSpacerRef   = useRef<HTMLDivElement>(null);
  const cloudTriggerRef = useRef<HTMLDivElement>(null);
  const threeCanvasRef  = useRef<HTMLDivElement>(null);

  const servicesRef  = useRef<HTMLDivElement>(null);
  const teamRef      = useRef<HTMLDivElement>(null);
  const toolsRef     = useRef<HTMLDivElement>(null);
  const projectsRef  = useRef<HTMLDivElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const footerRef    = useRef<HTMLElement>(null);
  const summitRef    = useRef<SVGSVGElement>(null);

  // ─── NEW: Collaboration section refs ───────────────────────────────────────
  const collabRef      = useRef<HTMLDivElement>(null);
  const collabWaveRef  = useRef<SVGPathElement>(null);
  const collabWave2Ref = useRef<SVGPathElement>(null);

  // ─── Page-transition state ─────────────────────────────────────────────────
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);
  const [transitionLabel, setTransitionLabel] = useState("");
  const transitionOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  const handleLoaderComplete = () => {
    setLoaderDone(true);
    setTimeout(() => setShowPage(true), 300);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("sending");
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.status === "delivered") {
        setSubmitStatus("delivered");
        setFormData({ name: "", email: "", message: "" });
        // Simulate 'received' confirmation after a short delay
        setTimeout(() => setSubmitStatus("received"), 2200);
        setTimeout(() => setSubmitStatus("idle"), 7000);
      } else {
        setSubmitError(data.error || "Transmission failed.");
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 5000);
      }
    } catch {
      setSubmitError("Network error. Please check your connection.");
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  /* --- THREE.JS CLOUD SETUP (unchanged) --- */
  useEffect(() => {
    if (!showPage || !threeCanvasRef.current) return;
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 70);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    threeCanvasRef.current.appendChild(renderer.domElement);
    const cloudTexture = createProceduralCloudTexture();
    const makeUniforms = (base: number, sun: number, shadow: number, opacity: number, light: number) => ({
      uMap:           { value: cloudTexture },
      uTime:          { value: 0 },
      uBaseColor:     { value: new THREE.Color(base) },
      uSunColor:      { value: new THREE.Color(sun) },
      uShadowColor:   { value: new THREE.Color(shadow) },
      uOpacity:       { value: opacity },
      uLightIntensity:{ value: light },
    });
    const uniformsBg   = makeUniforms(0xffffff, 0xffffff, 0xdee4ec, 0.65, 0.8);
    const uniformsFg   = makeUniforms(0xffffff, 0xffffff, 0xeef2f5, 0.85, 1.0);
    const uniformsWisp = makeUniforms(0xffffff, 0xffffff, 0xffffff, 0.40, 0.9);
    const makeMat = (u: typeof uniformsBg) => new THREE.ShaderMaterial({ vertexShader: cloudVertexShader, fragmentShader: cloudFragmentShader, uniforms: u, transparent: true, depthWrite: false, blending: THREE.NormalBlending });
    const materialBg   = makeMat(uniformsBg);
    const materialFg   = makeMat(uniformsFg);
    const materialWisp = makeMat(uniformsWisp);
    const geometry = new THREE.PlaneGeometry(1, 1);
    const createCloudCluster = (material: THREE.ShaderMaterial, count: number, sX: number, sY: number, sZ: number, scMin: number, scMax: number) => {
      const group = new THREE.Group();
      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set((Math.random()-0.5)*sX, (Math.random()-0.5)*sY, (Math.random()-0.5)*sZ);
        const sc = Math.random()*(scMax-scMin)+scMin;
        mesh.scale.set(sc, sc, 1);
        mesh.rotation.z = Math.random()*Math.PI*2;
        mesh.userData = { rotationSpeed: (Math.random()-0.5)*0.0001, floatSpeed: Math.random()*0.0008+0.0005, floatOffset: Math.random()*Math.PI*2, floatAmplitude: Math.random()*0.01+0.005 };
        group.add(mesh);
      }
      return group;
    };
    const leftBg    = createCloudCluster(materialBg,   18, 220, 30, 25, 70, 110);
    const rightBg   = createCloudCluster(materialBg,   18, 220, 30, 25, 70, 110);
    const leftFg    = createCloudCluster(materialFg,   20, 180, 20, 20, 60,  95);
    const rightFg   = createCloudCluster(materialFg,   20, 180, 20, 20, 60,  95);
    const leftWisp  = createCloudCluster(materialWisp, 10, 240, 15, 30, 50, 100);
    const rightWisp = createCloudCluster(materialWisp, 10, 240, 15, 30, 50, 100);
    [leftWisp, rightWisp].forEach(g => g.children.forEach((m: any) => { m.scale.y *= (Math.random()*0.25+0.25); }));
    leftBg.position.set(-100,-17,-15);  rightBg.position.set(100,-17,-15);
    leftFg.position.set(-80,-20,8);     rightFg.position.set(80,-20,8);
    leftWisp.position.set(-120,-12,15); rightWisp.position.set(120,-12,15);
    scene.add(leftBg, rightBg, leftFg, rightFg, leftWisp, rightWisp);
    let cft = 0;
    const cBZ = camera.position.z, cBY = camera.position.y, cBX = camera.position.x;
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = Date.now();
      cft += 0.016;
      camera.position.x = cBX + Math.sin(cft*0.3)*0.08 + Math.sin(cft*2.1)*0.015;
      camera.position.y = cBY + Math.cos(cft*0.25)*0.06 + Math.cos(cft*1.8)*0.012;
      camera.position.z = cBZ + Math.sin(cft*0.15)*0.4;
      camera.rotation.z = Math.sin(cft*0.2)*0.002;
      camera.rotation.y = Math.sin(cft*0.18)*0.003;
      uniformsBg.uTime.value = uniformsFg.uTime.value = uniformsWisp.uTime.value = time*0.0008;
      leftBg.position.y    += Math.sin(time*0.00008)*0.002;
      rightBg.position.y   += Math.cos(time*0.00008)*0.002;
      leftFg.position.y    += Math.sin(time*0.00008+1)*0.003;
      rightFg.position.y   += Math.cos(time*0.00008+1)*0.003;
      leftWisp.position.x  += 0.008;  rightWisp.position.x -= 0.008;
      leftWisp.position.y  += Math.sin(time*0.0001)*0.004;
      rightWisp.position.y += Math.cos(time*0.0001)*0.004;
      [leftBg, rightBg, leftFg, rightFg, leftWisp, rightWisp].forEach(g => g.children.forEach((m: any) => {
        m.rotation.z += m.userData.rotationSpeed;
        m.position.y += Math.sin(time*m.userData.floatSpeed+m.userData.floatOffset)*m.userData.floatAmplitude;
      }));
      renderer.render(scene, camera);
    };
    animate();
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: heroSpacerRef.current, start: "top top", end: "bottom top", scrub: 2 } })
        .to(camera.position, { z: 30, y: -5, ease: "power2.inOut" });
      gsap.timeline({ scrollTrigger: { trigger: cloudTriggerRef.current, start: "top 100%", end: "bottom 0%", scrub: 2.5 } })
        .to(leftBg.position,  { x: -30, y:  3, ease: "power1.inOut"  }, 0)
        .to(rightBg.position, { x:  30, y:  3, ease: "power1.inOut"  }, 0)
        .to(leftFg.position,  { x: -20, y:  6, ease: "power2.inOut"  }, 0)
        .to(rightFg.position, { x:  20, y:  6, ease: "power2.inOut"  }, 0)
        .to(leftWisp.position,  { x:  10, y: 10, ease: "power1.out"  }, 0)
        .to(rightWisp.position, { x: -10, y: 10, ease: "power1.out"  }, 0)
        .to([leftFg.position,   rightFg.position],   { z: 20, ease: "power1.inOut" }, 0)
        .to([leftWisp.position, rightWisp.position], { z: 28, ease: "power1.inOut" }, 0)
        .to(uniformsBg.uOpacity,   { value: 0.9, ease: "power2.in" }, 0.2)
        .to(uniformsFg.uOpacity,   { value: 1.0, ease: "power2.in" }, 0.2)
        .to(uniformsWisp.uOpacity, { value: 0.6, ease: "power2.in" }, 0.2);
    });
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      ctx.revert();
      renderer.dispose();
      materialBg.dispose(); materialFg.dispose(); materialWisp.dispose();
      geometry.dispose(); cloudTexture.dispose();
      if (threeCanvasRef.current) threeCanvasRef.current.innerHTML = "";
    };
  }, [showPage]);

  /* ─── LIQUID WAVE MORPH (continuous, independent of scroll) ─────────────── */
  useEffect(() => {
    if (!showPage) return;

    const wavePathA  = "M0,30 Q167,5 333,30 Q500,55 667,30 Q833,5 1000,30";
    const wavePathB  = "M0,30 Q167,55 333,30 Q500,5 667,30 Q833,55 1000,30";
    const wave2PathA = "M0,30 Q200,8 400,30 Q600,52 800,30 Q900,18 1000,30";
    const wave2PathB = "M0,30 Q200,52 400,30 Q600,8 800,30 Q900,42 1000,30";

    const tweens: gsap.core.Tween[] = [];

    if (collabWaveRef.current) {
      tweens.push(
        gsap.to(collabWaveRef.current, {
          attr: { d: wavePathB },
          duration: 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      );
    }
    if (collabWave2Ref.current) {
      tweens.push(
        gsap.to(collabWave2Ref.current, {
          attr: { d: wave2PathB },
          duration: 5.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.2,
        })
      );
    }

    return () => tweens.forEach((t) => t.kill());
  }, [showPage]);

  /* --- DOM GSAP SETUP --- */
  useEffect(() => {
    if (!showPage) return;
    gsap.set(uiWrapperRef.current,    { opacity: 0, y: -20 });

    const ctx = gsap.context(() => {
      gsap.to(uiWrapperRef.current,    { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });

      if (mountainBgRef.current) {
        gsap.fromTo(mountainBgRef.current, { scale: 1.4 }, {
          scale: 1.0, ease: "power2.out",
          scrollTrigger: { trigger: heroSpacerRef.current, start: "top top", end: "bottom top", scrub: 1.8 },
        });
      }

      /* ─── HERO SECTION ENTRANCE ──────────────────────────────────────────── */
      if (heroSectionRef.current) {
        const heroEls = heroSectionRef.current.querySelectorAll(".hero-fade-in");
        gsap.fromTo(heroEls,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: heroSectionRef.current, start: "top 85%" },
          }
        );

        /* Title Morphing Entrance */
        const titleLetters = heroSectionRef.current.querySelectorAll(".hero-title-letter");
        gsap.fromTo(titleLetters,
          { filter: "blur(20px)", scale: 1.5, opacity: 0, y: 50, rotationX: 45 },
          {
            filter: "blur(0px)", scale: 1, opacity: 1, y: 0, rotationX: 0,
            duration: 1.2, stagger: 0.08, ease: "power4.out",
            scrollTrigger: { trigger: heroSectionRef.current, start: "top 80%" }
          }
        );
      }

      if (servicesRef.current) {
        gsap.fromTo(servicesRef.current.children,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: servicesRef.current, start: "top 75%" } }
        );
      }


      /* Tools section animations */
      if (toolsRef.current) {
        const toolsHeader = toolsRef.current.querySelector(".tools-header");
        const toolCards = gsap.utils.toArray(".tool-card-neu") as HTMLElement[];

        if (toolsHeader) {
          gsap.fromTo(toolsHeader,
            { opacity: 0, yPercent: 30 },
            { opacity: 1, yPercent: 0, duration: 1, ease: "power4.out",
              scrollTrigger: { trigger: toolsRef.current, start: "top 80%" } }
          );
        }

        gsap.fromTo(toolCards,
          { opacity: 0, yPercent: 20 },
          { opacity: 1, yPercent: 0, duration: 1.2, stagger: 0.15, ease: "power4.out",
            scrollTrigger: { trigger: toolsRef.current, start: "top 75%" } }
        );
      }

      /* ─── PROJECTS ───────────────────────────────────────────────────────── */
      if (projectsRef.current) {
        gsap.fromTo(".project-card",
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: projectsRef.current, start: "top 75%" } }
        );
      }

      /* ─── COLLAB SECTION ─────────────────────────────────────────────────── */
      if (collabRef.current) {
        // Headline: text splits in from edges
        const headline = collabRef.current.querySelector(".collab-headline");
        if (headline) {
          gsap.fromTo(headline,
            { opacity: 0, y: 60, scale: 0.92 },
            { opacity: 1, y: 0,  scale: 1,    duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: headline, start: "top 82%" } }
          );
        }

        // Panel 1 — slides in from left
        const panel1 = collabRef.current.querySelector(".collab-panel-1");
        if (panel1) {
          gsap.fromTo(panel1,
            { opacity: 0, x: -60, scale: 0.96 },
            { opacity: 1, x: 0,   scale: 1,    duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: panel1, start: "top 80%" } }
          );
          // Subtle continuous liquid morph on the borderRadius
          gsap.to(panel1, {
            borderRadius: "48px 64px 48px 64px / 64px 48px 64px 48px",
            duration: 7,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }

        // Panel 2 — slides in from right
        const panel2 = collabRef.current.querySelector(".collab-panel-2");
        if (panel2) {
          gsap.fromTo(panel2,
            { opacity: 0, x: 60, scale: 0.96 },
            { opacity: 1, x: 0,  scale: 1,    duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: panel2, start: "top 80%" }, delay: 0.1 }
          );
          gsap.to(panel2, {
            borderRadius: "64px 48px 64px 48px / 48px 64px 48px 64px",
            duration: 8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: -3.5,
          });
        }
      }

      /* ─── CTA ────────────────────────────────────────────────────────────── */
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1,   duration: 1, ease: "power3.out", scrollTrigger: { trigger: ctaRef.current, start: "top 85%" } }
        );
      }

      /* ─── FOOTER SUMMIT RISE ────────────────────────────────────────────── */
      if (summitRef.current) {
        gsap.fromTo(summitRef.current,
          { yPercent: 60, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 95%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      /* Footer content stagger */
      if (footerRef.current) {
        const footerEls = footerRef.current.querySelectorAll(".footer-animate");
        gsap.fromTo(footerEls,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 70%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [showPage]);

  /* -------------------------------------------------------------------------- */
  /* STYLE HELPERS                                                              */
  /* -------------------------------------------------------------------------- */
  const neuOuter  = "bg-[#e6eaf0] shadow-[12px_12px_24px_#c8d0e0,-12px_-12px_24px_#ffffff]";
  const neuInner  = "bg-[#e6eaf0] shadow-[inset_6px_6px_12px_#c8d0e0,inset_-6px_-6px_12px_#ffffff]";
  const neuButton = "bg-[#e6eaf0] shadow-[6px_6px_12px_#c8d0e0,-6px_-6px_12px_#ffffff] hover:shadow-[8px_8px_16px_#c8d0e0,-8px_-8px_16px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8d0e0,inset_-4px_-4px_8px_#ffffff] transition-all duration-300 text-fuchsia-600 font-bold uppercase tracking-widest";
  const neuInput  = "w-full bg-[#e6eaf0] shadow-[inset_6px_6px_12px_#c8d0e0,inset_-6px_-6px_12px_#ffffff] rounded-xl px-5 py-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-fuchsia-500/30 transition-all border-none placeholder-gray-400";

  /* ─── Dark glass helpers for sections in the dark gradient zone ────── */
  const darkGlass  = "backdrop-blur-2xl border border-white/[0.08]";
  const darkButton = "backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/40 active:scale-[0.98] transition-all duration-300 text-purple-300 font-bold uppercase tracking-widest";
  const darkInput  = "w-full rounded-xl px-5 py-4 text-sm font-medium text-white/80 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all border border-white/[0.08] placeholder-white/30";

  /* -------------------------------------------------------------------------- */
  /* MORPH PAGE TRANSITION                                                      */
  /* -------------------------------------------------------------------------- */
  const triggerTransition = (href: string, direction: "left" | "right") => {
    if (transitioning) return;
    setTransitioning(true);
    setTransitionLabel(direction === "left" ? "Graphics" : "Video");

    const overlay = transitionOverlayRef.current;
    if (!overlay) { router.push(href); return; }

    const blobs = gsap.utils.toArray(".morph-blob") as HTMLElement[];
    const label = overlay.querySelector(".transition-label");
    const arrow = overlay.querySelector(".transition-arrow");

    // "slide left" → blobs enter from RIGHT;  "slide right" → from LEFT
    const fromX = direction === "left" ? 120 : -120;
    const rotDir = direction === "left" ? 1 : -1;

    gsap.set(overlay, { display: "block", pointerEvents: "all" });

    const tl = gsap.timeline({
      onComplete: () => router.push(href),
    });

    // ── Sweep each blob with squash-stretch + organic border-radius morph ──
    blobs.forEach((blob, i) => {
      gsap.set(blob, {
        xPercent: fromX,
        yPercent: (i % 2 === 0 ? -1 : 1) * 6,
        scaleY: 0.35 + i * 0.08,
        scaleX: 1.6,
        rotation: rotDir * (18 - i * 5),
        borderRadius: "30% 70% 60% 40% / 55% 35% 65% 45%",
        opacity: 0,
      });

      tl.to(blob, {
        xPercent: 0,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        rotation: 0,
        borderRadius: "0%",
        opacity: 1,
        duration: 0.65,
        ease: "back.out(1.4)",
      }, i * 0.09);
    });

    // ── Bouncy directional arrow ──
    if (arrow) {
      gsap.set(arrow, {
        opacity: 0,
        x: rotDir * -80,
        scale: 0.3,
        rotation: rotDir * 40,
      });
      tl.to(arrow, {
        opacity: 1,
        x: 0,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.55)",
      }, 0.28);
    }

    // ── Label pops in ──
    if (label) {
      gsap.set(label, {
        opacity: 0,
        y: 40,
        scale: 0.6,
        rotation: rotDir * 12,
      });
      tl.to(label, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.55,
        ease: "back.out(3)",
      }, 0.38);
    }
  };

  return (
    <>
      {!loaderDone && <TriangleLoader onComplete={handleLoaderComplete} />}
      {loaderDone && <SplashCursor />}

      {/* ── MORPH PAGE-TRANSITION OVERLAY ── */}
      <div
        ref={transitionOverlayRef}
        className="fixed inset-0 z-[250] pointer-events-none"
        style={{ display: "none" }}
      >
        {/* Blob layers — staggered sweep */}
        <div className="morph-blob absolute inset-0" style={{ background: "rgba(192, 132, 252, 0.95)" }} />
        <div className="morph-blob absolute inset-0" style={{ background: "rgba(168, 85, 247, 0.96)" }} />
        <div className="morph-blob absolute inset-0" style={{ background: "rgba(147, 51, 234, 0.97)" }} />
        <div className="morph-blob absolute inset-0" style={{ background: "rgba(124, 58, 237, 1)" }} />

        {/* Centered label + arrow */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none gap-4">
          <div
            className="transition-arrow w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
          <span
            className="transition-label font-black tracking-[0.35em] uppercase text-white/90 select-none"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)", textShadow: "0 4px 30px rgba(124,58,237,0.5)" }}
          >
            {transitionLabel}
          </span>
          <span className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-bold">Navigating</span>
        </div>
      </div>

      <div className={`relative min-h-[300vh] bg-[#e6eaf0] font-sans selection:bg-fuchsia-500/30 ${showPage ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}>

        {/* ── FIXED MOUNTAIN BG ── */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#020104]">
          <div ref={mountainBgRef} className="absolute inset-0 will-change-transform" style={{ backgroundImage: "url('/images/mountain.jpg')", backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat", transform: "scale(1.4)" }} />
          <div className="absolute inset-0 pointer-events-none opacity-60" style={{ background: "linear-gradient(to bottom, rgba(2,1,4,0.3) 0%, transparent 20%, transparent 80%, #e6eaf0 100%)" }} />
        </div>

        {/* ── NAVBAR ── */}
        <div ref={uiWrapperRef} className="fixed top-6 inset-x-0 flex justify-center px-4 z-50 pointer-events-none">
          <div className={`pointer-events-auto w-full max-w-4xl flex items-center justify-between rounded-full px-4 py-3 ${neuOuter}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden relative ${neuInner}`}>
                <img src="/images/icon-logo.png" alt="Prominence" className="w-full h-full object-cover opacity-80" onError={(e) => (e.currentTarget.style.display = "none")} />
                <div className="absolute w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse mix-blend-screen" />
              </div>
              <span className="font-black tracking-[0.2em] uppercase text-[11px] text-gray-800 drop-shadow-sm">Prominence</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase">
              <a href="#services" className="hover:text-fuchsia-500 transition-colors duration-300">Services</a>
              <a href="#team"     className="hover:text-fuchsia-500 transition-colors duration-300">Team</a>
              <a href="#tools"    className="hover:text-fuchsia-500 transition-colors duration-300">Stack</a>
            </div>
            <a href="#collab" className={`px-6 py-2.5 rounded-full text-[10px] ${neuButton}`}>Contact Us</a>
          </div>
        </div>

        {/* ── HERO SPACER & CLOUDS ── */}
        <div ref={heroSpacerRef} className="relative z-10 w-full h-[100vh]" />
        <div ref={cloudTriggerRef} className="relative z-20 w-full h-[40vh] translate-y-[20px] pointer-events-none flex items-center justify-center">
          <div ref={threeCanvasRef} className="absolute inset-0 w-full h-[150vh] -top-[50vh]" style={{ pointerEvents: "none", maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 85%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 85%)" }} />
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* MAIN CONTENT                                                        */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="relative z-30 w-full rounded-t-[3rem] -mt-10 pt-24 pb-32 px-6 sm:px-12" style={{ background: 'linear-gradient(180deg, #e6eaf0 0%, #e6eaf0 15%, #ddd8e8 22%, #c4bbd8 28%, #8b7faa 36%, #5a4e80 43%, #3a3060 50%, #262050 56%, #1e1a3a 62%, #161330 70%, #100e24 80%, #0c0a1a 90%, #0a0814 100%)', overflowX: 'clip' }}>
          {/* Starfield — fades in over the dark gradient zone */}
          <div className="starfield" style={{ top: '0', maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 40%, black 70%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 40%, black 70%)' }} />

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* HERO — CONVERTING LANDING                                          */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <section ref={heroSectionRef} className="relative max-w-6xl mx-auto pt-10 pb-40 overflow-visible">

            {/* ── Soft lavender radial spotlight ── */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(192,132,252,0.10) 0%, rgba(168,85,247,0.04) 40%, transparent 70%)" }} />

            {/* ── Content — centered, high-converting layout ── */}
            <div className="relative z-10 flex flex-col items-center px-4 text-center">

              {/* Overline */}
              <p className="hero-fade-in text-fuchsia-500/60 text-[9px] tracking-[0.5em] uppercase font-black mb-6">
                Isaiah 60 — 61
              </p>

              {/* Headline — large, bold, high-contrast, 3D effect */}
              <h1
                className="mb-5 flex justify-center gap-[2px]"
                style={{
                  fontFamily: "'Astron', sans-serif",
                  fontSize: "clamp(3rem, 9vw, 7rem)",
                  letterSpacing: "0.05em",
                  lineHeight: 0.95,
                  color: "#1a1a2e",
                  perspective: "1000px"
                }}
              >
                {"PROMINENCE".split("").map((letter, i) => (
                  <span
                    key={i}
                    className="hero-title-letter"
                    style={{
                      display: "inline-block",
                      willChange: "transform, filter, opacity",
                      textShadow: "1px 1px 0 #d8b4fe, 2px 2px 0 #c084fc, 3px 3px 0 #a855f7, 4px 4px 0 #9333ea, 0 10px 20px rgba(147,51,234,0.4)"
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </h1>

              {/* Sub-headline — clear hierarchy */}
              <p className="hero-fade-in text-gray-600 text-xs md:text-sm tracking-[0.35em] uppercase font-bold mb-10">
                Virtual Assistance &nbsp;·&nbsp; Creative Studio &nbsp;·&nbsp; Digital Agency
              </p>

              {/* Decorative accent line */}
              <div className="hero-fade-in flex items-center gap-4 mb-10">
                <div className="w-20 h-px bg-gradient-to-r from-transparent to-fuchsia-400/40" />
                <div className="w-2 h-2 rounded-full bg-fuchsia-500/30 shadow-[0_0_8px_rgba(147,51,234,0.2)]" />
                <div className="w-20 h-px bg-gradient-to-l from-transparent to-fuchsia-400/40" />
              </div>

              {/* Description */}
              <p className="hero-fade-in text-gray-500 text-sm md:text-base leading-[2] font-medium max-w-xl mb-12" style={{ textWrap: "pretty" }}>
                Helping businesses rise, shine, and bring their vision into prominence. Built on faith, driven by purpose.
              </p>

              {/* CTA Button — prominent, deep purple */}
              <a
                href="#collab"
                className="hero-fade-in group relative inline-flex items-center gap-3 px-10 py-4 rounded-full text-white font-bold text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:scale-105 hover:shadow-[0_8px_40px_rgba(147,51,234,0.4)]"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #9333ea, #a855f7)",
                  boxShadow: "0 6px 30px rgba(147,51,234,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                  filter: "drop-shadow(0 4px 20px rgba(147,51,234,0.25))",
                }}
              >
                <span>Work With Us</span>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </span>
              </a>

              {/* Trust line */}
              <p className="hero-fade-in text-gray-400/50 text-[9px] tracking-[0.3em] uppercase font-medium mt-6">
                Trusted by brands worldwide
              </p>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#e6eaf0] to-transparent pointer-events-none" />
          </section>

          {/* ── SERVICES ── */}
          <section id="services" className="max-w-6xl mx-auto pt-10 pb-32">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-gray-800 mb-6 drop-shadow-sm">The Ascent</h2>
              <div className="w-px h-16 bg-gradient-to-b from-fuchsia-500 to-transparent mx-auto" />
            </div>
            <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: "Web Architecture", desc: "Forging highly optimized, scalable Next.js environments tailored for performance and aesthetics." },
                { title: "Cinematic Edits",  desc: "Transforming raw footage into premium, narrative-driven experiences that capture attention instantly." },
                { title: "Brand Identity",   desc: "Crafting visually striking graphic design systems using industry-standard tools to solidify your presence." },
              ].map((service, i) => (
                <div key={i} className={`p-10 rounded-[2rem] transition-all duration-500 group relative overflow-hidden ${neuOuter}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10 ${neuInner}`}>
                    <div className="w-4 h-4 bg-fuchsia-500 rounded-sm rotate-45 shadow-[0_0_10px_rgba(217,70,239,0.3)]" />
                  </div>
                  <h3 className="text-fuchsia-600 font-bold tracking-widest text-[11px] uppercase mb-4 relative z-10">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-loose relative z-10 font-medium">{service.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── TEAM ── */}
          <section id="team" className="max-w-6xl mx-auto py-32 border-t border-gray-300/30" ref={teamRef}>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-gray-800 mb-6 text-center drop-shadow-sm">The Engine</h2>
            <p className="text-gray-400 text-xs tracking-[0.25em] uppercase font-medium text-center mb-16">Drag or scroll to explore the team</p>

            {/* ── Circular Gallery — all team members including CEO ── */}
            <div className="relative w-full mb-12 overflow-hidden" style={{ height: 'clamp(400px, 55vh, 650px)', maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)' }}>

              <CircularGallery
                items={teamGalleryItems}
                bend={3}
                textColor="#a855f7"
                borderRadius={0.05}
                font="bold 16px sans-serif"
                scrollSpeed={2}
                scrollEase={0.03}
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* TOOLS — DARK NEUMORPHIC ECOSYSTEM                                 */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <section id="tools" className="relative py-32 px-4 sm:px-12" ref={toolsRef}>
            {/* Section header */}
            <div className="tools-header text-center mb-16 relative z-10">
              <p className="text-purple-400/50 text-[9px] tracking-[0.4em] uppercase font-black mb-5">Our Arsenal</p>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.08em] text-white/90 mb-5" style={{ textShadow: '0 0 40px rgba(147,51,234,0.25)' }}>Ecosystem</h2>
              <p className="text-white/30 text-xs tracking-[0.2em] uppercase font-medium">The tools that forge our systems.</p>
            </div>

            {/* ── ScrollVelocity marquee bands ── */}
            <div className="relative z-10 mb-20 overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
              <ScrollVelocity
                texts={[
                  'Next.js · VS Code · Firebase · Vercel · CapCut · Premiere · DaVinci',
                  'Canva · Photoshop · Illustrator · Figma · After Effects · ',
                ]}
                velocity={40}
                className="tool-velocity-text"
                numCopies={4}
                damping={50}
                stiffness={400}
                parallaxClassName="tool-parallax"
                scrollerClassName="tool-scroller"
              />
            </div>

            {/* ── Individual floating tool cards ── */}
            <div className="max-w-6xl mx-auto relative z-10 px-4">
              <MagicBento
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
                spotlightRadius={300}
                particleCount={12}
                glowColor="147, 51, 234"
                cards={[
                  // Engineering
                  { title: 'Next.js', label: 'Engineering', icon: <Box size={24} color="#ffffff" />, color: '#161330', glowColor: '255, 255, 255' },
                  { title: 'VS Code', label: 'Engineering', icon: <Code size={24} color="#007ACC" />, color: '#161330', glowColor: '0, 122, 204' },
                  { title: 'Firebase', label: 'Engineering', icon: <Flame size={24} color="#FFA000" />, color: '#161330', glowColor: '255, 160, 0' },
                  { title: 'Vercel', label: 'Engineering', icon: <Triangle size={24} color="#cccccc" fill="#cccccc" />, color: '#161330', glowColor: '204, 204, 204' },
                  
                  // Post-Production
                  { title: 'CapCut', label: 'Post-Production', icon: <Scissors size={24} color="#a855f7" />, color: '#161330', glowColor: '168, 85, 247' },
                  { title: 'Adobe Premiere', label: 'Post-Production', icon: <Video size={24} color="#9999FF" />, color: '#161330', glowColor: '153, 153, 255' },
                  { title: 'DaVinci Resolve', label: 'Post-Production', icon: <Film size={24} color="#2dd4bf" />, color: '#161330', glowColor: '45, 212, 191' },
                  
                  // Graphics
                  { title: 'Canva', label: 'Graphics', icon: <Paintbrush size={24} color="#00C4CC" />, color: '#161330', glowColor: '0, 196, 204' },
                  { title: 'Photoshop', label: 'Graphics', icon: <ImageIcon size={24} color="#31A8FF" />, color: '#161330', glowColor: '49, 168, 255' },
                  { title: 'Illustrator', label: 'Graphics', icon: <PenTool size={24} color="#FF9A00" />, color: '#161330', glowColor: '255, 154, 0' }
                ]}
              />
            </div>
          </section>

          {/* ── PROJECTS ── */}
          <section id="projects" className="max-w-6xl mx-auto py-32 border-t border-white/[0.06]">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-white/90 mb-20 text-center" style={{ textShadow: '0 0 30px rgba(147,51,234,0.2)' }}>Selected Work</h2>
            <div ref={projectsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="project-card h-80 rounded-[2rem] flex flex-col items-center justify-center group cursor-pointer overflow-hidden relative" style={{ background: 'rgba(15, 10, 35, 0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(147,51,234,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
                  <div className="absolute inset-6 rounded-[1.5rem] transition-transform duration-500" style={{ background: 'rgba(147,51,234,0.04)', border: '1px solid rgba(147,51,234,0.06)' }} />
                  <p className="text-white/40 font-bold tracking-widest uppercase text-sm z-10">Project 0{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/*  COLLAB CTA  —  LET'S WORK TOGETHER  (LIQUID MORPH)              */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <section
            id="collab"
            ref={collabRef}
            className="max-w-6xl mx-auto py-32 border-t border-white/[0.06] px-4"
          >
            {/* Headline */}
            <div className="collab-headline text-center mb-16 select-none">
              <p className="text-fuchsia-500 text-[9px] tracking-[0.5em] uppercase font-black mb-6">Ready to Collaborate</p>
              <h2
                className="font-black uppercase leading-[0.82] text-white/90"
                style={{ fontSize: "clamp(3.2rem, 9vw, 7.5rem)", letterSpacing: "-0.025em" }}
              >
                Let's Work
                <br />
                <span style={{ WebkitTextStroke: "2px #9333ea", color: "transparent" }}>
                  Together
                </span>
              </h2>
            </div>

            {/* ─── Panel 1: Graphics Design ─────────────────────────────────── */}
            <div
              className="collab-panel-1 relative overflow-hidden"
              style={{
                borderRadius: "40px",
                background: 'rgba(15, 10, 35, 0.6)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(147,51,234,0.12)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 60px rgba(147,51,234,0.05), inset 0 1px 0 rgba(255,255,255,0.04)',
                minHeight: "260px",
              }}
            >
              {/* Decorative floating orb accent */}
              <div
                className="absolute -right-16 -top-16 w-72 h-72 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 70%)', opacity: 0.6 }}
              />
              <div
                className="absolute -right-8 -top-8 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', opacity: 0.4 }}
              />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 p-12 md:p-16">
                <div>
                  <p className="text-fuchsia-400 text-[9px] tracking-[0.45em] uppercase font-black mb-5">
                    01 / Creative Direction
                  </p>
                  <h3
                    className="font-black uppercase text-white/90 leading-none"
                    style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", letterSpacing: "-0.02em" }}
                  >
                    Graphics
                    <br />
                    Design
                  </h3>
                  <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase mt-4 font-semibold">
                    Branding · Identity · Print · Digital
                  </p>
                </div>

                {/* CTA Button — positioned right */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <button
                    onClick={() => triggerTransition("/graphics", "left")}
                    className={`group/btn flex items-center gap-4 px-10 py-5 rounded-full text-sm cursor-pointer ${darkButton}`}
                    style={{ background: 'rgba(147,51,234,0.12)', boxShadow: '0 0 20px rgba(147,51,234,0.1)' }}
                  >
                    <span>Start a Project</span>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center bg-fuchsia-500 text-white text-xs shadow-[0_0_12px_rgba(168,85,247,0.5)] group-hover/btn:shadow-[0_0_20px_rgba(168,85,247,0.7)] transition-shadow duration-300">
                      →
                    </span>
                  </button>
                  <span className="text-white/25 text-[9px] tracking-widest uppercase font-medium">
                    Response within 24h
                  </span>
                </div>
              </div>
            </div>

            {/* ─── Liquid Wave Divider ─────────────────────────────────────── */}
            <div className="relative w-full h-14 overflow-visible -my-1 z-10 pointer-events-none">
              <svg
                viewBox="0 0 1000 56"
                preserveAspectRatio="none"
                className="w-full h-full"
                style={{ overflow: "visible" }}
              >
                {/* Shadow layer — slightly thicker, offset */}
                <path
                  ref={collabWave2Ref}
                  d="M0,28 Q200,8 400,28 Q600,48 800,28 Q900,18 1000,28"
                  fill="none"
                  stroke="rgba(168,85,247,0.12)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Main morphing wave */}
                <path
                  ref={collabWaveRef}
                  d="M0,28 Q167,5 333,28 Q500,51 667,28 Q833,5 1000,28"
                  fill="none"
                  stroke="rgba(168,85,247,0.35)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Highlight specular */}
                <path
                  d="M0,28 Q250,14 500,28 Q750,42 1000,28"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* ─── Panel 2: Video Editing ────────────────────────────────────── */}
            <div
              className="collab-panel-2 relative overflow-hidden"
              style={{
                borderRadius: "40px",
                background: 'rgba(15, 10, 35, 0.6)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(168,85,247,0.12)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 60px rgba(168,85,247,0.05), inset 0 1px 0 rgba(255,255,255,0.04)',
                minHeight: "260px",
              }}
            >
              {/* Decorative orb accent — mirrored, bottom-left */}
              <div
                className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', opacity: 0.6 }}
              />
              <div
                className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 70%)', opacity: 0.4 }}
              />

              <div className="relative z-10 flex flex-col md:flex-row-reverse items-center justify-between gap-10 p-12 md:p-16">
                <div className="text-right">
                  <p className="text-fuchsia-400 text-[9px] tracking-[0.45em] uppercase font-black mb-5">
                    02 / Post-Production
                  </p>
                  <h3
                    className="font-black uppercase text-white/90 leading-none"
                    style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", letterSpacing: "-0.02em" }}
                  >
                    Video
                    <br />
                    Editing
                  </h3>
                  <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase mt-4 font-semibold">
                    Reels · Shorts · Films · Motion
                  </p>
                </div>

                {/* CTA Button — positioned left (row-reversed) */}
                <div className="flex flex-col items-start gap-3 shrink-0">
                  <button
                    onClick={() => triggerTransition("/video", "right")}
                    className={`group/btn flex items-center gap-4 px-10 py-5 rounded-full text-sm cursor-pointer ${darkButton}`}
                    style={{ background: 'rgba(168,85,247,0.12)', boxShadow: '0 0 20px rgba(168,85,247,0.1)' }}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center bg-fuchsia-500 text-white text-xs shadow-[0_0_12px_rgba(168,85,247,0.5)] group-hover/btn:shadow-[0_0_20px_rgba(168,85,247,0.7)] transition-shadow duration-300"
                    >
                      →
                    </span>
                    <span>Start a Project</span>
                  </button>
                  <span className="text-white/25 text-[9px] tracking-widest uppercase font-medium">
                    Response within 24h
                  </span>
                </div>
              </div>
            </div>

          </section>

          {/* ── CONTACT FORM — HYBRID SUPPORT PORTAL ── */}
          <section id="cta" className="max-w-4xl mx-auto py-32 my-10 px-4" ref={ctaRef}>
            <div className="rounded-[3rem] p-10 md:p-20 relative overflow-hidden" style={{ background: 'rgba(15, 10, 35, 0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(147,51,234,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)' }}>

              {/* Live status pulse */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span className="text-[9px] tracking-[0.3em] uppercase text-emerald-400/70 font-bold">Secure Channel Active</span>
              </div>

              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-[0.1em] text-white/90 mb-4" style={{ textShadow: '0 0 30px rgba(147,51,234,0.2)' }}>Communicate</h2>
                <p className="text-white/40 text-sm md:text-base leading-relaxed tracking-wide font-medium max-w-lg mx-auto">
                  Initialize a secure channel. Your message is stored, delivered via email, and appears in our command center in realtime.
                </p>
              </div>

              {/* Delivery status indicator */}
              {submitStatus !== "idle" && (
                <div className="max-w-xl mx-auto mb-8">
                  <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'rgba(10, 8, 20, 0.6)', border: '1px solid rgba(147,51,234,0.08)' }}>
                    {/* Progress steps */}
                    <div className="flex items-center justify-between mb-4">
                      {[
                        { key: "sending",   label: "Encrypting",  active: ["sending","delivered","received"].includes(submitStatus) },
                        { key: "delivered", label: "Delivered",    active: ["delivered","received"].includes(submitStatus) },
                        { key: "received",  label: "Confirmed",   active: submitStatus === "received" },
                      ].map((step, i) => (
                        <div key={step.key} className="flex items-center gap-2 flex-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${
                            step.active
                              ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                              : 'bg-white/[0.05] text-white/20 border border-white/[0.08]'
                          }`}>
                            {step.active ? (
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : i + 1}
                          </div>
                          <span className={`text-[9px] tracking-[0.15em] uppercase font-bold transition-colors duration-500 ${step.active ? 'text-purple-300' : 'text-white/20'}`}>{step.label}</span>
                          {i < 2 && <div className={`flex-1 h-px mx-2 transition-colors duration-500 ${step.active ? 'bg-purple-500/30' : 'bg-white/[0.05]'}`} />}
                        </div>
                      ))}
                    </div>

                    {/* Status message */}
                    <div className="text-center">
                      {submitStatus === "sending" && (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-4 h-4 border-2 border-purple-400/40 border-t-purple-400 rounded-full animate-spin" />
                          <span className="text-purple-300/80 text-xs tracking-widest uppercase font-bold">Transmitting payload...</span>
                        </div>
                      )}
                      {submitStatus === "delivered" && (
                        <p className="text-emerald-400 text-xs tracking-widest uppercase font-bold">✓ Message delivered to Prominence</p>
                      )}
                      {submitStatus === "received" && (
                        <p className="text-emerald-400 text-xs tracking-widest uppercase font-bold">✓✓ Confirmed — Your message is in our inbox</p>
                      )}
                      {submitStatus === "error" && (
                        <p className="text-red-400 text-xs tracking-widest uppercase font-bold">✕ {submitError || "Transmission failed"}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="max-w-xl mx-auto space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative">
                    <label className="block text-[9px] tracking-[0.25em] uppercase text-white/30 font-bold mb-2 ml-1">Identification</label>
                    <input type="text" required placeholder="Your name" className={darkInput} style={{ background: 'rgba(147,51,234,0.06)' }} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={submitStatus === "sending"} />
                  </div>
                  <div className="relative">
                    <label className="block text-[9px] tracking-[0.25em] uppercase text-white/30 font-bold mb-2 ml-1">Protocol</label>
                    <input type="email" required placeholder="your@email.com" className={darkInput} style={{ background: 'rgba(147,51,234,0.06)' }} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={submitStatus === "sending"} />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-[9px] tracking-[0.25em] uppercase text-white/30 font-bold mb-2 ml-1">Payload</label>
                  <textarea required placeholder="Describe your project or message..." rows={5} className={`${darkInput} resize-none`} style={{ background: 'rgba(147,51,234,0.06)' }} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} disabled={submitStatus === "sending"} />
                </div>
                <div className="flex flex-col items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitStatus === "sending" || submitStatus === "delivered" || submitStatus === "received"}
                    className={`group px-12 py-4 rounded-full ${darkButton} ${submitStatus === "sending" ? "opacity-50 cursor-wait" : ""} ${["delivered","received"].includes(submitStatus) ? "opacity-40 pointer-events-none" : ""}`}
                    style={{ background: 'rgba(147,51,234,0.15)', boxShadow: '0 0 20px rgba(147,51,234,0.1)' }}
                  >
                    {submitStatus === "sending" ? (
                      <span className="flex items-center gap-3">
                        <span className="w-4 h-4 border-2 border-purple-300/40 border-t-purple-300 rounded-full animate-spin" />
                        Transmitting...
                      </span>
                    ) : submitStatus === "delivered" || submitStatus === "received" ? (
                      "Transmission Complete"
                    ) : (
                      "Initiate Contact"
                    )}
                  </button>
                  <span className="text-white/15 text-[9px] tracking-widest uppercase font-medium">End-to-end encrypted · Realtime delivery</span>
                </div>
              </form>
            </div>
          </section>

        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* FOOTER — SUMMIT SILHOUETTE                                        */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <footer ref={footerRef} className="relative z-30 overflow-hidden" style={{ background: '#0a0814' }}>

          {/* ── Summit Silhouette SVG — rises on scroll ── */}
          <svg
            ref={summitRef}
            className="w-full h-auto block"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{ marginBottom: "-4px" }}
          >
            <defs>
              <linearGradient id="summitGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="summitGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9333ea" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0f0f1a" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="summitGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.06" />
                <stop offset="60%" stopColor="#1a1a2e" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0a0a14" />
              </linearGradient>
              <linearGradient id="summitSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a0814" />
                <stop offset="40%" stopColor="#0d0b1a" />
                <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <style>
              {`
                @keyframes pan-clouds {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-1440px); }
                }
                .cloud-layer {
                  animation: pan-clouds 80s linear infinite;
                }
              `}
            </style>
            {/* Sky gradient backdrop */}
            <rect width="1440" height="320" fill="url(#summitSky)" />

            {/* Low-poly clouds layer (duplicated for seamless loop) */}
            <g className="cloud-layer" fill="rgba(255, 255, 255, 0.04)">
              <path d="M50,220 L100,180 L150,200 L200,170 L250,210 L300,180 L350,230 Z" />
              <path d="M400,240 L450,190 L500,210 L550,180 L600,240 Z" />
              <path d="M700,220 L750,170 L800,200 L850,180 L900,230 Z" />
              <path d="M1000,250 L1050,210 L1100,230 L1150,190 L1200,250 Z" />
              <path d="M1300,230 L1340,180 L1380,210 L1420,170 L1460,230 Z" />
              
              <path d="M1490,220 L1540,180 L1590,200 L1640,170 L1690,210 L1740,180 L1790,230 Z" />
              <path d="M1840,240 L1890,190 L1940,210 L1990,180 L2040,240 Z" />
              <path d="M2140,220 L2190,170 L2240,200 L2290,180 L2340,230 Z" />
              <path d="M2440,250 L2490,210 L2540,230 L2590,190 L2640,250 Z" />
              <path d="M2740,230 L2780,180 L2820,210 L2860,170 L2900,230 Z" />
            </g>

            {/* Far range — subtle, misty */}
            <path
              d="M0,280 L80,240 L160,255 L240,210 L320,230 L400,185 L480,200 L560,160 L640,175 L680,140 L720,120 L760,140 L800,165 L880,190 L960,170 L1040,195 L1120,175 L1200,200 L1280,185 L1360,210 L1440,195 L1440,320 L0,320 Z"
              fill="url(#summitGrad2)"
              opacity="0.5"
            />
            {/* Mid range — defined peaks */}
            <path
              d="M0,290 L60,270 L120,280 L200,245 L280,260 L340,220 L420,235 L480,195 L540,210 L600,175 L660,155 L720,100 L780,155 L820,180 L880,200 L940,185 L1000,210 L1060,195 L1120,215 L1180,200 L1240,225 L1320,210 L1380,230 L1440,220 L1440,320 L0,320 Z"
              fill="url(#summitGrad1)"
              opacity="0.75"
            />
            {/* Foreground range — sharp, dark */}
            <path
              d="M0,300 L40,290 L100,295 L160,275 L220,285 L280,260 L340,270 L400,245 L440,255 L500,230 L560,240 L620,215 L680,195 L720,160 L760,195 L800,220 L840,235 L900,250 L960,240 L1020,255 L1060,245 L1120,260 L1180,250 L1240,265 L1300,255 L1360,270 L1400,260 L1440,265 L1440,320 L0,320 Z"
              fill="url(#summitGrad3)"
            />
            {/* Snow caps accent */}
            <path
              d="M700,170 L720,100 L740,170"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M710,140 L720,100 L730,140"
              fill="rgba(255,255,255,0.08)"
            />
          </svg>

          {/* ── Footer Content ── */}
          <div style={{ background: "linear-gradient(to bottom, #0a0a14, #0d0d1a 40%, #111126)" }} className="relative">

            <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 pt-16 pb-10">

              {/* ── Top row: Brand + Contact ── */}
              <div className="footer-animate flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 mb-16">

                {/* Brand block */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center relative" style={{ background: "rgba(147,51,234,0.12)", boxShadow: "0 0 30px rgba(147,51,234,0.15), inset 0 1px 1px rgba(255,255,255,0.05)" }}>
                    <img
                      src="/images/icon-logo.png"
                      alt="Prominence"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                  <div>
                    <h4 className="font-black tracking-[0.25em] uppercase text-white/90 text-sm">Prominence</h4>
                    <p className="text-[9px] tracking-[0.3em] uppercase text-purple-400/60 font-semibold mt-0.5">Virtual Assistance</p>
                  </div>
                </div>

                {/* Contact info — display only */}
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
              </div>

              {/* ── Divider ── */}
              <div className="footer-animate w-full h-px mb-10" style={{ background: "linear-gradient(to right, transparent, rgba(147,51,234,0.25), rgba(255,255,255,0.06), rgba(147,51,234,0.25), transparent)" }} />

              {/* ── Middle row: Quick links + Status ── */}
              <div className="footer-animate flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
                {/* Quick links */}
                <nav className="flex flex-wrap items-center gap-6 text-[9px] tracking-[0.25em] uppercase font-bold">
                  {["Services", "Team", "Stack", "Projects", "Contact"].map((link) => (
                    <a
                      key={link}
                      href={`#${link === "Stack" ? "tools" : (link === "Contact" || link === "Services") ? "collab" : link.toLowerCase()}`}
                      className="p-3 -m-3 text-white/30 hover:text-purple-400 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  ))}
                </nav>

                {/* Status indicator */}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)] animate-pulse" />
                  <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 font-bold">Systems Operational</span>
                </div>
              </div>

              {/* ── Bottom row: Copyright + Location ── */}
              <div className="footer-animate flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] tracking-[0.3em] uppercase text-white/20 font-medium">
                <p>© {new Date().getFullYear()} Prominence. All operational rights reserved.</p>
                <div className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-purple-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Olongapo City, 2200</span>
                </div>
              </div>

            </div>

            {/* ── Bottom glow accent ── */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] pointer-events-none"
              style={{ background: "linear-gradient(to right, transparent, rgba(147,51,234,0.4), transparent)" }}
            />
          </div>
        </footer>
      </div>
    </>
  );
}