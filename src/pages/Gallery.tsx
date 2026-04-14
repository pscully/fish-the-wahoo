import SEO from '../components/seo/SEO';
import GallerySection from '../components/sections/GallerySection';
import CTABanner from '../components/sections/CTABanner';

const allImages = [
  { src: 'https://images.pexels.com/photos/1586880/pexels-photo-1586880.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Boat at sunset', size: 'large' as const },
  { src: 'https://images.pexels.com/photos/1630344/pexels-photo-1630344.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Deep sea catch', size: 'medium' as const },
  { src: 'https://images.pexels.com/photos/1618606/pexels-photo-1618606.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Family fishing', size: 'small' as const },
  { src: 'https://images.pexels.com/photos/3361691/pexels-photo-3361691.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Fishing charter', size: 'small' as const },
  { src: 'https://images.pexels.com/photos/2624849/pexels-photo-2624849.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Ocean fishing', size: 'medium' as const },
  { src: 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Trophy tuna', size: 'small' as const },
  { src: 'https://images.pexels.com/photos/2131967/pexels-photo-2131967.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Captain at helm', size: 'small' as const },
  { src: 'https://images.pexels.com/photos/1172739/pexels-photo-1172739.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Group catch', size: 'large' as const },
  { src: 'https://images.pexels.com/photos/1586880/pexels-photo-1586880.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Deep sea action', size: 'small' as const },
  { src: 'https://images.pexels.com/photos/1630344/pexels-photo-1630344.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Big fish', size: 'small' as const },
  { src: 'https://images.pexels.com/photos/2624849/pexels-photo-2624849.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Offshore fishing', size: 'medium' as const },
  { src: 'https://images.pexels.com/photos/1618606/pexels-photo-1618606.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Family trip', size: 'small' as const },
];

export default function Gallery() {
  return (
    <>
      <SEO
        title="Photo Gallery | Fish The Wahoo Charleston"
        description="Photos from deep sea fishing trips out of Charleston, SC. Trophy catches, beautiful boats, and unforgettable moments on the water."
        canonicalPath="/gallery/"
      />

      <section className="pt-32 pb-8 bg-nautical-dark">
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

      <GallerySection images={allImages} showViewAll={false} />

      <CTABanner />
    </>
  );
}
