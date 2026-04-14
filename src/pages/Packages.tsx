import { Link } from 'react-router-dom';
import { Clock, Users, ChevronRight } from 'lucide-react';
import { packages } from '../content/packages';
import SEO from '../components/seo/SEO';
import Hero from '../components/sections/Hero';

export default function Packages() {
  return (
    <>
      <SEO
        title="Fishing Charter Packages & Pricing"
        description="Browse all Fish The Wahoo fishing charter packages out of Charleston, SC. 4-hour family trips to 12-hour deep sea adventures and overnight Gulf Stream trips."
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
        subheadline="From family-friendly nearshore trips to overnight Gulf Stream adventures. All trips include rods, bait, tackle, and licenses."
        primaryCta={{ label: 'Book A Trip', to: '/book' }}
        fullscreen={false}
      />

      <section className="py-20 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.slug} className="metallic-card rounded-xl overflow-hidden flex flex-col group">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-accent-orange text-white font-bold px-3 py-1 text-sm rounded-sm">
                    From ${pkg.priceFrom.toLocaleString()}
                  </div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-nautical-dark/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {pkg.duration}
                    </span>
                    <span className="bg-nautical-dark/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Users className="w-3 h-3" /> Up to {pkg.maxPassengers}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-lg text-white mb-2 uppercase leading-tight">{pkg.name}</h3>
                  <p className="text-accent-orange text-xs font-bold uppercase tracking-widest mb-3">
                    {pkg.tagline}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed flex-grow mb-6">
                    {pkg.description}
                  </p>
                  <div className="flex gap-3">
                    <Link
                      to={`/book/calendar?package=${pkg.slug}`}
                      className="btn-primary flex-grow py-2 text-sm text-center"
                    >
                      Book Trip
                    </Link>
                    <Link
                      to={`/packages/${pkg.slug}`}
                      className="btn-outline px-4 py-2 text-sm"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
