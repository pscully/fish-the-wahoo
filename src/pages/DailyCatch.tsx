import SEO from '../components/seo/SEO';
import CTABanner from '../components/sections/CTABanner';

export default function DailyCatch() {
  return (
    <>
      <SEO
        title="Daily Catch Reports | Fish The Wahoo"
        description="Daily fish reports and trip updates from Fish The Wahoo fishing charters out of Charleston, SC."
        canonicalPath="/daily-catch/"
      />

      <section className="pt-32 pb-8 bg-nautical-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Trip Reports</span>
          <h1 className="text-5xl md:text-6xl text-white uppercase mb-6">Daily Catch</h1>
          <div className="w-24 h-1 bg-accent-orange mb-8" />
          <p className="text-slate-400 text-lg leading-relaxed">
            Trip reports, daily catch updates, and fishing conditions from the Fish The Wahoo fleet.
            Follow along to see what's biting off Charleston.
          </p>
        </div>
      </section>

      <section className="py-16 bg-nautical-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-nautical-blue rounded-xl p-12 text-center border border-white/10">
            <p className="text-slate-400 text-lg mb-4">
              Trip reports are being migrated to our new site.
            </p>
            <p className="text-slate-500 text-sm">
              Follow us on{' '}
              <a
                href="https://instagram.com/fishthewahoo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-orange hover:underline"
              >
                Instagram @fishthewahoo
              </a>{' '}
              for the latest catches and conditions.
            </p>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
