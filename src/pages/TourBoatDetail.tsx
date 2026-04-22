import { useParams, Link, Navigate } from 'react-router-dom';
import { getBoatBySlug } from '../content/boats';
import SEO from '../components/seo/SEO';
import CTABanner from '../components/sections/CTABanner';

export default function TourBoatDetail() {
  const { slug } = useParams<{ slug: string }>();
  const boat = getBoatBySlug(slug ?? '');

  if (!boat) return <Navigate to="/tour-boats" replace />;

  return (
    <>
      <SEO
        title={boat.metaTitle}
        description={boat.metaDescription}
        canonicalPath={`/tour-boats/${boat.slug}/`}
      />

      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={boat.image} alt={boat.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-nautical-dark via-nautical-dark/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <Link
            to="/tour-boats"
            className="inline-flex items-center gap-1 text-accent-orange text-sm font-bold uppercase tracking-widest mb-6"
          >
            ← All Boats
          </Link>
          <h1 className="text-4xl md:text-6xl text-white uppercase mb-4">{boat.name}</h1>
          <p className="text-accent-orange font-bold uppercase tracking-widest text-sm">
            {boat.tagline}
          </p>
        </div>
      </section>

      <section className="py-20 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="text-slate-300 leading-relaxed text-lg mb-12">{boat.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                {[
                  { label: 'Length', value: boat.length },
                  { label: 'Engine', value: boat.engine },
                  { label: 'Speed', value: boat.speed },
                  { label: 'Capacity', value: `${boat.capacity} passengers` },
                ].map((spec) => (
                  <div key={spec.label} className="bg-nautical-blue rounded-lg p-4 border border-white/10">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">
                      {spec.label}
                    </p>
                    <p className="text-white font-semibold">{spec.value}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-xl text-white uppercase mb-6">Best For</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
                {boat.bestFor.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-slate-300 text-sm">
                    <div className="w-1.5 h-1.5 bg-accent-orange rounded-full" />
                    {item}
                  </div>
                ))}
              </div>

              <h3 className="text-xl text-white uppercase mb-6">Typical Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {boat.amenities.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-slate-300 text-sm">
                    <div className="w-1.5 h-1.5 bg-accent-orange rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="metallic-card rounded-xl p-8 sticky top-24">
                <h3 className="text-lg text-white uppercase mb-6">Book This Class</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  Reserve a trip on a {boat.length} class sportfisher. Pay a small deposit today and
                  we'll confirm your booking and boat assignment.
                </p>
                <Link to="/book" className="btn-primary w-full text-center py-4 block">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
