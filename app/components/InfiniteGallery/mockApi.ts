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
  { id: "g01", src: "https://picsum.photos/id/10/600/400",  width: 600, height: 400,  title: "Northern Highlands",  category: "Nature" },
  { id: "g02", src: "https://picsum.photos/id/11/600/900",  width: 600, height: 900,  title: "Emerald Lake",        category: "Travel" },
  { id: "g03", src: "https://picsum.photos/id/13/600/450",  width: 600, height: 450,  title: "Coastal Cliffs",      category: "Nature" },
  { id: "g04", src: "https://picsum.photos/id/14/600/600",  width: 600, height: 600,  title: "Ocean Tranquility",   category: "Travel" },
  { id: "g05", src: "https://picsum.photos/id/15/600/800",  width: 600, height: 800,  title: "River Valley",        category: "Nature" },
  { id: "g06", src: "https://picsum.photos/id/16/600/350",  width: 600, height: 350,  title: "Volcanic Ridge",      category: "Nature" },
  { id: "g07", src: "https://picsum.photos/id/17/600/900",  width: 600, height: 900,  title: "Forest Guardian",     category: "Wildlife" },
  { id: "g08", src: "https://picsum.photos/id/18/600/420",  width: 600, height: 420,  title: "Shoreline Mist",      category: "Nature" },
  { id: "g09", src: "https://picsum.photos/id/19/600/600",  width: 600, height: 600,  title: "Hidden Falls",        category: "Nature" },
  { id: "g10", src: "https://picsum.photos/id/20/600/800",  width: 600, height: 800,  title: "Winter Fox",          category: "Wildlife" },
  { id: "g11", src: "https://picsum.photos/id/22/600/400",  width: 600, height: 400,  title: "Alpine Peaks",        category: "Nature" },
  { id: "g12", src: "https://picsum.photos/id/24/600/380",  width: 600, height: 380,  title: "Glass Cathedral",     category: "Architecture" },
  { id: "g13", src: "https://picsum.photos/id/27/600/600",  width: 600, height: 600,  title: "Night Bazaar",        category: "Urban" },
  { id: "g14", src: "https://picsum.photos/id/28/600/900",  width: 600, height: 900,  title: "Snow Silence",        category: "Nature" },
  { id: "g15", src: "https://picsum.photos/id/29/600/420",  width: 600, height: 420,  title: "Harbor Dawn",         category: "Travel" },
  { id: "g16", src: "https://picsum.photos/id/36/600/800",  width: 600, height: 800,  title: "Steel & Sky",         category: "Architecture" },
  { id: "g17", src: "https://picsum.photos/id/37/600/400",  width: 600, height: 400,  title: "Golden Peaks",        category: "Nature" },
  { id: "g18", src: "https://picsum.photos/id/40/600/600",  width: 600, height: 600,  title: "Ancient Canopy",      category: "Nature" },
  { id: "g19", src: "https://picsum.photos/id/42/600/380",  width: 600, height: 380,  title: "Bridge of Sighs",     category: "Architecture" },
  { id: "g20", src: "https://picsum.photos/id/43/600/900",  width: 600, height: 900,  title: "Window Light",        category: "Portrait" },
  { id: "g21", src: "https://picsum.photos/id/44/600/450",  width: 600, height: 450,  title: "Spiral Ascent",       category: "Architecture" },
  { id: "g22", src: "https://picsum.photos/id/48/600/800",  width: 600, height: 800,  title: "Castle Ruins",        category: "Architecture" },
  { id: "g23", src: "https://picsum.photos/id/49/600/400",  width: 600, height: 400,  title: "Desert Canyon",       category: "Nature" },
  { id: "g24", src: "https://picsum.photos/id/50/600/600",  width: 600, height: 600,  title: "Urban Pulse",         category: "Urban" },
  { id: "g25", src: "https://picsum.photos/id/54/600/400",  width: 600, height: 400,  title: "Concrete Jungle",     category: "Urban" },
  { id: "g26", src: "https://picsum.photos/id/56/600/900",  width: 600, height: 900,  title: "Twilight Walk",       category: "Urban" },
  { id: "g27", src: "https://picsum.photos/id/58/600/420",  width: 600, height: 420,  title: "Rain City",           category: "Urban" },
  { id: "g28", src: "https://picsum.photos/id/59/600/800",  width: 600, height: 800,  title: "Glass Tower",         category: "Architecture" },
  { id: "g29", src: "https://picsum.photos/id/64/600/600",  width: 600, height: 600,  title: "Morning Portrait",    category: "Portrait" },
  { id: "g30", src: "https://picsum.photos/id/65/600/350",  width: 600, height: 350,  title: "Boardwalk",           category: "Travel" },
  { id: "g31", src: "https://picsum.photos/id/67/600/900",  width: 600, height: 900,  title: "The Wanderer",        category: "Portrait" },
  { id: "g32", src: "https://picsum.photos/id/69/600/400",  width: 600, height: 400,  title: "Light Play",          category: "Abstract" },
  { id: "g33", src: "https://picsum.photos/id/73/600/600",  width: 600, height: 600,  title: "Golden Hour",         category: "Nature" },
  { id: "g34", src: "https://picsum.photos/id/74/600/800",  width: 600, height: 800,  title: "Cave Light",          category: "Nature" },
  { id: "g35", src: "https://picsum.photos/id/76/600/420",  width: 600, height: 420,  title: "Misty Trail",         category: "Nature" },
  { id: "g36", src: "https://picsum.photos/id/77/600/350",  width: 600, height: 350,  title: "Open Road",           category: "Travel" },
  { id: "g37", src: "https://picsum.photos/id/82/600/900",  width: 600, height: 900,  title: "Frost Bloom",         category: "Nature" },
  { id: "g38", src: "https://picsum.photos/id/83/600/400",  width: 600, height: 400,  title: "Dune Sea",            category: "Nature" },
  { id: "g39", src: "https://picsum.photos/id/84/600/600",  width: 600, height: 600,  title: "Terrace Garden",      category: "Architecture" },
  { id: "g40", src: "https://picsum.photos/id/85/600/800",  width: 600, height: 800,  title: "Deep Forest",         category: "Nature" },
  { id: "g41", src: "https://picsum.photos/id/88/600/420",  width: 600, height: 420,  title: "Sunset Pier",         category: "Travel" },
  { id: "g42", src: "https://picsum.photos/id/89/600/350",  width: 600, height: 350,  title: "Railway Dreams",      category: "Travel" },
  { id: "g43", src: "https://picsum.photos/id/91/600/900",  width: 600, height: 900,  title: "Silent Gaze",         category: "Portrait" },
  { id: "g44", src: "https://picsum.photos/id/92/600/400",  width: 600, height: 400,  title: "Market Colors",       category: "Travel" },
  { id: "g45", src: "https://picsum.photos/id/96/600/600",  width: 600, height: 600,  title: "Wave Patterns",       category: "Abstract" },
  { id: "g46", src: "https://picsum.photos/id/100/600/800", width: 600, height: 800,  title: "Mountain Lake",       category: "Nature" },
  { id: "g47", src: "https://picsum.photos/id/101/600/420", width: 600, height: 420,  title: "Cloud Carpet",        category: "Nature" },
  { id: "g48", src: "https://picsum.photos/id/102/600/350", width: 600, height: 350,  title: "Flat Iron",           category: "Architecture" },
    // Video page hero images
    { id: "v01_img", src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop", width: 1200, height: 675, title: "Edit Einjo1", category: "Video" },
    { id: "v02_img", src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop", width: 800, height: 450, title: "Mountain Sounds", category: "Video" },
    { id: "v03_img", src: "https://images.unsplash.com/photo-1505881502353-a1986add3762?q=80&w=800&auto=format&fit=crop", width: 800, height: 450, title: "The Bahamas", category: "Video" },
    { id: "v04_img", src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=800&auto=format&fit=crop", width: 800, height: 450, title: "Urban Pulse", category: "Video" },
    { id: "v05_img", src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop", width: 800, height: 450, title: "Neon Solstice", category: "Video" },
    // Hero videos as gallery items (video type)
    { id: "v01_vid", src: "/videos/edit_einjo1.mp4", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop", width: 1280, height: 720, title: "Edit Einjo1", category: "Video", type: "video" },
    { id: "v02_vid", src: "/videos/Did_You_Know.mp4", poster: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop", width: 1280, height: 720, title: "Did You Know", category: "Video", type: "video" },
    { id: "v03_vid", src: "/videos/blog_33.mp4", poster: "https://images.unsplash.com/photo-1505881502353-a1986add3762?q=80&w=800&auto=format&fit=crop", width: 1280, height: 720, title: "Blog Reel", category: "Video", type: "video" },
    { id: "v04_vid", src: "/videos/Stabucks_Coffee.mp4", poster: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=800&auto=format&fit=crop", width: 1280, height: 720, title: "Coffee Promo", category: "Video", type: "video" },
    { id: "v05_vid", src: "/videos/videoplayback.mp4", poster: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop", width: 1280, height: 720, title: "Playback Demo", category: "Video", type: "video" },
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
