export interface GalleryImage {
  src: string;
  alt: string;
}

export const galleryImages: GalleryImage[] = [
  { src: '/images/gallery-01.webp', alt: 'Angler with a wahoo caught off Charleston' },
  { src: '/images/gallery-03.webp', alt: 'Guest holding a release flag on the dock' },
  { src: '/images/gallery-05.webp', alt: 'Charter guests with a mahi-mahi on deck' },
  { src: '/images/gallery-06.webp', alt: 'Angler reeling in an offshore fish' },
  { src: '/images/gallery-11.webp', alt: 'Angler with a king mackerel at the transom' },
  { src: '/images/gallery-12.webp', alt: 'Crew landing a fish at the stern' },
  { src: '/images/gallery-15.webp', alt: 'Mahi-mahi jumping on the line' },
  { src: '/images/bottom-fishing-near-charleston.jpg', alt: 'Bottom fishing trip near Charleston' },
  { src: '/images/fish-the-wahoo-charleston-sc.jpg', alt: 'Guest with a mahi aboard Fish The Wahoo' },
  { src: '/images/fishing-charter-near-charleston.jpg', alt: 'Sportfishing boat running out of Charleston' },
  { src: '/images/charleston-fishing-2020-07-13.jpg', alt: 'Summer 2020 Charleston offshore trip' },
  { src: '/images/charleston-fishing-2023-06-05-b.jpg', alt: 'Charter fleet tied up at the docks' },
  { src: '/images/charleston-fishing-gallery-01.jpg', alt: 'Angler with the day’s catch on deck' },
  { src: '/images/charleston-fishing-gallery-02.jpg', alt: 'Mahi-mahi swimming boatside' },
];

export const previewImages = galleryImages.slice(0, 8);
