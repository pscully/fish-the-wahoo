export interface SpeciesData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  body: string;
  image: string;
  seasons: string;
  bestPackages: string[];
  metaTitle: string;
  metaDescription: string;
  legacySlug?: string;
}

export const species: SpeciesData[] = [
  {
    slug: 'blue-marlin',
    name: 'Blue Marlin',
    tagline: 'The apex offshore predator',
    description:
      'Blue marlin are the ultimate prize for offshore anglers. These powerful billfish can exceed 1,000 lbs and are known for spectacular aerial displays.',
    body: `Blue marlin are the crown jewel of offshore fishing. Found in the warm Gulf Stream waters off Charleston, SC, these magnificent fish can reach over 1,000 pounds and run for hours when hooked. The Gulf Stream passes closest to Charleston in the summer months, making June through September prime time for blue marlin fishing.\n\nOur captains use proven trolling spreads with rigged baits and lures to target marlin along color changes and temperature breaks. When a blue marlin strikes a surface bait, the explosion is unlike anything else in fishing.\n\nBlue marlin are typically released after catch — these billfish are too special to keep. Your captain will work the fish boat-side for photos before a safe release.`,
    image:
      'https://images.pexels.com/photos/1586880/pexels-photo-1586880.jpeg?auto=compress&cs=tinysrgb&w=800',
    seasons: 'June through September (peak)',
    bestPackages: ['9-hour-deep-sea-fishing', '12-hour-deep-sea-fishing', 'overnight-gulf-stream-deep-sea-fishing'],
    metaTitle: 'Blue Marlin Fishing Charleston SC | Fish The Wahoo',
    metaDescription:
      'Book a blue marlin fishing charter out of Charleston, SC. The Gulf Stream brings trophy billfish within reach during summer months.',
    legacySlug: 'blue-marlin-fishing',
  },
  {
    slug: 'white-marlin',
    name: 'White Marlin',
    tagline: 'The athletic billfish of the Atlantic',
    description:
      'White marlin are smaller than blues but are considered pound-for-pound one of the most exciting sport fish in the Atlantic.',
    body: `White marlin are a beloved target for sport anglers fishing the Atlantic coast. More numerous than blue marlin, whites are known for their aerial acrobatics and tenacious fighting ability. A 50-pound white marlin on light tackle will test any angler.\n\nOut of Charleston, white marlin are targeted using light rigged ballyhoo and small lures trolled along the edges of the Gulf Stream. Fall is particularly productive as marlin concentrate along bait schools moving south.\n\nAll white marlin are released alive at Fish The Wahoo. These are too valuable as sport fish to take.`,
    image:
      'https://images.pexels.com/photos/1630344/pexels-photo-1630344.jpeg?auto=compress&cs=tinysrgb&w=800',
    seasons: 'August through October (peak)',
    bestPackages: ['9-hour-deep-sea-fishing', '12-hour-deep-sea-fishing'],
    metaTitle: 'White Marlin Fishing Charleston SC | Fish The Wahoo',
    metaDescription:
      'White marlin fishing charters from Charleston, SC. Target the Atlantic\'s most athletic billfish on a Gulf Stream trip.',
    legacySlug: 'white-marlin-fishing',
  },
  {
    slug: 'mahi-mahi',
    name: 'Mahi-Mahi (Dolphinfish)',
    tagline: 'The most colorful fish in the sea',
    description:
      'Mahi-mahi are the bread and butter of offshore fishing out of Charleston. Fast-growing, incredible fighters, and absolutely delicious.',
    body: `Mahi-mahi (also called dolphin or dorado) are the most popular target for offshore anglers out of Charleston. These spectacular fish are known for their vivid colors — bright yellow, green, and blue — their speed, and their tendency to school around floating debris and weed lines in the Gulf Stream.\n\nMahi-mahi are aggressive surface feeders and will readily take trolled baits and lures. When you find a school, it's not unusual to catch dozens of fish. They're also exceptional table fare, making mahi one of the few fish where everyone goes home happy.\n\nPrime mahi season in Charleston runs from May through October, with the best action often in June and July when the Gulf Stream pushes its northernmost.`,
    image:
      'https://images.pexels.com/photos/2624849/pexels-photo-2624849.jpeg?auto=compress&cs=tinysrgb&w=800',
    seasons: 'May through October',
    bestPackages: ['6-hour-deep-sea-fishing', '9-hour-deep-sea-fishing', '12-hour-deep-sea-fishing'],
    metaTitle: 'Mahi-Mahi Fishing Charleston SC | Fish The Wahoo',
    metaDescription:
      'Mahi-mahi fishing charters from Charleston, SC. Catch the most colorful fish in the sea on a Gulf Stream offshore trip.',
    legacySlug: 'mahi-mahi-fishing',
  },
  {
    slug: 'wahoo',
    name: 'Wahoo',
    tagline: 'The fastest fish in the Atlantic',
    description:
      'Wahoo are the speed demons of the deep, capable of bursts over 60 mph. They strike hard, run fast, and taste incredible.',
    body: `Wahoo are one of the most sought-after offshore species in the Atlantic. Known for their blistering speed — they can exceed 60 mph — wahoo are apex predators that strike trolled baits with explosive force. The initial run of a wahoo is unforgettable.\n\nFished almost exclusively by high-speed trolling, wahoo respond to lures and rigged baits pulled at 12-16 knots. They favor the edges and temperature breaks of the Gulf Stream and are often found at depth on down-riggers during the winter months.\n\nWahoo are prime table fare — their white, firm flesh is prized by chefs. It's no coincidence the boat "Wahoo" is one of Fish The Wahoo's most sought-after vessels.`,
    image:
      'https://images.pexels.com/photos/1172739/pexels-photo-1172739.jpeg?auto=compress&cs=tinysrgb&w=800',
    seasons: 'Year-round (peak: October through February)',
    bestPackages: ['9-hour-deep-sea-fishing', '12-hour-deep-sea-fishing', 'overnight-gulf-stream-deep-sea-fishing'],
    metaTitle: 'Wahoo Fishing Charleston SC | Fish The Wahoo',
    metaDescription:
      'Wahoo fishing charters out of Charleston, SC. Target the fastest fish in the Atlantic on an offshore trip to the Gulf Stream.',
    legacySlug: 'wahoo-fishing',
  },
  {
    slug: 'grouper',
    name: 'Grouper',
    tagline: 'The prize of the bottom',
    description:
      'Grouper are the most sought-after bottom fish off Charleston. Big, hard-fighting, and exceptional eating.',
    body: `Grouper are the premier bottom fish off the South Carolina coast. Several species inhabit the rocky bottom and artificial reefs within range of Charleston — gag grouper, red grouper, and scamp are the most common targets. These powerful fish have to be winched off the bottom before they can dive back into structure.\n\nGrouper fishing requires heavy tackle, strong leaders, and natural baits worked on or near the bottom. The most productive time is spring and fall when grouper are most active and regulations are most favorable.\n\nGrouper is one of the finest eating fish in the ocean. A box of fresh grouper fillets is a prized trophy from any offshore trip.`,
    image:
      'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=800',
    seasons: 'April through June and September through November',
    bestPackages: ['6-hour-near-shore-fishing', '9-hour-deep-sea-fishing', '12-hour-deep-sea-fishing'],
    metaTitle: 'Grouper Fishing Charleston SC | Fish The Wahoo',
    metaDescription:
      'Grouper fishing charters out of Charleston, SC. Target gag and red grouper on the nearshore reefs and offshore ledges.',
    legacySlug: 'grouper-fishing',
  },
  {
    slug: 'red-snapper',
    name: 'Red Snapper',
    tagline: 'The most sought-after bottom fish on the Atlantic coast',
    description:
      'Red snapper are prized for their beauty, fighting ability, and incredible flavor. A cooler full of snapper is a great day.',
    body: `Red snapper are one of the most highly regulated and prized sport fish on the Atlantic coast. With their brilliant red color, firm white flesh, and hard-fighting nature, snapper are a bucket-list species for many anglers.\n\nOff Charleston, red snapper are found on the natural ledges and artificial reefs in 60-200 feet of water. They respond well to fresh dead baits fished on the bottom. The season is closely managed by NOAA, so check current regulations before booking.\n\nRed snapper are exceptional table fare and typically limit out quickly when the captain finds a productive spot.`,
    image:
      'https://images.pexels.com/photos/3361691/pexels-photo-3361691.jpeg?auto=compress&cs=tinysrgb&w=800',
    seasons: 'Summer months (limited federal season)',
    bestPackages: ['4-hour-near-shore-fishing', '6-hour-near-shore-fishing', '6-hour-deep-sea-fishing'],
    metaTitle: 'Red Snapper Fishing Charleston SC | Fish The Wahoo',
    metaDescription:
      'Red snapper fishing charters from Charleston, SC. One of the most prized and delicious fish on the Atlantic coast.',
    legacySlug: 'red-snapper-fishing',
  },
  {
    slug: 'sailfish',
    name: 'Sailfish',
    tagline: 'The acrobat of the Atlantic',
    description:
      'Sailfish are spectacular billfish known for their dramatic aerial displays and impressive dorsal fin.',
    body: `Sailfish are the showboats of the billfish world. When a sailfish strikes and takes to the air, the spectacle is unforgettable. Their large, brilliant dorsal sail makes them one of the most beautiful fish in the ocean.\n\nOff Charleston, sailfish are primarily a fall target as they migrate south along the Atlantic coast. They respond to live baits and rigged ballyhoo trolled near the surface at moderate speeds.\n\nAll sailfish are released at Fish The Wahoo. These spectacular fish deserve to swim another day.`,
    image:
      'https://images.pexels.com/photos/1586880/pexels-photo-1586880.jpeg?auto=compress&cs=tinysrgb&w=800',
    seasons: 'September through December (migration)',
    bestPackages: ['9-hour-deep-sea-fishing', '12-hour-deep-sea-fishing'],
    metaTitle: 'Sailfish Fishing Charleston SC | Fish The Wahoo',
    metaDescription:
      'Sailfish fishing charters from Charleston, SC. Target the Atlantic\'s most spectacular billfish during the fall migration.',
    legacySlug: 'sailfish-fishing',
  },
  {
    slug: 'sea-bass',
    name: 'Sea Bass (Black Sea Bass)',
    tagline: 'The best beginner fish in the Atlantic',
    description:
      'Black sea bass are abundant, easy to catch, hard fighting for their size, and excellent eating. Perfect for families.',
    body: `Black sea bass are one of the most popular and accessible sport fish off the South Carolina coast. These compact, aggressive fish inhabit rocky bottom, artificial reefs, and wrecks in relatively shallow water. They'll take almost any natural bait fished on the bottom.\n\nSea bass are ideal for beginners and families because they bite readily, fight well for their size, and taste outstanding. A trip targeting sea bass with a family is almost guaranteed to produce action.\n\nThey're found year-round in Charleston waters and represent excellent value on a nearshore charter.`,
    image:
      'https://images.pexels.com/photos/1618606/pexels-photo-1618606.jpeg?auto=compress&cs=tinysrgb&w=800',
    seasons: 'Year-round (peak: spring and fall)',
    bestPackages: ['4-hour-family-fun-in-the-sun-charter', '4-hour-near-shore-fishing', '6-hour-near-shore-fishing'],
    metaTitle: 'Sea Bass Fishing Charleston SC | Fish The Wahoo',
    metaDescription:
      'Black sea bass fishing charters from Charleston, SC. Great for families and beginners. Abundant, hard-fighting, and delicious.',
    legacySlug: 'sea-bass-fishing',
  },
  {
    slug: 'tuna-charleston',
    name: 'Tuna',
    tagline: 'Big speed, big fights, big flavor',
    description:
      'Yellowfin and bluefin tuna are the pinnacle of offshore fishing. Fast, powerful, and the finest sushi on the water.',
    body: `Tuna represent the pinnacle of offshore fishing out of Charleston. Both yellowfin and bluefin tuna migrate through the Gulf Stream, and catching a 200-pound yellowfin or a 500-pound bluefin is a life-changing experience.\n\nYellowfin tuna are our most commonly targeted species. They school under floating debris and birds, and respond to chunking, trolling, and casting. The bite can be frenetic when you find a school.\n\nBluefin tuna are a winter target — they migrate south along the Atlantic coast in large schools from January through March. A legal bluefin is among the most valuable sport fish in the world.`,
    image:
      'https://images.pexels.com/photos/2131967/pexels-photo-2131967.jpeg?auto=compress&cs=tinysrgb&w=800',
    seasons: 'Yellowfin: May-November. Bluefin: January-March.',
    bestPackages: ['9-hour-deep-sea-fishing', '12-hour-deep-sea-fishing', 'overnight-gulf-stream-deep-sea-fishing'],
    metaTitle: 'Tuna Fishing Charleston SC | Fish The Wahoo',
    metaDescription:
      'Yellowfin and bluefin tuna fishing charters from Charleston, SC. The pinnacle of offshore fishing in the Gulf Stream.',
    legacySlug: 'tuna-fishing',
  },
  {
    slug: 'swordfish',
    name: 'Swordfish',
    tagline: 'The ultimate overnight trophy',
    description:
      'Swordfish are deep water predators targeted at night. An overnight Gulf Stream trip gives you the best shot at these magnificent fish.',
    body: `Swordfish are one of the most prized and challenging fish to target in the Atlantic. Unlike most sport fish, broadbill swordfish are primarily targeted at night using deep baits suspended on glow sticks at 500-1,500 feet of water. The overnight drift fishing technique produces the best results.\n\nOur overnight Gulf Stream trips are specifically designed for swordfish, though mahi-mahi, wahoo, and marlin are often caught as well. The experience of fishing through the night in the Gulf Stream is something you'll never forget.\n\nSwordfish can exceed 1,000 pounds, though fish in the 100-300 pound range are more common.`,
    image:
      'https://images.pexels.com/photos/1172739/pexels-photo-1172739.jpeg?auto=compress&cs=tinysrgb&w=800',
    seasons: 'Year-round (best: May through October)',
    bestPackages: ['overnight-gulf-stream-deep-sea-fishing'],
    metaTitle: 'Swordfish Fishing Charleston SC | Fish The Wahoo',
    metaDescription:
      'Overnight swordfish fishing charters from Charleston, SC. Target broadbill swordfish on a Gulf Stream overnight trip.',
    legacySlug: 'swordfish-fishing',
  },
  {
    slug: 'shark',
    name: 'Shark Fishing',
    tagline: 'Adrenaline in the deep blue',
    description:
      'Mako, thresher, and hammerhead sharks are apex predators that will test your tackle and your nerves.',
    body: `Shark fishing off Charleston offers some of the most heart-pounding action in sport fishing. Shortfin mako sharks are the premier target — these powerful predators are capable of leaping 20 feet out of the water and screaming runs that will empty your reel.\n\nOther shark species commonly encountered include thresher, hammerhead, and bull sharks. Shark fishing typically involves chunking near color changes and temperature breaks in the Gulf Stream.\n\nAll sharks are released at Fish The Wahoo. We practice catch-and-release on all sharks to protect these important apex predators.`,
    image:
      'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=800',
    seasons: 'May through September',
    bestPackages: ['9-hour-deep-sea-fishing', '12-hour-deep-sea-fishing'],
    metaTitle: 'Shark Fishing Charters Charleston SC | Fish The Wahoo',
    metaDescription:
      'Shark fishing charters from Charleston, SC. Target mako, thresher, and hammerhead sharks in the Gulf Stream.',
    legacySlug: 'shark-fishing',
  },
  {
    slug: 'dolphin',
    name: 'Dolphin (Mahi-Mahi)',
    tagline: 'The colorful kings of the weed lines',
    description:
      'Dolphin (the fish, not the mammal) are the most exciting and reliable offshore target out of Charleston.',
    body: `Dolphinfish — commonly called mahi-mahi, dorado, or "dolphin" in the South — are the most popular offshore target out of Charleston. Don't be confused: these are fish, not marine mammals.\n\nDolphin are found along floating grass lines and debris in the Gulf Stream. When you find a good weed line, the action can be non-stop. Dolphin are spectacular fighters with brilliant colors — bright yellow, green, and blue — that fade quickly after landing.\n\nThey're also exceptional table fare, which is why dolphin trips consistently rate as the most popular offshore charters from Charleston.`,
    image:
      'https://images.pexels.com/photos/2624849/pexels-photo-2624849.jpeg?auto=compress&cs=tinysrgb&w=800',
    seasons: 'May through October',
    bestPackages: ['6-hour-deep-sea-fishing', '9-hour-deep-sea-fishing', '12-hour-deep-sea-fishing'],
    metaTitle: 'Dolphin (Mahi-Mahi) Fishing Charleston SC | Fish The Wahoo',
    metaDescription:
      'Dolphin/mahi-mahi fishing charters from Charleston, SC. The most popular offshore target on the East Coast.',
    legacySlug: 'dolphin-fishing',
  },
];

export function getSpeciesBySlug(slug: string): SpeciesData | undefined {
  return species.find((s) => s.slug === slug);
}
