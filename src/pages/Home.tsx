import Hero from '../components/sections/Hero';
import StatsBar from '../components/sections/StatsBar';
import PackagesPreview from '../components/sections/PackagesPreview';
import PackagesGrid from '../components/sections/PackagesGrid';
import GallerySection from '../components/sections/GallerySection';
import CTABanner from '../components/sections/CTABanner';
import ReviewsSection from '../components/sections/ReviewsSection';

export default function Home() {
  return (
    <>
      <Hero
        bgImage="/images/fishing-charters-hero-home.webp"
        badge="The Premier Deep Sea Experience"
        headline={
          <>
            The Home For <span className="text-accent-orange">Deep Sea</span> Fishing{' '}
            <br />
            <span className="text-slate-400">Charleston, SC</span>
          </>
        }
        subheadline="Experience the thrill of the Atlantic aboard a network of 15+ Charleston sportfishing boats. From trophy marlin to family fun, we match you with the right boat for the trip you want."
        primaryCta={{ label: 'Book A Trip', to: '/book' }}
        secondaryCta={{ label: 'View Packages', to: '/packages' }}
      />

      <StatsBar />

      <PackagesPreview />

      <section className="py-24 bg-nautical-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-label">Trip Packages</span>
            <h2 className="text-4xl md:text-5xl text-white mb-4 uppercase">
              Every Trip We Book
            </h2>
            <div className="section-divider" />
            <p className="text-slate-400 max-w-2xl mx-auto">
              Pick the duration and style that fits your group. Every trip includes licenses,
              bait, tackle, and ice.
            </p>
          </div>
          <PackagesGrid />
        </div>
      </section>

      <GallerySection />

      <CTABanner />

      <ReviewsSection />
    </>
  );
}
