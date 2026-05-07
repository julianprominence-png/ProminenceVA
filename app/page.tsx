"use client";

import { useEffect, useRef, useState } from "react";
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
    about: "Visionary leader driving innovation and pushing the boundaries of digital architecture. Orchestrating the intersection of design and robust engineering to build systems that scale."
  },
  members: [
    { name: "Vinz Iligan", role: "Lead Engineer", about: "Architecting scalable backend systems and ensuring seamless data pipelines." },
    { name: "Julian Tolentino", role: "Frontend Wizard", about: "Crafting pixel-perfect, interactive user interfaces with modern frameworks." },
    { name: "Giervan Sabalbero", role: "Fullstack Dev", about: "Bridging the gap between intuitive frontends and powerful server logic." },
    { name: "Andrea Turalba", role: "UI/UX Dev", about: "Translating complex user journeys into elegant, accessible web experiences." },
    { name: "Gian Cruz", role: "Senior Editor", about: "Transforming raw concepts into cinematic, narrative-driven visual stories." },
    { name: "Russel Minimo", role: "Motion Graphics", about: "Breathing life into static assets through fluid motion and dynamic effects." }
  ]
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
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
      gradient.addColorStop(0.3, `rgba(255, 255, 255, ${opacity * 0.9})`);
      gradient.addColorStop(0.6, `rgba(255, 255, 255, ${opacity * 0.6})`);
      gradient.addColorStop(0.85, `rgba(255, 255, 255, ${opacity * 0.2})`);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

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

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

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
  const loaderRef = useRef<HTMLDivElement>(null);
  const tri1Ref = useRef<SVGPolygonElement>(null);
  const tri2Ref = useRef<SVGPolygonElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    if (!loaderRef.current || !tri1Ref.current || !tri2Ref.current) return;

    gsap.set(tri1Ref.current, { x: -38, y: 0, transformOrigin: "center center" });
    gsap.set(tri2Ref.current, { x: 38, y: 0, rotation: 180, transformOrigin: "center center" });
    gsap.set(shadowRef.current, { scaleX: 1, opacity: 0.35, transformOrigin: "center center" });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.1 });

    tl.to(tri1Ref.current, { x: 0, y: -52, rotation: 15, duration: 0.32, ease: "power2.out" }, 0)
      .to(shadowRef.current, { scaleX: 0.6, opacity: 0.18, duration: 0.32, ease: "power2.out" }, 0)
      .to(tri1Ref.current, { x: 38, y: 0, rotation: 0, duration: 0.28, ease: "bounce.out" }, 0.32)
      .to(shadowRef.current, { scaleX: 1, opacity: 0.35, duration: 0.28, ease: "power2.out" }, 0.32)
      .to(tri2Ref.current, { x: 0, y: -52, rotation: 165, duration: 0.32, ease: "power2.out" }, 0.72)
      .to(shadowRef.current, { scaleX: 0.6, opacity: 0.18, duration: 0.32, ease: "power2.out" }, 0.72)
      .to(tri2Ref.current, { x: -38, y: 0, rotation: 180, duration: 0.28, ease: "bounce.out" }, 1.04)
      .to(shadowRef.current, { scaleX: 1, opacity: 0.35, duration: 0.28, ease: "power2.out" }, 1.04)
      .to({}, { duration: 0.45 });

    const exitTimer = setTimeout(() => {
      tl.kill();
      gsap.to(loaderRef.current, {
        opacity: 0,
        scale: 1.06,
        duration: 0.85,
        ease: "power3.inOut",
        onComplete,
      });
    }, 2800);

    return () => {
      tl.kill();
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden" style={{ background: "#000000" }}>
      <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, transparent 30%, rgba(0,0,0,0.88) 100%)" }} />
      <div className="relative z-10 flex flex-col items-center gap-10">
        <svg width="180" height="110" viewBox="-90 -70 180 110" overflow="visible">
          <ellipse ref={shadowRef} cx="0" cy="30" rx="72" ry="14" fill="#c084fc" style={{ filter: "blur(18px)" }} opacity="0.35" />
          <polygon ref={tri1Ref} points="0,-38 34,22 -34,22" fill="#7c3aed" stroke="#a855f7" strokeWidth="1.5" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 12px rgba(168,85,247,0.75))" }} />
          <polygon ref={tri2Ref} points="0,-38 34,22 -34,22" fill="#ffffff" stroke="rgba(255,255,255,0.55)" strokeWidth="1" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.55))" }} transform="translate(38,0) rotate(180)" />
        </svg>
        <p className="font-black tracking-[0.45em] text-transparent uppercase select-none" style={{ fontSize: "clamp(1.1rem, 4vw, 1.55rem)", WebkitTextStroke: "1px rgba(255,255,255,0.18)", textShadow: "0 0 40px rgba(168,85,247,0.45)" }}>
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
  const [showPage, setShowPage] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const mountainBgRef = useRef<HTMLDivElement>(null);
  const uiWrapperRef = useRef<HTMLDivElement>(null);
  const floatingCardRef = useRef<HTMLDivElement>(null);
  
  const heroSpacerRef = useRef<HTMLDivElement>(null);
  const cloudTriggerRef = useRef<HTMLDivElement>(null);
  const threeCanvasRef = useRef<HTMLDivElement>(null);
  
  const servicesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 4000);
    }
  };

  /* --- THREE.JS CLOUD SETUP --- */
  useEffect(() => {
    if (!showPage || !threeCanvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    camera.position.z = 70; 
    camera.position.y = 5;
    camera.position.x = 0;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); 
    threeCanvasRef.current.appendChild(renderer.domElement);

    const cloudTexture = createProceduralCloudTexture();
    
    const uniformsBg = {
      uMap: { value: cloudTexture },
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color(0xffffff) }, 
      uSunColor: { value: new THREE.Color(0xffffff) }, 
      uShadowColor: { value: new THREE.Color(0xdee4ec) }, 
      uOpacity: { value: 0.65 }, 
      uLightIntensity: { value: 0.8 }
    };

    const uniformsFg = {
      uMap: { value: cloudTexture },
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color(0xffffff) }, 
      uSunColor: { value: new THREE.Color(0xffffff) },
      uShadowColor: { value: new THREE.Color(0xeef2f5) }, 
      uOpacity: { value: 0.85 }, 
      uLightIntensity: { value: 1.0 }
    };

    const uniformsWisp = {
      uMap: { value: cloudTexture },
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color(0xffffff) },
      uSunColor: { value: new THREE.Color(0xffffff) },
      uShadowColor: { value: new THREE.Color(0xffffff) }, 
      uOpacity: { value: 0.4 }, 
      uLightIntensity: { value: 0.9 }
    };

    const materialBg = new THREE.ShaderMaterial({ 
      vertexShader: cloudVertexShader, fragmentShader: cloudFragmentShader, 
      uniforms: uniformsBg, transparent: true, depthWrite: false, blending: THREE.NormalBlending 
    });
    
    const materialFg = new THREE.ShaderMaterial({ 
      vertexShader: cloudVertexShader, fragmentShader: cloudFragmentShader, 
      uniforms: uniformsFg, transparent: true, depthWrite: false, blending: THREE.NormalBlending
    });

    const materialWisp = new THREE.ShaderMaterial({ 
      vertexShader: cloudVertexShader, fragmentShader: cloudFragmentShader, 
      uniforms: uniformsWisp, transparent: true, depthWrite: false, blending: THREE.NormalBlending 
    });

    const geometry = new THREE.PlaneGeometry(1, 1);

    const createCloudCluster = (material: THREE.ShaderMaterial, count: number, spreadX: number, spreadY: number, spreadZ: number, scaleMin: number, scaleMax: number) => {
      const group = new THREE.Group();
      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set((Math.random() - 0.5) * spreadX, (Math.random() - 0.5) * spreadY, (Math.random() - 0.5) * spreadZ);
        const scale = Math.random() * (scaleMax - scaleMin) + scaleMin;
        mesh.scale.set(scale, scale, 1);
        mesh.rotation.z = Math.random() * Math.PI * 2;
        mesh.userData = {
           rotationSpeed: (Math.random() - 0.5) * 0.0001, 
           floatSpeed: Math.random() * 0.0008 + 0.0005,
           floatOffset: Math.random() * Math.PI * 2,
           floatAmplitude: Math.random() * 0.01 + 0.005
        };
        group.add(mesh);
      }
      return group;
    };

    const leftBg = createCloudCluster(materialBg, 18, 220, 30, 25, 70, 110);
    const rightBg = createCloudCluster(materialBg, 18, 220, 30, 25, 70, 110);
    const leftFg = createCloudCluster(materialFg, 20, 180, 20, 20, 60, 95);
    const rightFg = createCloudCluster(materialFg, 20, 180, 20, 20, 60, 95);
    const leftWisp = createCloudCluster(materialWisp, 10, 240, 15, 30, 50, 100);
    const rightWisp = createCloudCluster(materialWisp, 10, 240, 15, 30, 50, 100);

    [leftWisp, rightWisp].forEach(group => group.children.forEach(mesh => { mesh.scale.y *= (Math.random() * 0.25 + 0.25); }));

    leftBg.position.set(-100, -17, -15);
    rightBg.position.set(100, -17, -15);
    leftFg.position.set(-80, -20, 8);
    rightFg.position.set(80, -20, 8);
    leftWisp.position.set(-120, -12, 15);
    rightWisp.position.set(120, -12, 15);

    scene.add(leftBg, rightBg, leftFg, rightFg, leftWisp, rightWisp);

    let cameraFloatTime = 0;
    const cameraBaseZ = camera.position.z;
    const cameraBaseY = camera.position.y;
    const cameraBaseX = camera.position.x;

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = Date.now();
      cameraFloatTime += 0.016; 
      
      const breathX = Math.sin(cameraFloatTime * 0.3) * 0.08;
      const breathY = Math.cos(cameraFloatTime * 0.25) * 0.06;
      const microShakeX = Math.sin(cameraFloatTime * 2.1) * 0.015;
      const microShakeY = Math.cos(cameraFloatTime * 1.8) * 0.012;
      const slowDriftZ = Math.sin(cameraFloatTime * 0.15) * 0.4;
      
      camera.position.x = cameraBaseX + breathX + microShakeX;
      camera.position.y = cameraBaseY + breathY + microShakeY;
      camera.position.z = cameraBaseZ + slowDriftZ;
      
      camera.rotation.z = Math.sin(cameraFloatTime * 0.2) * 0.002;
      camera.rotation.y = Math.sin(cameraFloatTime * 0.18) * 0.003;
      
      uniformsBg.uTime.value = time * 0.0008;
      uniformsFg.uTime.value = time * 0.0008;
      uniformsWisp.uTime.value = time * 0.0008;
      
      leftBg.position.y += Math.sin(time * 0.00008) * 0.002;
      rightBg.position.y += Math.cos(time * 0.00008) * 0.002;
      leftFg.position.y += Math.sin((time * 0.00008) + 1) * 0.003;
      rightFg.position.y += Math.cos((time * 0.00008) + 1) * 0.003;
      
      leftWisp.position.x += 0.008;
      rightWisp.position.x -= 0.008;
      leftWisp.position.y += Math.sin(time * 0.0001) * 0.004;
      rightWisp.position.y += Math.cos(time * 0.0001) * 0.004;

      [leftBg, rightBg, leftFg, rightFg, leftWisp, rightWisp].forEach(group => {
          group.children.forEach((mesh: any) => {
              mesh.rotation.z += mesh.userData.rotationSpeed;
              mesh.position.y += Math.sin(time * mesh.userData.floatSpeed + mesh.userData.floatOffset) * mesh.userData.floatAmplitude;
          })
      });

      renderer.render(scene, camera);
    };
    animate();

    const ctx = gsap.context(() => {
      const cameraTimeline = gsap.timeline({
        scrollTrigger: { trigger: heroSpacerRef.current, start: "top top", end: "bottom top", scrub: 2 }
      });

      cameraTimeline.to(camera.position, { z: 30, y: -5, ease: "power2.inOut" });

      const cloudTimeline = gsap.timeline({
        scrollTrigger: { trigger: cloudTriggerRef.current, start: "top 100%", end: "bottom 0%", scrub: 2.5 }
      });

      cloudTimeline
        .to(leftBg.position, { x: -30, y: 3, ease: "power1.inOut" }, 0)
        .to(rightBg.position, { x: 30, y: 3, ease: "power1.inOut" }, 0)
        .to(leftFg.position, { x: -20, y: 6, ease: "power2.inOut" }, 0)
        .to(rightFg.position, { x: 20, y: 6, ease: "power2.inOut" }, 0)
        .to(leftWisp.position, { x: 10, y: 10, ease: "power1.out" }, 0)
        .to(rightWisp.position, { x: -10, y: 10, ease: "power1.out" }, 0)
        .to([leftFg.position, rightFg.position], { z: 20, ease: "power1.inOut" }, 0)
        .to([leftWisp.position, rightWisp.position], { z: 28, ease: "power1.inOut" }, 0)
        .to(uniformsBg.uOpacity, { value: 0.9, ease: "power2.in" }, 0.2) 
        .to(uniformsFg.uOpacity, { value: 1.0, ease: "power2.in" }, 0.2)
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
      cancelAnimationFrame(animationFrameId);
      ctx.revert();
      renderer.dispose();
      materialBg.dispose();
      materialFg.dispose();
      materialWisp.dispose();
      geometry.dispose();
      cloudTexture.dispose();
      if (threeCanvasRef.current) threeCanvasRef.current.innerHTML = '';
    };
  }, [showPage]);

  /* --- DOM GSAP SETUP --- */
  useEffect(() => {
    if (!showPage) return;
    
    gsap.set(uiWrapperRef.current, { opacity: 0, y: -20 });
    gsap.set(floatingCardRef.current, { opacity: 0, x: -20 });

    const ctx = gsap.context(() => {
      gsap.to(uiWrapperRef.current, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });
      gsap.to(floatingCardRef.current, { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", delay: 0.4 });

      if (mountainBgRef.current) {
        gsap.fromTo(mountainBgRef.current, { scale: 1.4 }, { 
          scale: 1.0, ease: "power2.out", 
          scrollTrigger: { trigger: heroSpacerRef.current, start: "top top", end: "bottom top", scrub: 1.8 } 
        });
      }

      gsap.to(floatingCardRef.current, {
        opacity: 0, x: -20, ease: "power2.in",
        scrollTrigger: { trigger: heroSpacerRef.current, start: "top -10%", end: "top -30%", scrub: true }
      });

      if (servicesRef.current) {
        gsap.fromTo(servicesRef.current.children, 
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: servicesRef.current, start: "top 75%" } }
        );
      }

      // Morphing Team Profile Cards
      const teamCards = gsap.utils.toArray('.team-card') as HTMLElement[];
      teamCards.forEach((card) => {
        const content = card.querySelector('.team-content');
        const img = card.querySelector('.team-img');
        const bio = card.querySelector('.team-bio');
        
        gsap.set(card, { width: '120px', height: '120px', borderRadius: '50%' });
        gsap.set(content, { opacity: 0, y: 20 });
        gsap.set(bio, { opacity: 0, height: 0 });
        gsap.set(img, { scale: 1.2 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none reverse" }
        });

        tl.to(card, { width: '100%', height: '360px', borderRadius: '24px', duration: 0.8, ease: "power3.inOut" })
          .to(img, { scale: 1, duration: 0.8, ease: "power3.inOut" }, "<")
          .to(content, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.3")
          .to(bio, { opacity: 1, height: 'auto', duration: 0.4, ease: "power2.out" }, "-=0.2");
      });

      // Bouncy Float for Tools Columns
      if (toolsRef.current) {
        gsap.fromTo('.tool-column', 
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", scrollTrigger: { trigger: toolsRef.current, start: "top 80%" },
              onComplete: () => {
                gsap.to('.tool-column', {
                  y: -15, duration: 2.5, ease: "sine.inOut", stagger: 0.2, repeat: -1, yoyo: true
                });
              }
            }
        );
      }

      if (projectsRef.current) {
        gsap.fromTo('.project-card', 
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: projectsRef.current, start: "top 75%" } }
        );
      }
      
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current, 
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ctaRef.current, start: "top 85%" } }
        );
      }
    });

    return () => ctx.revert();
  }, [showPage]);

  // Neumorphic System Styles (Base: #e6eaf0)
  const neuOuter = "bg-[#e6eaf0] shadow-[12px_12px_24px_#c8d0e0,-12px_-12px_24px_#ffffff]";
  const neuInner = "bg-[#e6eaf0] shadow-[inset_6px_6px_12px_#c8d0e0,inset_-6px_-6px_12px_#ffffff]";
  const neuButton = "bg-[#e6eaf0] shadow-[6px_6px_12px_#c8d0e0,-6px_-6px_12px_#ffffff] hover:shadow-[8px_8px_16px_#c8d0e0,-8px_-8px_16px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8d0e0,inset_-4px_-4px_8px_#ffffff] transition-all duration-300 text-fuchsia-600 font-bold uppercase tracking-widest";
  const neuInput = "w-full bg-[#e6eaf0] shadow-[inset_6px_6px_12px_#c8d0e0,inset_-6px_-6px_12px_#ffffff] rounded-xl px-5 py-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-fuchsia-500/30 transition-all border-none placeholder-gray-400";

  return (
    <>
      {!loaderDone && <TriangleLoader onComplete={handleLoaderComplete} />}

      <div className={`relative min-h-[300vh] bg-[#e6eaf0] font-sans selection:bg-fuchsia-500/30 ${showPage ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
        
        {/* --- FIXED MOUNTAIN BACKGROUND LAYER --- */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#020104]">
          <div ref={mountainBgRef} className="absolute inset-0 will-change-transform" style={{ backgroundImage: "url('/images/mountain.jpg')", backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat", transform: "scale(1.4)" }} />
          <div className="absolute inset-0 pointer-events-none opacity-60" style={{ background: "linear-gradient(to bottom, rgba(2,1,4,0.3) 0%, transparent 20%, transparent 80%, #e6eaf0 100%)" }} />
        </div>

        {/* --- NAVBAR --- */}
        <div ref={uiWrapperRef} className="fixed top-6 inset-x-0 flex justify-center px-4 z-50 pointer-events-none">
          <div className={`pointer-events-auto w-full max-w-4xl flex items-center justify-between rounded-full px-4 py-3 ${neuOuter}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden relative ${neuInner}`}>
                <img src="/images/icon-logo.png" alt="Prominence" className="w-full h-full object-cover opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
                <div className="absolute w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse mix-blend-screen" />
              </div>
              <span className="font-black tracking-[0.2em] uppercase text-[11px] text-gray-800 drop-shadow-sm">
                Prominence
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase">
              <a href="#services" className="hover:text-fuchsia-500 transition-colors duration-300">Services</a>
              <a href="#team" className="hover:text-fuchsia-500 transition-colors duration-300">Team</a>
              <a href="#tools" className="hover:text-fuchsia-500 transition-colors duration-300">Stack</a>
            </div>
            <a href="#cta" className={`px-6 py-2.5 rounded-full text-[10px] ${neuButton}`}>Contact Us</a>
          </div>
        </div>

        {/* --- FLOATING INFO CARD --- */}
        <div ref={floatingCardRef} className="fixed bottom-10 left-10 z-50 pointer-events-none hidden lg:block">
          <div className={`pointer-events-auto rounded-2xl p-6 w-72 ${neuOuter}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)] animate-pulse" />
              <h4 className="text-gray-800 text-[10px] uppercase tracking-widest font-black">Systems Online</h4>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed font-medium">
              We build the foundations required to scale the highest peaks. Premium development, cinematic video editing, and modern graphics.
            </p>
          </div>
        </div>

        {/* --- HERO SPACER & CLOUDS --- */}
        <div ref={heroSpacerRef} className="relative z-10 w-full h-[100vh]" />

        <div ref={cloudTriggerRef} className="relative z-20 w-full h-[40vh] translate-y-[20px] pointer-events-none flex items-center justify-center">
           <div ref={threeCanvasRef} className="absolute inset-0 w-full h-[150vh] -top-[50vh]" style={{ pointerEvents: "none", maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 85%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 85%)" }} />
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="relative z-30 w-full bg-[#e6eaf0] rounded-t-[3rem] -mt-10 pt-24 pb-32 px-6 sm:px-12 shadow-[0_-20px_40px_rgba(230,234,240,1)] overflow-hidden">
          
          {/* Section 1: Services */}
          <section id="services" className="max-w-6xl mx-auto pt-10 pb-32">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-gray-800 mb-6 drop-shadow-sm">The Ascent</h2>
              <div className="w-px h-16 bg-gradient-to-b from-fuchsia-500 to-transparent mx-auto" />
            </div>
            
            <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: "Web Architecture", desc: "Forging highly optimized, scalable Next.js environments tailored for performance and aesthetics." },
                { title: "Cinematic Edits", desc: "Transforming raw footage into premium, narrative-driven experiences that capture attention instantly." },
                { title: "Brand Identity", desc: "Crafting visually striking graphic design systems using industry-standard tools to solidify your presence." }
              ].map((service, i) => (
                <div key={i} className={`p-10 rounded-[2rem] transition-all duration-500 group relative overflow-hidden ${neuOuter}`}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10 bg-[#e6eaf0] shadow-[6px_6px_12px_#c8d0e0,-6px_-6px_12px_#ffffff]">
                    <div className="w-4 h-4 bg-fuchsia-500 rounded-sm rotate-45 shadow-[0_0_10px_rgba(217,70,239,0.3)]" />
                  </div>
                  <h3 className="text-fuchsia-600 font-bold tracking-widest text-[11px] uppercase mb-4 relative z-10">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-loose relative z-10 font-medium">{service.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Team */}
          <section id="team" className="max-w-6xl mx-auto py-32 border-t border-gray-300/30">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-gray-800 mb-20 text-center drop-shadow-sm">The Engine</h2>
            
            {/* CEO HERO PROFILE */}
            <div className="flex justify-center mb-24 px-4">
              <div className={`relative w-full max-w-4xl rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 overflow-hidden group transition-shadow duration-500 ${neuOuter}`}>
                
                {/* Image Placeholder */}
                <div className={`w-full md:w-5/12 h-[340px] rounded-[2rem] overflow-hidden relative flex-shrink-0 ${neuInner}`}>
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-gray-400 text-xs tracking-widest uppercase font-bold">Image_Placeholder</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="w-full md:w-7/12 text-left z-10">
                  <div className={`inline-block px-5 py-2 rounded-full mb-6 ${neuInner}`}>
                    <p className="text-fuchsia-600 font-black tracking-[0.2em] uppercase text-[10px]">{teamData.ceo.role}</p>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-gray-800 tracking-wider uppercase mb-6 drop-shadow-sm">{teamData.ceo.name}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm md:text-base font-medium border-l-2 border-fuchsia-300 pl-6">
                    {teamData.ceo.about}
                  </p>
                </div>
              </div>
            </div>

            {/* Unified Team Grid */}
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

          {/* Section 3: Tools */}
          <section id="tools" className="max-w-6xl mx-auto py-32 border-t border-gray-300/30" ref={toolsRef}>
            <div className="text-center mb-24">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-gray-800 mb-6 drop-shadow-sm">Ecosystem</h2>
              <p className="text-gray-500 text-sm tracking-widest uppercase font-medium">The tools that forge our systems.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
              
              {/* CODING TOOLS */}
              <div className={`tool-column rounded-[2rem] p-10 ${neuOuter}`}>
                <h3 className="text-fuchsia-600 font-black tracking-widest text-xs uppercase mb-8 border-b border-gray-300/50 pb-4">Engineering</h3>
                <ul className="space-y-6 text-sm font-bold text-gray-600 tracking-wide">
                  <li className="flex items-center gap-4 cursor-default">
                    <div className={`p-2 rounded-lg ${neuInner}`}>
                      <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.5L18.5 19h-13L12 5.5z"/></svg>
                    </div>
                    Next.js
                  </li>
                  <li className="flex items-center gap-4 cursor-default">
                    <div className={`p-2 rounded-lg ${neuInner}`}>
                      <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                    </div>
                    VS Code
                  </li>
                  <li className="flex items-center gap-4 cursor-default">
                    <div className={`p-2 rounded-lg ${neuInner}`}>
                      <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 2L7.5 10l-4 3 8 8 9-18-9-1z"/></svg>
                    </div>
                    Firebase
                  </li>
                  <li className="flex items-center gap-4 cursor-default">
                    <div className={`p-2 rounded-lg ${neuInner}`}>
                      <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>
                    </div>
                    Vercel
                  </li>
                </ul>
              </div>

              {/* VIDEO EDITING */}
              <div className={`tool-column rounded-[2rem] p-10 ${neuOuter}`}>
                <h3 className="text-fuchsia-600 font-black tracking-widest text-xs uppercase mb-8 border-b border-gray-300/50 pb-4">Post-Production</h3>
                <ul className="space-y-6 text-sm font-bold text-gray-600 tracking-wide">
                  <li className="flex items-center gap-4 cursor-default">
                    <div className={`p-2 rounded-lg ${neuInner}`}>
                      <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
                    </div>
                    CapCut
                  </li>
                  <li className="flex items-center gap-4 cursor-default">
                    <div className={`p-2 rounded-lg ${neuInner}`}>
                      <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    </div>
                    Adobe Premiere
                  </li>
                  <li className="flex items-center gap-4 cursor-default">
                    <div className={`p-2 rounded-lg ${neuInner}`}>
                      <svg className="w-5 h-5 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </div>
                    DaVinci Resolve
                  </li>
                </ul>
              </div>

              {/* GRAPHICS */}
              <div className={`tool-column rounded-[2rem] p-10 ${neuOuter}`}>
                <h3 className="text-fuchsia-600 font-black tracking-widest text-xs uppercase mb-8 border-b border-gray-300/50 pb-4">Graphics</h3>
                <ul className="space-y-6 text-sm font-bold text-gray-600 tracking-wide">
                  <li className="flex items-center gap-4 cursor-default">
                    <div className={`p-2 rounded-lg ${neuInner}`}>
                      <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>
                    </div>
                    Canva
                  </li>
                  <li className="flex items-center gap-4 cursor-default">
                    <div className={`p-2 rounded-lg ${neuInner}`}>
                      <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </div>
                    Photoshop
                  </li>
                  <li className="flex items-center gap-4 cursor-default">
                    <div className={`p-2 rounded-lg ${neuInner}`}>
                      <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
                    </div>
                    Illustrator
                  </li>
                </ul>
              </div>

            </div>
          </section>

          {/* Section 4: Projects */}
          <section id="projects" className="max-w-6xl mx-auto py-32 border-t border-gray-300/30">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-gray-800 mb-20 text-center drop-shadow-sm">Selected Work</h2>
            <div ref={projectsRef} className="grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className={`project-card h-80 rounded-[2.5rem] flex flex-col items-center justify-center group cursor-pointer overflow-hidden relative ${neuOuter}`}>
                  <div className={`absolute inset-6 rounded-[2rem] transition-transform duration-500 ${neuInner}`} />
                  <p className="text-gray-500 font-bold tracking-widest uppercase text-sm z-10">Project 0{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Contact Form (Functional CTA) */}
          <section id="cta" className="max-w-4xl mx-auto py-32 my-10 px-4" ref={ctaRef}>
            <div className={`rounded-[3rem] p-10 md:p-20 relative overflow-hidden ${neuOuter}`}>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-[0.1em] text-gray-800 mb-4 drop-shadow-sm">Communicate</h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed tracking-wide font-medium max-w-lg mx-auto">
                  Initialize a secure channel. Submit your parameters below to deploy our systems for your next operation.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="max-w-xl mx-auto space-y-6">
                <div>
                  <input 
                    type="text" 
                    required 
                    placeholder="Identification (Name)" 
                    className={neuInput}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    required 
                    placeholder="Transmission Protocol (Email)" 
                    className={neuInput}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <textarea 
                    required 
                    placeholder="Payload (Message details)" 
                    rows={5}
                    className={`${neuInput} resize-none`}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                {submitStatus === "success" && (
                  <p className="text-green-600 text-sm font-bold tracking-widest uppercase text-center">Transmission Successful.</p>
                )}
                {submitStatus === "error" && (
                  <p className="text-red-500 text-sm font-bold tracking-widest uppercase text-center">Transmission Failed. Retrying...</p>
                )}

                <div className="flex justify-center pt-4">
                  <button 
                    type="submit" 
                    disabled={submitStatus === "loading"}
                    className={`px-12 py-4 rounded-full ${neuButton} ${submitStatus === "loading" ? "opacity-50 cursor-wait" : ""}`}
                  >
                    {submitStatus === "loading" ? "Transmitting..." : "Initiate Contact"}
                  </button>
                </div>
              </form>
            </div>
          </section>

        </div>

        {/* --- FOOTER --- */}
        <footer className="relative z-30 py-12 text-center text-gray-500 text-[9px] tracking-[0.4em] uppercase bg-[#e6eaf0] border-t border-gray-300/40">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className={`w-2.5 h-2.5 rounded-full ${neuInner}`} />
            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${neuInner}`}>
               <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
            </div>
            <div className={`w-2.5 h-2.5 rounded-full ${neuInner}`} />
          </div>
          <p className="font-bold">© {new Date().getFullYear()} Prominence. All operational rights reserved.</p>
          <p className="mt-4 font-medium">Olongapo City, 2200</p>
        </footer>
      </div>
    </>
  );
}