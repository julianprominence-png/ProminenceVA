/* ═══════════════════════════════════════════════════════════════════════════ */
/* Gallery Image Data — curated pool with varied aspect ratios for masonry   */
/* ═══════════════════════════════════════════════════════════════════════════ */

export interface GalleryImage {
  id: string;
  src: string;
  width: number;
  height: number;
  title: string;
  category: string;
  /** media type: image (default) or video */
  type?: "image" | "video";
  /** optional poster/thumbnail for video items */
  poster?: string;
}

/**
 * 48 curated images with intentionally varied aspect ratios
 * to create a dynamic, visually interesting masonry layout.
 *
 * Heights range from 300 (wide panoramic) to 900 (tall portrait)
 * to maximize the depth and organic rhythm of the gallery wall.
 */
export const galleryImages: GalleryImage[] = [
    // Hero videos as gallery items (video type)
    { id: "v01_vid", src: "/videos/edit_einjo1.mp4", poster: "/videos/posters/edit_einjo.png", width: 1280, height: 720, title: "Edit Einjo1", category: "Video", type: "video" },
    { id: "v02_vid", src: "/videos/Did_You_Know.mp4", poster: "/videos/posters/did_you_know.png", width: 1280, height: 720, title: "Did You Know", category: "Video", type: "video" },
    { id: "v03_vid", src: "/videos/blog_33.mp4", poster: "/videos/posters/blog_reel.png", width: 1280, height: 720, title: "Blog Reel", category: "Video", type: "video" },
    { id: "v04_vid", src: "/videos/Stabucks_Coffee.mp4", poster: "/videos/posters/starbucks.png", width: 1280, height: 720, title: "Coffee Promo", category: "Video", type: "video" },
    { id: "v05_vid", src: "/videos/videoplayback.mp4", poster: "/videos/posters/playback.png", width: 1280, height: 720, title: "Playback Demo", category: "Video", type: "video" },
    // Graphics page WORKS assets
    { id: "gfx01", src: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1779809312/SYC6_ziwiy4.jpg", width: 1200, height: 800, title: "Aero Dynamics", category: "Graphics" },
    { id: "gfx02", src: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1780411420/TASK_1_-_WHAT_IS_EMTONE_1_egwrrw.jpg", width: 1200, height: 800, title: "Vanguard Motors", category: "Graphics" },
    { id: "gfx03", src: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1780413198/Screenshot_2026-06-02_231248_apfvz5.png", width: 1200, height: 800, title: "Kroma Architecture", category: "Graphics" },
    { id: "gfx04", src: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1780405902/TASK8_w8yoby.png", width: 1200, height: 800, title: "Maison Velour", category: "Graphics" },
    { id: "gfx05", src: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1780411857/BROOMES_3_llpwkl.png", width: 1200, height: 800, title: "Luxe Collective", category: "Graphics" },
    { id: "gfx06", src: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1780413365/BROOMES_4_lcee8t.png", width: 1200, height: 800, title: "Nova Robotics", category: "Graphics" },
    { id: "gfx07", src: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1780411392/TASK_2_-_TAUT_TONED_2_vv7pko.jpg", width: 1200, height: 800, title: "Atelier & Co.", category: "Graphics" },
    { id: "gfx08", src: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1780413697/Screenshot_2026-06-02_232114_a4micc.png", width: 1200, height: 800, title: "Aura Skincare", category: "Graphics" },
    { id: "gfx09", src: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1780411803/truckimage_c7x1kp.png", width: 1200, height: 800, title: "Quantum Interface", category: "Graphics" },
];

/* Special featured image (unique asset inserted at a random position) */
const SPECIAL_IMAGE: GalleryImage = {
  id: "g_special",
  src: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1780495254/SQ_-_Carousel_1_gfqaq6.png",
  width: 1200,
  height: 420,
  title: "Spotlight Carousel",
  category: "Feature",
};

/* Second unique featured image — must be placed at a different index */
const SPECIAL_IMAGE_2: GalleryImage = {
  id: "g_special2",
  src: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1780495221/image_3_f9amnz.png",
  width: 900,
  height: 900,
  title: "Accent Feature",
  category: "Feature",
};

/* Third unique featured image — must be placed at a different index */
const SPECIAL_IMAGE_3: GalleryImage = {
  id: "g_special3",
  src: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1780495169/image_2_u9qaug.png",
  width: 1000,
  height: 600,
  title: "Tertiary Accent",
  category: "Feature",
};

/* Fourth unique featured image — must be placed at a different index */
const SPECIAL_IMAGE_4: GalleryImage = {
  id: "g_special4",
  src: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1780495090/BROOMES_1_srzklc.png",
  width: 1200,
  height: 800,
  title: "Quaternary Accent",
  category: "Feature",
};

/* Video special: plays when left-clicked */
const SPECIAL_VIDEO: GalleryImage = {
  id: "g_special_video",
  src: "https://res.cloudinary.com/dzbqzsvoi/video/upload/q_auto/f_auto/v1780500300/RIDES_TO_FLY_k5m9uu.mp4",
  poster: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1780499000/RIDES_TO_FLY_poster.jpg",
  width: 1280,
  height: 720,
  title: "Rides To Fly",
  category: "Video",
  type: "video",
};

/* Additional video special: Dyson (plays like other video specials) */
const SPECIAL_VIDEO_2: GalleryImage = {
  id: "g_special_video_dyson",
  src: "https://res.cloudinary.com/dzbqzsvoi/video/upload/q_auto/f_auto/v1780501097/Dyson_No_BG_1.0_ob9rut.mp4",
  poster: "https://res.cloudinary.com/dzbqzsvoi/image/upload/q_auto/f_auto/v1780499001/Dyson_poster.jpg",
  width: 1280,
  height: 720,
  title: "Dyson Promo",
  category: "Video",
  type: "video",
};


/**
 * Return a new array with the special image inserted at a random index.
 * The original `galleryImages` array is not mutated.
 */
export function getGalleryImagesRandomized(): GalleryImage[] {
  // Ensure special images are not duplicated in the pool
  const pool = galleryImages.filter(
    (i) => i.id !== SPECIAL_IMAGE.id && i.id !== SPECIAL_IMAGE_2.id && i.id !== SPECIAL_IMAGE_3.id && i.id !== SPECIAL_IMAGE_4.id
  );
  const out = pool.slice();

  const maxInsert = out.length + 1; // possible insertion positions
  const indices = new Set<number>();
  while (indices.size < 6) {
    indices.add(Math.floor(Math.random() * maxInsert));
  }
  const idxArr = Array.from(indices);

  // Pair each special image with an index. Insert in descending order
  // so earlier splices don't shift later positions.
  const specials = [
    SPECIAL_IMAGE,
    SPECIAL_IMAGE_2,
    SPECIAL_IMAGE_3,
    SPECIAL_IMAGE_4,
    SPECIAL_VIDEO,
    SPECIAL_VIDEO_2,
  ];
  const pairs = idxArr.map((idx, i) => ({ idx, img: specials[i] }));
  pairs.sort((a, b) => b.idx - a.idx);

  pairs.forEach((p) => out.splice(p.idx, 0, p.img));

  return out;
}
