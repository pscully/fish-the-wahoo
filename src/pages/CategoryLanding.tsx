import { Link } from 'react-router-dom';
import { getPackagesByCategory } from '../content/packages';
import type { PackageData } from '../content/packages';
import SEO from '../components/seo/SEO';
import Hero from '../components/sections/Hero';
import CTABanner from '../components/sections/CTABanner';

interface CategoryConfig {
  category: PackageData['category'];
  headline: React.ReactNode;
  badge: string;
  subheadline: string;
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  bgImage?: string;
}

export default function CategoryLanding({
  category,
  headline,
  badge,
  subheadline,
  metaTitle,
  metaDescription,
  canonicalPath,
  bgImage,
}: CategoryConfig) {
  const categoryPackages = getPackagesByCategory(category);

  return (
    <>
      <SEO title={metaTitle} description={metaDescription} canonicalPath={canonicalPath} />
      <Hero
        badge={badge}
        headline={headline}
        subheadline={subheadline}
        primaryCta={{ label: 'View All Packages', to: '/packages' }}
        secondaryCta={{ label: 'Book A Trip', to: '/book' }}
        bgImage={bgImage}
        fullscreen={false}
      />

      <section className="py-20 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryPackages.map((pkg) => (
              <div
                key={pkg.slug}
                className="metallic-card rounded-xl overflow-hidden flex flex-col group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-accent-orange text-white font-bold px-3 py-1 text-sm rounded-sm">
                    From ${pkg.priceFrom.toLocaleString()}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-lg text-white mb-2 uppercase leading-tight">{pkg.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-grow mb-6">
                    {pkg.description}
                  </p>
                  <div className="flex gap-3">
                    <Link
                      to={`/book?package=${pkg.slug}`}
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
        </div>
      </section>

      <CTABanner />
    </>
  );
}
