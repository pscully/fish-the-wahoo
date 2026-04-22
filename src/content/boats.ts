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
  bestFor: string[];
  metaTitle: string;
  metaDescription: string;
}

export const boats: BoatData[] = [
  {
    slug: 'backhaul',
    classSlug: '48-50-foot-class',
    name: 'The 48–50 Foot Class',
    tagline: 'The economical offshore choice',
    description:
      'The 48 to 50 foot sportfisher class is our most economical way to fish the deep water off Charleston. Boats in this class run a smooth, manageable ride, get to the grounds fast, and handle every trip type we book — from a 6-hour nearshore bottom trip to a full 12-hour run at the Gulf Stream. A great fit for budget-conscious groups who still want the full offshore experience. We don\'t operate a fixed fleet, so the specific boat you fish may vary, but every hull in this class meets our standards for gear, safety, and captain experience.',
    length: '48–50 ft',
    engine: 'Twin diesel',
    speed: 'Up to 25 knots',
    capacity: 6,
    startingDepositCents: 28000,
    image: '/images/fishing-charters-000.webp',
    amenities: [
      'Enclosed cabin',
      'Ice boxes',
      'GPS / fishfinder',
      'Live well',
      'Expert tackle',
      'Marine head',
    ],
    bestFor: [
      '6-hour bottom fishing',
      '9-hour offshore runs',
      'Budget-friendly offshore trips',
      'Small groups up to 6',
    ],
    metaTitle: '48–50 Foot Class Sportfisher | Fish The Wahoo Charleston',
    metaDescription:
      'What to expect from a 48–50 foot class sportfisher out of Charleston, SC. Capacity, trip types, and what the class handles best.',
  },
  {
    slug: 'wahoo',
    classSlug: '53-59-foot-class',
    name: 'The 53–59 Foot Class',
    tagline: 'The comfortable workhorse class',
    description:
      'The 53 to 59 foot class is the most common size we book for serious offshore days. A little more boat than the economy class, a little more room, a smoother ride when the chop picks up, and enough horsepower to cover water quickly. This is the middle-of-the-road choice for groups who want a comfortable offshore day without paying for the flagship. Like every class we book, the specific hull may vary trip to trip depending on captain and boat availability.',
    length: '53–59 ft',
    engine: 'Twin diesel',
    speed: 'Up to 28 knots',
    capacity: 6,
    startingDepositCents: 39000,
    image: '/images/fishing-charters-001.webp',
    amenities: [
      'AC cabin',
      'Microwave and fridge',
      'Sonar and radar',
      'Outriggers',
      'Custom rods',
      'Clean head',
    ],
    bestFor: [
      '9-hour offshore trips',
      'Full-day deep sea runs',
      'Groups prioritizing comfort',
      'Trolling + bottom fishing combos',
    ],
    metaTitle: '53–59 Foot Class Sportfisher | Fish The Wahoo Charleston',
    metaDescription:
      'What to expect from a 53–59 foot class sportfisher out of Charleston, SC. Capacity, trip types, and what the class handles best.',
  },
  {
    slug: 'teaser-2',
    classSlug: '60-plus-foot-class',
    name: 'The 60+ Foot Class',
    tagline: 'The flagship experience',
    description:
      'The 60 foot and up class is the biggest, smoothest, best-riding group of boats we have access to in Charleston. If you want the fighting chair, the full galley, a truly luxurious ride to the Gulf Stream, and the kind of onboard experience that makes the whole day feel like a private yacht trip — book this class. Specific boats vary, but every hull we put in this tier is set up for serious offshore fishing with premium tackle and amenities.',
    length: '60+ ft',
    engine: 'Twin diesel',
    speed: 'Up to 32 knots',
    capacity: 6,
    startingDepositCents: 57000,
    image: '/images/fishing-charters-002.webp',
    amenities: [
      'Full AC cabin',
      'Full galley',
      'Satellite TV',
      'Fighting chair',
      'Premium tackle',
      'Private head',
    ],
    bestFor: [
      'Full-day Gulf Stream runs',
      'Trophy billfish trips',
      'Groups wanting maximum comfort',
      'Celebratory or corporate charters',
    ],
    metaTitle: '60+ Foot Class Sportfisher | Fish The Wahoo Charleston',
    metaDescription:
      'What to expect from a 60+ foot class sportfisher out of Charleston, SC. Capacity, trip types, and what the class handles best.',
  },
];

export function getBoatBySlug(slug: string): BoatData | undefined {
  return boats.find((b) => b.slug === slug);
}
