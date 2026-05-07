"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
    
    // Initial States
    gsap.set(uiWrapperRef.current, { opacity: 0, y: -20 });
    gsap.set(floatingCardRef.current, { opacity: 0, x: -20 });

    const ctx = gsap.context(() => {
      // Intro Animations
      gsap.to(uiWrapperRef.current, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });
      gsap.to(floatingCardRef.current, { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", delay: 0.4 });

      // Parallax Hero
      if (mountainBgRef.current) {
        gsap.fromTo(mountainBgRef.current, { scale: 1.4 }, { 
          scale: 1.0, ease: "power2.out", 
          scrollTrigger: { trigger: heroSpacerRef.current, start: "top top", end: "bottom top", scrub: 1.8 } 
        });
      }

      // Fade out floating card on scroll
      gsap.to(floatingCardRef.current, {
        opacity: 0, x: -20, ease: "power2.in",
        scrollTrigger: { trigger: heroSpacerRef.current, start: "top -10%", end: "top -30%", scrub: true }
      });

      // Services Fade Up
      if (servicesRef.current) {
        gsap.fromTo(servicesRef.current.children, 
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: servicesRef.current, start: "top 75%" } }
        );
      }

      // Team Morphing Cards
      const teamCards = gsap.utils.toArray('.team-card') as HTMLElement[];
      teamCards.forEach((card) => {
        const content = card.querySelector('.team-content');
        const img = card.querySelector('.team-img');
        
        // Initial setup for the circle
        gsap.set(card, { width: '120px', height: '120px', borderRadius: '50%' });
        gsap.set(content, { opacity: 0, y: 20 });
        gsap.set(img, { scale: 1.2 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none reverse" }
        });

        tl.to(card, { width: '100%', height: '320px', borderRadius: '24px', duration: 0.8, ease: "power3.inOut" })
          .to(img, { scale: 1, duration: 0.8, ease: "power3.inOut" }, "<")
          .to(content, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.3");
      });

      // Tools Reveal
      if (toolsRef.current) {
        gsap.fromTo('.tool-column', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", scrollTrigger: { trigger: toolsRef.current, start: "top 80%" } }
        );
      }

      // Projects Reveal
      if (projectsRef.current) {
        gsap.fromTo('.project-card', 
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: projectsRef.current, start: "top 75%" } }
        );
      }
      
      // CTA Scale Up
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current, 
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ctaRef.current, start: "top 85%" } }
        );
      }
    });

    return () => ctx.revert();
  }, [showPage]);

  // Styles
  const neumorphicNavbar = "w-full max-w-4xl flex items-center justify-between rounded-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]";
  const neumorphicButton = "bg-white text-fuchsia-600 font-bold rounded-full px-6 py-2.5 text-[10px] uppercase tracking-widest shadow-[0_4px_15px_rgba(255,255,255,0.3)] hover:shadow-[0_4px_20px_rgba(192,132,252,0.5)] hover:scale-105 transition-all duration-300";
  const glassCard = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-3xl p-8";

  return (
    <>
      {!loaderDone && <TriangleLoader onComplete={handleLoaderComplete} />}

      <div className={`relative min-h-[300vh] bg-[#f3f5f8] font-sans selection:bg-fuchsia-500/30 ${showPage ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
        
        {/* --- FIXED MOUNTAIN BACKGROUND LAYER --- */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#020104]">
          <div ref={mountainBgRef} className="absolute inset-0 will-change-transform" style={{ backgroundImage: "url('/images/mountain.jpg')", backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat", transform: "scale(1.4)" }} />
          <div className="absolute inset-0 pointer-events-none opacity-60" style={{ background: "linear-gradient(to bottom, rgba(2,1,4,0.3) 0%, transparent 20%, transparent 80%, rgba(243,245,248,1) 100%)" }} />
        </div>

        {/* --- NAVBAR --- */}
        <div ref={uiWrapperRef} className="fixed top-6 inset-x-0 flex justify-center px-4 z-50 pointer-events-none">
          <div className={`pointer-events-auto ${neumorphicNavbar}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30 overflow-hidden relative">
                {/* Fallback styling for icon-logo.png */}
                <img src="/images/icon-logo.png" alt="Prominence" className="w-full h-full object-cover opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
                <div className="absolute w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse mix-blend-screen" />
              </div>
              <span className="font-black tracking-[0.2em] uppercase text-[11px] text-white drop-shadow-md">
                Prominence
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-[9px] font-bold tracking-[0.2em] text-white/70 uppercase">
              <a href="#services" className="hover:text-fuchsia-400 transition-colors duration-300">Services</a>
              <a href="#team" className="hover:text-fuchsia-400 transition-colors duration-300">Team</a>
              <a href="#tools" className="hover:text-fuchsia-400 transition-colors duration-300">Stack</a>
            </div>
            <a href="#cta" className={neumorphicButton}>Contact Us</a>
          </div>
        </div>

        {/* --- FLOATING INFO CARD --- */}
        <div ref={floatingCardRef} className="fixed bottom-10 left-10 z-50 pointer-events-none hidden lg:block">
          <div className="pointer-events-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 w-72 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)] animate-pulse" />
              <h4 className="text-white text-[10px] uppercase tracking-widest font-bold">Systems Online</h4>
            </div>
            <p className="text-white/60 text-xs leading-relaxed font-light">
              We build the foundations required to scale the highest peaks. Premium development, cinematic video editing, and modern graphics.
            </p>
          </div>
        </div>

        {/* --- HERO SPACER & CLOUDS --- */}
        <div ref={heroSpacerRef} className="relative z-10 w-full h-[100vh]" />

        <div ref={cloudTriggerRef} className="relative z-20 w-full h-[40vh] translate-y-[20px] pointer-events-none flex items-center justify-center">
           <div ref={threeCanvasRef} className="absolute inset-0 w-full h-[150vh] -top-[50vh]" style={{ pointerEvents: "none", maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 85%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 85%)" }} />
        </div>

        {/* --- MAIN CONTENT (LIGHT THEME) --- */}
        <div className="relative z-30 w-full bg-[#f3f5f8] rounded-t-[3rem] -mt-10 pt-24 pb-32 px-6 sm:px-12 shadow-[0_-20px_40px_rgba(243,245,248,1)] overflow-hidden">
          
          {/* Section 1: Services */}
          <section id="services" className="max-w-6xl mx-auto pt-10 pb-32">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-gray-900 mb-6">The Ascent</h2>
              <div className="w-px h-16 bg-gradient-to-b from-fuchsia-500 to-transparent mx-auto" />
            </div>
            
            <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Web Architecture", desc: "Forging highly optimized, scalable Next.js environments tailored for performance and aesthetics." },
                { title: "Cinematic Edits", desc: "Transforming raw footage into premium, narrative-driven experiences that capture attention instantly." },
                { title: "Brand Identity", desc: "Crafting visually striking graphic design systems using industry-standard tools to solidify your presence." }
              ].map((service, i) => (
                <div key={i} className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-2 hover:shadow-fuchsia-500/10 transition-all duration-500 group">
                  <div className="w-12 h-12 rounded-full bg-fuchsia-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <div className="w-4 h-4 bg-fuchsia-500 rounded-sm rotate-45" />
                  </div>
                  <h3 className="text-fuchsia-600 font-bold tracking-widest text-[11px] uppercase mb-4">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-loose">{service.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Team */}
          <section id="team" className="max-w-6xl mx-auto py-32 border-t border-gray-200/60">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-gray-900 mb-20 text-center">The Engine</h2>
            
            {/* CEO */}
            <div className="flex justify-center mb-16">
              <div className="team-card relative bg-white shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col items-center justify-end mx-auto border border-gray-100">
                <div className="absolute inset-0 bg-gray-100 team-img transition-transform" />
                <div className="team-content absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent text-center">
                  <h3 className="text-gray-900 font-black tracking-widest uppercase text-sm">Vien Abache</h3>
                  <p className="text-fuchsia-600 text-[10px] tracking-[0.2em] font-bold mt-1">CEO & Founder</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Developers */}
              <div>
                <h3 className="text-center text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-8">Development</h3>
                <div className="grid grid-cols-2 gap-6">
                  {["Vinz Iligan", "Julian Tolentino", "Giervan Sabalbero", "Andrea Turalba"].map((name, i) => (
                    <div key={i} className="team-card relative bg-white shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col items-center justify-end mx-auto border border-gray-100">
                      <div className="absolute inset-0 bg-gray-50 team-img transition-transform" />
                      <div className="team-content absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-white via-white/90 to-transparent text-center">
                        <h3 className="text-gray-800 font-bold tracking-wider uppercase text-xs">{name}</h3>
                        <p className="text-fuchsia-500 text-[9px] tracking-widest font-semibold mt-1">Engineer</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editors */}
              <div>
                <h3 className="text-center text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-8">Post-Production</h3>
                <div className="flex justify-center gap-6">
                  {["Gian Cruz", "Russel Minimo"].map((name, i) => (
                    <div key={i} className="team-card relative bg-white shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col items-center justify-end border border-gray-100">
                      <div className="absolute inset-0 bg-gray-50 team-img transition-transform" />
                      <div className="team-content absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-white via-white/90 to-transparent text-center">
                        <h3 className="text-gray-800 font-bold tracking-wider uppercase text-xs">{name}</h3>
                        <p className="text-fuchsia-500 text-[9px] tracking-widest font-semibold mt-1">Video Editor</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Tools */}
          <section id="tools" className="max-w-6xl mx-auto py-32 border-t border-gray-200/60" ref={toolsRef}>
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-gray-900 mb-6">Ecosystem</h2>
              <p className="text-gray-500 text-sm tracking-widest uppercase">The tools that forge our systems.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="tool-column bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                <h3 className="text-fuchsia-600 font-bold tracking-widest text-[11px] uppercase mb-8 border-b border-gray-100 pb-4">Coding Tools</h3>
                <ul className="space-y-4 text-sm font-semibold text-gray-600 tracking-wide">
                  {['Next.js', 'VS Code', 'Firebase', 'Vercel'].map(tool => (
                    <li key={tool} className="flex items-center gap-3 hover:text-fuchsia-500 hover:translate-x-2 transition-all cursor-default">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> {tool}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="tool-column bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                <h3 className="text-fuchsia-600 font-bold tracking-widest text-[11px] uppercase mb-8 border-b border-gray-100 pb-4">Video Editing</h3>
                <ul className="space-y-4 text-sm font-semibold text-gray-600 tracking-wide">
                  {['Canva', 'CapCut', 'Adobe Premiere'].map(tool => (
                    <li key={tool} className="flex items-center gap-3 hover:text-fuchsia-500 hover:translate-x-2 transition-all cursor-default">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> {tool}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="tool-column bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                <h3 className="text-fuchsia-600 font-bold tracking-widest text-[11px] uppercase mb-8 border-b border-gray-100 pb-4">Graphics</h3>
                <ul className="space-y-4 text-sm font-semibold text-gray-600 tracking-wide">
                  {['Canva', 'Photoshop', 'Adobe Illustrator'].map(tool => (
                    <li key={tool} className="flex items-center gap-3 hover:text-fuchsia-500 hover:translate-x-2 transition-all cursor-default">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Projects (Placeholder Grid) */}
          <section id="projects" className="max-w-6xl mx-auto py-32 border-t border-gray-200/60">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] text-gray-900 mb-20 text-center">Selected Work</h2>
            <div ref={projectsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="project-card bg-gray-100/50 h-80 rounded-3xl border border-gray-200/50 flex flex-col items-center justify-center group hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 cursor-pointer overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <p className="text-gray-400 font-bold tracking-widest uppercase text-xs group-hover:text-fuchsia-500 transition-colors z-10">Project 0{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: CTA */}
          <section id="cta" className="max-w-4xl mx-auto py-32 my-20" ref={ctaRef}>
            <div className="bg-[#020104] rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-fuchsia-900/20">
              <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/10 to-transparent pointer-events-none" />
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50" />
              
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[0.1em] text-white mb-6">Reach the Summit</h2>
              <p className="text-white/60 text-sm md:text-base leading-relaxed tracking-wide font-light max-w-xl mx-auto mb-12">
                Ready to elevate your digital presence? Partner with Prominence and let us build the systems that drive your success.
              </p>
              <button className="bg-fuchsia-600 text-white font-black rounded-full px-10 py-4 text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(192,132,252,0.4)] hover:bg-fuchsia-500 hover:shadow-[0_0_40px_rgba(192,132,252,0.6)] hover:-translate-y-1 transition-all duration-300">
                Book a Demo
              </button>
            </div>
          </section>

        </div>

        {/* --- FOOTER --- */}
        <footer className="relative z-30 py-12 text-center text-gray-400 text-[9px] tracking-[0.4em] uppercase bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 animate-pulse shadow-[0_0_15px_rgba(217,70,239,0.4)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          </div>
          <p className="opacity-90 font-bold text-gray-500">© {new Date().getFullYear()} Prominence. All operational rights reserved.</p>
          <p className="mt-4 opacity-50">Olongapo City, 2200</p>
        </footer>
      </div>
    </>
  );
}