"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ─── CONFIG ─────────────────────────────────────────── */
const ORB_COUNT = 7;
const PARTICLE_COUNT = 300;
const ORB_COLORS = [
  new THREE.Color("#b4a7d6"), // lavender
  new THREE.Color("#a8c8e8"), // pale blue
  new THREE.Color("#d4a8d8"), // blush purple
  new THREE.Color("#c9b8f0"), // soft violet
  new THREE.Color("#8ec5e2"), // sky mist
  new THREE.Color("#e0b4e8"), // pink orchid
  new THREE.Color("#9db8e0"), // steel periwinkle
];

interface Orb {
  mesh: THREE.Mesh;
  basePos: THREE.Vector3;
  speed: THREE.Vector3;
  phase: number;
  amplitude: THREE.Vector3;
}

export default function EtherealCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* ── Scene Setup ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 30);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    /* ── Lighting ── */
    const ambientLight = new THREE.AmbientLight(0xb4a7d6, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xa8c8e8, 0.8, 80);
    pointLight1.position.set(15, 10, 15);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xd4a8d8, 0.6, 80);
    pointLight2.position.set(-15, -8, 10);
    scene.add(pointLight2);

    /* ── Luminous Orbs ── */
    const orbs: Orb[] = [];
    for (let i = 0; i < ORB_COUNT; i++) {
      const radius = 0.8 + Math.random() * 2.5;
      const geo = new THREE.SphereGeometry(radius, 32, 32);
      const color = ORB_COLORS[i % ORB_COLORS.length];

      const mat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.18 + Math.random() * 0.15,
        roughness: 0.2,
        metalness: 0.1,
      });

      const mesh = new THREE.Mesh(geo, mat);
      const basePos = new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 10
      );
      mesh.position.copy(basePos);
      scene.add(mesh);

      orbs.push({
        mesh,
        basePos,
        speed: new THREE.Vector3(
          0.1 + Math.random() * 0.3,
          0.1 + Math.random() * 0.25,
          0.05 + Math.random() * 0.15
        ),
        phase: Math.random() * Math.PI * 2,
        amplitude: new THREE.Vector3(
          2 + Math.random() * 4,
          1.5 + Math.random() * 3,
          1 + Math.random() * 2
        ),
      });
    }

    /* ── Ambient Dust Particles ── */
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const particleSizes = new Float32Array(PARTICLE_COUNT);
    const particleAlphas = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      particleSizes[i] = 0.02 + Math.random() * 0.08;
      particleAlphas[i] = 0.2 + Math.random() * 0.6;
    }

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      color: 0xd0c8f0,
      size: 0.12,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* ── Mouse Parallax ── */
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    /* ── Animation Loop ── */
    const clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.02;
      mouse.y += (mouse.targetY - mouse.y) * 0.02;

      // Animate orbs
      orbs.forEach((orb) => {
        const t = elapsed;
        orb.mesh.position.x =
          orb.basePos.x +
          Math.sin(t * orb.speed.x + orb.phase) * orb.amplitude.x;
        orb.mesh.position.y =
          orb.basePos.y +
          Math.cos(t * orb.speed.y + orb.phase * 1.3) * orb.amplitude.y;
        orb.mesh.position.z =
          orb.basePos.z +
          Math.sin(t * orb.speed.z + orb.phase * 0.7) * orb.amplitude.z;

        // Subtle scale breathing
        const breathe = 1 + Math.sin(t * 0.5 + orb.phase) * 0.08;
        orb.mesh.scale.setScalar(breathe);
      });

      // Animate particles — slow upward drift
      const posArr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        posArr[i * 3 + 1] += 0.005 + particleSizes[i] * 0.01;
        // Wrap around
        if (posArr[i * 3 + 1] > 25) {
          posArr[i * 3 + 1] = -25;
          posArr[i * 3] = (Math.random() - 0.5) * 60;
        }
        // Gentle horizontal sway
        posArr[i * 3] += Math.sin(elapsed * 0.3 + i * 0.1) * 0.003;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Camera parallax
      camera.position.x = mouse.x * 1.5;
      camera.position.y = -mouse.y * 1;
      camera.lookAt(0, 0, 0);

      // Animate lights
      pointLight1.position.x = 15 + Math.sin(elapsed * 0.3) * 5;
      pointLight1.position.y = 10 + Math.cos(elapsed * 0.2) * 4;
      pointLight2.position.x = -15 + Math.cos(elapsed * 0.25) * 5;
      pointLight2.position.y = -8 + Math.sin(elapsed * 0.35) * 3;

      renderer.render(scene, camera);
    };

    animate();

    /* ── Resize Handler ── */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

      orbs.forEach((orb) => {
        orb.mesh.geometry.dispose();
        (orb.mesh.material as THREE.Material).dispose();
      });
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="ethereal-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -10,
        pointerEvents: "none",
      }}
    />
  );
}
