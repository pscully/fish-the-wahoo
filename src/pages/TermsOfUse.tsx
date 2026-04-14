import SEO from '../components/seo/SEO';

export default function TermsOfUse() {
  return (
    <>
      <SEO
        title="Terms of Use | Fish The Wahoo"
        description="Terms of use for Fish The Wahoo deep sea fishing charters in Charleston, SC."
        canonicalPath="/terms-of-use/"
      />

      <section className="pt-32 pb-20 bg-nautical-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Legal</span>
          <h1 className="text-5xl text-white uppercase mb-6">Terms of Use</h1>
          <div className="w-24 h-1 bg-accent-orange mb-12" />

          <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
            <div className="metallic-card rounded-xl p-8">
              <h2 className="text-xl text-white uppercase mb-4">Booking Agreement</h2>
              <p>
                By booking a charter through Fish The Wahoo, you agree to these terms. A deposit is
                required to confirm your booking. The remaining balance is due on the day of your
                trip, payable directly to your captain.
              </p>
            </div>

            <div className="metallic-card rounded-xl p-8">
              <h2 className="text-xl text-white uppercase mb-4">Safety & Conduct</h2>
              <ul className="space-y-2">
                <li>All passengers must follow the captain's instructions at all times.</li>
                <li>Life jackets must be worn when instructed by the captain.</li>
                <li>Alcohol is permitted in moderation. Excessive intoxication is grounds for removal from the vessel.</li>
                <li>We reserve the right to refuse service to any person who poses a safety risk.</li>
              </ul>
            </div>

            <div className="metallic-card rounded-xl p-8">
              <h2 className="text-xl text-white uppercase mb-4">Liability</h2>
              <p>
                Deep sea fishing involves inherent risks. By booking a trip, you acknowledge these
                risks and agree to hold Fish The Wahoo, its captains, and crew harmless from
                personal injury, property damage, or other losses arising from participation in
                charter activities, except where caused by negligence.
              </p>
            </div>

            <div className="metallic-card rounded-xl p-8">
              <h2 className="text-xl text-white uppercase mb-4">Fishing Regulations</h2>
              <p>
                All trips operate in compliance with federal and state fishing regulations. Bag
                limits, size limits, and seasonal restrictions will be observed. Catches not meeting
                regulations will be released.
              </p>
            </div>

            <p className="text-slate-500 text-xs mt-8">Last updated: 2026.</p>
          </div>
        </div>
      </section>
    </>
  );
}
