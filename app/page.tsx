"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

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
    about:
      "Visionary leader driving innovation and pushing the boundaries of digital architecture. Orchestrating the intersection of design and robust engineering to build systems that scale.",
  },
  members: [
    { name: "Vinz Iligan",       role: "Lead Engineer",    about: "Architecting scalable backend systems and ensuring seamless data pipelines." },
    { name: "Julian Tolentino",  role: "Frontend Wizard",  about: "Crafting pixel-perfect, interactive user interfaces with modern frameworks." },
    { name: "Giervan Sabalbero", role: "Fullstack Dev",    about: "Bridging the gap between intuitive frontends and powerful server logic." },
    { name: "Andrea Turalba",    role: "UI/UX Dev",        about: "Translating complex user journeys into elegant, accessible web experiences." },
    { name: "Gian Cruz",         role: "Senior Editor",    about: "Transforming raw concepts into cinematic, narrative-driven visual stories." },
    { name: "Russel Minimo",     role: "Motion Graphics",  about: "Breathing life into static assets through fluid motion and dynamic effects." },
  ],
};

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
  const [submitStatus, setSubmitStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

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
    setSubmitStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitStatus("idle"), 4000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 4000);
      }
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 4000);
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
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: heroSectionRef.current, start: "top 80%" },
          }
        );

        /* Backdrop logo gentle float */
        const bdLogo = heroSectionRef.current.querySelector(".hero-backdrop-logo");
        if (bdLogo) {
          // Logo movement removed - now steady
        }

        /* Orbital ring spin */
        const rings = heroSectionRef.current.querySelectorAll(".orbital-ring");
        rings.forEach((ring, i) => {
          gsap.to(ring, { rotation: 360, duration: 20 + i * 8, ease: "none", repeat: -1, transformOrigin: "center center" });
        });

        /* Low-poly flowers grow upward */
        const flowers = heroSectionRef.current.querySelectorAll(".flower-stem");
        gsap.fromTo(flowers,
          { scaleY: 0, transformOrigin: "bottom center" },
          {
            scaleY: 1, duration: 1.6, stagger: 0.12, ease: "elastic.out(1, 0.4)",
            scrollTrigger: { trigger: heroSectionRef.current, start: "top 70%" },
          }
        );

        /* Floating particles drift */
        const particles = heroSectionRef.current.querySelectorAll(".hero-particle");
        particles.forEach((p, i) => {
          gsap.to(p, { y: -30 - i * 10, x: (i % 2 === 0 ? 15 : -15), duration: 3 + i * 0.8, ease: "sine.inOut", repeat: -1, yoyo: true });
        });
      }

      if (servicesRef.current) {
        gsap.fromTo(servicesRef.current.children,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: servicesRef.current, start: "top 75%" } }
        );
      }

      /* ─── TEAM MORPH CARDS ───────────────────────────────────────────────── */
      const teamCards = gsap.utils.toArray(".team-card") as HTMLElement[];
      teamCards.forEach((card) => {
        const content = card.querySelector(".team-content");
        const img     = card.querySelector(".team-img");
        const bio     = card.querySelector(".team-bio");
        gsap.set(card,    { width: "120px", height: "120px", borderRadius: "50%" });
        gsap.set(content, { opacity: 0, y: 20 });
        gsap.set(bio,     { opacity: 0, height: 0 });
        gsap.set(img,     { scale: 1.2 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none reverse" } });
        tl.to(card,    { width: "100%", height: "360px", borderRadius: "24px", duration: 0.8, ease: "power3.inOut" })
          .to(img,     { scale: 1,   duration: 0.8, ease: "power3.inOut" }, "<")
          .to(content, { opacity: 1, y: 0,          duration: 0.4, ease: "power2.out"  }, "-=0.3")
          .to(bio,     { opacity: 1, height: "auto", duration: 0.4, ease: "power2.out" }, "-=0.2");
      });

      /* ─── 3D REVOLVING CARD STACK for TOOLS ────────────────────────────────── */
      if (toolsRef.current) {
        const cards3d = gsap.utils.toArray(".tool-card-3d") as HTMLElement[];
        const toolsHeader = toolsRef.current.querySelector(".tools-header");

        // Set initial states — cards are behind the camera, rotated, invisible
        gsap.set(toolsHeader, { opacity: 0, y: 50 });
        cards3d.forEach((card, i) => {
          gsap.set(card, {
            z: -900 - i * 350,
            rotateX: 18 + i * 6,
            rotateY: (i - 1) * 25,
            opacity: 0,
            scale: 0.45,
            transformPerspective: 1200,
          });
        });

        const toolsTl = gsap.timeline({
          scrollTrigger: {
            trigger: toolsRef.current,
            start: "top top",
            end: "+=2800",
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
          },
        });

        // Header fades in first
        toolsTl.to(toolsHeader, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0);

        // Cards fly in one-by-one with staggered timing
        cards3d.forEach((card, i) => {
          const start = 0.12 + i * 0.3;
          toolsTl.to(card, {
            z: 0,
            rotateX: 0,
            rotateY: 0,
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "power2.out",
          }, start);
        });
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
          <div className="starfield" style={{ top: '30%', maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)' }} />

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* HERO — OUR STORY                                                 */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <section ref={heroSectionRef} className="relative max-w-6xl mx-auto pt-10 pb-40 overflow-visible">

            {/* ── Backdrop Logo — large, low-opacity, offset left ── */}
            <div className="hero-backdrop-logo absolute pointer-events-none select-none" style={{ top: "-12%", left: "-15%", width: "clamp(600px, 90vw, 1000px)", height: "clamp(600px, 90vw, 1000px)", opacity: 0.156, zIndex: 0 }}>
              {/* Radial glow behind logo */}
              <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(147,51,234,0.06) 0%, rgba(236,72,153,0.03) 40%, transparent 70%)", transform: "scale(1.3)" }} />
              <img src="/images/main-bg.png" alt="" className="w-full h-full object-contain relative z-10" style={{ filter: "grayscale(0.2)" }} />
              {/* Orbital rings around logo */}
              <svg className="orbital-ring absolute inset-0 w-full h-full" viewBox="0 0 200 200" fill="none" style={{ transform: "scale(1.15)" }}>
                <ellipse cx="100" cy="100" rx="95" ry="95" stroke="rgba(147,51,234,0.35)" strokeWidth="1.2" strokeDasharray="8 6" />
                <circle cx="100" cy="5" r="2.5" fill="rgba(147,51,234,0.5)" />
              </svg>
              <svg className="orbital-ring absolute inset-0 w-full h-full" viewBox="0 0 200 200" fill="none" style={{ transform: "rotate(60deg) scale(1.05)" }}>
                <ellipse cx="100" cy="100" rx="82" ry="82" stroke="rgba(236,72,153,0.3)" strokeWidth="1" strokeDasharray="5 10" />
                <circle cx="182" cy="100" r="2" fill="rgba(236,72,153,0.45)" />
              </svg>
              <svg className="orbital-ring absolute inset-0 w-full h-full" viewBox="0 0 200 200" fill="none" style={{ transform: "rotate(-30deg) scale(1.25)" }}>
                <ellipse cx="100" cy="100" rx="98" ry="98" stroke="rgba(168,85,247,0.15)" strokeWidth="0.8" strokeDasharray="3 14" />
              </svg>
            </div>

            {/* ── Floating decorative particles ── */}
            <div className="hero-particle absolute w-1.5 h-1.5 rounded-full bg-fuchsia-400/20 pointer-events-none" style={{ top: "15%", left: "20%" }} />
            <div className="hero-particle absolute w-1 h-1 rounded-full bg-purple-400/25 pointer-events-none" style={{ top: "35%", left: "8%" }} />
            <div className="hero-particle absolute w-2 h-2 rounded-full bg-fuchsia-300/15 pointer-events-none" style={{ top: "60%", left: "15%" }} />
            <div className="hero-particle absolute w-1 h-1 rounded-full bg-purple-500/20 pointer-events-none" style={{ top: "25%", right: "12%" }} />
            <div className="hero-particle absolute w-1.5 h-1.5 rounded-full bg-pink-400/15 pointer-events-none" style={{ top: "70%", right: "8%" }} />

            {/* ── Low-poly Flowers — LEFT ── */}
            <div className="absolute left-0 bottom-0 w-32 md:w-48 h-full pointer-events-none select-none" style={{ transform: "translateX(-30%)" }}>
              <svg className="flower-stem absolute bottom-8 left-4" width="40" height="180" viewBox="0 0 40 180" fill="none">
                <path d="M20,180 L20,60 L15,50 L20,35 L25,50 L20,60" stroke="rgba(34,197,94,0.35)" strokeWidth="2" fill="none" />
                <polygon points="20,35 12,15 20,0 28,15" fill="rgba(168,85,247,0.2)" />
                <polygon points="20,25 14,10 20,0 26,10" fill="rgba(192,132,252,0.25)" />
                <path d="M20,80 L8,65" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5" />
                <polygon points="8,65 0,55 8,50 12,60" fill="rgba(34,197,94,0.15)" />
                <path d="M20,110 L32,95" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5" />
                <polygon points="32,95 40,85 32,80 28,90" fill="rgba(34,197,94,0.15)" />
              </svg>
              <svg className="flower-stem absolute bottom-4 left-16" width="35" height="140" viewBox="0 0 35 140" fill="none">
                <path d="M17,140 L17,50 L12,40 L17,25 L22,40 L17,50" stroke="rgba(34,197,94,0.3)" strokeWidth="1.5" fill="none" />
                <polygon points="17,25 10,8 17,0 24,8" fill="rgba(236,72,153,0.18)" />
                <polygon points="17,18 12,6 17,0 22,6" fill="rgba(244,114,182,0.22)" />
                <path d="M17,70 L7,58" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
                <polygon points="7,58 0,50 7,46 10,54" fill="rgba(34,197,94,0.12)" />
              </svg>
              <svg className="flower-stem absolute bottom-12 left-8" width="30" height="100" viewBox="0 0 30 100" fill="none">
                <path d="M15,100 L15,35 L11,28 L15,18 L19,28 L15,35" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5" fill="none" />
                <polygon points="15,18 9,5 15,0 21,5" fill="rgba(147,51,234,0.15)" />
                <path d="M15,60 L25,50" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
                <polygon points="25,50 30,42 24,38 22,46" fill="rgba(34,197,94,0.1)" />
              </svg>
            </div>

            {/* ── Low-poly Flowers — RIGHT ── */}
            <div className="absolute right-0 bottom-0 w-32 md:w-48 h-full pointer-events-none select-none" style={{ transform: "translateX(30%)" }}>
              <svg className="flower-stem absolute bottom-6 right-6" width="40" height="160" viewBox="0 0 40 160" fill="none">
                <path d="M20,160 L20,55 L15,45 L20,30 L25,45 L20,55" stroke="rgba(34,197,94,0.35)" strokeWidth="2" fill="none" />
                <polygon points="20,30 12,12 20,0 28,12" fill="rgba(244,114,182,0.2)" />
                <polygon points="20,22 14,8 20,0 26,8" fill="rgba(236,72,153,0.25)" />
                <path d="M20,85 L30,72" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5" />
                <polygon points="30,72 38,62 30,58 26,68" fill="rgba(34,197,94,0.15)" />
                <path d="M20,115 L10,100" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5" />
                <polygon points="10,100 2,90 10,86 14,96" fill="rgba(34,197,94,0.15)" />
              </svg>
              <svg className="flower-stem absolute bottom-10 right-16" width="35" height="130" viewBox="0 0 35 130" fill="none">
                <path d="M17,130 L17,45 L12,36 L17,22 L22,36 L17,45" stroke="rgba(34,197,94,0.3)" strokeWidth="1.5" fill="none" />
                <polygon points="17,22 10,7 17,0 24,7" fill="rgba(168,85,247,0.2)" />
                <polygon points="17,15 12,5 17,0 22,5" fill="rgba(192,132,252,0.25)" />
                <path d="M17,65 L27,55" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
                <polygon points="27,55 35,47 27,43 24,51" fill="rgba(34,197,94,0.12)" />
              </svg>
              <svg className="flower-stem absolute bottom-2 right-10" width="28" height="95" viewBox="0 0 28 95" fill="none">
                <path d="M14,95 L14,32 L10,25 L14,15 L18,25 L14,32" stroke="rgba(34,197,94,0.25)" strokeWidth="1.5" fill="none" />
                <polygon points="14,15 8,4 14,0 20,4" fill="rgba(147,51,234,0.18)" />
                <path d="M14,55 L5,45" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
                <polygon points="5,45 0,38 6,34 8,42" fill="rgba(34,197,94,0.1)" />
              </svg>
            </div>

            {/* ── Content — right-aligned on desktop ── */}
            <div className="relative z-10 flex flex-col items-center md:items-end px-4 md:px-0 md:ml-auto md:max-w-[55%]">

              {/* Overline */}
              <p className="hero-fade-in text-fuchsia-500/70 text-[9px] tracking-[0.5em] uppercase font-black mb-8">
                Isaiah 60 — 61
              </p>

              {/* Title with Astron font */}
              <h1
                className="hero-fade-in mb-8 text-center md:text-right"
                style={{
                  fontFamily: "'Astron', sans-serif",
                  fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
                  letterSpacing: "0.12em",
                  lineHeight: 1,
                  color: "#1f2937",
                  textShadow: "0 2px 20px rgba(147,51,234,0.08)",
                }}
              >
                PROMINENCE
              </h1>

              {/* Decorative accent line */}
              <div className="hero-fade-in flex items-center gap-4 mb-10">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-fuchsia-400/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500/40" />
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-fuchsia-400/40" />
              </div>

              {/* Story text */}
              <p className="hero-fade-in text-gray-500 text-sm md:text-base leading-[2] font-medium max-w-lg text-center md:text-right" style={{ textWrap: "pretty" }}>
                Founded through faith and inspired by Isaiah 60 to 61, Prominence Virtual Assistance was built from a small beginning with nothing but vision, purpose, and the courage to keep going. What started as a simple step of faith grew into a creative digital agency dedicated to helping businesses rise, shine, and bring their vision into prominence.
              </p>

              {/* Subtle tagline */}
              <p className="hero-fade-in text-fuchsia-600/40 text-[9px] tracking-[0.4em] uppercase font-bold mt-10">
                Virtual Assistance &nbsp;·&nbsp; Creative Studio &nbsp;·&nbsp; Digital Agency
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
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-gray-800 mb-20 text-center drop-shadow-sm">The Engine</h2>
            {/* CEO */}
            <div className="flex justify-center mb-24 px-4">
              <div className={`relative w-full max-w-4xl rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 overflow-hidden group transition-shadow duration-500 ${neuOuter}`}>
                <div className={`w-full md:w-5/12 h-[340px] rounded-[2rem] overflow-hidden relative flex-shrink-0 ${neuInner}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400 text-xs tracking-widest uppercase font-bold">Image_Placeholder</span>
                  </div>
                </div>
                <div className="w-full md:w-7/12 text-left z-10">
                  <div className={`inline-block px-5 py-2 rounded-full mb-6 ${neuInner}`}>
                    <p className="text-fuchsia-600 font-black tracking-[0.2em] uppercase text-[10px]">{teamData.ceo.role}</p>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-gray-800 tracking-wider uppercase mb-6 drop-shadow-sm">{teamData.ceo.name}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm md:text-base font-medium border-l-2 border-fuchsia-300 pl-6">{teamData.ceo.about}</p>
                </div>
              </div>
            </div>
            {/* Team grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
              {teamData.members.map((member, i) => (
                <div key={i} className={`team-card relative overflow-hidden flex flex-col items-center justify-end mx-auto group ${neuOuter}`}>
                  <div className={`absolute inset-0 team-img transition-transform duration-700 ${neuInner} m-4 rounded-[1.5rem]`} />
                  <div className="team-content absolute bottom-0 inset-x-0 p-6 text-center flex flex-col justify-end bg-gradient-to-t from-[#e6eaf0] via-[#e6eaf0]/90 to-transparent">
                    <h3 className="text-gray-800 font-black tracking-wider uppercase text-sm mb-1">{member.name}</h3>
                    <p className="text-fuchsia-600 text-[10px] tracking-widest font-bold uppercase">{member.role}</p>
                    <div className="team-bio overflow-hidden mt-3">
                      <p className="text-gray-500 text-xs leading-relaxed font-medium">{member.about}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* TOOLS  —  3D REVOLVING CARD STACK                                */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <section id="tools" className="relative" ref={toolsRef}>
            <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 sm:px-12">

              {/* Section header */}
              <div className="tools-header text-center mb-16 relative z-10">
                <p className="text-purple-400/60 text-[9px] tracking-[0.5em] uppercase font-black mb-6">Our Arsenal</p>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-white/90 mb-6" style={{ textShadow: '0 0 40px rgba(147,51,234,0.3)' }}>Ecosystem</h2>
                <p className="text-white/35 text-sm tracking-widest uppercase font-medium">The tools that forge our systems.</p>
              </div>

              {/* 3D Stage */}
              <div className="tools-3d-stage w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                  {/* ── ENGINEERING ── */}
                  <div className="tool-card-3d">
                    <div className="relative overflow-hidden rounded-[24px] p-8 md:p-10" style={{ background: 'rgba(15, 10, 35, 0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(147, 51, 234, 0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(147,51,234,0.06), inset 0 1px 0 rgba(255,255,255,0.05)', minHeight: '380px' }}>
                      {/* Glow accent */}
                      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 70%)' }} />
                      <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(147,51,234,0.15)', boxShadow: '0 0 20px rgba(147,51,234,0.1)' }}>
                          <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                        </div>
                        <h3 className="text-white/90 font-black tracking-widest text-xs uppercase">Engineering</h3>
                      </div>
                      <div className="w-full h-px mb-7 relative z-10" style={{ background: 'linear-gradient(to right, rgba(147,51,234,0.3), transparent)' }} />
                      <ul className="space-y-5 text-sm font-bold text-white/60 tracking-wide relative z-10">
                        {[
                          { label: "Next.js",  color: "text-white/80",   icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.5L18.5 19h-13L12 5.5z"/></svg> },
                          { label: "VS Code",  color: "text-blue-400",   icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> },
                          { label: "Firebase", color: "text-orange-400",  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 2L7.5 10l-4 3 8 8 9-18-9-1z"/></svg> },
                          { label: "Vercel",   color: "text-white/70",    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg> },
                        ].map((t) => (
                          <li key={t.label} className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${t.color}`} style={{ background: 'rgba(147,51,234,0.1)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>{t.icon}</div>
                            {t.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ── POST-PRODUCTION ── */}
                  <div className="tool-card-3d">
                    <div className="relative overflow-hidden rounded-[24px] p-8 md:p-10" style={{ background: 'rgba(15, 10, 35, 0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(168, 85, 247, 0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(168,85,247,0.06), inset 0 1px 0 rgba(255,255,255,0.05)', minHeight: '380px' }}>
                      <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)' }} />
                      <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.15)', boxShadow: '0 0 20px rgba(168,85,247,0.1)' }}>
                          <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                        </div>
                        <h3 className="text-white/90 font-black tracking-widest text-xs uppercase">Post-Production</h3>
                      </div>
                      <div className="w-full h-px mb-7 relative z-10" style={{ background: 'linear-gradient(to right, rgba(168,85,247,0.3), transparent)' }} />
                      <ul className="space-y-5 text-sm font-bold text-white/60 tracking-wide relative z-10">
                        {[
                          { label: "CapCut",          color: "text-purple-400",  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg> },
                          { label: "Adobe Premiere",  color: "text-blue-400",    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> },
                          { label: "DaVinci Resolve", color: "text-teal-400",    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> },
                        ].map((t) => (
                          <li key={t.label} className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${t.color}`} style={{ background: 'rgba(168,85,247,0.1)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>{t.icon}</div>
                            {t.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ── GRAPHICS ── */}
                  <div className="tool-card-3d">
                    <div className="relative overflow-hidden rounded-[24px] p-8 md:p-10" style={{ background: 'rgba(15, 10, 35, 0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(192, 132, 252, 0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(192,132,252,0.06), inset 0 1px 0 rgba(255,255,255,0.05)', minHeight: '380px' }}>
                      <div className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%)' }} />
                      <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(192,132,252,0.15)', boxShadow: '0 0 20px rgba(192,132,252,0.1)' }}>
                          <svg className="w-6 h-6 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
                        </div>
                        <h3 className="text-white/90 font-black tracking-widest text-xs uppercase">Graphics</h3>
                      </div>
                      <div className="w-full h-px mb-7 relative z-10" style={{ background: 'linear-gradient(to right, rgba(192,132,252,0.3), transparent)' }} />
                      <ul className="space-y-5 text-sm font-bold text-white/60 tracking-wide relative z-10">
                        {[
                          { label: "Canva",        color: "text-blue-400",    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></svg> },
                          { label: "Photoshop",    color: "text-indigo-400",  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
                          { label: "Illustrator",  color: "text-orange-400",  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg> },
                        ].map((t) => (
                          <li key={t.label} className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${t.color}`} style={{ background: 'rgba(192,132,252,0.1)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>{t.icon}</div>
                            {t.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
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

          {/* ── CONTACT FORM ── */}
          <section id="cta" className="max-w-4xl mx-auto py-32 my-10 px-4" ref={ctaRef}>
            <div className="rounded-[3rem] p-10 md:p-20 relative overflow-hidden" style={{ background: 'rgba(15, 10, 35, 0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(147,51,234,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-[0.1em] text-white/90 mb-4" style={{ textShadow: '0 0 30px rgba(147,51,234,0.2)' }}>Communicate</h2>
                <p className="text-white/40 text-sm md:text-base leading-relaxed tracking-wide font-medium max-w-lg mx-auto">
                  Initialize a secure channel. Submit your parameters below to deploy our systems for your next operation.
                </p>
              </div>
              <form onSubmit={handleContactSubmit} className="max-w-xl mx-auto space-y-6">
                <input type="text"  required placeholder="Identification (Name)"            className={darkInput} style={{ background: 'rgba(147,51,234,0.06)' }} value={formData.name}    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <input type="email" required placeholder="Transmission Protocol (Email)"    className={darkInput} style={{ background: 'rgba(147,51,234,0.06)' }} value={formData.email}   onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <textarea          required placeholder="Payload (Message details)" rows={5} className={`${darkInput} resize-none`} style={{ background: 'rgba(147,51,234,0.06)' }} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                {submitStatus === "success" && <p className="text-emerald-400 text-sm font-bold tracking-widest uppercase text-center">Transmission Successful.</p>}
                {submitStatus === "error"   && <p className="text-red-400  text-sm font-bold tracking-widest uppercase text-center">Transmission Failed. Retrying...</p>}
                <div className="flex justify-center pt-4">
                  <button type="submit" disabled={submitStatus === "loading"} className={`px-12 py-4 rounded-full ${darkButton} ${submitStatus === "loading" ? "opacity-50 cursor-wait" : ""}`} style={{ background: 'rgba(147,51,234,0.15)', boxShadow: '0 0 20px rgba(147,51,234,0.1)' }}>
                    {submitStatus === "loading" ? "Transmitting..." : "Initiate Contact"}
                  </button>
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