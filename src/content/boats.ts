export interface BoatData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  length: string;
  engine: string;
  speed: string;
  capacity: number;
  image: string;
  amenities: string[];
  metaTitle: string;
  metaDescription: string;
}

export const boats: BoatData[] = [
  {
    slug: 'backhaul',
    name: 'The Backhaul',
    tagline: '48-foot sportfisher — the economical deep sea choice',
    description:
      'A proven offshore performer at an accessible price point. Perfect for serious anglers who want to go deep without the premium price tag.',
    length: "48'",
    engine: 'Twin Diesel 600HP',
    speed: '25 Knots',
    capacity: 6,
    image:
      'https://images.pexels.com/photos/1586880/pexels-photo-1586880.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: [
      'Enclosed cabin',
      'Ice boxes',
      'GPS / fishfinder',
      'Live well',
      'Expert tackle',
      'Marine head',
    ],
    metaTitle: 'The Backhaul — 48ft Fishing Charter Boat | Fish The Wahoo',
    metaDescription:
      'Charter the Backhaul — a 48-foot sportfisher out of Charleston, SC. Economical deep sea fishing for up to 6 passengers.',
  },
  {
    slug: 'wahoo',
    name: 'The Wahoo',
    tagline: '55-foot sportfisher — the workhorse of the fleet',
    description:
      'The most popular boat in our fleet. A perfect balance of comfort, speed, and fishability for any offshore trip.',
    length: "55'",
    engine: 'Twin Diesel 800HP',
    speed: '28 Knots',
    capacity: 6,
    image:
      'https://images.pexels.com/photos/1630344/pexels-photo-1630344.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: [
      'AC cabin',
      'Microwave and fridge',
      'Sonar and radar',
      'Outriggers',
      'Custom rods',
      'Clean head',
    ],
    metaTitle: 'The Wahoo — 55ft Fishing Charter Boat | Fish The Wahoo',
    metaDescription:
      'Charter the Wahoo — a 55-foot sportfisher out of Charleston, SC. The most popular boat in our deep sea fishing fleet.',
  },
  {
    slug: 'teaser-2',
    name: 'Teaser 2',
    tagline: '62-foot sportfisher — the ultimate offshore experience',
    description:
      'The flagship of the Fish The Wahoo fleet. Biggest, smoothest, best riding boat in Charleston. For those who want the absolute best.',
    length: "62'",
    engine: 'Twin Diesel 1200HP',
    speed: '32 Knots',
    capacity: 6,
    image:
      'https://images.pexels.com/photos/2624849/pexels-photo-2624849.jpeg?auto=compress&cs=tinysrgb&w=800',
    amenities: [
      'Full AC cabin',
      'Full galley',
      'Satellite TV',
      'Fighting chair',
      'Premium tackle',
      'Private head',
    ],
    metaTitle: 'Teaser 2 — 62ft Flagship Charter Boat | Fish The Wahoo',
    metaDescription:
      'Charter Teaser 2 — the 62-foot flagship sportfisher of Fish The Wahoo in Charleston, SC. The ultimate deep sea fishing experience.',
  },
];

export function getBoatBySlug(slug: string): BoatData | undefined {
  return boats.find((b) => b.slug === slug);
}
