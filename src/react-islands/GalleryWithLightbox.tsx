import { useState } from 'react';
import GalleryGrid from '../components/gallery/GalleryGrid';
import Lightbox from '../components/gallery/Lightbox';
import { galleryImages } from '../content/gallery';

export default function GalleryWithLightbox() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <>
      <GalleryGrid images={galleryImages} onImageClick={setActiveIndex} />
      <Lightbox
        images={galleryImages}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </>
  );
}
