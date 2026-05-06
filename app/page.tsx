"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------- */
/* DENSE PROCEDURAL CLOUD TEXTURE GENERATOR                                   */
/* -------------------------------------------------------------------------- */
const createProceduralCloudTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 512; 
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);

    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.9)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.4)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

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
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#000000" }}
    >
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 55% at 50% 50%, transparent 30%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10">
        <svg width="180" height="110" viewBox="-90 -70 180 110" overflow="visible">
          <ellipse ref={shadowRef} cx="0" cy="30" rx="72" ry="14" fill="#c084fc" style={{ filter: "blur(18px)" }} opacity="0.35" />
          <polygon ref={tri1Ref} points="0,-38 34,22 -34,22" fill="#7c3aed" stroke="#a855f7" strokeWidth="1.5" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 12px rgba(168,85,247,0.75))" }} />
          <polygon ref={tri2Ref} points="0,-38 34,22 -34,22" fill="#ffffff" stroke="rgba(255,255,255,0.55)" strokeWidth="1" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.55))" }} transform="translate(38,0) rotate(180)" />
        </svg>

        <p
          className="font-black tracking-[0.45em] text-transparent uppercase select-none"
          style={{ fontSize: "clamp(1.1rem, 4vw, 1.55rem)", WebkitTextStroke: "1px rgba(255,255,255,0.18)", textShadow: "0 0 40px rgba(168,85,247,0.45)" }}
        >
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
  const leftBlurRef = useRef<HTMLDivElement>(null);
  const rightBlurRef = useRef<HTMLDivElement>(null);
  
  const heroSpacerRef = useRef<HTMLDivElement>(null);
  const cloudTriggerRef = useRef<HTMLDivElement>(null);
  const threeCanvasRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  // Force scroll to top on initial load
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
    
    // Adjusted camera to center the dense horizontal cloud band
    camera.position.z = 25;
    camera.position.y = 0;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    // Match the container's rendered size perfectly
    renderer.setSize(threeCanvasRef.current.clientWidth, threeCanvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    threeCanvasRef.current.appendChild(renderer.domElement);

    const cloudTexture = createProceduralCloudTexture();
    
    const materialBg = new THREE.SpriteMaterial({ 
      map: cloudTexture, transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.NormalBlending
    });
    
    const materialFg = new THREE.SpriteMaterial({ 
      map: cloudTexture, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.NormalBlending
    });

    const createCloudCluster = (material: THREE.SpriteMaterial, count: number, spreadX: number, spreadY: number, spreadZ: number, scaleMin: number, scaleMax: number) => {
      const group = new THREE.Group();
      for (let i = 0; i < count; i++) {
        const sprite = new THREE.Sprite(material);
        sprite.position.set(
          (Math.random() - 0.5) * spreadX,
          (Math.random() - 0.5) * spreadY, // Vertical spread
          (Math.random() - 0.5) * spreadZ
        );
        const scale = Math.random() * (scaleMax - scaleMin) + scaleMin;
        sprite.scale.set(scale, scale, 1);
        sprite.material.rotation = Math.random() * Math.PI;
        group.add(sprite);
      }
      return group;
    };

    const countMult = 6; 
    
    // SPREAD-Y HALVED: Changed vertical spread to tightly pack the clouds.
    // Also slightly reduced the max scale to keep the band looking proportionately thin.
    const leftBg = createCloudCluster(materialBg, 60 * countMult, 90, 6, 10, 8, 14);
    const rightBg = createCloudCluster(materialBg, 60 * countMult, 90, 6, 10, 8, 14);
    const leftFg = createCloudCluster(materialFg, 80 * countMult, 80, 7.5, 10, 10, 18);
    const rightFg = createCloudCluster(materialFg, 80 * countMult, 80, 7.5, 10, 10, 18);

    // Initial off-screen positions 
    leftBg.position.set(-50, -1, -5);
    rightBg.position.set(50, -1, -5);
    leftFg.position.set(-60, -2, 2);
    rightFg.position.set(60, -2, 2);

    scene.add(leftBg, rightBg, leftFg, rightFg);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = Date.now() * 0.0003;
      
      leftBg.position.y += Math.sin(time) * 0.005;
      rightBg.position.y += Math.cos(time) * 0.005;
      leftFg.position.y += Math.sin(time + 1) * 0.008;
      rightFg.position.y += Math.cos(time + 1) * 0.008;
      
      [leftBg, rightBg, leftFg, rightFg].forEach(group => {
          group.children.forEach((sprite: any) => {
              sprite.material.rotation += (Math.random() - 0.5) * 0.0001;
          })
      })

      renderer.render(scene, camera);
    };
    animate();

    const ctx = gsap.context(() => {
      const cloudTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: cloudTriggerRef.current,
          start: "top 85%",
          end: "bottom 45%",
          scrub: 1.5,
        },
      });

      cloudTimeline
        .to(leftBg.position, { x: -15, ease: "power1.inOut" }, 0)
        .to(rightBg.position, { x: 15, ease: "power1.inOut" }, 0)
        .to(leftFg.position, { x: -8, ease: "power2.out" }, 0)
        .to(rightFg.position, { x: 8, ease: "power2.out" }, 0);
    });

    const handleResize = () => {
      if (!threeCanvasRef.current) return;
      camera.aspect = threeCanvasRef.current.clientWidth / threeCanvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(threeCanvasRef.current.clientWidth, threeCanvasRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      ctx.revert();
      renderer.dispose();
      materialBg.dispose();
      materialFg.dispose();
      cloudTexture.dispose();
      if (threeCanvasRef.current) threeCanvasRef.current.innerHTML = '';
    };
  }, [showPage]);

  /* --- STANDARD DOM GSAP SETUP --- */
  useEffect(() => {
    if (!showPage) return;
    gsap.set(uiWrapperRef.current, { opacity: 0, y: -20 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.body,
        start: "20px top",
        onEnter: () => gsap.to(uiWrapperRef.current, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }),
      });

      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroSpacerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      heroTimeline.fromTo(mountainBgRef.current, { scale: 1.3 }, { scale: 1.0, ease: "none" }, 0);
      heroTimeline.fromTo([leftBlurRef.current, rightBlurRef.current], { opacity: 0 }, { opacity: 1, ease: "none" }, 0.5);
      
      gsap.fromTo(aboutSectionRef.current.children, 
          { opacity: 0, y: 50 },
          { 
              opacity: 1, y: 0, duration: 1.5, stagger: 0.2, ease: "power2.out",
              scrollTrigger: { trigger: aboutSectionRef.current, start: "top 75%" }
          }
      )
    });

    return () => ctx.revert();
  }, [showPage]);

  const neumorphicButton =
    "bg-[#f5f7fa] text-[#7c3aed] font-black rounded-full px-8 py-3 text-[10px] uppercase tracking-widest shadow-[5px_5px_10px_rgba(0,0,0,0.1),-5px_-5px_10px_rgba(255,255,255,0.8)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] transition-all duration-300 hover:text-[#9333ea]";

  return (
    <>
      {!loaderDone && <TriangleLoader onComplete={handleLoaderComplete} />}

      <div className={`relative min-h-[300vh] bg-[#020104] text-white font-sans overflow-x-hidden selection:bg-fuchsia-500/40 ${showPage ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
        
        {/* FIXED BACKGROUND LAYER */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div
            ref={mountainBgRef}
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: "url('/images/mountain.jpg')", backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat", transform: "scale(1.3)",
            }}
          />
          <div ref={leftBlurRef} className="absolute inset-y-0 left-0 w-[200px] z-10 pointer-events-none opacity-0" style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", maskImage: "linear-gradient(to right, black 20%, transparent)", WebkitMaskImage: "linear-gradient(to right, black 20%, transparent)" }} />
          <div ref={rightBlurRef} className="absolute inset-y-0 right-0 w-[200px] z-10 pointer-events-none opacity-0" style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", maskImage: "linear-gradient(to left, black 20%, transparent)", WebkitMaskImage: "linear-gradient(to left, black 20%, transparent)" }} />
          <div className="absolute inset-0 pointer-events-none opacity-50" style={{ background: "linear-gradient(to bottom, rgba(2,1,4,0.3) 0%, transparent 20%, transparent 80%, rgba(2,1,4,1) 100%)" }} />
        </div>

        {/* UI ELEMENTS */}
        <div ref={uiWrapperRef} className="will-change-transform opacity-0 z-50 fixed top-6 inset-x-0 flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-5xl flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500" style={{ background: "#f3f5f8", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.05)" }}>
            <div className="font-black tracking-[0.25em] uppercase text-[10px] flex items-center gap-3 text-gray-800">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-3 h-3 rounded-full bg-fuchsia-400/60 animate-ping" />
                <div className="relative w-1.5 h-1.5 rounded-full bg-fuchsia-600 shadow-[0_0_10px_rgba(147,51,234,0.8)]" />
              </div>
              Prominence
            </div>
            <div className="hidden md:flex items-center gap-10 text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase">
              <a href="#about" className="hover:text-fuchsia-600 transition-colors duration-300">The Ascent</a>
              <a href="#team" className="hover:text-fuchsia-600 transition-colors duration-300">The Engine</a>
              <a href="#tools" className="hover:text-fuchsia-600 transition-colors duration-300">Ecosystem</a>
            </div>
            <button className={neumorphicButton}>Engage</button>
          </div>
        </div>

        {/* HERO SPACER */}
        <div ref={heroSpacerRef} className="relative z-10 w-full h-[120vh]" />

        {/* CLOUD TRANSITION ZONE */}
        <div ref={cloudTriggerRef} className="relative z-40 w-full h-[50vh] pointer-events-none">
           <div 
              ref={threeCanvasRef} 
              // Set bottom-0 and translate-y-[30px] to move the final cloud band 30px lower over the About section
              className="absolute bottom-0 translate-y-[30px] left-0 w-full h-[100vh]" 
              style={{ pointerEvents: "none" }}
           />
        </div>

        {/* ABOUT SECTION (FOOT OF THE MOUNTAIN) */}
        <section id="about" className="relative z-30 w-full bg-[#020104] pt-[15vh] pb-[20vh] px-8 border-t border-white/5">
          <div ref={aboutSectionRef} className="max-w-4xl mx-auto text-center relative z-20">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.3em] mb-10 text-white shadow-black drop-shadow-2xl opacity-0">
              Foot of the Mountain
            </h2>
            <div className="w-px h-24 bg-gradient-to-b from-fuchsia-600 to-transparent mx-auto mb-10 opacity-0" />
            <p className="text-white/60 text-lg md:text-xl leading-relaxed tracking-wide font-light opacity-0">
              Here at the base, the air is thick with anticipation. We build the foundations required to scale the highest peaks. Our systems are forged under pressure, architected with brutal precision, and designed to outlast the elements. Emerging from the cloud cover, the ascent begins now.
            </p>
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-0">
              <div className="p-8 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-md">
                <h3 className="text-fuchsia-400 font-bold tracking-widest text-[11px] uppercase mb-4">Preparation</h3>
                <p className="text-white/40 text-sm leading-loose">Mapping the terrain and charting the course before the ascent begins.</p>
              </div>
              <div className="p-8 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-md">
                <h3 className="text-fuchsia-400 font-bold tracking-widest text-[11px] uppercase mb-4">Endurance</h3>
                <p className="text-white/40 text-sm leading-loose">Systems engineered to withstand sudden shifts in altitude and scale.</p>
              </div>
              <div className="p-8 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-md">
                <h3 className="text-fuchsia-400 font-bold tracking-widest text-[11px] uppercase mb-4">Elevation</h3>
                <p className="text-white/40 text-sm leading-loose">Reaching the summit with zero technical debt and absolute clarity.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="relative z-30 py-20 text-center text-white/50 text-[9px] tracking-[0.4em] uppercase bg-black">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/80 animate-pulse" style={{ boxShadow: "0 0 20px rgba(255,255,255,1)" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </div>
          <p className="opacity-90 font-bold">© {new Date().getFullYear()} Prominence. All operational rights reserved.</p>
          <p className="mt-4 opacity-50">Olongapo City, 2200</p>
        </footer>
      </div>
    </>
  );
}

