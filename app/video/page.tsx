"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import gsap from "gsap";
import {
  Menu,
  X,
  ArrowRight,
  Send,
  PlayCircle,
  Star,
  Sparkles,
  Palette,
  Layers,
  Headphones,
  Smartphone,
  Eye,
  Scissors,
  Zap,
  Users,
  Target,
  Clock,
  CheckCircle,
  Sliders,
  MessageCircle,
  Briefcase,
  Cpu,
  Film,
  Mail,
  User,
  MapPin,
  ArrowRight as ArrowRightIcon,
  ExternalLink,
  FolderOpen,
  Download,
  Video
} from "lucide-react";

// Simple social icons as custom components since lucide-react doesn't export them
const Twitter = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Instagram = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const Github = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.296 2.75-1.026 2.75-1.026.544 1.378.201 2.397.098 2.65.64.7 1.029 1.595 1.029 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const Linkedin = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
  </svg>
);

// ─── Types for Three.js objects ──────────────────────────────────────────────
interface RippleObject {
  mesh: THREE.Mesh;
  t: number;
  speed: number;
  maxR: number;
  x: number;
  z: number;
}

/* ─────────────────────────────────────────────
   THREE.JS + GSAP WATER / LILY-PAD CANVAS
───────────────────────────────────────────── */
function WaterCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const waterGeoRef = useRef<THREE.PlaneGeometry | null>(null);
  const origYRef = useRef<number[]>([]);
  const ripplesRef = useRef<RippleObject[]>([]);
  const animIdRef = useRef<number>(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const mountNode = mountRef.current;

    const W = window.innerWidth;
    const H = window.innerHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a2a1a, 1);
    if (mountNode) {
      mountNode.appendChild(renderer.domElement);
    }
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a2a1a, 0.035);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera.position.set(0, 14, 18);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // ── Water plane ──
    const waterGeo = new THREE.PlaneGeometry(80, 80, 120, 120);
    const waterMat = new THREE.MeshPhongMaterial({
      color: 0x0d4a30,
      shininess: 160,
      specular: 0x44ffaa,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    scene.add(water);
    waterGeoRef.current = waterGeo;

    // Store original Y positions
    const posAttr = waterGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      origYRef.current.push(posAttr.getY(i));
    }

    // ── Ambient + directional lights ──
    scene.add(new THREE.AmbientLight(0x88ffcc, 0.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(10, 20, 10);
    scene.add(sun);
    const fill = new THREE.PointLight(0x00ffaa, 0.8, 60);
    fill.position.set(-10, 5, -10);
    scene.add(fill);

    // ── Lily pad factory ──
    function makeLilyPad(x: number, z: number, radius: number, rot: number) {
      const group = new THREE.Group();

      // Pad shape (disc with notch via custom geometry)
      const shape = new THREE.Shape();
      const notchAngle = Math.PI * 0.18;
      shape.moveTo(0, 0);
      shape.absarc(0, 0, radius, notchAngle, Math.PI * 2 - notchAngle, false);
      shape.lineTo(0, 0);

      const geo = new THREE.ShapeGeometry(shape, 64);
      const hue = 0.33 + (radius * 0.02);
      const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(hue, 0.7, 0.3),
        shininess: 80,
        specular: 0x88ffaa,
        side: THREE.DoubleSide,
      });
      const pad = new THREE.Mesh(geo, mat);
      pad.rotation.x = -Math.PI / 2;
      pad.position.y = 0.05;
      group.add(pad);

      // Veins
      const veinMat = new THREE.LineBasicMaterial({ color: 0x1a6640 });
      const numVeins = 8;
      for (let v = 0; v < numVeins; v++) {
        const a = notchAngle + ((Math.PI * 2 - notchAngle * 2) / numVeins) * v;
        const points = [
          new THREE.Vector3(0, 0.06, 0),
          new THREE.Vector3(Math.cos(a) * radius * 0.9, 0.06, Math.sin(a) * radius * 0.9),
        ];
        const vGeo = new THREE.BufferGeometry().setFromPoints(points);
        group.add(new THREE.Line(vGeo, veinMat));
      }

      group.position.set(x, 0, z);
      group.rotation.y = rot;
      scene.add(group);

      // Gentle bob animation
      gsap.to(group.position, {
        y: 0.15 + radius * 0.03,
        duration: 2 + radius * 0.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      return group;
    }

    // Place lily pads (deterministic positions)
    const padConfigs = [
      { x: 0, z: 0, r: 3.8, rot: 0.3 },
      { x: -6, z: -3, r: 3.2, rot: 1.1 },
      { x: 7, z: -2, r: 3.5, rot: -0.5 },
      { x: -10, z: 4, r: 2.8, rot: 0.8 },
      { x: 10, z: 5, r: 3.0, rot: 2.1 },
      { x: 3, z: 7, r: 2.6, rot: -1.2 },
      { x: -4, z: 8, r: 2.4, rot: 0.4 },
      { x: -13, z: -2, r: 2.2, rot: -0.9 },
      { x: 14, z: -5, r: 2.0, rot: 1.7 },
      { x: 0, z: -9, r: 2.8, rot: 0.1 },
      { x: 6, z: -10, r: 2.2, rot: -2.0 },
      { x: -7, z: 11, r: 2.0, rot: 1.5 },
    ];
    padConfigs.forEach((c) => makeLilyPad(c.x, c.z, c.r, c.rot));

    // ── Ripple system ──
    function spawnRipple(x: number, z: number) {
      const count = 4;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          if (!sceneRef.current) return;
          const geo = new THREE.RingGeometry(0.1, 0.5, 64);
          const mat = new THREE.MeshBasicMaterial({
            color: 0x88ffcc,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.rotation.x = -Math.PI / 2;
          mesh.position.set(x, 0.07, z);
          sceneRef.current.add(mesh);
          ripplesRef.current.push({ mesh, t: 0, speed: 2.5 + i * 0.5, maxR: 5 + i * 2, x, z });
        }, i * 120);
      }
    }

    // LEFT CLICK ONLY → ripple
    function onPointerDown(e: MouseEvent) {
      if (e.button !== 0) return;
      if (!cameraRef.current || !sceneRef.current) return;
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(mouse, cameraRef.current);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const pt = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, pt);
      if (pt) spawnRipple(pt.x, pt.z);
    }
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("contextmenu", (e) => e.preventDefault());

    // ── Animation loop ──
    let t = 0;
    function animate() {
      animIdRef.current = requestAnimationFrame(animate);
      t += 0.008;

      // Water wave
      if (waterGeoRef.current && origYRef.current.length) {
        const posAttr = waterGeoRef.current.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const x = posAttr.getX(i);
          const z = posAttr.getZ(i);
          posAttr.setY(i, origYRef.current[i] + Math.sin(x * 0.4 + t) * 0.12 + Math.cos(z * 0.35 + t * 1.3) * 0.1);
        }
        posAttr.needsUpdate = true;
        waterGeoRef.current.computeVertexNormals();
      }

      // Ripple update
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.t += 0.016 * r.speed;
        const scale = 1 + r.t * (r.maxR / 1);
        r.mesh.scale.set(scale, scale, scale);
        if (r.mesh.material) {
          const material = r.mesh.material as THREE.MeshBasicMaterial;
          material.opacity = Math.max(0, 0.7 - r.t * 0.6);
        }
        if (r.t >= 1.2) {
          scene.remove(r.mesh);
          r.mesh.geometry.dispose();
          if (r.mesh.material) {
            const material = r.mesh.material as THREE.Material;
            material.dispose();
          }
          ripplesRef.current.splice(i, 1);
        }
      }

      // Slow camera drift
      if (cameraRef.current) {
        cameraRef.current.position.x = Math.sin(t * 0.05) * 2;
        cameraRef.current.lookAt(0, 0, 0);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }
    animate();

    // Resize
    const onResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("contextmenu", (e) => e.preventDefault());
      if (rendererRef.current && mountNode) {
        rendererRef.current.dispose();
        if (mountNode.contains(rendererRef.current.domElement)) {
          mountNode.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0" style={{ cursor: "crosshair" }} suppressHydrationWarning />;
}

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5"
      style={{ background: "linear-gradient(to bottom, rgba(5,20,12,0.85) 0%, transparent 100%)", backdropFilter: "blur(2px)" }}>
      <span className="font-display text-xl md:text-2xl tracking-widest text-emerald-300 uppercase flex items-center gap-2">
        <Film className="w-5 h-5 md:w-6 md:h-6" />
        VideoEdit
      </span>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8 text-sm tracking-widest text-emerald-200/70 uppercase font-mono">
        {["Works", "Services", "Process", "Tools", "Contact"].map((n) => (
          <a key={n} href={`#${n.toLowerCase()}`}
            className="hover:text-emerald-300 transition-colors duration-300 flex items-center gap-1">
            {n === "Works" && <Briefcase className="w-3 h-3" />}
            {n === "Services" && <Zap className="w-3 h-3" />}
            {n === "Process" && <Sliders className="w-3 h-3" />}
            {n === "Tools" && <Cpu className="w-3 h-3" />}
            {n === "Contact" && <Mail className="w-3 h-3" />}
            {n}
          </a>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-emerald-300"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-emerald-900/95 backdrop-blur-md py-4 px-6 flex flex-col gap-3 md:hidden"
          >
            {["Works", "Services", "Process", "Tools", "Contact"].map((n) => (
              <a key={n} href={`#${n.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-emerald-200/70 hover:text-emerald-300 transition-colors py-2 flex items-center gap-2">
                {n === "Works" && <Briefcase className="w-4 h-4" />}
                {n === "Services" && <Zap className="w-4 h-4" />}
                {n === "Process" && <Sliders className="w-4 h-4" />}
                {n === "Tools" && <Cpu className="w-4 h-4" />}
                {n === "Contact" && <Mail className="w-4 h-4" />}
                {n}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  return (
    <section id="hero" className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.3em" }}
        animate={{ opacity: 1, letterSpacing: "0.6em" }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="text-emerald-400/60 text-xs uppercase font-mono mb-6 tracking-[0.5em] flex items-center gap-2"
      >
        <Sparkles className="w-3 h-3" />
        Cinematic · Precise · Expressive
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-[clamp(4rem,14vw,11rem)] leading-none tracking-tight text-white"
        style={{ textShadow: "0 0 80px rgba(0,255,120,0.25), 0 4px 40px rgba(0,0,0,0.8)" }}
      >
        VIDEO<br />
        <span className="text-emerald-400">EDIT</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="mt-8 max-w-lg text-emerald-100/60 text-lg font-light leading-relaxed"
      >
        Transforming raw footage into stories that breathe, move, and linger.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-12"
      >
        <a href="#works"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-emerald-400/40 text-emerald-300 text-sm tracking-widest uppercase font-mono hover:bg-emerald-400/10 transition-all duration-300 group">
          View Selected Works
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 text-emerald-300 text-xs font-mono tracking-widest"
      >
        ← click the water to create ripples →
      </motion.p>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SELECTED WORKS (with deterministic SVG bars)
───────────────────────────────────────────── */
const selectedWorks = [
  { title: "Monsoon Dreams", type: "Short Film", year: "2024", color: "#0d6b3f", bars: [12, 18, 8, 14, 22, 16, 10, 20, 15, 12, 18, 8, 14, 22, 16, 10, 20, 15, 12, 18] },
  { title: "Urban Pulse", type: "Documentary", year: "2024", color: "#1a4d5c", bars: [8, 14, 22, 16, 10, 20, 15, 12, 18, 8, 14, 22, 16, 10, 20, 15, 12, 18, 8, 14] },
  { title: "Neon Solstice", type: "Music Video", year: "2023", color: "#3d2a6e", bars: [16, 10, 20, 15, 12, 18, 8, 14, 22, 16, 10, 20, 15, 12, 18, 8, 14, 22, 16, 10] },
  { title: "Still Waters", type: "Brand Film", year: "2023", color: "#2a5c3f", bars: [20, 15, 12, 18, 8, 14, 22, 16, 10, 20, 15, 12, 18, 8, 14, 22, 16, 10, 20, 15] },
  { title: "Edge of Light", type: "Commercial", year: "2023", color: "#5c3a1a", bars: [10, 20, 15, 12, 18, 8, 14, 22, 16, 10, 20, 15, 12, 18, 8, 14, 22, 16, 10, 20] },
  { title: "Quiet Hours", type: "Short Film", year: "2022", color: "#1a5c4d", bars: [14, 22, 16, 10, 20, 15, 12, 18, 8, 14, 22, 16, 10, 20, 15, 12, 18, 8, 14, 22] },
];

function SelectedWorks() {
  return (
    <section id="selected-works" className="relative z-10 py-32 px-6 md:px-16">
      <SectionLabel icon={<Star className="w-3 h-3" />}>Selected Works</SectionLabel>
      <motion.h2
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="font-display text-5xl md:text-7xl text-white mb-16"
      >
        Curated<br /><span className="text-emerald-400">Edits</span>
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedWorks.map((w, i) => (
          <motion.div
            key={w.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03, y: -6 }}
            className="group relative rounded-2xl overflow-hidden cursor-pointer"
            style={{ background: w.color }}
          >
            <div className="aspect-video flex flex-col justify-end p-6"
              style={{ background: `linear-gradient(135deg, ${w.color}cc 0%, #000000aa 100%)` }}>
              <div className="h-24 w-full mb-4 flex items-center justify-center opacity-20">
                <svg viewBox="0 0 100 40" className="w-full" fill="none">
                  {w.bars.map((height, j) => (
                    <rect key={j} x={j * 5} y={20 - height / 2} width="3"
                      height={height} fill="currentColor" className="text-white" />
                  ))}
                </svg>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-300/60 text-xs font-mono uppercase tracking-widest">{w.type} · {w.year}</span>
                <PlayCircle className="w-5 h-5 text-emerald-400/40 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="font-display text-2xl text-white mt-1 group-hover:text-emerald-300 transition-colors">{w.title}</h3>
            </div>
            <div className="absolute inset-0 ring-1 ring-white/10 rounded-2xl group-hover:ring-emerald-400/40 transition-all" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────── */
const services = [
  { icon: Scissors, title: "Narrative Editing", desc: "Crafting the emotional spine of your story with precise cuts and pacing that pulls viewers forward." },
  { icon: Palette, title: "Color Grading", desc: "Cinematic color science applied to evoke mood — from earthy naturalism to stylized fantasy." },
  { icon: Layers, title: "Motion Graphics", desc: "Kinetic text, logo animations, and lower-thirds that blend seamlessly with your footage." },
  { icon: Headphones, title: "Sound Design", desc: "Layered soundscapes, SFX, and music sync that give every cut an audible heartbeat." },
  { icon: Smartphone, title: "Vertical / Social", desc: "Platform-native recuts for Reels, TikTok, and Shorts — without losing the original's soul." },
  { icon: Eye, title: "VFX & Compositing", desc: "Clean removals, sky replacements, and subtle enhancements that stay invisible by design." },
];

function Services() {
  return (
    <section id="services" className="relative z-10 py-32 px-6 md:px-16">
      <SectionLabel icon={<Zap className="w-3 h-3" />}>Services</SectionLabel>
      <motion.h2
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="font-display text-5xl md:text-7xl text-white mb-16"
      >
        What I<br /><span className="text-emerald-400">Offer</span>
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-emerald-800/20 rounded-2xl overflow-hidden ring-1 ring-emerald-800/30">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            viewport={{ once: true }}
            whileHover={{ backgroundColor: "rgba(16,100,60,0.15)" }}
            className="p-8 transition-colors duration-300"
            style={{ background: "rgba(5,20,12,0.7)" }}
          >
            <s.icon className="text-emerald-400 text-3xl w-8 h-8" />
            <h3 className="font-display text-xl text-white mt-4 mb-3">{s.title}</h3>
            <p className="text-emerald-100/50 text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROCESS
───────────────────────────────────────────── */
function Process() {
  return (
    <section id="process" className="relative z-10 py-32 px-6 md:px-16">
      <SectionLabel icon={<Sliders className="w-3 h-3" />}>The Process</SectionLabel>
      <motion.h2
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="font-display text-5xl md:text-7xl text-white mb-16"
      >
        How It<br /><span className="text-emerald-400">Works</span>
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { num: "01", title: "Discovery", icon: Target, desc: "Understand your vision, audience, and goals before a single cut is made." },
          { num: "02", title: "Ingest", icon: FolderOpen, desc: "Organizing, syncing, and evaluating every frame of raw footage." },
          { num: "03", title: "Assembly", icon: Scissors, desc: "Laying the structural skeleton — story first, aesthetics second." },
          { num: "04", title: "Fine Cut", icon: Sliders, desc: "Frame-level precision: every transition, cut, and moment crafted." },
          { num: "05", title: "Delivery", icon: Download, desc: "Color-graded, mixed, mastered, and exported for every platform." },
        ].map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-emerald-900/20 backdrop-blur-sm border border-emerald-800/30 hover:border-emerald-500/50 transition-all"
          >
            <step.icon className="w-8 h-8 text-emerald-400 mb-4" />
            <span className="text-emerald-400/50 text-xs font-mono">{step.num}</span>
            <h3 className="font-display text-xl text-white mt-1">{step.title}</h3>
            <p className="text-emerald-100/50 text-xs mt-2 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TOOLS
───────────────────────────────────────────── */
const tools = [
  {
    name: "CapCut",
    url: "https://www.capcut.com",
    desc: "Fast mobile-first editing for social-native content, viral formats, and quick turnarounds.",
    icon: Smartphone,
    color: "#1a1a2e",
  },
  {
    name: "Adobe Premiere",
    url: "https://www.adobe.com/products/premiere.html",
    desc: "Industry-standard NLE for narrative, commercial, and broadcast-grade productions.",
    icon: Video,
    color: "#1a0a2e",
  },
  {
    name: "DaVinci Resolve",
    url: "https://www.blackmagicdesign.com/products/davinciresolve",
    desc: "Hollywood-grade color science, Fairlight audio, and Fusion VFX in one powerhouse.",
    icon: Palette,
    color: "#0a1a2e",
  },
];

function Tools() {
  return (
    <section id="tools" className="relative z-10 py-32 px-6 md:px-16">
      <SectionLabel icon={<Cpu className="w-3 h-3" />}>Tools</SectionLabel>
      <motion.h2
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="font-display text-5xl md:text-7xl text-white mb-16"
      >
        Built With<br /><span className="text-emerald-400">The Best</span>
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool, i) => (
          <motion.a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.04, y: -6 }}
            className="group block rounded-2xl p-8 ring-1 ring-white/10 hover:ring-emerald-400/40 transition-all duration-300"
            style={{ background: `linear-gradient(135deg, ${tool.color} 0%, rgba(5,20,12,0.9) 100%)`, backdropFilter: "blur(12px)" }}
          >
            <tool.icon className="text-5xl text-emerald-400 group-hover:scale-110 transition-transform duration-300 w-12 h-12" />
            <h3 className="font-display text-2xl text-white mt-6 mb-3">{tool.name}</h3>
            <p className="text-emerald-100/50 text-sm leading-relaxed mb-6">{tool.desc}</p>
            <span className="text-emerald-400/60 text-xs font-mono tracking-widest group-hover:text-emerald-300 transition-colors flex items-center gap-1">
              Visit Site <ExternalLink className="w-3 h-3" />
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   WORKS / PROJECTS
───────────────────────────────────────────── */
const projects = [
  { title: "Brand Identity Film", client: "Botanica Co.", duration: "2:30", type: "Commercial" },
  { title: "Festival Documentary", client: "Soundwave Fest", duration: "18:00", type: "Documentary" },
  { title: "Artist EP Visualizer", client: "Nova Rize", duration: "4:12", type: "Music Video" },
  { title: "Product Launch Reel", client: "Lumix PH", duration: "1:00", type: "Commercial" },
  { title: "Travel Series: EP 3", client: "Wanderlight", duration: "12:45", type: "Web Series" },
  { title: "Corporate Annual Recap", client: "Greentech Inc.", duration: "5:20", type: "Corporate" },
  { title: "Short Film: Threshold", client: "Independent", duration: "9:00", type: "Short Film" },
  { title: "Social Media Pack", client: "Café Moreno", duration: "0:15–0:30", type: "Social" },
];

function Works() {
  return (
    <section id="works" className="relative z-10 py-32 px-6 md:px-16">
      <SectionLabel icon={<Briefcase className="w-3 h-3" />}>Works / Projects</SectionLabel>
      <motion.h2
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="font-display text-5xl md:text-7xl text-white mb-16"
      >
        All<br /><span className="text-emerald-400">Projects</span>
      </motion.h2>
      <div className="space-y-0 rounded-2xl overflow-hidden ring-1 ring-emerald-800/30">
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            viewport={{ once: true }}
            whileHover={{ paddingLeft: "2.5rem" }}
            className="flex items-center justify-between p-6 border-b border-emerald-800/20 cursor-pointer group transition-all duration-300"
            style={{ background: "rgba(5,20,12,0.6)" }}
          >
            <div className="flex items-center gap-6">
              <span className="text-emerald-500/30 font-mono text-sm w-8">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h4 className="font-display text-lg text-white group-hover:text-emerald-300 transition-colors">{p.title}</h4>
                <span className="text-emerald-100/40 text-xs flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {p.client}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-8 text-right">
              <span className="hidden md:flex items-center gap-1 text-emerald-400/50 text-xs font-mono bg-emerald-800/20 px-3 py-1 rounded-full">
                <Film className="w-3 h-3" />
                {p.type}
              </span>
              <span className="text-emerald-100/30 text-xs font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {p.duration}
              </span>
              <ArrowRightIcon className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  return (
    <section id="contact" className="relative z-10 py-32 px-6 md:px-16">
      <SectionLabel icon={<Mail className="w-3 h-3" />}>Contact</SectionLabel>
      <div className="max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-display text-5xl md:text-7xl text-white mb-4"
        >
          Let&apos;s<br /><span className="text-emerald-400">Create</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-emerald-100/50 mb-12 leading-relaxed"
        >
          Ready to bring your footage to life? Drop a message and let&apos;s talk about your project.
        </motion.p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-12 text-center ring-1 ring-emerald-400/30"
            style={{ background: "rgba(5,40,20,0.6)" }}
          >
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="font-display text-3xl text-emerald-300 mt-4">Message Sent!</h3>
            <p className="text-emerald-100/50 mt-3">I&apos;ll be in touch within 24 hours.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            {[
              { key: "name", label: "Name", type: "text", placeholder: "Your full name", icon: User },
              { key: "email", label: "Email Address", type: "email", placeholder: "your@email.com", icon: Mail },
            ].map((field) => {
              const FieldIcon = field.icon;
              return (
                <div key={field.key}>
                  <label className="block text-emerald-400/70 text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
                    <FieldIcon className="w-3 h-3" />
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key as "name" | "email"]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full bg-transparent border border-emerald-800/50 rounded-xl px-5 py-4 text-white placeholder-emerald-800/60 focus:outline-none focus:border-emerald-400/60 transition-colors text-sm"
                    style={{ background: "rgba(5,20,12,0.5)" }}
                  />
                </div>
              );
            })}
            <div>
              <label className="block text-emerald-400/70 text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
                <MessageCircle className="w-3 h-3" />
                Message Details
              </label>
              <textarea
                rows={5}
                placeholder="Tell me about your project — footage type, platform, timeline, and any references you love."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-transparent border border-emerald-800/50 rounded-xl px-5 py-4 text-white placeholder-emerald-800/60 focus:outline-none focus:border-emerald-400/60 transition-colors text-sm resize-none"
                style={{ background: "rgba(5,20,12,0.5)" }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full py-5 rounded-xl font-mono text-sm uppercase tracking-widest text-black font-bold transition-all duration-300 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)" }}
            >
              Send Message <Send className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="relative z-10 py-12 px-6 md:px-16 border-t border-emerald-800/30 flex flex-col md:flex-row items-center justify-between gap-4">
      <span className="font-display text-emerald-400/60 tracking-widest text-sm uppercase flex items-center gap-2">
        <Film className="w-4 h-4" />
        VideoEdit
      </span>
      <div className="flex gap-4">
        <a href="#" className="text-emerald-500/40 hover:text-emerald-400 transition-colors">
          <Twitter />
        </a>
        <a href="#" className="text-emerald-500/40 hover:text-emerald-400 transition-colors">
          <Instagram />
        </a>
        <a href="#" className="text-emerald-500/40 hover:text-emerald-400 transition-colors">
          <Github />
        </a>
        <a href="#" className="text-emerald-500/40 hover:text-emerald-400 transition-colors">
          <Linkedin />
        </a>
      </div>
      <span className="text-emerald-600/40 text-xs font-mono">© {new Date().getFullYear()} · All Rights Reserved</span>
      <span className="text-emerald-600/30 text-xs font-mono flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        Quezon City, PH
      </span>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   SECTION LABEL HELPER
───────────────────────────────────────────── */
function SectionLabel({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-emerald-500/50 text-xs font-mono uppercase tracking-[0.4em] mb-4 flex items-center gap-2"
    >
      {icon}
      {children}
    </motion.p>
  );
}

/* ─────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────── */
export default function Page() {
  return (
    <>
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; background: #050f08; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050f08; }
        ::-webkit-scrollbar-thumb { background: #1a6040; border-radius: 2px; }
      `}</style>

      <main className="relative min-h-screen bg-transparent text-white overflow-x-hidden">
        {/* Three.js water + lily pads background */}
        <WaterCanvas />

        {/* Overlay gradient so text is readable */}
        <div
          className="fixed inset-0 z-[1] pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(5,20,12,0.2) 0%, rgba(5,20,12,0.05) 30%, rgba(5,20,12,0.05) 70%, rgba(5,20,12,0.4) 100%)" }}
        />

        {/* Content */}
        <div className="relative z-10">
          <Nav />
          <Hero />

          {/* Content sections on frosted panels */}
          <div style={{ background: "rgba(3,12,7,0.82)", backdropFilter: "blur(18px)" }}>
            <SelectedWorks />
            <Services />
            <Process />
            <Tools />
            <Works />
            <Contact />
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}