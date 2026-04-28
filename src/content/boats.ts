export interface BoatData {
  slug: string;
  /** Matches the boat_classes.slug in Supabase so ?class= URL params resolve. */
  classSlug: string;
  name: string;
  tagline: string;
  description: string;
  length: string;
  engine: string;
  speed: string;
  capacity: number;
  /** Cheapest deposit (in cents) across all durations offered on this class. 10% of lowest total. */
  startingDepositCents: number;
  image: string;
  amenities: string[];
  metaTitle: string;
  metaDescription: string;
  /** Show a "Most Popular" emphasis on cards/sections for this class. */
  isMostPopular?: boolean;
}

export const boats: BoatData[] = [
  {
    slug: 'teaser-2',
    classSlug: '60-plus-foot-class',
    name: 'The 60+ Foot Class',
    tagline: 'The flagship experience',
    description:
      'Our biggest, smoothest-riding class. Fighting chair, full galley, AC cabin, and the kind of onboard experience that makes the day feel like a private yacht trip to the Gulf Stream.',
    length: '60+ ft',
    engine: 'Twin diesel',
    speed: 'Up to 32 knots',
    capacity: 6,
    startingDepositCents: 61000,
    image: '/images/fishing-charters-002.webp',
    amenities: [
      'Full AC cabin',
      'Full galley',
      'Satellite TV',
      'Fighting chair',
      'Premium tackle',
      'Private head',
    ],
    metaTitle: '60+ Foot Class Sportfisher | Fish The Wahoo Charleston',
    metaDescription:
      'What to expect from a 60+ foot class sportfisher out of Charleston, SC. Capacity, trip types, and what the class handles best.',
  },
  {
    slug: 'wahoo',
    classSlug: '53-59-foot-class',
    name: 'The 53–59 Foot Class',
    tagline: 'The comfortable workhorse',
    description:
      'The most common size we book for serious offshore days. More room and a smoother ride than the 48-50, with enough horsepower to cover water fast without paying for the flagship.',
    length: '53–59 ft',
    engine: 'Twin diesel',
    speed: 'Up to 28 knots',
    capacity: 6,
    startingDepositCents: 43000,
    image: '/images/fishing-charters-001.webp',
    amenities: [
      'AC cabin',
      'Microwave and fridge',
      'Sonar and radar',
      'Outriggers',
      'Custom rods',
      'Clean head',
    ],
    metaTitle: '53–59 Foot Class Sportfisher | Fish The Wahoo Charleston',
    metaDescription:
      'What to expect from a 53–59 foot class sportfisher out of Charleston, SC. Capacity, trip types, and what the class handles best.',
  },
  {
    slug: 'backhaul',
    classSlug: '48-50-foot-class',
    name: 'The 48–50 Foot Class',
    tagline: 'The economical offshore choice',
    isMostPopular: true,
    description:
      'The most economical way to fish the deep water off Charleston. Smooth, manageable ride, fast to the grounds, and handles every trip we book, from a 1/2 day bottom trip to a full day Gulf Stream run.',
    length: '48–50 ft',
    engine: 'Twin diesel',
    speed: 'Up to 25 knots',
    capacity: 6,
    startingDepositCents: 32000,
    image: '/images/fishing-charters-000.webp',
    amenities: [
      'Enclosed cabin',
      'Ice boxes',
      'GPS / fishfinder',
      'Live well',
      'Expert tackle',
      'Marine head',
    ],
    metaTitle: '48–50 Foot Class Sportfisher | Fish The Wahoo Charleston',
    metaDescription:
      'What to expect from a 48–50 foot class sportfisher out of Charleston, SC. Capacity, trip types, and what the class handles best.',
  },
];

export function getBoatBySlug(slug: string): BoatData | undefined {
  return boats.find((b) => b.slug === slug);
}
