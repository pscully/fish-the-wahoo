import { Link } from 'react-router-dom';
import { boats } from '../content/boats';
import SEO from '../components/seo/SEO';
import Hero from '../components/sections/Hero';

export default function TourBoats() {
  return (
    <>
      <SEO
        title="Charleston Fishing Charter Boat Classes | Fish The Wahoo"
        description="Three classes of offshore sportfishing boats we book out of Charleston, SC — 48–50ft, 53–59ft, and 60+ft. What to expect from each class and the trips they handle best."
        canonicalPath="/tour-boats/"
      />
      <Hero
        badge="Boat Classes"
        headline={
          <>
            Our <span className="text-accent-orange">Boat Classes</span>
          </>
        }
        subheadline="Three sportfisher size classes we book out of Charleston. Specific hulls rotate based on captain availability, but every boat in each class meets the same standards for gear, safety, and crew experience."
        primaryCta={{ label: 'Book A Trip', to: '/book' }}
        fullscreen={false}
      />

      <section className="py-20 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {boats.map((boat, i) => (
              <div
                key={boat.slug}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  i % 2 !== 0 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={i % 2 !== 0 ? 'lg:order-2' : ''}>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden">
                    <img
                      src={boat.image}
                      alt={boat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className={i % 2 !== 0 ? 'lg:order-1' : ''}>
                  <span className="section-label">{boat.length} Sportfisher Class</span>
                  <h2 className="text-4xl text-white uppercase mb-4">{boat.name}</h2>
                  <p className="text-accent-orange font-bold uppercase tracking-widest text-sm mb-6">
                    {boat.tagline}
                  </p>
                  <p className="text-slate-300 leading-relaxed mb-8">{boat.description}</p>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {[
                      { label: 'Length', value: boat.length },
                      { label: 'Capacity', value: `${boat.capacity} passengers` },
                      { label: 'Speed', value: boat.speed },
                    ].map((spec) => (
                      <div key={spec.label}>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">
                          {spec.label}
                        </p>
                        <p className="text-white font-semibold text-sm">{spec.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mb-8">
                    <p className="text-white text-sm font-bold uppercase tracking-widest mb-4">
                      Best For
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {boat.bestFor.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-slate-400 text-sm">
                          <div className="w-1 h-1 bg-accent-orange rounded-full" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link to="/book" className="btn-primary py-3 px-8">
                      Book This Class
                    </Link>
                    <Link
                      to={`/tour-boats/${boat.slug}`}
                      className="btn-outline py-3 px-8"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
