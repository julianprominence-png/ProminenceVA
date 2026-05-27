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
];
