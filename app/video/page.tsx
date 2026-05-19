"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
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
  Smartphone,
  Eye,
  Scissors,
  Zap,
  Sliders,
  Briefcase,
  Cpu,
  Film,
  Mail,
  MapPin,
  FolderOpen,
  Download,
  Video,
} from "lucide-react";

// Custom premium social icons
const CustomTwitter = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const CustomInstagram = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const CustomGithub = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.296 2.75-1.026 2.75-1.026.544 1.378.201 2.397.098 2.65.64.7 1.029 1.595 1.029 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const CustomLinkedin = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
  </svg>
);

interface RippleObject {
  mesh: THREE.LineLoop;
  t: number;
  speed: number;
  maxR: number;
  layer: number;
}

/* ─────────────────────────────────────────────
    CINEMATIC WATER CANVAS WITH HUGE LILY PADS & LILIES
───────────────────────────────────────────── */
function WaterCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ripplesRef = useRef<RippleObject[]>([]);
  const entitiesRef = useRef<THREE.Group[]>([]);
  const animIdRef = useRef<number>(0);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  // Detailed procedural canvas textures for luxury organic leaf body
  const createLilyPadTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const cx = 512;
    const cy = 512;
    const r = 470;

    ctx.clearRect(0, 0, 1024, 1024);

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0.16 * Math.PI, 1.84 * Math.PI, false);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fillStyle = "#040b06";
    ctx.fill();

    const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, r);
    grad.addColorStop(0, "#0a1f12");
    grad.addColorStop(0.5, "#06140b");
    grad.addColorStop(0.9, "#030805");
    grad.addColorStop(1, "#010402");
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = "rgba(140, 190, 155, 0.25)";
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.strokeStyle = "rgba(140, 190, 155, 0.08)";
    ctx.lineWidth = 3;
    const veinAngles = [0.22, 0.35, 0.5, 0.65, 0.8, 1.0, 1.2, 1.35, 1.5, 1.65, 1.78];
    veinAngles.forEach((angle) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle * Math.PI) * r, cy + Math.sin(angle * Math.PI) * r);
      ctx.stroke();
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  const buildLilyPadGeometry = (size: number) => {
    const shape = new THREE.Shape();
    const steps = 120;
    const radius = size / 2;
    const startAngle = 0.14 * Math.PI;
    const endAngle = 1.86 * Math.PI;

    for (let i = 0; i <= steps; i++) {
      const theta = startAngle + (i / steps) * (endAngle - startAngle);
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.lineTo(0, 0);
    return new THREE.ShapeGeometry(shape);
  };

  // Generates custom 3D mesh architecture representing a premium lotus blossom
  const createWaterLilyFlower = (scaleFactor: number) => {
    const flowerGroup = new THREE.Group();
    const petalLayers = 3;
    const petalsPerLayer = 12;
    const basePetalColor = new THREE.Color(0xd2f5dc); // Soft organic mint/white bloom

    for (let layer = 0; layer < petalLayers; layer++) {
      const layerScale = 1.0 - layer * 0.18;
      const layerHeight = layer * 0.15;
      const angleOffset = (layer * Math.PI) / petalsPerLayer;

      for (let p = 0; p < petalsPerLayer; p++) {
        const angle = ((p * Math.PI * 2) / petalsPerLayer) + angleOffset;
        
        // Build streamlined geometric petal geometry via paths
        const petalShape = new THREE.Shape();
        petalShape.moveTo(0, 0);
        petalShape.quadraticCurveTo(0.25, 0.6, 0.0, 1.4);
        petalShape.quadraticCurveTo(-0.25, 0.6, 0, 0);
        
        const petalGeo = new THREE.ShapeGeometry(petalShape);
        const petalMat = new THREE.MeshStandardMaterial({
          color: basePetalColor.clone().multiplyScalar(1.0 - layer * 0.08),
          roughness: 0.3,
          metalness: 0.1,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9 - layer * 0.1,
        });

        const petalMesh = new THREE.Mesh(petalGeo, petalMat);
        
        // Position & lift individual petals up organically into a bowl configuration
        petalMesh.scale.set(scaleFactor * layerScale, scaleFactor * layerScale, scaleFactor * layerScale);
        petalMesh.rotation.z = angle - Math.PI / 2;
        petalMesh.rotation.x = 0.35 + layer * 0.15; // Upward angle flare
        
        petalMesh.position.x = Math.cos(angle) * 0.12 * scaleFactor;
        petalMesh.position.z = Math.sin(angle) * 0.12 * scaleFactor;
        petalMesh.position.y = layerHeight * scaleFactor;
        petalMesh.castShadow = true;

        flowerGroup.add(petalMesh);
      }
    }

    // Add a golden structural core/pistil structure at center point
    const coreGeo = new THREE.CylinderGeometry(0.18 * scaleFactor, 0.1 * scaleFactor, 0.2 * scaleFactor, 12);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x93c47d, // Vivid emerald-gold center matrix
      roughness: 0.5,
      metalness: 0.2,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 0.15 * scaleFactor;
    flowerGroup.add(coreMesh);

    return flowerGroup;
  };

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x010c05); // Deep luxury green background logic
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    mountNode.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010c05);
    scene.fog = new THREE.FogExp2(0x010c05, 0.012);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 200);
    camera.position.set(0, 15, 28);
    camera.lookAt(0, -1, 0);
    cameraRef.current = camera;

    // Dark liquid reflective floor matrix
    const waterGeometry = new THREE.CircleGeometry(90, 64);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x02160a,
      roughness: 0.05,
      metalness: 0.98,
      transparent: true,
      opacity: 0.98,
    });
    const waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.y = -0.3;
    waterPlane.receiveShadow = true;
    scene.add(waterPlane);

    // Spatial Lighting Design Architectures
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.04);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xdcf2e3, 1.4);
    mainLight.position.set(25, 45, 15);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 4096;
    mainLight.shadow.mapSize.height = 4096;
    scene.add(mainLight);

    const softBioticRim = new THREE.PointLight(0x4f9e66, 1.2, 60);
    softBioticRim.position.set(-18, 10, -14);
    scene.add(softBioticRim);

    const causticLight = new THREE.PointLight(0xa6e3ba, 0.5, 45);
    causticLight.position.set(5, 16, 8);
    scene.add(causticLight);

    // SIGNIFICANTLY SCALED UP COMPOSITE STRUCTURAL POSITIONS
    const structuralPads = [
      { x: -5.0, z: -2, s: 7.5, rot: 0.5, hasFlower: true, fScale: 1.4 }, 
      { x: 8.5, z: 3, s: 6.8, rot: 2.9, hasFlower: true, fScale: 1.2 },  
      { x: -2.0, z: 8, s: 5.2, rot: 4.2, hasFlower: false, fScale: 1.0 },
      { x: -11, z: 6, s: 4.8, rot: 1.1, hasFlower: true, fScale: 0.9 },  
      { x: 12.5, z: -6, s: 8.2, rot: 3.8, hasFlower: false, fScale: 1.5 },
      { x: 3.0, z: -10, s: 5.8, rot: 0.8, hasFlower: true, fScale: 1.1 }, 
    ];

    const sharedPadTexture = createLilyPadTexture();

    structuralPads.forEach((pos) => {
      const parentGroup = new THREE.Group();
      parentGroup.position.set(pos.x, -0.28, pos.z);

      const padGeo = buildLilyPadGeometry(pos.s);
      if (!sharedPadTexture) return;

      const padMat = new THREE.MeshStandardMaterial({
        map: sharedPadTexture,
        transparent: true,
        roughness: 0.22,
        metalness: 0.12,
        side: THREE.DoubleSide,
        alphaTest: 0.01,
      });

      const padMesh = new THREE.Mesh(padGeo, padMat);
      padMesh.rotation.x = -Math.PI / 2;
      padMesh.rotation.z = pos.rot;
      padMesh.receiveShadow = true;
      parentGroup.add(padMesh);

      // Add blooming 3D Lily architecture inside the grouped cluster if active
      if (pos.hasFlower) {
        const flower = createWaterLilyFlower(pos.fScale);
        // Slightly offset flower center point from pad cutout axis
        flower.position.set(Math.cos(pos.rot) * 0.2, 0.02, Math.sin(pos.rot) * 0.2);
        parentGroup.add(flower);
      }

      parentGroup.userData = {
        originX: pos.x,
        originZ: pos.z,
        seed: Math.random() * 250,
        tiltSeed: Math.random() * Math.PI,
      };

      scene.add(parentGroup);
      entitiesRef.current.push(parentGroup);
    });

    // 7-Layer Line Circular Ripple Engine
    function createOrganicRipple(x: number, z: number) {
      const layersCount = 7;
      const colors = [0xe2f7e6, 0xbfe8c7, 0x99daaa, 0x72cb8b, 0x4cbd6e, 0x309c52, 0x197036];
      
      for (let i = 0; i < layersCount; i++) {
        setTimeout(() => {
          if (!sceneRef.current) return;

          const ringGeo = new THREE.RingGeometry(0, 0.5, 64, 1);
          const edges = new THREE.EdgesGeometry(ringGeo);
          
          const lineMat = new THREE.LineBasicMaterial({
            color: colors[i],
            transparent: true,
            opacity: 0.65,
            linewidth: 1,
          });

          const lineLoop = new THREE.LineLoop(edges, lineMat);
          lineLoop.position.set(x, -0.25 + i * 0.001, z);
          lineLoop.rotation.x = Math.PI / 2;
          sceneRef.current.add(lineLoop);

          ripplesRef.current.push({
            mesh: lineLoop,
            t: 0,
            speed: 0.92 - i * 0.04,
            maxR: 26 + i * 4.5,
            layer: i,
          });

          ringGeo.dispose();
        }, i * 130);
      }
    }

    const handleClick = (e: MouseEvent) => {
      if (e.button !== 0 || !cameraRef.current) return;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(mouse, cameraRef.current);

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.3);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectPoint);

      if (intersectPoint) {
        createOrganicRipple(intersectPoint.x, intersectPoint.z);
      }
    };

    window.addEventListener("mousedown", handleClick);

    let targetCamX = 0, targetCamY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      targetCamX = (e.clientX / window.innerWidth - 0.5) * 1.8;
      targetCamY = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let time = 0;
    function animate() {
      animIdRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();
      time += delta;

      causticLight.position.x = 5 + Math.sin(time * 0.4) * 5;
      causticLight.position.z = 8 + Math.cos(time * 0.3) * 5;

      if (cameraRef.current) {
        cameraRef.current.position.x += (targetCamX - cameraRef.current.position.x) * 0.025;
        cameraRef.current.position.y = 14.5 + targetCamY * 0.5;
        cameraRef.current.lookAt(0, -1, 0);
      }

      // Elegant rotational floating drift matching water vectors
      entitiesRef.current.forEach((entity) => {
        const { originX, originZ, seed, tiltSeed } = entity.userData;
        entity.position.x = originX + Math.sin(time * 0.25 + seed) * 0.35;
        entity.position.z = originZ + Math.cos(time * 0.2 + seed) * 0.35;
        
        entity.rotation.x = Math.sin(time * 0.45 + tiltSeed) * 0.02;
        entity.rotation.y = Math.cos(time * 0.35 + tiltSeed) * 0.018;
        entity.rotation.z += Math.sin(time * 0.06 + seed) * 0.0002;
      });

      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const ripple = ripplesRef.current[i];
        ripple.t += 0.0038 * ripple.speed;

        const currentScale = 0.1 + ripple.t * (ripple.maxR - 0.1);
        ripple.mesh.scale.set(currentScale, currentScale, currentScale);

        if (ripple.mesh.material) {
          const material = ripple.mesh.material as THREE.LineBasicMaterial;
          const baseOpacity = 0.75 - (ripple.layer * 0.06);
          material.opacity = Math.max(0, baseOpacity - (ripple.t * 1.05));
        }

        if (ripple.t >= 1.0) {
          scene.remove(ripple.mesh);
          ripple.mesh.geometry.dispose();
          if (Array.isArray(ripple.mesh.material)) {
            ripple.mesh.material.forEach((m) => m.dispose());
          } else {
            ripple.mesh.material.dispose();
          }
          ripplesRef.current.splice(i, 1);
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }

    animate();

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (rendererRef.current && mountNode) {
        rendererRef.current.dispose();
        if (mountNode.contains(rendererRef.current.domElement)) {
          mountNode.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0" style={{ cursor: "pointer" }} suppressHydrationWarning />;
}

/* ─────────────────────────────────────────────
    SECTION LABEL HELPER
───────────────────────────────────────────── */
function SectionLabel({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-emerald-400/50 text-[11px] font-mono uppercase tracking-[0.5em] mb-8 flex items-center gap-3"
    >
      {icon && <span className="text-emerald-400/40">{icon}</span>}
      {children}
    </motion.p>
  );
}

/* ─────────────────────────────────────────────
    NAVBAR
───────────────────────────────────────────── */
function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 50) {
          navRef.current.classList.add("scrolled");
        } else {
          navRef.current.classList.remove("scrolled");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-10 transition-all duration-500 border-b border-transparent"
      style={{ background: "linear-gradient(to bottom, rgba(1,10,4,0.95) 0%, transparent 100%)" }}
    >
      <motion.span
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-xl tracking-[0.2em] text-zinc-100 uppercase flex items-center gap-3"
      >
        <Film className="w-4 h-4 text-emerald-500" />
        V.EDIT
      </motion.span>
      
      <div className="hidden md:flex gap-12 text-[10px] tracking-[0.25em] text-zinc-400 uppercase font-mono">
        {["Works", "Services", "Process", "Tools", "Contact"].map((n, i) => (
          <motion.a
            key={n}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            href={`#${n.toLowerCase()}`}
            className="hover:text-emerald-400 transition-colors duration-300"
          >
            {n}
          </motion.a>
        ))}
      </div>

      <button
        className="md:hidden text-zinc-300 opacity-80 hover:opacity-100 transition-opacity"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 bg-[#010a04]/98 backdrop-blur-2xl py-12 px-8 flex flex-col gap-8 md:hidden border-b border-white/5"
          >
            {["Works", "Services", "Process", "Tools", "Contact"].map((n) => (
              <a
                key={n}
                href={`#${n.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-4 text-xs font-mono uppercase tracking-[0.2em]"
              >
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
    <section id="hero" className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 pt-32 pb-32">
      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.2em" }}
        animate={{ opacity: 1, letterSpacing: "0.6em" }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="text-emerald-400/90 text-[10px] uppercase font-mono mb-10 flex items-center gap-2"
      >
        <Sparkles className="w-3 h-3 opacity-70" />
        Precision · Rhythm · Flow
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-[clamp(4.5rem,15vw,11rem)] leading-[0.9] tracking-tight text-zinc-100"
      >
        VIDEO<br />
        <span className="text-emerald-600/40 italic font-light">EDITOR</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-12 max-w-xl text-zinc-400 text-sm md:text-base font-light leading-relaxed tracking-wide"
      >
        Crafting invisible seams and unforgettable movements. Elevating raw footage into compelling cinematic narratives.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
        className="mt-16"
      >
        <a
          href="#works"
          className="inline-flex items-center gap-4 px-10 py-5 rounded-full border border-emerald-800/30 text-zinc-300 text-[11px] tracking-[0.25em] uppercase font-mono hover:bg-emerald-950/80 hover:text-white hover:border-emerald-500/50 transition-all duration-500 group"
        >
          View Portfolio
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-emerald-400" />
        </a>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-16 flex flex-col items-center"
      >
        <p className="text-emerald-500/50 text-[9px] font-mono tracking-[0.25em] mb-5 uppercase">
          Interact with fluid surface
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-4 h-7 border border-emerald-800/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[2px] h-[4px] bg-emerald-500 rounded-full mt-1.5"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
    SELECTED WORKS (FEATURED CUTS)
───────────────────────────────────────────── */
const selectedWorks = [
  { title: "Monsoon Dreams", type: "Short Film", year: "2024", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop" },
  { title: "Urban Pulse", type: "Documentary", year: "2024", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop" },
  { title: "Neon Solstice", type: "Music Video", year: "2023", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop" },
  { title: "Still Waters", type: "Brand Film", year: "2023", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop" },
  { title: "Edge of Light", type: "Commercial", year: "2023", image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=800&auto=format&fit=crop" },
  { title: "Quiet Hours", type: "Short Film", year: "2022", image: "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?q=80&w=800&auto=format&fit=crop" },
];

function SelectedWorks() {
  return (
    <section id="works" className="relative z-10 py-64 md:py-80 px-8 md:px-16 max-w-[1600px] mx-auto">
      <div className="mb-32 md:mb-44">
        <SectionLabel icon={<Star className="w-3 h-3" />}>Featured Works</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-7xl text-zinc-100"
        >
          Selected <span className="text-emerald-600/40 italic font-light">Edits</span>
        </motion.h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24">
        {selectedWorks.map((w, i) => (
          <motion.div
            key={w.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative rounded-lg overflow-hidden cursor-pointer"
          >
            <div className="aspect-[4/5] relative bg-emerald-950/20 overflow-hidden rounded-md border border-emerald-900/20">
              <img 
                src={w.image} 
                alt={w.title}
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-15 group-hover:scale-105 transition-all duration-700 blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#011105] via-transparent to-transparent" />
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <span className="text-emerald-400 text-[10px] font-mono uppercase tracking-[0.25em]">{w.type} · {w.year}</span>
                  <PlayCircle className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="font-display text-2xl text-zinc-200 group-hover:text-emerald-400 transition-colors duration-300">{w.title}</h3>
              </div>
            </div>
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
  { icon: Scissors, title: "Narrative Editing", desc: "Shaping the emotional arc with precise cuts, focusing on rhythm, story progression, and character development." },
  { icon: Palette, title: "Color Grading", desc: "Elevating the visual tone through professional color science, matching raw mood to structural intent." },
  { icon: Layers, title: "Motion Design", desc: "Integrating elegant kinetic typography and contextual minimal motion graphics that elevate structural flow." },
  { icon: Cpu, title: "Soundscapes", desc: "Layering ambient multi-track depth, foley, and score mixes to give visual elements an organic heartbeat." },
  { icon: Smartphone, title: "Social Formats", desc: "Re-envisioning wide cinematic narratives into native vertical form factors with high engagement conversion." },
  { icon: Eye, title: "Compositing", desc: "Executing seamless structural cleanups, tracking, rotoscoping, and architectural multi-plate integration." },
];

function Services() {
  return (
    <section id="services" className="relative z-10 py-64 md:py-80 px-8 md:px-16 max-w-[1600px] mx-auto">
      <div className="mb-32 md:mb-44">
        <SectionLabel icon={<Zap className="w-3 h-3" />}>Expertise</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-7xl text-zinc-100"
        >
          Post <span className="text-emerald-600/40 italic font-light">Production</span>
        </motion.h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            viewport={{ once: true }}
            className="p-10 md:p-14 rounded-lg transition-all duration-300 bg-emerald-950/[0.04] border border-emerald-900/20 hover:bg-emerald-900/[0.06] hover:border-emerald-600/30 group"
          >
            <s.icon className="text-emerald-700 w-5 h-5 mb-10 group-hover:text-emerald-400 transition-colors duration-300" />
            <h3 className="font-display text-2xl text-zinc-200 mb-5">{s.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-light tracking-wide">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
    PROCESS
───────────────────────────────────────────── */
const processSteps = [
  { num: "01", title: "Ingest & Log", icon: FolderOpen, desc: "Rigorous organization, systematic metadata tagging, and thorough raw review." },
  { num: "02", title: "Assembly", icon: Scissors, desc: "Building the narrative frame skeleton, keeping focus entirely on structural pacing." },
  { num: "03", title: "Refinement", icon: Sliders, desc: "Micro-adjustments, L/J cut alignments, and locking structural fluid rhythm." },
  { num: "04", title: "Finishing", icon: Palette, desc: "Applying fine lookup color matrices, spatial mastering, and compositing fixes." },
  { num: "05", title: "Mastering", icon: Download, desc: "Exporting clean target matrices tailored for web or theatrical pipeline distribution." },
];

function Process() {
  return (
    <section id="process" className="relative z-10 py-64 md:py-80 px-8 md:px-16 max-w-[1600px] mx-auto">
      <div className="mb-32 md:mb-44">
        <SectionLabel icon={<Sliders className="w-3 h-3" />}>Workflow</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-7xl text-zinc-100"
        >
          The <span className="text-emerald-600/40 italic font-light">Method</span>
        </motion.h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-6">
        {processSteps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="relative p-10 border-l lg:border-l-0 lg:border-t border-emerald-900/20 group"
          >
            <div className="absolute top-0 left-[-1px] lg:left-0 lg:top-[-1px] w-[2px] h-0 lg:h-[2px] lg:w-0 bg-emerald-500 group-hover:h-full lg:group-hover:h-[2px] lg:group-hover:w-full transition-all duration-500" />
            <span className="text-emerald-500 text-xs font-mono mb-8 block tracking-widest">{step.num}</span>
            <step.icon className="w-5 h-5 text-zinc-400 mb-8" />
            <h3 className="font-display text-xl text-zinc-200 mb-4">{step.title}</h3>
            <p className="text-zinc-400 text-xs leading-relaxed tracking-wide">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
    ARSENAL TOOLS
───────────────────────────────────────────── */
const tools = [
  { name: "DaVinci Resolve", role: "Primary NLE & Grading", icon: Palette },
  { name: "Adobe Premiere Pro", role: "Editorial & Agency Work", icon: Video },
  { name: "After Effects", role: "Compositing & Motion", icon: Layers },
];

function Tools() {
  return (
    <section id="tools" className="relative z-10 py-64 md:py-80 px-8 md:px-16 max-w-[1600px] mx-auto">
      <div className="mb-32 md:mb-44">
        <SectionLabel icon={<Cpu className="w-3 h-3" />}>Arsenal</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-7xl text-zinc-100"
        >
          Industry <span className="text-emerald-600/40 italic font-light">Standard</span>
        </motion.h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-12 border border-emerald-900/20 bg-black/30 backdrop-blur-md rounded-lg flex flex-col justify-between aspect-square group hover:border-emerald-600/30 transition-colors duration-500"
          >
            <tool.icon className="w-6 h-6 text-emerald-950 group-hover:text-emerald-400 transition-colors duration-500" />
            <div>
              <p className="text-emerald-400/50 text-[10px] font-mono uppercase tracking-[0.25em] mb-3">{tool.role}</p>
              <h3 className="font-display text-3xl text-zinc-300 tracking-wide">{tool.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
    COMPLETE INDEX
───────────────────────────────────────────── */
const projects = [
  { title: "Brand Identity Film", client: "Botanica Co.", duration: "2:30", type: "Commercial" },
  { title: "Festival Documentary", client: "Soundwave Fest", duration: "18:00", type: "Documentary" },
  { title: "Artist EP Visualizer", client: "Nova Rize", duration: "4:12", type: "Music Video" },
  { title: "Product Launch Reel", client: "Lumix PH", duration: "1:00", type: "Commercial" },
  { title: "Travel Series: EP 3", client: "Wanderlight", duration: "12:45", type: "Web Series" },
  { title: "Corporate Annual Recap", client: "Greentech Inc.", duration: "5:20", type: "Corporate" },
  { title: "Short Film: Threshold", client: "Independent", duration: "9:00", type: "Short Film" },
];

function WorksFull() {
  return (
    <section id="all-works" className="relative z-10 py-64 md:py-80 px-8 md:px-16 max-w-[1600px] mx-auto">
      <div className="mb-32 md:mb-44">
        <SectionLabel icon={<Briefcase className="w-3 h-3" />}>Archive</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-7xl text-zinc-100"
        >
          Complete <span className="text-emerald-600/40 italic font-light">Index</span>
        </motion.h2>
      </div>
      <div className="border-t border-emerald-900/20">
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-emerald-900/10 hover:bg-emerald-950/[0.03] transition-colors duration-300 px-6 cursor-pointer group"
          >
            <div className="flex items-center gap-8 md:w-1/2">
              <span className="text-emerald-800 font-mono text-xs w-6 hidden md:block">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h4 className="font-display text-2xl text-zinc-300 group-hover:text-emerald-400 transition-colors">{p.title}</h4>
                <span className="text-zinc-500 text-[11px] font-mono mt-2 block tracking-wide">{p.client}</span>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-12 mt-6 md:mt-0 md:w-1/2">
              <span className="text-zinc-400 text-[10px] font-mono uppercase tracking-[0.2em]">{p.type}</span>
              <span className="text-zinc-500 text-[11px] font-mono tracking-wide">{p.duration}</span>
              <ArrowRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0 hidden md:block" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
    CONTACT INQUIRIES
───────────────────────────────────────────── */
function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  return (
    <section id="contact" className="relative z-10 py-64 md:py-80 px-8 md:px-16 max-w-[1600px] mx-auto">
      <div className="max-w-3xl">
        <SectionLabel icon={<Mail className="w-3 h-3" />}>Inquiries</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-7xl text-zinc-100 mb-10"
        >
          Start a <span className="text-emerald-600/40 italic font-light">Project</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-zinc-400 mb-20 text-sm leading-relaxed tracking-wide max-w-xl"
        >
          Currently accepting bookings for high-fidelity campaigns. Please provide structural parameters regarding timeline and layout requirements.
        </motion.p>
        
        {sent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-emerald-900/30 bg-emerald-950/[0.02] p-16 text-center rounded-lg"
          >
            <h3 className="font-display text-3xl text-zinc-200 mb-3 tracking-wide">Transmission Received</h3>
            <p className="text-zinc-400 text-sm tracking-wide">Reviewing parameters. Structural response dispatch within 24 operational cycles.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { key: "name", label: "Client Name", type: "text", placeholder: "Jane Doe" },
                { key: "email", label: "Email Address", type: "email", placeholder: "jane@studio.com" }
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-emerald-400/70 text-[10px] font-mono uppercase tracking-[0.25em] mb-4">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key as "name" | "email"]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full bg-black/20 border border-emerald-900/30 rounded-none px-5 py-5 text-zinc-200 placeholder-emerald-900/20 focus:outline-none focus:border-emerald-500/50 focus:bg-black/40 transition-all text-sm font-light tracking-wide"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-emerald-400/70 text-[10px] font-mono uppercase tracking-[0.25em] mb-4">
                Project Brief
              </label>
              <textarea
                rows={5}
                placeholder="Describe the footage parameters, baseline deliverables, and visual design layout benchmarks..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-black/20 border border-emerald-900/30 rounded-none px-5 py-5 text-zinc-200 placeholder-emerald-900/20 focus:outline-none focus:border-emerald-500/50 focus:bg-black/40 transition-all text-sm font-light tracking-wide resize-none"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              onClick={handleSubmit}
              className="px-10 py-5 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-mono text-[11px] uppercase tracking-[0.25em] hover:bg-emerald-900 hover:text-white hover:border-emerald-500 transition-colors flex items-center justify-center gap-3 w-full md:w-auto"
            >
              Submit Inquiry <Send className="w-3 h-3" />
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
    <footer className="relative z-10 py-20 px-8 md:px-16 border-t border-emerald-900/20 flex flex-col md:flex-row items-center justify-between gap-8 text-zinc-500 text-[10px] font-mono uppercase tracking-[0.25em] max-w-[1600px] mx-auto w-full">
      <span className="font-display tracking-[0.25em] text-sm text-zinc-400">V.EDIT</span>
      <div className="flex gap-8">
        <a href="#" className="hover:text-emerald-400 transition-colors"><CustomTwitter /></a>
        <a href="#" className="hover:text-emerald-400 transition-colors"><CustomInstagram /></a>
        <a href="#" className="hover:text-emerald-400 transition-colors"><CustomGithub /></a>
        <a href="#" className="hover:text-emerald-400 transition-colors"><CustomLinkedin /></a>
      </div>
      <span className="flex items-center gap-2 text-emerald-800">
        <MapPin className="w-3 h-3" />
        Quezon City, PH — {new Date().getFullYear()}
      </span>
    </footer>
  );
}

/* ─────────────────────────────────────────────
    PAGE MASTER LAYER ROOT
───────────────────────────────────────────── */
export default function Page() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Space+Mono:wght@400&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; background: #010c05; color: #ffffff; -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(16, 185, 129, 0.15); color: #ffffff; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #010c05; }
        ::-webkit-scrollbar-thumb { background: #03210e; border-radius: 0; }
        ::-webkit-scrollbar-thumb:hover { background: #053b19; }
        .scrolled { 
          background: rgba(1, 12, 5, 0.94) !important; 
          backdrop-filter: blur(30px) !important; 
          border-bottom: 1px solid rgba(16, 185, 129, 0.1) !important;
          padding-top: 1.4rem !important; 
          padding-bottom: 1.4rem !important; 
        }
        html { scroll-behavior: smooth; scroll-padding-top: 10rem; }
      `}</style>
      <main className="relative min-h-screen bg-transparent overflow-x-hidden">
        <WaterCanvas />
        {/* Deep luxurious dark green vignette overlay */}
        <div className="fixed inset-0 z-[1] pointer-events-none" style={{ background: "radial-gradient(circle at center, transparent 10%, rgba(1,12,5,0.92) 100%)" }} />
        
        <div className="relative z-10 w-full">
          <Nav />
          <Hero />
          
          {/* Section Container Wrap with isolated blur mixing panels & premium deep spacing splits */}
          <div className="relative bg-[#010c05]/75 backdrop-blur-[12px] border-t border-emerald-900/20 space-y-24">
            <SelectedWorks />
            <Services />
            <Process />
            <Tools />
            <WorksFull />
            <Contact />
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}