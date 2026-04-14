import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Clock, Users, ChevronRight, Fish } from 'lucide-react';
import { getPackageBySlug } from '../content/packages';
import { supabase } from '../lib/supabase';
import SEO from '../components/seo/SEO';
import CTABanner from '../components/sections/CTABanner';

export default function PackageDetail() {
  const { slug } = useParams<{ slug: string }>();
  const pkg = getPackageBySlug(slug ?? '');
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    if (!pkg) return;
    supabase
      .from('boat_classes')
      .select('image_url')
      .order('display_order')
      .then(({ data }) => {
        if (data && data[pkg.boatClassIndex]?.image_url) {
          setHeroImage(data[pkg.boatClassIndex].image_url as string);
        }
      });
  }, [pkg]);

  if (!pkg) return <Navigate to="/packages" replace />;

  const displayImage = heroImage ?? pkg.image;

  return (
    <>
      <SEO
        title={pkg.metaTitle}
        description={pkg.metaDescription}
        canonicalPath={`/packages/${pkg.slug}/`}
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={displayImage} alt={pkg.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-nautical-dark via-nautical-dark/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
          <Link to="/packages" className="inline-flex items-center gap-1 text-accent-orange text-sm font-bold uppercase tracking-widest mb-6 hover:gap-2 transition-all">
            ← All Packages
          </Link>
          <h1 className="text-4xl md:text-6xl text-white uppercase mb-4">{pkg.name}</h1>
          <p className="text-accent-orange font-bold uppercase tracking-widest text-sm mb-6">
            {pkg.tagline}
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-2 rounded-sm">
              <Clock className="w-4 h-4 text-accent-orange" /> {pkg.duration}
            </span>
            <span className="flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-2 rounded-sm">
              <Users className="w-4 h-4 text-accent-orange" /> Up to {pkg.maxPassengers} passengers
            </span>
            <span className="bg-accent-orange text-white text-sm px-4 py-2 rounded-sm font-bold">
              From ${pkg.priceFrom.toLocaleString()}
            </span>
          </div>
        </div>
      </section>

      <section className="py-20 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed mb-12">
                {pkg.longDescription.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-6">
                    {para}
                  </p>
                ))}
              </div>

              {pkg.targetSpecies.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl text-white uppercase mb-6">Target Species</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {pkg.targetSpecies.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-slate-300 text-sm">
                        <Fish className="w-4 h-4 text-accent-orange shrink-0" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="metallic-card rounded-xl p-8 sticky top-24">
                <h3 className="text-xl text-white uppercase mb-6">Trip Includes</h3>
                <ul className="space-y-3 mb-8">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                      <ChevronRight className="w-4 h-4 text-accent-orange shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/book/calendar?package=${pkg.slug}`}
                  className="btn-primary w-full text-center py-4 block"
                >
                  Book This Trip
                </Link>
                <p className="text-slate-500 text-xs text-center mt-4">
                  Pay a small deposit to hold your date. Balance due on the day of the trip.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        headline="Ready to Book This Trip?"
        subtext="Our calendar fills up fast. Secure your date with a small deposit and we'll match you with the perfect captain and boat."
        ctaLabel="Book Now"
        ctaTo={`/book/calendar?package=${pkg.slug}`}
      />
    </>
  );
}
