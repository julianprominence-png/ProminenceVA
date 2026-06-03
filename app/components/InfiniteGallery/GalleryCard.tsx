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

  const handleActivate = async (e?: MouseEvent | PointerEvent) => {
    // If this is a mouse/pointer event and it's not a primary (left) button,
    // ignore. Allow keyboard activation (no event) and touch (pointerType === 'touch').
    if (e && 'button' in e) {
      // pointer events may include pointerType
      // @ts-ignore
      const pointerType = (e as any).pointerType;
      const btn = (e as any).button;
      if (pointerType === 'mouse' && btn !== 0) return; // only left mouse
      if (pointerType === 'pen' && btn !== 0) return;
      // if pointerType is touch, allow (but user requested left click; keep touch disabled)
      if (!pointerType && btn !== 0) return; // mouse fallback
    }

    if (image.type === "video" && videoRef.current) {
      const v = videoRef.current;
      console.debug("GalleryCard: activate", image.id, { paused: v.paused, muted: v.muted });
      if (v.paused) {
        // assign src on demand to avoid preloading remote videos
        try {
          if (!v.src || v.src !== image.src) {
            // prefer adding a <source> element — some browsers give clearer errors this way
            try {
              // clear existing sources
              while (v.firstChild) v.removeChild(v.firstChild);
              const srcEl = document.createElement('source');
              srcEl.src = image.src;
              srcEl.type = 'video/mp4';
              // set CORS to help remote hosts that allow cross-origin fetches
              // (Cloudinary typically permits this, but set as a safety net)
              (v as any).crossOrigin = 'anonymous';
              (srcEl as any).crossOrigin = 'anonymous';
              v.appendChild(srcEl);
              v.load();
            } catch (e) {
              // fallback to direct assignment
              v.src = image.src;
              try { v.load(); } catch (ee) { /* ignore */ }
            }
          }

          // simple capability check
          const canPlay = v.canPlayType && v.canPlayType('video/mp4');
          if (!canPlay) {
            console.warn('GalleryCard: video may not be playable in this client (canPlayType):', image.id, canPlay);
            // bail early to avoid NotSupportedError
            return;
          }

          // Start muted first to maximize success across browsers, then unmute.
          v.muted = true;

          // Wait for 'canplay' event (or timeout) before attempting to play to reduce AbortError.
          const canPlayPromise = new Promise<void>((resolve) => {
            if (v.readyState >= 3) return resolve();
            const onCan = () => {
              v.removeEventListener('canplay', onCan);
              resolve();
            };
            v.addEventListener('canplay', onCan);
            // safety timeout
            setTimeout(() => {
              try { v.removeEventListener('canplay', onCan); } catch (e) {}
              resolve();
            }, 1500);
          });
          await canPlayPromise;

          try {
            await v.play();
            console.debug('GalleryCard: muted play started', image.id);
          } catch (err) {
            console.error('GalleryCard: playback failed (muted fallback)', image.id, err);
            // restore poster and leave video unloaded — avoids repeated failing requests
            try {
              v.pause();
              // remove sources to prevent further network attempts
              while (v.firstChild) v.removeChild(v.firstChild);
              v.removeAttribute('src');
              v.load();
            } catch (e) { /* ignore */ }
            return;
          }
          // attempt to unmute shortly after playback begins (user intended gesture)
          setTimeout(() => {
            try {
              v.muted = false;
            } catch (e) {
              /* ignore */
            }
          }, 250);
        } catch (err) {
          console.error("GalleryCard: playback failed (muted fallback)", image.id, err);
        }
      } else {
        v.pause();
      }
    }
  };

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
                className={`w-full h-full object-cover transition-all duration-700 ease-out will-change-transform ${
                  loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"
                } group-hover:scale-[1.08]`}
              />
            )}

            <video
              ref={videoRef}
              poster={image.poster}
              preload="none"
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
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out will-change-transform ${
                playing ? "opacity-100 scale-100" : "opacity-0"
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
              transition-all duration-700 ease-out will-change-transform
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
