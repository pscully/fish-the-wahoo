import SEO from '../components/seo/SEO';
import CTABanner from '../components/sections/CTABanner';

// Blog posts will be populated by the import script in Phase 6.
// For now, show a placeholder that matches the live site's blog URL.
export default function Blog() {
  return (
    <>
      <SEO
        title="Deep Sea Fishing Blog | Fish The Wahoo Charleston"
        description="Fishing tips, trip reports, species guides, and deep sea fishing news from Fish The Wahoo out of Charleston, SC."
        canonicalPath="/blog/"
      />

      <section className="pt-32 pb-8 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Articles</span>
          <h1 className="text-5xl text-white uppercase mb-4">Fishing Blog</h1>
          <div className="w-24 h-1 bg-accent-orange mb-6" />
          <p className="text-slate-400 max-w-2xl">
            Fishing tips, species guides, trip reports, and deep sea fishing news from the
            Fish The Wahoo crew.
          </p>
        </div>
      </section>

      <section className="py-16 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-nautical-blue rounded-xl p-12 text-center border border-white/10">
            <p className="text-slate-400 text-lg mb-4">Blog posts are being migrated.</p>
            <p className="text-slate-500 text-sm">
              Check back soon for tips, reports, and species guides.
            </p>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
