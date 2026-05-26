"use client";

import { memo, useState } from "react";
import type { GalleryImage } from "./mockApi";

/* ═══════════════════════════════════════════════════════════════════════════ */
/* GalleryCard — Memoized image card with skeleton, lazy load, hover overlay */
/* ═══════════════════════════════════════════════════════════════════════════ */

interface GalleryCardProps {
  image: GalleryImage;
}

const GalleryCard = memo(function GalleryCard({ image }: GalleryCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="gallery-card relative overflow-hidden group cursor-pointer"
      role="figure"
      aria-label={`${image.title} — ${image.category}`}
      tabIndex={0}
    >
      {/*
       * aspect-ratio locks the card dimensions BEFORE the image loads,
       * preventing all layout shift. The skeleton fills this same space.
       */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
      >
        {/* ── Skeleton shimmer (visible until image loads) ── */}
        {!loaded && (
          <div
            className="absolute inset-0 gallery-skeleton"
            aria-hidden="true"
          />
        )}

        {/* ── Lazy-loaded image ── */}
        <img
          src={image.src}
          alt={image.title}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`
            w-full h-full object-cover
            transition-all duration-700 ease-out will-change-transform
            ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"}
            group-hover:scale-[1.08]
          `}
        />

        {/* ── Gradient overlay (hover) ── */}
        <div
          className="
            absolute inset-0 pointer-events-none
            bg-gradient-to-t from-black/65 via-black/15 to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
          "
        />

        {/* ── Glassmorphism info card (hover) ── */}
        <div
          className="
            absolute bottom-0 left-0 right-0 p-2.5 sm:p-3
            translate-y-3 opacity-0
            group-hover:translate-y-0 group-hover:opacity-100
            transition-all duration-500 ease-out
            pointer-events-none
          "
        >
          <div
            className="
              backdrop-blur-xl rounded-xl px-3 py-2
              border border-white/[0.1]
            "
            style={{
              background: "rgba(255,255,255,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            }}
          >
            <p className="text-white text-[11px] sm:text-xs font-bold tracking-wide truncate">
              {image.title}
            </p>
            <p className="text-white/45 text-[9px] sm:text-[10px] tracking-[0.12em] uppercase font-medium">
              {image.category}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default GalleryCard;
