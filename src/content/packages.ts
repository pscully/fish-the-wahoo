export interface PackageData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  duration: string;
  hours: number;
  category: 'family' | 'near-shore' | 'deep-sea' | 'cruise';
  priceFrom: number;
  maxPassengers: number;
  includes: string[];
  targetSpecies: string[];
  /** Fallback image used when Supabase boat_classes image is unavailable */
  image: string;
  /**
   * Which boat class to pull the hero image from (0 = smallest/first by
   * display_order, 1 = mid, 2 = largest). Used by PackageDetail to fetch
   * image_url from Supabase instead of using the static image above.
   */
  boatClassIndex: 0 | 1 | 2;
  metaTitle: string;
  metaDescription: string;
}

export const packages: PackageData[] = [
  {
    slug: '6-hour-family-fun-in-the-sun-charter',
    name: '6-Hour Family Fun In The Sun Charter',
    tagline: 'More time on the water, more fish in the cooler',
    description:
      'Six hours of nearshore action targeting a wide variety of coastal species. Great value for families who want a full morning adventure.',
    longDescription:
      'Our 6-hour family charter gives you more time to explore Charleston\'s productive nearshore fishing grounds. You\'ll target a wide variety of species including red snapper, grouper, sea bass, and more. This trip departs early morning and returns before lunch, leaving the afternoon free. All gear provided, no experience necessary.',
    duration: '6 Hours',
    hours: 6,
    category: 'family',
    priceFrom: 2800,
    maxPassengers: 6,
    includes: [
      'Rods, reels, and tackle',
      'Live and cut bait',
      'Fishing licenses',
      'Ice and fish cleaning',
      'Life jackets',
    ],
    targetSpecies: ['Red Snapper', 'Grouper', 'Sea Bass', 'Flounder', 'Spanish Mackerel'],
    image:
      'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=800',
    boatClassIndex: 0 as const,
    metaTitle: '6-Hour Family Fishing Charter | Fish The Wahoo Charleston',
    metaDescription:
      'Six hours of nearshore fishing out of Charleston, SC. Family-friendly, all gear included. Book your spot today.',
  },
  {
    slug: '6-hour-near-shore-fishing',
    name: '6-Hour Near Shore Fishing',
    tagline: 'Extended nearshore bottom fishing',
    description:
      'Six hours targeting nearshore structure, reefs, and ledges for bottom species and migratory fish.',
    longDescription:
      'With 6 hours to work the nearshore grounds, your captain can cover more territory and find the bite wherever it is. We target a wide mix of species depending on season and conditions. This trip offers great value for groups who want more action without going offshore.',
    duration: '6 Hours',
    hours: 6,
    category: 'near-shore',
    priceFrom: 2800,
    maxPassengers: 6,
    includes: [
      'Rods, reels, and tackle',
      'Live and cut bait',
      'Fishing licenses',
      'Ice and fish cleaning',
      'Life jackets',
    ],
    targetSpecies: ['Red Snapper', 'Grouper', 'Sea Bass', 'Amberjack', 'King Mackerel'],
    image:
      'https://images.pexels.com/photos/2624849/pexels-photo-2624849.jpeg?auto=compress&cs=tinysrgb&w=800',
    boatClassIndex: 0 as const,
    metaTitle: '6-Hour Nearshore Fishing Charter Charleston SC | Fish The Wahoo',
    metaDescription:
      'Six-hour nearshore fishing charters from Charleston, SC. Extended action targeting snapper, grouper, and more.',
  },
  {
    slug: '6-hour-bottom-fishing',
    name: '6-Hour Bottom Fishing',
    tagline: 'Snapper, grouper, and sea bass on the reefs and ledges',
    description:
      'Six hours working the productive reefs and ledges off Charleston. Bottom fishing only — offshore runs need a longer day.',
    longDescription:
      'A 6-hour trip is our bottom fishing option. Six hours is a tight window, so the offshore run to the Gulf Stream isn\'t possible — we stay on the nearshore reefs and ledges where the bite is consistent and the action is fast. Expect snapper, grouper, sea bass, amberjack, and the occasional king mackerel depending on the season. If you want to target mahi, wahoo, tuna, or billfish, book a 9- or 12-hour trip so we have time to run offshore and fish.',
    duration: '6 Hours',
    hours: 6,
    category: 'near-shore',
    priceFrom: 2800,
    maxPassengers: 6,
    includes: [
      'Rods, reels, and tackle',
      'Live and cut bait',
      'Fishing licenses',
      'Ice and fish cleaning',
      'Life jackets and safety gear',
    ],
    targetSpecies: ['Red Snapper', 'Grouper', 'Sea Bass', 'Amberjack', 'King Mackerel'],
    image:
      'https://images.pexels.com/photos/3361691/pexels-photo-3361691.jpeg?auto=compress&cs=tinysrgb&w=800',
    boatClassIndex: 0 as const,
    metaTitle: '6-Hour Bottom Fishing Charter Charleston SC | Fish The Wahoo',
    metaDescription:
      'Six-hour bottom fishing charters out of Charleston, SC. Nearshore reefs and ledges for snapper, grouper, and sea bass. Book today.',
  },
  {
    slug: '9-hour-deep-sea-fishing',
    name: '9-Hour Deep Sea Fishing',
    tagline: 'The serious angler\'s offshore trip',
    description:
      'Nine hours gives you maximum fishing time at the best offshore grounds. Ideal for targeting big game pelagics.',
    longDescription:
      'With 9 hours on the water, your captain can run to the most productive offshore grounds and give you the best chance at landing a trophy fish. This is the trip for serious anglers who want to maximize their offshore time. Mahi-mahi, wahoo, tuna, and sailfish are all targets depending on season.',
    duration: '9 Hours',
    hours: 9,
    category: 'deep-sea',
    priceFrom: 3100,
    maxPassengers: 6,
    includes: [
      'Premium rods, reels, and tackle',
      'Live and rigged baits',
      'Fishing licenses',
      'Ice and fish cleaning',
      'Life jackets and safety gear',
      'Lunch stop or snacks',
    ],
    targetSpecies: ['Mahi-Mahi', 'Wahoo', 'Tuna', 'Sailfish', 'Blue Marlin'],
    image:
      'https://images.pexels.com/photos/1172739/pexels-photo-1172739.jpeg?auto=compress&cs=tinysrgb&w=800',
    boatClassIndex: 1 as const,
    metaTitle: '9-Hour Deep Sea Fishing Charter Charleston SC | Fish The Wahoo',
    metaDescription:
      'Nine-hour offshore fishing charters from Charleston. Maximum time on the water targeting mahi, wahoo, tuna, and marlin.',
  },
  {
    slug: '12-hour-deep-sea-fishing',
    name: '12-Hour Deep Sea Fishing',
    tagline: 'The full offshore experience',
    description:
      'A full day offshore targeting the best big game fishing Charleston has to offer. Our most popular serious angler trip.',
    longDescription:
      'The 12-hour deep sea charter is the gold standard for offshore fishing out of Charleston. Departing before dawn, your captain runs to the best grounds for the season. You\'ll spend maximum time fishing, targeting blue marlin, white marlin, mahi-mahi, wahoo, and tuna. This is the trip everyone talks about when they get back to the dock.',
    duration: '12 Hours',
    hours: 12,
    category: 'deep-sea',
    priceFrom: 3400,
    maxPassengers: 6,
    includes: [
      'Premium rods, reels, and tackle',
      'Live and rigged baits',
      'Fishing licenses',
      'Ice and fish cleaning',
      'Life jackets and safety gear',
      'Lunch and snacks',
      'Beverages',
    ],
    targetSpecies: [
      'Blue Marlin',
      'White Marlin',
      'Mahi-Mahi',
      'Wahoo',
      'Yellowfin Tuna',
      'Sailfish',
    ],
    image:
      'https://images.pexels.com/photos/1630344/pexels-photo-1630344.jpeg?auto=compress&cs=tinysrgb&w=800',
    boatClassIndex: 2 as const,
    metaTitle: '12-Hour Full Day Deep Sea Fishing Charter Charleston SC | Fish The Wahoo',
    metaDescription:
      'Full-day 12-hour deep sea fishing charters from Charleston, SC. Targeting blue marlin, mahi, wahoo, and tuna. The ultimate offshore experience.',
  },
  {
    slug: 'harbor-cruises',
    name: 'Harbor Cruises',
    tagline: 'Scenic Charleston from the water',
    description:
      'Not just fishing -- take in the stunning beauty of Charleston Harbor and the surrounding waterways on a private charter cruise.',
    longDescription:
      'Our harbor cruise charters give you a private boat experience to explore the beautiful Charleston Harbor, Fort Sumter, and the surrounding coastal scenery. Perfect for anniversaries, corporate events, family gatherings, or just a relaxing afternoon on the water. We can customize the route and duration to your preferences. Dolphin sightings are common.',
    duration: '2-4 Hours',
    hours: 3,
    category: 'cruise',
    priceFrom: 750,
    maxPassengers: 12,
    includes: [
      'Private boat and captain',
      'Life jackets',
      'Narrated tour of the harbor',
      'Cooler and ice (bring your own beverages)',
    ],
    targetSpecies: [],
    image:
      'https://images.pexels.com/photos/1172739/pexels-photo-1172739.jpeg?auto=compress&cs=tinysrgb&w=800',
    boatClassIndex: 0 as const,
    metaTitle: 'Charleston Harbor Cruise Charters | Fish The Wahoo',
    metaDescription:
      'Private harbor cruise charters in Charleston, SC. See Fort Sumter, dolphins, and the Charleston skyline from the water.',
  },
];

export function getPackageBySlug(slug: string): PackageData | undefined {
  return packages.find((p) => p.slug === slug);
}

export function getPackagesByCategory(category: PackageData['category']): PackageData[] {
  return packages.filter((p) => p.category === category);
}
