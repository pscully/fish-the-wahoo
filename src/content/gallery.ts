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
];

export const previewImages = galleryImages.slice(0, 8);
