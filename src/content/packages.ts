export interface PackageData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  duration: string;
  hours: number;
  category: 'near-shore' | 'deep-sea' | 'cruise';
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
  /** Hide from public listings (grid, category pages, sitemap). Detail route still resolves. */
  hidden?: boolean;
}

export const packages: PackageData[] = [
  {
    slug: 'half-day-charter',
    name: '1/2 Day Charter',
    tagline: 'Half day on the water, half day in Charleston',
    description:
      'A half day trip out of Charleston. Pick a 6am or noon departure and still have time left in your day.',
    longDescription:
      'Book a 1/2 day trip and make your time at sea just part of your day in Charleston. Go out at 6am and be back at 11, or book for the afternoon from noon to 5pm. Looking for a fun activity and still have plenty of time to do other things? Half day deep sea fishing is the perfect answer. Get out on the water, hopefully catch some fish and hang out with your friends on a nice big boat – and still have time to enjoy Charleston.',
    duration: '1/2 Day',
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
    metaTitle: '1/2 Day Fishing Charter Charleston SC | Fish The Wahoo',
    metaDescription:
      'Half day fishing charters out of Charleston, SC. Pick a 6am or noon departure and be back with plenty of day left. Book today.',
  },
  {
    slug: 'three-quarter-day-deep-sea-fishing',
    name: '3/4 Day Deep Sea Fishing',
    tagline: 'The serious angler\'s offshore trip',
    description:
      'A 3/4 day trip gives you maximum fishing time at the best offshore grounds. Ideal for targeting big game pelagics.',
    longDescription:
      'The ¾ Day package gives you a decent dose of either Trolling or Bottom Fishing, but it is difficult to do both in this amount of time. In fact, depending on season and conditions, the captain might elect to only troll. Keep in mind, it takes at least an hour and a half to reach the offshore fishing grounds, so time is limited. That being said, 3/4 day trips can still produce a very nice catch. *** We do not put groups together. You book the entire boat for your own group only regardless of party size.',
    duration: '3/4 Day',
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
    metaTitle: '3/4 Day Deep Sea Fishing Charter Charleston SC | Fish The Wahoo',
    metaDescription:
      'Three-quarter day offshore fishing charters from Charleston. Maximum time on the water targeting mahi, wahoo, tuna, and marlin.',
  },
  {
    slug: 'full-day-deep-sea-fishing',
    name: 'Full Day Deep Sea Fishing',
    tagline: 'The full offshore experience',
    description:
      'A full day offshore targeting the best big game fishing Charleston has to offer. Our most popular serious angler trip.',
    longDescription:
      'There are two types of deep sea fishing. TROLLING is fishing on top of the water for big fish like Marlin, Sailfish, Mahi, Wahoo, Tuna, etc. BOTTOM FISHING is anchoring over a reef and dropping bait to the ocean floor for smaller fish like Grouper, Snapper, Triggerfish, Sea Bass, etc. Trolling is exciting because while you are not catching as many fish, the fish you catch are typically quite large and put up a spectacular fight, often taking to the air. Trolling is sport fishing at it\'s best. If the trolling bite is slow, we might stop and bottom fish (Captain\'s discretion based on season and conditions). The fish are typically much smaller bottom fishing, but there is typically more action. The full day package gives us the best opportunity at tracking down the trolling bite. *** We do not put groups together. You book the entire boat for your own group only regardless of party size.',
    duration: 'Full Day',
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
    metaTitle: 'Full Day Deep Sea Fishing Charter Charleston SC | Fish The Wahoo',
    metaDescription:
      'Full day deep sea fishing charters from Charleston, SC. Targeting blue marlin, mahi, wahoo, and tuna. The ultimate offshore experience.',
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
    hidden: true,
  },
];

/** Packages shown in public grids/category pages/sitemap. */
export const visiblePackages: PackageData[] = packages.filter((p) => !p.hidden);

export function getPackageBySlug(slug: string): PackageData | undefined {
  return packages.find((p) => p.slug === slug);
}

export function getPackagesByCategory(category: PackageData['category']): PackageData[] {
  return visiblePackages.filter((p) => p.category === category);
}
