import { ChevronRight } from 'lucide-react';
import SEO from '../components/seo/SEO';
import Hero from '../components/sections/Hero';
import PackagesGrid from '../components/sections/PackagesGrid';

export default function Packages() {
  return (
    <>
      <SEO
        title="Fishing Charter Packages & Pricing"
        description="Browse all Fish The Wahoo fishing charter packages out of Charleston, SC. 6-hour bottom fishing, 9-hour and 12-hour deep sea trips, and private harbor cruises."
        canonicalPath="/packages/"
      />
      <Hero
        badge="Choose Your Adventure"
        headline={
          <>
            Charter Packages <br />
            <span className="text-accent-orange">&amp; Pricing</span>
          </>
        }
        subheadline="From 6-hour bottom fishing on the nearshore reefs to full-day offshore runs for marlin, mahi, and wahoo. All trips include rods, bait, tackle, and licenses."
        primaryCta={{ label: 'Book A Trip', to: '/book' }}
        fullscreen={false}
      />

      <section className="py-20 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PackagesGrid />

          <div className="mt-16 bg-nautical-blue rounded-xl p-8 text-center border border-white/10">
            <h3 className="text-2xl text-white mb-4 uppercase">What Every Trip Includes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {[
                'Fishing licenses',
                'Rods and reels',
                'Live and cut bait',
                'Tackle and lures',
                'Ice and fish cleaning',
                'Life jackets',
                'Safety equipment',
                'Expert captain',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-slate-300 text-sm">
                  <ChevronRight className="w-4 h-4 text-accent-orange shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
