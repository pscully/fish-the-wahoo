import { useParams, Link, Navigate } from 'react-router-dom';
import { getSpeciesBySlug } from '../content/species';
import { getPackageBySlug } from '../content/packages';
import SEO from '../components/seo/SEO';
import CTABanner from '../components/sections/CTABanner';

export default function SpeciesDetail() {
  const { slug } = useParams<{ slug: string }>();
  const s = getSpeciesBySlug(slug ?? '');

  if (!s) return <Navigate to="/species" replace />;

  const relatedPackages = s.bestPackages
    .map((ps) => getPackageBySlug(ps))
    .filter(Boolean);

  return (
    <>
      <SEO
        title={s.metaTitle}
        description={s.metaDescription}
        canonicalPath={`/species/${s.slug}/`}
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-nautical-dark via-nautical-dark/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <Link
            to="/species"
            className="inline-flex items-center gap-1 text-accent-orange text-sm font-bold uppercase tracking-widest mb-6 hover:gap-2 transition-all"
          >
            ← All Species
          </Link>
          <h1 className="text-4xl md:text-6xl text-white uppercase mb-4">{s.name}</h1>
          <p className="text-accent-orange font-bold uppercase tracking-widest text-sm mb-4">
            {s.tagline}
          </p>
          <p className="text-slate-300 text-sm">Best season: {s.seasons}</p>
        </div>
      </section>

      <section className="py-20 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="text-slate-300 leading-relaxed">
                {s.body.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-6">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {relatedPackages.length > 0 && (
              <div>
                <div className="metallic-card rounded-xl p-8 sticky top-24">
                  <h3 className="text-lg text-white uppercase mb-6">Best Trips for {s.name}</h3>
                  <div className="space-y-4">
                    {relatedPackages.map((pkg) => (
                      <div key={pkg!.slug} className="border-b border-white/10 pb-4 last:border-0">
                        <p className="text-white text-sm font-bold mb-1">{pkg!.name}</p>
                        <p className="text-slate-400 text-xs mb-3">{pkg!.duration} · Up to {pkg!.maxPassengers} passengers</p>
                        <Link
                          to={`/packages/${pkg!.slug}`}
                          className="text-accent-orange text-xs font-bold uppercase tracking-widest hover:underline"
                        >
                          View Package →
                        </Link>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/book"
                    className="btn-primary w-full text-center py-4 block mt-6"
                  >
                    Book A Trip
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
