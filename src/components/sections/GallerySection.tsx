import { Link } from 'react-router-dom';
import GalleryGrid from '../gallery/GalleryGrid';
import { previewImages } from '../../content/gallery';

export default function GallerySection() {
  return (
    <section id="gallery" className="py-24 bg-nautical-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-label">Photos</span>
          <h2 className="text-4xl md:text-5xl text-white mb-4 uppercase">
            Recent Catches & Our Fleet
          </h2>
          <div className="section-divider" />
          <p className="text-slate-400 max-w-2xl mx-auto">
            A glimpse into the daily adventures on the Atlantic. From trophy catches to our
            state-of-the-art sportfishing fleet.
          </p>
        </div>

        <GalleryGrid images={previewImages} />

        <div className="mt-16 text-center">
          <Link to="/gallery" className="btn-outline">
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
