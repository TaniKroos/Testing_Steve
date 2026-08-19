const seedPackages = [
  {
    id: "pkg-kerala",
    location: "Kerala, India",
    country: "India",
    title: "Backwaters & Forest Canopies",
    duration: "6 days · 5 nights",
    price: 1299,
    discount: 15,
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
    description: "Drift through palm-lined waterways, sip spice garden tea, and wake up to the call of the wild.",
    highlights: ["Private houseboat", "Periyar nature walk", "Local cuisine"],
    featured: true
  },
  {
    id: "pkg-madeira",
    location: "Madeira, Portugal",
    country: "Portugal",
    title: "The Island of Eternal Spring",
    duration: "5 days · 4 nights",
    price: 1480,
    discount: 10,
    rating: 4.8,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1501446529957-6226bd447c46?auto=format&fit=crop&w=1200&q=85",
    description: "Follow levada trails above the Atlantic and discover a volcanic island in full bloom.",
    highlights: ["Levada hike", "Funchal food tour", "Ocean-view stay"],
    featured: true
  },
  {
    id: "pkg-banff",
    location: "Banff, Canada",
    country: "Canada",
    title: "Lakes, Peaks & Wild Skies",
    duration: "7 days · 6 nights",
    price: 1795,
    discount: 12,
    rating: 4.9,
    reviews: 206,
    image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1200&q=85",
    description: "A restorative alpine escape shaped around turquoise lakes and spectacular mountain trails.",
    highlights: ["Lake Louise sunrise", "Guided hiking", "Cabin lodging"],
    featured: true
  },
  {
    id: "pkg-bali",
    location: "Ubud, Bali",
    country: "Indonesia",
    title: "Rice Terraces & Sacred Rivers",
    duration: "6 days · 5 nights",
    price: 1120,
    discount: 8,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
    description: "Slow down among emerald paddies, temple rituals, and lush river valleys.",
    highlights: ["Wellness morning", "Temple visit", "Cycling tour"],
    featured: false
  }
];

let packages = structuredClone(seedPackages);

export const packageStore = {
  list() {
    return packages;
  },
  get(id) {
    return packages.find((travelPackage) => travelPackage.id === id);
  },
  create(travelPackage) {
    packages.unshift(travelPackage);
    return travelPackage;
  },
  update(id, changes) {
    const index = packages.findIndex((travelPackage) => travelPackage.id === id);
    if (index === -1) return null;
    packages[index] = { ...packages[index], ...changes, id };
    return packages[index];
  }
};
