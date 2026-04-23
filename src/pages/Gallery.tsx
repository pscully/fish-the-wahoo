import { useState } from 'react';
import SEO from '../components/seo/SEO';
import GalleryGrid from '../components/gallery/GalleryGrid';
import Lightbox from '../components/gallery/Lightbox';
import CTABanner from '../components/sections/CTABanner';
import { galleryImages } from '../content/gallery';

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <SEO
        title="Photo Gallery | Fish The Wahoo Charleston"
        description="Photos from deep sea fishing trips out of Charleston, SC. Trophy catches, beautiful boats, and unforgettable moments on the water."
        canonicalPath="/gallery/"
      />

      <section className="pt-32 pb-10 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label">Photos</span>
          <h1 className="text-5xl md:text-6xl text-white uppercase mb-6">
            Trip Gallery
          </h1>
          <div className="section-divider" />
          <p className="text-slate-400 max-w-2xl mx-auto">
            A look at the daily adventures on the Atlantic. Trophy catches, beautiful sunrises, and
            the best deep sea fishing Charleston has to offer.
          </p>
        </div>
      </section>

      <section className="pb-24 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryGrid images={galleryImages} onImageClick={setActiveIndex} />
        </div>
      </section>

      <Lightbox
        images={galleryImages}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />

      <CTABanner />
    </>
  );
}
