"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import dynamic from "next/dynamic";
import { Globe, Clapperboard, Paintbrush, Mail, Phone } from "lucide-react";
import Image from "next/image";

const QuoteModal = dynamic(
  () => import("./components/QuoteModal/QuoteModal"),
  { ssr: false }
);

const SplashCursor = dynamic(
  () => import("./components/SplashCursor/SplashCursor"),
  { ssr: false }
);

const InfiniteGallery = dynamic(
  () => import("./components/InfiniteGallery/InfiniteGallery"),
  { ssr: false }
);

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
      gradient.addColorStop(0, `rgba(255,255,255,${opacity})`);
      gradient.addColorStop(0.3, `rgba(255,255,255,${opacity * 0.9})`);
      gradient.addColorStop(0.6, `rgba(255,255,255,${opacity * 0.6})`);
      gradient.addColorStop(0.85, `rgba(255,255,255,${opacity * 0.2})`);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
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
          <polygon ref={tri1Ref} points="0,-38 34,22 -34,22" fill="#7c3aed" stroke="#a855f7" strokeWidth="1.5" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 12px rgba(168,85,247,0.75))" }} />
          <polygon ref={tri2Ref} points="0,-38 34,22 -34,22" fill="#ffffff" stroke="rgba(255,255,255,0.55)" strokeWidth="1" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.55))" }} transform="translate(38,0) rotate(180)" />
        </svg>
        <p className="tracking-[0.45em] text-transparent uppercase select-none science-gothic-brand" style={{ fontSize: "clamp(1.1rem,4vw,1.55rem)", WebkitTextStroke: "1px rgba(255,255,255,0.18)", textShadow: "0 0 40px rgba(168,85,247,0.45)" }}>
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

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "delivered" | "received" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const mountainBgRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  const heroSpacerRef = useRef<HTMLDivElement>(null);
  const cloudTriggerRef = useRef<HTMLDivElement>(null);
  const threeCanvasRef = useRef<HTMLDivElement>(null);

  const worksRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const summitRef = useRef<SVGSVGElement>(null);
  const peakMaskRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);
  const [transitionLabel, setTransitionLabel] = useState("");
  const transitionOverlayRef = useRef<HTMLDivElement>(null);
  const [isIsaiahModalOpen, setIsIsaiahModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    const handleOpenQuote = () => setQuoteModalOpen(true);
    window.addEventListener('open-quote-modal', handleOpenQuote);
    return () => window.removeEventListener('open-quote-modal', handleOpenQuote);
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

  /* --- THREE.JS CLOUD SETUP --- */
  useEffect(() => {
    if (!showPage || !threeCanvasRef.current) return;
    const canvasEl = threeCanvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 70);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    canvasEl.appendChild(renderer.domElement);
    const cloudTexture = createProceduralCloudTexture();
    const makeUniforms = (base: number, sun: number, shadow: number, opacity: number, light: number) => ({
      uMap: { value: cloudTexture },
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color(base) },
      uSunColor: { value: new THREE.Color(sun) },
      uShadowColor: { value: new THREE.Color(shadow) },
      uOpacity: { value: opacity },
      uLightIntensity: { value: light },
    });
    const uniformsBg = makeUniforms(0xffffff, 0xffffff, 0xdee4ec, 0.65, 0.8);
    const uniformsFg = makeUniforms(0xffffff, 0xffffff, 0xeef2f5, 0.85, 1.0);
    const uniformsWisp = makeUniforms(0xffffff, 0xffffff, 0xffffff, 0.40, 0.9);
    const makeMat = (u: typeof uniformsBg) => new THREE.ShaderMaterial({ vertexShader: cloudVertexShader, fragmentShader: cloudFragmentShader, uniforms: u, transparent: true, depthWrite: false, blending: THREE.NormalBlending });
    const materialBg = makeMat(uniformsBg);
    const materialFg = makeMat(uniformsFg);
    const materialWisp = makeMat(uniformsWisp);
    const geometry = new THREE.PlaneGeometry(1, 1);
    const createCloudCluster = (material: THREE.ShaderMaterial, count: number, sX: number, sY: number, sZ: number, scMin: number, scMax: number) => {
      const group = new THREE.Group();
      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set((Math.random() - 0.5) * sX, (Math.random() - 0.5) * sY, (Math.random() - 0.5) * sZ);
        const sc = Math.random() * (scMax - scMin) + scMin;
        mesh.scale.set(sc, sc, 1);
        mesh.rotation.z = Math.random() * Math.PI * 2;
        mesh.userData = { rotationSpeed: (Math.random() - 0.5) * 0.0001, floatSpeed: Math.random() * 0.0008 + 0.0005, floatOffset: Math.random() * Math.PI * 2, floatAmplitude: Math.random() * 0.01 + 0.005 };
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
    type CloudUserData = {
      rotationSpeed: number;
      floatSpeed: number;
      floatOffset: number;
      floatAmplitude: number;
    };
    type CloudMesh = THREE.Mesh & { userData: CloudUserData };
    [leftWisp, rightWisp].forEach(g => g.children.forEach((child) => { const m = child as CloudMesh; m.scale.y *= (Math.random() * 0.25 + 0.25); }));
    leftBg.position.set(-100, -17, -15); rightBg.position.set(100, -17, -15);
    leftFg.position.set(-80, -20, 8); rightFg.position.set(80, -20, 8);
    leftWisp.position.set(-120, -12, 15); rightWisp.position.set(120, -12, 15);
    scene.add(leftBg, rightBg, leftFg, rightFg, leftWisp, rightWisp);
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    if (canvasEl) observer.observe(canvasEl);

    let cft = 0;
    const cBZ = camera.position.z, cBY = camera.position.y, cBX = camera.position.x;
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return; // Skip heavy work and render if not visible
      const time = Date.now();
      cft += 0.016;
      camera.position.x = cBX + Math.sin(cft * 0.3) * 0.08 + Math.sin(cft * 2.1) * 0.015;
      camera.position.y = cBY + Math.cos(cft * 0.25) * 0.06 + Math.cos(cft * 1.8) * 0.012;
      camera.position.z = cBZ + Math.sin(cft * 0.15) * 0.4;
      camera.rotation.z = Math.sin(cft * 0.2) * 0.002;
      camera.rotation.y = Math.sin(cft * 0.18) * 0.003;
      uniformsBg.uTime.value = uniformsFg.uTime.value = uniformsWisp.uTime.value = time * 0.0008;
      leftBg.position.y += Math.sin(time * 0.00008) * 0.002;
      rightBg.position.y += Math.cos(time * 0.00008) * 0.002;
      leftFg.position.y += Math.sin(time * 0.00008 + 1) * 0.003;
      rightFg.position.y += Math.cos(time * 0.00008 + 1) * 0.003;
      leftWisp.position.x += 0.008; rightWisp.position.x -= 0.008;
      leftWisp.position.y += Math.sin(time * 0.0001) * 0.004;
      rightWisp.position.y += Math.cos(time * 0.0001) * 0.004;
      [leftBg, rightBg, leftFg, rightFg, leftWisp, rightWisp].forEach(g => g.children.forEach((child) => {
        const m = child as CloudMesh;
        m.rotation.z += m.userData.rotationSpeed;
        m.position.y += Math.sin(time * m.userData.floatSpeed + m.userData.floatOffset) * m.userData.floatAmplitude;
      }));
      renderer.render(scene, camera);
    };
    animate();
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: heroSpacerRef.current, start: "top top", end: "bottom top", scrub: 2 } })
        .to(camera.position, { z: 30, y: -5, ease: "power2.inOut" });
      gsap.timeline({ scrollTrigger: { trigger: cloudTriggerRef.current, start: "top 100%", end: "bottom 0%", scrub: 2.5 } })
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
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      ctx.revert();
      renderer.dispose();
      materialBg.dispose(); materialFg.dispose(); materialWisp.dispose();
      geometry.dispose(); cloudTexture.dispose();
      if (canvasEl) canvasEl.innerHTML = "";
    };
  }, [showPage]);

  /* --- DOM GSAP SETUP --- */
  useEffect(() => {
    if (!showPage) return;

    const ctx = gsap.context(() => {

      if (mountainBgRef.current) {
        gsap.fromTo(mountainBgRef.current, { scale: 1.4 }, {
          scale: 1.0, ease: "power2.out",
          scrollTrigger: { trigger: heroSpacerRef.current, start: "top top", end: "bottom top", scrub: 1.8 },
        });
      }

      if (peakMaskRef.current) {
        const peakInner = peakMaskRef.current.querySelector('.peak-mask-inner') as HTMLElement;
        if (peakInner) {
          gsap.fromTo(peakInner, { scale: 1.4 }, {
            scale: 1.0, ease: "power2.out",
            scrollTrigger: { trigger: heroSpacerRef.current, start: "top top", end: "bottom top", scrub: 1.8 },
          });
        }
        gsap.to(peakMaskRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroSpacerRef.current,
            start: "60% top",
            end: "bottom top",
             scrub: 1,
          },
        });
      }

      if (heroSectionRef.current) {
        const heroEls = heroSectionRef.current.querySelectorAll(".hero-fade-in");
        gsap.fromTo(heroEls,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "power3.out", delay: 0.5 }
        );

        const titleLetters = heroSectionRef.current.querySelectorAll(".hero-title-letter");
        gsap.fromTo(titleLetters,
          { filter: "blur(20px)", scale: 1.5, opacity: 0, y: 50, rotationX: 45 },
          {
            filter: "blur(0px)", scale: 1, opacity: 1, y: 0, rotationX: 0,
            duration: 1.2, stagger: 0.08, ease: "power4.out", delay: 0.3
          }
        );

        const parallaxEls = heroSectionRef.current.querySelectorAll(".hero-parallax");
        parallaxEls.forEach((el) => {
          const speed = parseFloat((el as HTMLElement).dataset.speed || "0.5");
          gsap.to(el, {
            y: () => -(window.innerHeight * (1 - speed) * 0.5),
            ease: "none",
            scrollTrigger: {
              trigger: heroSpacerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        });

        gsap.to(heroSectionRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroSpacerRef.current,
            start: "60% top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      if (worksRef.current) {
        gsap.fromTo(worksRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: worksRef.current, start: "top 90%" } }
        );
      }

      if (contactRef.current) {
        gsap.fromTo(contactRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: contactRef.current, start: "top 80%" } }
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ctaRef.current, start: "top 85%" } }
        );
      }

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
  const darkButton = "backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/40 active:scale-[0.98] transition-all duration-300 text-purple-300 font-bold uppercase tracking-widest";
  const darkInput = "w-full rounded-xl px-5 py-4 text-sm font-medium text-white/80 outline-none focus:ring-2 focus:ring-purple-500/30 transition-all border border-white/[0.08] placeholder-white/30";

  return (
    <div>
      {!loaderDone && <TriangleLoader onComplete={handleLoaderComplete} />}
      {loaderDone && <SplashCursor />}

      {/* MORPH PAGE-TRANSITION OVERLAY */}
      <div
        ref={transitionOverlayRef}
        className="fixed inset-0 z-[250] pointer-events-none"
        style={{ display: "none" }}
      >
        <div className="morph-blob absolute inset-0" style={{ background: "rgba(192, 132, 252, 0.95)" }} />
        <div className="morph-blob absolute inset-0" style={{ background: "rgba(168, 85, 247, 0.96)" }} />
        <div className="morph-blob absolute inset-0" style={{ background: "rgba(147, 51, 234, 0.97)" }} />
        <div className="morph-blob absolute inset-0" style={{ background: "rgba(124, 58, 237, 1)" }} />

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

        {/* FIXED MOUNTAIN BG */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#020104]">
          <div ref={mountainBgRef} className="absolute inset-0 will-change-transform" style={{ backgroundImage: "url('/images/mountain.jpg')", backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat", transform: "scale(1.4)" }} />
          <div className="absolute inset-0 pointer-events-none opacity-60" style={{ background: "linear-gradient(to bottom, rgba(2,1,4,0.3) 0%, transparent 20%, transparent 70%, rgba(230,234,240,0.3) 82%, rgba(230,234,240,0.6) 90%, #e6eaf0 100%)" }} />
        </div>

        {/* MOUNTAIN PEAK FOREGROUND MASK — 3D depth overlapping text */}
        <div ref={peakMaskRef} className="fixed inset-0 z-[15] pointer-events-none">
          <div className="peak-mask-inner absolute inset-0 will-change-transform" style={{
            backgroundImage: "url('/images/mountain.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            transform: 'scale(1.4)',
            maskImage: 'radial-gradient(ellipse 20% 14% at 50% 32%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 45%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 20% 14% at 50% 32%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 45%, transparent 70%)',
          }} />
        </div>

        {/* HERO ON MOUNTAIN */}
        <div ref={heroSpacerRef} className="relative z-10 w-full min-h-[100vh] flex flex-col">

          <div ref={heroSectionRef} className="relative flex-1 flex flex-col items-center justify-center text-center w-full mt-[136px]">

            {/* Iridescent light flares — screen blend for additive color */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5, mixBlendMode: 'screen' as const }}>
              {/* Warm golden flare */}
              <div className="absolute hero-flare-1" style={{
                width: '500px', height: '400px',
                top: '10%', left: '20%',
                background: 'radial-gradient(ellipse at center, rgba(255,200,120,0.35) 0%, rgba(255,160,80,0.15) 35%, transparent 70%)',
                filter: 'blur(30px)',
              }} />
              {/* Cool purple flare */}
              <div className="absolute hero-flare-2" style={{
                width: '450px', height: '500px',
                top: '5%', right: '15%',
                background: 'radial-gradient(ellipse at center, rgba(180,120,255,0.3) 0%, rgba(147,51,234,0.12) 40%, transparent 70%)',
                filter: 'blur(25px)',
              }} />
              {/* Cyan accent flare */}
              <div className="absolute hero-flare-3" style={{
                width: '350px', height: '300px',
                top: '25%', left: '38%',
                background: 'radial-gradient(ellipse at center, rgba(120,220,255,0.25) 0%, rgba(100,180,255,0.1) 35%, transparent 65%)',
                filter: 'blur(35px)',
              }} />
            </div>

            {/* Color-dodge accent — intense light leak hotspot */}
            <div className="absolute hero-flare-1 pointer-events-none" style={{
              width: '300px', height: '250px',
              top: '15%', left: '40%',
              zIndex: 5,
              background: 'radial-gradient(ellipse at center, rgba(255,220,180,0.2) 0%, transparent 60%)',
              filter: 'blur(20px)',
              mixBlendMode: 'color-dodge' as const,
            }} />

            {/* Headline */}
            <h1
              className="hero-parallax mb-8 flex justify-center gap-0 sm:gap-[2px] science-gothic-brand text-[clamp(0.8rem,4.5vw,1.5rem)] sm:text-[clamp(2.5rem,10vw,8.75rem)]"
              data-speed="0.6"
              style={{
                letterSpacing: "0.02em",
                lineHeight: 0.9,
                color: "rgba(255,255,255,0.95)",
                perspective: "1000px",
                position: "relative" as const,
                zIndex: 2,
              }}
            >
              {"PROMINENCE".split("").map((letter, i) => (
                <span
                  key={i}
                  className="hero-title-letter"
                  style={{
                    display: "inline-block",
                    willChange: "transform, filter, opacity",
                    textShadow: "0 0 40px rgba(147,51,234,0.5), 0 0 80px rgba(147,51,234,0.25), 0 0 120px rgba(168,85,247,0.15), 0 4px 20px rgba(0,0,0,0.5)"
                  }}
                >
                  {letter}
                </span>
              ))}
            </h1>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center justify-center relative z-10 w-full mt-4 mb-12">
              <a
                href="#contact"
                className="btn-light-neumorphic hero-fade-in hero-parallax group"
                data-speed="0.5"
              >
                <span>Discover Now</span>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-purple-500 transition-transform group-hover:translate-x-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
              </a>

              <button
                onClick={() => setQuoteModalOpen(true)}
                className="btn-light-neumorphic hero-fade-in hero-parallax group"
                data-speed="0.5"
              >
                <span className="text-[#E36EFF]">Get a Quote</span>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-[#E36EFF] transition-transform group-hover:translate-x-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </span>
              </button>
            </div>
          </div>

          <div className="hero-fade-in relative w-full pb-10 pt-16 px-6" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 mb-32 gap-16 w-full max-w-full mx-auto">
              {[
                { num: '01', label: 'Web Development', desc: 'We architect scalable, high-performance web platforms that drive results and deliver seamless user experiences across every device.' },
                { num: '02', label: 'Graphics Design', desc: 'Crafting striking brand identities, print design, and visual strategies that command attention and elevate your market presence.' },
                { num: '03', label: 'Video Editing', desc: 'Cinematic post-production, motion graphics, and narrative-driven edits that transform raw footage into compelling visual stories.' },
              ].map((svc, i) => (
                <div key={i} className={`flex items-start gap-4 sm:px-6 py-4 ${i > 0 ? 'border-t border-white/30 pt-8 mt-4 sm:border-t-0 sm:pt-4 sm:mt-0 sm:border-l sm:border-white' : ''}`}>
                  <span style={{ fontFamily: "'Astrona', 'Astron', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', lineHeight: 1, color: 'rgba(255, 255, 255, 1)', fontWeight: 400 }}>
                    {svc.num}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[20px] font-bold tracking-[0.15em] uppercase text-white/80">{svc.label}</span>
                    <span className="text-[15px] text-white/100 font-medium leading-[1.8]">{svc.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 ml-6 w-24 h-[2px] bg-gradient-to-r from-white/40 to-transparent" />
          </div>

        </div>

        <div ref={cloudTriggerRef} className="relative z-20 w-full h-[40vh] translate-y-[20px] pointer-events-none flex items-center justify-center">
          <div ref={threeCanvasRef} className="absolute inset-0 w-full h-[150vh] -top-[50vh]" style={{ pointerEvents: "none", maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 5%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.5) 18%, black 28%, black 55%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0.05) 90%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 5%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.5) 18%, black 28%, black 55%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0.05) 90%, transparent 100%)" }} />
        </div>

        {/* MAIN CONTENT */}
        <div className="relative z-30 w-full rounded-t-[3rem] -mt-10 pt-24 pb-32 px-6 sm:px-12" style={{ background: 'linear-gradient(180deg, #e6eaf0 0%, #e6eaf0 15%, #ddd8e8 22%, #c4bbd8 28%, #8b7faa 36%, #5a4e80 43%, #3a3060 50%, #262050 56%, #1e1a3a 62%, #161330 70%, #100e24 80%, #0c0a1a 90%, #0a0814 100%)', overflowX: 'clip' }}>
          <div className="starfield" style={{ top: '0', maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 40%, black 70%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 40%, black 70%)' }} />

          {/* WORKS — SEAMLESS AUTO-LOOPING MASONRY GALLERY */}
          <div className="relative -mx-6 sm:-mx-12">
            <section id="works" ref={worksRef}>
              <Suspense fallback={<div className="h-[400px] w-full flex items-center justify-center text-white/50">Loading Gallery...</div>}>
                <InfiniteGallery />
              </Suspense>
            </section>
          </div>

          {/* CONTACT SECTION */}
          <section id="contact" className="max-w-6xl mx-auto py-32 px-4 border-t border-white/[0.06]" ref={contactRef}>

            <div className="text-center mb-16">
              <p className="text-fuchsia-500 text-[9px] tracking-[0.5em] uppercase font-black mb-6">Ready to Collaborate</p>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.08em] text-white/90 mb-4" style={{ textShadow: '0 0 30px rgba(147,51,234,0.2)' }}>
                Start a Project
              </h2>
              <p className="text-white/30 text-sm font-medium max-w-lg mx-auto leading-relaxed mb-8">
                Choose a service below or send us a general inquiry.
              </p>
              <button
                onClick={() => setQuoteModalOpen(true)}
                className={`px-10 py-4 rounded-full text-sm cursor-pointer ${darkButton}`}
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))', boxShadow: '0 0 30px rgba(147,51,234,0.15)' }}
              >
                Get a Quote →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
              {[
                { title: 'Web Development', desc: 'Scalable Next.js web apps & platforms', icon: <Globe size={28} />, href: '#contact' },
                { title: 'Graphics Design', desc: 'Branding, identity, print & digital assets', icon: <Paintbrush size={28} />, href: '/graphics#contact' },
                { title: 'Video Editing', desc: 'Cinematic reels, shorts, films & motion', icon: <Clapperboard size={28} />, href: '/video#contact' },
              ].map((svc, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-[2rem] p-8 md:p-10 flex flex-col items-center text-center gap-4 group transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    background: 'rgba(15, 10, 35, 0.5)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(147,51,234,0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
                  }}
                >
                  <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 70%)' }} />
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-fuchsia-400 mb-2" style={{ background: 'rgba(147,51,234,0.1)', boxShadow: '0 0 20px rgba(147,51,234,0.1)' }}>
                    {svc.icon}
                  </div>
                  <h3 className="text-white/90 font-bold text-sm tracking-[0.1em] uppercase">{svc.title}</h3>
                  <p className="text-white/30 text-xs leading-relaxed font-medium">{svc.desc}</p>
                  <a
                    href={svc.href}
                    className={`mt-3 px-6 py-3 rounded-full text-[10px] cursor-pointer ${darkButton}`}
                    style={{ background: 'rgba(147,51,234,0.12)', boxShadow: '0 0 15px rgba(147,51,234,0.08)' }}
                  >
                    Go to {svc.title} Contact
                  </a>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8" ref={ctaRef}>
              <div className="lg:col-span-3 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden" style={{ background: 'rgba(15, 10, 35, 0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(147,51,234,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <span className="text-[9px] tracking-[0.3em] uppercase text-emerald-400/70 font-bold">Secure Channel Active</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-[0.08em] text-white/90 mb-2" style={{ textShadow: '0 0 20px rgba(147,51,234,0.15)' }}>Send a Message</h3>
                <p className="text-white/35 text-xs mb-8 font-medium leading-relaxed">Your message is delivered via email and appears in our command center in realtime.</p>

                {submitStatus !== "idle" && (
                  <div className="mb-6 rounded-xl p-4" style={{ background: 'rgba(10, 8, 20, 0.6)', border: '1px solid rgba(147,51,234,0.08)' }}>
                    <div className="text-center">
                      {submitStatus === "sending" && (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-4 h-4 border-2 border-purple-400/40 border-t-purple-400 rounded-full animate-spin" />
                          <span className="text-purple-300/80 text-xs tracking-widest uppercase font-bold">Transmitting...</span>
                        </div>
                      )}
                      {submitStatus === "delivered" && <p className="text-emerald-400 text-xs tracking-widest uppercase font-bold">✓ Message delivered</p>}
                      {submitStatus === "received" && <p className="text-emerald-400 text-xs tracking-widest uppercase font-bold">✓✓ Confirmed</p>}
                      {submitStatus === "error" && <p className="text-red-400 text-xs tracking-widest uppercase font-bold">✕ {submitError || "Failed"}</p>}
                    </div>
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] tracking-[0.25em] uppercase text-white/30 font-bold mb-2 ml-1">Name</label>
                      <input type="text" required placeholder="Your name" className={darkInput} style={{ background: 'rgba(147,51,234,0.06)' }} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={submitStatus === "sending"} />
                    </div>
                    <div>
                      <label className="block text-[9px] tracking-[0.25em] uppercase text-white/30 font-bold mb-2 ml-1">Email</label>
                      <input type="email" required placeholder="your@email.com" className={darkInput} style={{ background: 'rgba(147,51,234,0.06)' }} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={submitStatus === "sending"} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] tracking-[0.25em] uppercase text-white/30 font-bold mb-2 ml-1">Message</label>
                    <textarea required placeholder="Describe your project..." rows={4} className={`${darkInput} resize-none`} style={{ background: 'rgba(147,51,234,0.06)' }} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} disabled={submitStatus === "sending"} />
                  </div>
                  <button
                    type="submit"
                    disabled={submitStatus === "sending" || submitStatus === "delivered" || submitStatus === "received"}
                    className={`w-full px-8 py-4 rounded-full ${darkButton} ${submitStatus === "sending" ? "opacity-50 cursor-wait" : ""} ${["delivered", "received"].includes(submitStatus) ? "opacity-40 pointer-events-none" : ""}`}
                    style={{ background: 'rgba(147,51,234,0.15)', boxShadow: '0 0 20px rgba(147,51,234,0.1)' }}
                  >
                    {submitStatus === "sending" ? "Transmitting..." : (submitStatus === "delivered" || submitStatus === "received") ? "Sent ✓" : "Send Message"}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="flex-1 rounded-[2rem] p-8 flex flex-col justify-center gap-4" style={{ background: 'rgba(15, 10, 35, 0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(147,51,234,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(147,51,234,0.1)' }}>
                    <Mail size={22} className="text-fuchsia-400" />
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 font-bold mb-1">Email</p>
                    <a href="mailto:prominence.va@gmail.com" className="text-white/70 text-sm font-semibold hover:text-fuchsia-400 transition-colors">prominence.va@gmail.com</a>
                  </div>
                </div>

                <div className="flex-1 rounded-[2rem] p-8 flex flex-col justify-center gap-4" style={{ background: 'rgba(15, 10, 35, 0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(147,51,234,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.1)' }}>
                    <Phone size={22} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 font-bold mb-1">WhatsApp</p>
                    <a href="tel:09560542898" className="text-white/70 text-sm font-semibold hover:text-emerald-400 transition-colors">09560542898</a>
                  </div>
                </div>

                <div className="rounded-[2rem] p-6 text-center" style={{ background: 'rgba(147,51,234,0.06)', border: '1px solid rgba(147,51,234,0.08)' }}>
                  <p className="text-white/25 text-[9px] tracking-widest uppercase font-medium">Average response within 24h</p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* FOOTER */}
        <footer ref={footerRef} className="relative z-30 overflow-hidden" style={{ background: '#0a0814' }}>
          <div className="relative">
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
              <rect width="1440" height="320" fill="url(#summitSky)" />
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
              <path
                d="M0,280 L80,240 L160,255 L240,210 L320,230 L400,185 L480,200 L560,160 L640,175 L680,140 L720,120 L760,140 L800,165 L880,190 L960,170 L1040,195 L1120,175 L1200,200 L1280,185 L1360,210 L1440,195 L1440,320 L0,320 Z"
                fill="url(#summitGrad2)"
                opacity="0.5"
              />
              <path
                d="M0,290 L60,270 L120,280 L200,245 L280,260 L340,220 L420,235 L480,195 L540,210 L600,175 L660,155 L720,100 L780,155 L820,180 L880,200 L940,185 L1000,210 L1060,195 L1120,215 L1180,200 L1240,225 L1320,210 L1380,230 L1440,220 L1440,320 L0,320 Z"
                fill="url(#summitGrad1)"
                opacity="0.75"
              />
              <path
                d="M0,300 L40,290 L100,295 L160,275 L220,285 L280,260 L340,270 L400,245 L440,255 L500,230 L560,240 L620,215 L680,195 L720,160 L760,195 L800,220 L840,235 L900,250 L960,240 L1020,255 L1060,245 L1120,260 L1180,250 L1240,265 L1300,255 L1360,270 L1400,260 L1440,265 L1440,320 L0,320 Z"
                fill="url(#summitGrad3)"
              />
              <path d="M700,170 L720,100 L740,170" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M710,140 L720,100 L730,140" fill="rgba(255,255,255,0.08)" />
            </svg>
          </div>

          {/* Footer Content */}
          <div style={{ background: "linear-gradient(to bottom, #0a0a14, #0d0d1a 40%, #111126)" }} className="relative">
            <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 pt-16 pb-10">

              <div className="footer-animate flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-16">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center relative" style={{ background: "rgba(147,51,234,0.12)", boxShadow: "0 0 30px rgba(147,51,234,0.15), inset 0 1px 1px rgba(255,255,255,0.05)" }}>
                    <Image
                      src="/images/icon-logo.png"
                      alt="Prominence"
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="tracking-[0.25em] uppercase text-white/90 text-sm science-gothic-brand">Prominence</h4>
                    <p className="text-[9px] tracking-[0.3em] uppercase text-purple-400/60 font-semibold mt-0.5">Virtual Assistance</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsIsaiahModalOpen(true)}
                  className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/[0.1] hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                  style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" style={{ boxShadow: '0 0 8px rgba(168,85,247,0.8)' }} />
                  <span className="text-white/90 text-[11px] tracking-[0.25em] uppercase science-gothic-brand">
                    Isaiah 60 &mdash; 61
                  </span>
                </button>

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

              <div className="footer-animate w-full h-px mb-10" style={{ background: "linear-gradient(to right, transparent, rgba(147,51,234,0.25), rgba(255,255,255,0.06), rgba(147,51,234,0.25), transparent)" }} />

              <div className="footer-animate flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
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

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)] animate-pulse" />
                  <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 font-bold">Systems Operational</span>
                </div>
              </div>

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

            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] pointer-events-none"
              style={{ background: "linear-gradient(to right, transparent, rgba(147,51,234,0.4), transparent)" }}
            />
          </div>
        </footer>
      </div>

      {/* ISAIAH MODAL */}
      {isIsaiahModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md" onClick={() => setIsIsaiahModalOpen(false)}>
          <div
            className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl p-8 sm:p-12 border border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.15)]"
            style={{ background: "linear-gradient(180deg, #111126 0%, #0a0a14 100%)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsIsaiahModalOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all z-10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-widest text-white mb-8 science-gothic-brand text-center drop-shadow-md">
              Isaiah 60 &mdash; 61
            </h2>

            <div className="text-white/80 font-medium leading-relaxed space-y-6 text-base sm:text-lg text-center" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
              <p>
                1 Arise, shine, for your light has come,<br />
                and the glory of the Lord has risen upon you.<br />
                2 For behold, darkness shall cover the earth,<br />
                and thick darkness the peoples;<br />
                but the Lord will arise upon you,<br />
                and his glory will be seen upon you.<br />
                3 And nations shall come to your light,<br />
                and kings to the brightness of your rising.
              </p>
              <p>
                4 Lift up your eyes all around, and see;<br />
                they all gather together, they come to you;<br />
                your sons shall come from afar,<br />
                and your daughters shall be carried on the hip.<br />
                5 Then you shall see and be radiant;<br />
                your heart shall thrill and exult,<br />
                because the abundance of the sea shall be turned to you,<br />
                the wealth of the nations shall come to you.
              </p>
              <p>
                6 A multitude of camels shall cover you,<br />
                the young camels of Midian and Ephah;<br />
                all those from Sheba shall come.<br />
                They shall bring gold and frankincense,<br />
                and shall bring good news, the praises of the Lord.<br />
                7 All the flocks of Kedar shall be gathered to you;<br />
                the rams of Nebaioth shall minister to you;<br />
                they shall come up with acceptance on my altar,<br />
                and I will beautify my beautiful house.
              </p>
              <p>
                8 Who are these that fly like a cloud,<br />
                and like doves to their windows?<br />
                9 For the coastlands shall hope for me,<br />
                the ships of Tarshish first,<br />
                to bring your children from afar,<br />
                their silver and gold with them,<br />
                for the name of the Lord your God,<br />
                and for the Holy One of Israel,<br />
                because he has made you beautiful.
              </p>
              <p>
                10 Foreigners shall build up your walls,<br />
                and their kings shall minister to you;<br />
                for in my wrath I struck you,<br />
                but in my favor I have had mercy on you.<br />
                11 Your gates shall be open continually;<br />
                day and night they shall not be shut,<br />
                that people may bring to you the wealth of the nations,<br />
                with their kings led in procession.<br />
                12 For the nation and kingdom<br />
                that will not serve you shall perish;<br />
                those nations shall be utterly laid waste.
              </p>
              <p>
                13 The glory of Lebanon shall come to you,<br />
                the cypress, the plane, and the pine,<br />
                to beautify the place of my sanctuary,<br />
                and I will make the place of my feet glorious.<br />
                14 The sons of those who afflicted you<br />
                shall come bending low to you,<br />
                and all who despised you<br />
                shall bow down at your feet;<br />
                they shall call you the City of the Lord,<br />
                the Zion of the Holy One of Israel.
              </p>
              <p>
                15 Whereas you have been forsaken and hated,<br />
                with no one passing through,<br />
                I will make you majestic forever,<br />
                a joy from age to age.<br />
                16 You shall suck the milk of nations;<br />
                you shall nurse at the breast of kings;<br />
                and you shall know that I, the Lord, am your Savior<br />
                and your Redeemer, the Mighty One of Jacob.
              </p>
              <p>
                17 Instead of bronze I will bring gold,<br />
                and instead of iron I will bring silver;<br />
                instead of wood, bronze,<br />
                instead of stones, iron.<br />
                I will make your overseers peace<br />
                and your taskmasters righteousness.<br />
                18 Violence shall no more be heard in your land,<br />
                devastation or destruction within your borders;<br />
                you shall call your walls Salvation,<br />
                and your gates Praise.
              </p>
              <p>
                19 The sun shall be no more<br />
                your light by day,<br />
                nor for brightness shall the moon<br />
                give you light;<br />
                but the Lord will be your everlasting light,<br />
                and your God will be your glory.<br />
                20 Your sun shall no more go down,<br />
                nor your moon withdraw itself;<br />
                for the Lord will be your everlasting light,<br />
                and your days of mourning shall be ended.<br />
                21 Your people shall all be righteous;<br />
                they shall possess the land forever,<br />
                the branch of my planting, the work of my hands,<br />
                that I might be glorified.<br />
                22 The least one shall become a clan,<br />
                and the smallest one a mighty nation;<br />
                I am the Lord;<br />
                in its time I will hasten it.
              </p>

              <div className="w-full h-px bg-white/10 my-12" />

              <p>
                1 The Spirit of the Lord God is upon me,<br />
                because the Lord has anointed me<br />
                to bring good news to the poor;<br />
                he has sent me to bind up the brokenhearted,<br />
                to proclaim liberty to the captives,<br />
                and the opening of the prison to those who are bound;<br />
                2 to proclaim the year of the Lord&apos;s favor,<br />
                and the day of vengeance of our God;<br />
                to comfort all who mourn;<br />
                3 to grant to those who mourn in Zion—<br />
                to give them a beautiful headdress instead of ashes,<br />
                the oil of gladness instead of mourning,<br />
                the garment of praise instead of a faint spirit;<br />
                that they may be called oaks of righteousness,<br />
                the planting of the Lord, that he may be glorified.
              </p>
              <p>
                4 They shall build up the ancient ruins;<br />
                they shall raise up the former devastations;<br />
                they shall repair the ruined cities,<br />
                the devastations of many generations.
              </p>
              <p>
                5 Strangers shall stand and tend your flocks;<br />
                foreigners shall be your plowmen and vinedressers;<br />
                6 but you shall be called the priests of the Lord;<br />
                they shall speak of you as the ministers of our God;<br />
                you shall eat the wealth of the nations,<br />
                and in their glory you shall boast.<br />
                7 Instead of your shame there shall be a double portion;<br />
                instead of dishonor they shall rejoice in their lot;<br />
                therefore in their land they shall possess a double portion;<br />
                they shall have everlasting joy.
              </p>
              <p>
                8 For I the Lord love justice;<br />
                I hate robbery and wrong;<br />
                I will faithfully give them their recompense,<br />
                and I will make an everlasting covenant with them.<br />
                9 Their offspring shall be known among the nations,<br />
                and their descendants in the midst of the peoples;<br />
                all who see them shall acknowledge them,<br />
                that they are an offspring the Lord has blessed.
              </p>
              <p>
                10 I will greatly rejoice in the Lord;<br />
                my soul shall exult in my God,<br />
                for he has clothed me with the garments of salvation;<br />
                he has covered me with the robe of righteousness,<br />
                as a bridegroom decks himself like a priest with a beautiful headdress,<br />
                and as a bride adorns herself with her jewels.<br />
                11 For as the earth brings forth its sprouts,<br />
                and as a garden causes what is sown in it to sprout up,<br />
                so the Lord God will cause righteousness and praise<br />
                to sprout up before all the nations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* QUOTE MODAL */}
      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
    </div>
  );
}