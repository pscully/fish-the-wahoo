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
  image: string;
  metaTitle: string;
  metaDescription: string;
}

export const packages: PackageData[] = [
  {
    slug: '4-hour-family-fun-in-the-sun-charter',
    name: '4-Hour Family Fun In The Sun Charter',
    tagline: 'Perfect for families and beginners',
    description:
      'An ideal introduction to Charleston fishing. Great for kids and first-timers looking for a fun half-morning on the water.',
    longDescription:
      'Our 4-hour family charter is designed for groups who want a fun, low-pressure day on the water without committing to a full-day adventure. We target nearshore species like red snapper, sea bass, and flounder in the beautiful Charleston coastal waters. All rods, bait, tackle, and fishing licenses are included. Our captains are patient and experienced with children and beginners.',
    duration: '4 Hours',
    hours: 4,
    category: 'family',
    priceFrom: 450,
    maxPassengers: 6,
    includes: [
      'Rods, reels, and tackle',
      'Live and cut bait',
      'Fishing licenses',
      'Ice and fish cleaning',
      'Life jackets',
    ],
    targetSpecies: ['Red Snapper', 'Sea Bass', 'Flounder', 'Spanish Mackerel'],
    image:
      'https://images.pexels.com/photos/1618606/pexels-photo-1618606.jpeg?auto=compress&cs=tinysrgb&w=800',
    metaTitle: '4-Hour Family Fun Fishing Charter | Fish The Wahoo Charleston',
    metaDescription:
      'Book a 4-hour family fishing charter out of Charleston, SC. Perfect for kids and beginners. All gear included. Call (843) 568-3222.',
  },
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
    priceFrom: 650,
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
    metaTitle: '6-Hour Family Fishing Charter | Fish The Wahoo Charleston',
    metaDescription:
      'Six hours of nearshore fishing out of Charleston, SC. Family-friendly, all gear included. Book your spot today.',
  },
  {
    slug: '4-hour-near-shore-fishing',
    name: '4-Hour Near Shore Fishing',
    tagline: 'Inshore action close to home',
    description:
      'Targeted nearshore fishing for anglers who want to catch fish fast. Focus on structure fishing and bottom species.',
    longDescription:
      'Our nearshore 4-hour trips target the productive reefs and ledges just off the Charleston coast. We focus on bottom fishing for snapper, grouper, and sea bass. This is a fast-paced, action-packed trip ideal for anglers who want to maximize their bite time.',
    duration: '4 Hours',
    hours: 4,
    category: 'near-shore',
    priceFrom: 500,
    maxPassengers: 6,
    includes: [
      'Rods, reels, and tackle',
      'Live and cut bait',
      'Fishing licenses',
      'Ice and fish cleaning',
      'Life jackets',
    ],
    targetSpecies: ['Red Snapper', 'Grouper', 'Sea Bass', 'Amberjack'],
    image:
      'https://images.pexels.com/photos/1586880/pexels-photo-1586880.jpeg?auto=compress&cs=tinysrgb&w=800',
    metaTitle: '4-Hour Nearshore Fishing Charter Charleston SC | Fish The Wahoo',
    metaDescription:
      'Fast-paced nearshore fishing trips out of Charleston, SC. Targeting snapper, grouper, and sea bass. All tackle included.',
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
    priceFrom: 750,
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
    metaTitle: '6-Hour Nearshore Fishing Charter Charleston SC | Fish The Wahoo',
    metaDescription:
      'Six-hour nearshore fishing charters from Charleston, SC. Extended action targeting snapper, grouper, and more.',
  },
  {
    slug: '6-hour-deep-sea-fishing',
    name: '6-Hour Deep Sea Fishing',
    tagline: 'Your first taste of the deep blue',
    description:
      'Head offshore in search of mahi-mahi, wahoo, and more. Six hours gives you enough time to reach productive deep water.',
    longDescription:
      'Our 6-hour deep sea trips take you out to the productive Gulf Stream waters in search of pelagic species. Mahi-mahi, wahoo, and tuna are common targets. Your captain will run to the fish and stay on them. This is our entry-level offshore experience and a great introduction to deep sea fishing.',
    duration: '6 Hours',
    hours: 6,
    category: 'deep-sea',
    priceFrom: 1200,
    maxPassengers: 6,
    includes: [
      'Premium rods, reels, and tackle',
      'Live and rigged baits',
      'Fishing licenses',
      'Ice and fish cleaning',
      'Life jackets and safety gear',
    ],
    targetSpecies: ['Mahi-Mahi', 'Wahoo', 'Tuna', 'King Mackerel'],
    image:
      'https://images.pexels.com/photos/3361691/pexels-photo-3361691.jpeg?auto=compress&cs=tinysrgb&w=800',
    metaTitle: '6-Hour Deep Sea Fishing Charter Charleston SC | Fish The Wahoo',
    metaDescription:
      'Six-hour deep sea fishing trips out of Charleston, SC. Target mahi-mahi, wahoo, and tuna offshore. Book today.',
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
    priceFrom: 1800,
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
    priceFrom: 2400,
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
    metaTitle: '12-Hour Full Day Deep Sea Fishing Charter Charleston SC | Fish The Wahoo',
    metaDescription:
      'Full-day 12-hour deep sea fishing charters from Charleston, SC. Targeting blue marlin, mahi, wahoo, and tuna. The ultimate offshore experience.',
  },
  {
    slug: 'overnight-gulf-stream-deep-sea-fishing',
    name: 'Overnight Gulf Stream Deep Sea Fishing',
    tagline: 'Chase the Gulf Stream through the night',
    description:
      'Our most epic adventure. Run out to the Gulf Stream at dusk, fish through the night, and return at dawn.',
    longDescription:
      'The overnight Gulf Stream trip is the most ambitious fishing adventure we offer. You\'ll depart in the late afternoon, run out to the Gulf Stream, and spend the night fishing some of the most productive blue water in the Atlantic. Swordfish are a primary target on the overnight drift. By morning you\'ll have experienced something truly special.',
    duration: 'Overnight',
    hours: 18,
    category: 'deep-sea',
    priceFrom: 4200,
    maxPassengers: 4,
    includes: [
      'Premium rods, reels, and tackle',
      'Live and rigged baits',
      'Fishing licenses',
      'Ice and fish cleaning',
      'Life jackets and safety gear',
      'Dinner, overnight snacks, and breakfast',
      'Beverages',
      'Sleeping accommodations on board',
    ],
    targetSpecies: ['Swordfish', 'Blue Marlin', 'Wahoo', 'Mahi-Mahi', 'Yellowfin Tuna'],
    image:
      'https://images.pexels.com/photos/2131967/pexels-photo-2131967.jpeg?auto=compress&cs=tinysrgb&w=800',
    metaTitle: 'Overnight Gulf Stream Deep Sea Fishing | Fish The Wahoo Charleston',
    metaDescription:
      'Overnight swordfish and big game fishing trips to the Gulf Stream from Charleston, SC. The most epic fishing adventure on the East Coast.',
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
    priceFrom: 350,
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
