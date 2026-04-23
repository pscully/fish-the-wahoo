export interface GalleryImage {
  src: string;
  alt: string;
  size?: 'large' | 'medium' | 'small';
}

export const galleryImages: GalleryImage[] = [
  { src: '/images/gallery-01.webp', alt: 'Charleston deep sea fishing', size: 'large' },
  { src: '/images/gallery-02.webp', alt: 'Offshore catch', size: 'medium' },
  { src: '/images/gallery-03.webp', alt: 'Deep sea fishing trip', size: 'small' },
  { src: '/images/gallery-04.webp', alt: 'Trophy fish Charleston', size: 'small' },
  { src: '/images/gallery-05.webp', alt: 'Fishing charter crew', size: 'medium' },
  { src: '/images/gallery-06.webp', alt: 'Deep sea catch', size: 'small' },
  { src: '/images/gallery-07.webp', alt: 'Offshore fishing action', size: 'small' },
  { src: '/images/gallery-08.webp', alt: 'Fish The Wahoo fleet', size: 'large' },
  { src: '/images/gallery-09.webp', alt: 'Gulf Stream fishing', size: 'small' },
  { src: '/images/gallery-10.webp', alt: 'Big game fishing Charleston', size: 'small' },
  { src: '/images/gallery-11.webp', alt: 'Mahi-mahi catch', size: 'medium' },
  { src: '/images/gallery-12.webp', alt: 'Sportfishing boat offshore', size: 'small' },
  { src: '/images/gallery-13.webp', alt: 'Trophy marlin', size: 'small' },
  { src: '/images/gallery-14.webp', alt: 'Charter fishing crew', size: 'medium' },
  { src: '/images/gallery-15.webp', alt: 'Deep sea fishing Charleston SC', size: 'small' },
  { src: '/images/bottom-fishing-charleston-fishing-charter.jpg', alt: 'Bottom fishing Charleston fishing charter', size: 'medium' },
  { src: '/images/bottom-fishing-near-charleston.jpg', alt: 'Bottom fishing near Charleston', size: 'small' },
  { src: '/images/deep-sea-fishing-charleston-sc.png', alt: 'Deep sea fishing Charleston SC', size: 'large' },
  { src: '/images/fish-the-wahoo-charleston-sc.jpg', alt: 'Fish The Wahoo Charleston SC', size: 'medium' },
  { src: '/images/fishing-charter-near-charleston.jpg', alt: 'Fishing charter near Charleston', size: 'small' },
  { src: '/images/charleston-fishing-2020-07-13.jpg', alt: 'Charleston fishing trip July 2020', size: 'small' },
  { src: '/images/charleston-fishing-2023-06-05.jpg', alt: 'Charleston offshore fishing trip', size: 'medium' },
  { src: '/images/charleston-fishing-2023-06-05-a.jpg', alt: 'Charleston sportfishing catch', size: 'small' },
  { src: '/images/charleston-fishing-2023-06-05-b.jpg', alt: 'Gulf Stream fishing Charleston', size: 'small' },
  { src: '/images/charleston-fishing-gallery-01.jpg', alt: 'Charleston deep sea fishing', size: 'small' },
  { src: '/images/charleston-fishing-gallery-02.jpg', alt: 'Charleston fishing charter trip', size: 'small' },
  { src: '/images/charleston-fishing-gallery-03.jpg', alt: 'Charleston charter fishing catch', size: 'medium' },
];

export const previewImages = galleryImages.slice(0, 8);
