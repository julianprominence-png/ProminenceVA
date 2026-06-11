"use client";

import { memo, useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";
import type { GalleryImage } from "./mockApi";

/* ═══════════════════════════════════════════════════════════════════════════ */
/* GalleryCard — Memoized image card with skeleton, lazy load, hover overlay */
/* ═══════════════════════════════════════════════════════════════════════════ */

interface GalleryCardProps {
  image: GalleryImage;
}

const GalleryCard = memo(function GalleryCard({ image }: GalleryCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isHovered = useRef(false);

  const playVideo = async () => {
    isHovered.current = true;
    if (image.type !== "video" || !videoRef.current) return;
    const v = videoRef.current;
    
    try {
      if (!v.currentSrc || !v.currentSrc.includes(image.src)) {
        try {
          while (v.firstChild) v.removeChild(v.firstChild);
          const srcEl = document.createElement('source');
          srcEl.src = image.src;
          srcEl.type = 'video/mp4';
          (v as any).crossOrigin = 'anonymous';
          (srcEl as any).crossOrigin = 'anonymous';
          v.appendChild(srcEl);
          v.load();
        } catch (e) {
          v.src = image.src;
          try { v.load(); } catch (ee) {}
        }
      }

      const canPlay = v.canPlayType && v.canPlayType('video/mp4');
      if (!canPlay) return;

      v.muted = true;
      const canPlayPromise = new Promise<void>((resolve) => {
        if (v.readyState >= 3) return resolve();
        const onCan = () => {
          v.removeEventListener('canplay', onCan);
          resolve();
        };
        v.addEventListener('canplay', onCan);
        setTimeout(() => {
          try { v.removeEventListener('canplay', onCan); } catch (e) {}
          resolve();
        }, 1500);
      });
      await canPlayPromise;

      if (!isHovered.current) return; // Prevent playing if hovered out during load

      try {
        await v.play();
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          try {
            v.pause();
            while (v.firstChild) v.removeChild(v.firstChild);
            v.removeAttribute('src');
            v.load();
          } catch (e) {}
        }
        return;
      }
      
      if (!isHovered.current) {
        v.pause();
        return;
      }
      
      setTimeout(() => {
        try { v.muted = false; } catch (e) {}
      }, 250);
    } catch (err) {
      console.error("GalleryCard: playback failed", image.id, err);
    }
  };

  const pauseVideo = () => {
    isHovered.current = false;
    if (image.type !== "video" || !videoRef.current) return;
    const v = videoRef.current;
    if (!v.paused) {
      v.pause();
    }
  };

  const handleActivate = async (e?: MouseEvent | PointerEvent) => {
    if (e && 'button' in e) {
      const pointerType = (e as any).pointerType;
      const btn = (e as any).button;
      if (pointerType === 'mouse' && btn !== 0) return;
      if (pointerType === 'pen' && btn !== 0) return;
      if (!pointerType && btn !== 0) return;
    }

    if (image.type === "video" && videoRef.current) {
      if (videoRef.current.paused) {
        playVideo();
      } else {
        pauseVideo();
      }
    }
  };

  return (
    <div
      className="gallery-card relative overflow-hidden group cursor-pointer"
      role="figure"
      aria-label={`${image.title} — ${image.category}`}
      tabIndex={0}
      onMouseEnter={playVideo}
      onMouseLeave={pauseVideo}
    >
      {/*
       * aspect-ratio locks the card dimensions BEFORE the image loads,
       * preventing all layout shift. The skeleton fills this same space.
       */}
      <div
        className="relative overflow-hidden"
        // fixed square aspect ratio so every gallery card is identical size
        style={{ aspectRatio: `1 / 1` }}
      >
        {/* ── Skeleton shimmer (visible until image loads) ── */}
        {!loaded && (
          <div
            className="absolute inset-0 gallery-skeleton"
            aria-hidden="true"
          />
        )}

        {/* ── Media (image or video) ── */}
        {image.type === "video" ? (
          <>
            {/* poster image shown until playback starts */}
            {image.poster && !playing && (
              <img
                src={image.poster}
                alt={`${image.title} poster`}
                decoding="async"
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                  loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"
                } group-hover:scale-[1.08]`}
              />
            )}

            <video
              ref={videoRef}
              poster={image.poster}
              preload={!image.poster ? "metadata" : "none"}
              src={!image.poster ? `${image.src}#t=0.001` : undefined}
              onLoadedData={() => setLoaded(true)}
              onClick={(e) => handleActivate(e)}
              onError={(e) => {
                // log media errors with useful video state for debugging
                const ev = e as any;
                const videoEl = ev?.currentTarget as HTMLVideoElement | undefined;
                console.error(
                  "GalleryCard: video error",
                  image.id,
                  videoEl?.error ?? null,
                  { currentSrc: videoEl?.currentSrc, networkState: videoEl?.networkState, readyState: videoEl?.readyState }
                );
              }}
              onPlay={() => {
                console.debug("GalleryCard: video onPlay", image.id);
                setPlaying(true);
              }}
              onPause={() => {
                setPlaying(false);
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                loaded && (playing || !image.poster) ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"
              } group-hover:scale-[1.08]`}
              playsInline
              // start muted to maximize playback success on browsers, then unmute after play
              muted={true}
              loop
            >
              {/* src is assigned on first user activation to avoid automatic loading/errors */}
            </video>
          </>
        ) : (
          <img
            src={image.src}
            alt={image.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`
              w-full h-full object-cover
              transition-all duration-700 ease-out
              ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"}
              group-hover:scale-[1.08]
            `}
          />
        )}

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
      {/* make touch/click activate media (play/pause for videos) */}
      <button
        onClick={(e) => handleActivate(e)}
        onPointerDown={(e) => handleActivate(e)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleActivate();
          }
        }}
        aria-label={image.type === "video" ? `Play ${image.title}` : undefined}
        className="absolute inset-0 p-0 m-0 bg-transparent border-0 z-40"
        style={{
          // ensure the button receives touch/click events
          pointerEvents: "auto",
          background: "transparent",
        }}
      />
    </div>
  );
});

export default GalleryCard;
