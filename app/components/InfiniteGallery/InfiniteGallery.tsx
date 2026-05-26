"use client";

/* ═══════════════════════════════════════════════════════════════════════════ */
/* InfiniteGallery — Seamless auto-looping cinematic masonry wall             */
/*                                                                           */
/* Architecture:                                                             */
/*   • Images distributed into columns via shortest-first algorithm          */
/*   • Each column's content is rendered 2× for seamless CSS loop            */
/*   • Columns scroll at different speeds & directions (parallax feel)       */
/*   • Hover pauses all columns; images zoom on individual hover             */
/*   • GPU-accelerated via CSS transform animations                          */
/*   • Responsive: 3 cols (md+) → 2 cols (mobile)                           */
/*   • Zero layout shift via aspect-ratio locking on every card              */
/* ═══════════════════════════════════════════════════════════════════════════ */

import { useMemo, useState, useEffect } from "react";
import { galleryImages, type GalleryImage } from "./mockApi";
import GalleryCard from "./GalleryCard";
import "./InfiniteGallery.css";

/* ── Column behaviour presets ── */
interface ColumnConfig {
  direction: "up" | "down";
  /** Total animation duration in seconds (lower = faster) */
  duration: number;
}

const COLUMN_PRESETS: ColumnConfig[] = [
  { direction: "up",   duration: 80 },   /* slow, scrolls up   */
  { direction: "down", duration: 60 },   /* medium, scrolls down (parallax) */
  { direction: "up",   duration: 90 },   /* slowest, scrolls up */
];

/* ── Props ── */
interface InfiniteGalleryProps {
  /** Container height — accepts any CSS value */
  height?: string;
  /** Extra class names on the outermost wrapper */
  className?: string;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* Component                                                                 */
/* ═══════════════════════════════════════════════════════════════════════════ */

export default function InfiniteGallery({
  height = "clamp(600px, 85vh, 1000px)",
  className = "",
}: InfiniteGalleryProps) {
  /* ── Responsive column count ── */
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const update = () =>
      setColumnCount(window.innerWidth >= 768 ? 3 : 2);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ── Distribute images across columns (shortest-first) ── */
  const columns = useMemo(() => {
    const buckets: GalleryImage[][] = Array.from(
      { length: columnCount },
      () => []
    );
    const heights = new Array(columnCount).fill(0);

    galleryImages.forEach((img) => {
      const shortest = heights.indexOf(Math.min(...heights));
      buckets[shortest].push(img);
      heights[shortest] += img.height / img.width; // accumulate aspect ratio
    });

    return buckets;
  }, [columnCount]);

  /* ── Render ── */
  return (
    <div
      className={`infinite-gallery-container ${className}`}
      style={{ height }}
      role="region"
      aria-label="Portfolio Gallery"
    >
      <div className="flex gap-1 h-full">
        {columns.map((col, colIdx) => {
          const config = COLUMN_PRESETS[colIdx % COLUMN_PRESETS.length];

          return (
            <div
              key={colIdx}
              className="flex-1 overflow-hidden relative h-full"
            >
              {/*
               * The scroll track contains the column content TWICE.
               * CSS animation scrolls exactly 50% (one full copy),
               * then loops back — perfectly invisible.
               */}
              <div
                className={`
                  flex flex-col gap-1
                  gallery-scroll-track
                  gallery-scroll-${config.direction}
                `}
                style={{
                  "--scroll-duration": `${config.duration}s`,
                } as React.CSSProperties}
              >
                {/* ── First copy ── */}
                {col.map((img) => (
                  <GalleryCard key={`a-${img.id}`} image={img} />
                ))}
                {/* ── Duplicate copy (seamless loop) ── */}
                {col.map((img) => (
                  <GalleryCard key={`b-${img.id}`} image={img} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
