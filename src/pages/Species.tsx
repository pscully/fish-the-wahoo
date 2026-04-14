import { Link } from 'react-router-dom';
import { species } from '../content/species';
import SEO from '../components/seo/SEO';
import Hero from '../components/sections/Hero';
import CTABanner from '../components/sections/CTABanner';

export default function Species() {
  return (
    <>
      <SEO
        title="Fish Species Guide | Charleston SC Fishing"
        description="Learn about the fish species you can target on a deep sea fishing charter out of Charleston, SC. Blue marlin, mahi-mahi, wahoo, grouper, and more."
        canonicalPath="/species/"
      />
      <Hero
        badge="Target Species"
        headline={
          <>
            What We <span className="text-accent-orange">Catch</span>
          </>
        }
        subheadline="The Gulf Stream and South Carolina coast offer some of the most diverse fishing on the East Coast. Here's what awaits you offshore."
        primaryCta={{ label: 'Book A Trip', to: '/book' }}
        fullscreen={false}
      />

      <section className="py-20 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {species.map((s) => (
              <Link
                key={s.slug}
                to={`/species/${s.slug}`}
                className="metallic-card rounded-xl overflow-hidden group block"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-nautical-dark/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white/60 text-xs uppercase tracking-widest">{s.seasons}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl text-white uppercase mb-2 group-hover:text-accent-orange transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-accent-orange text-xs font-bold uppercase tracking-widest mb-3">
                    {s.tagline}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                    {s.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
