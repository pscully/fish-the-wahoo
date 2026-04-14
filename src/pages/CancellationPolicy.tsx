import SEO from '../components/seo/SEO';

export default function CancellationPolicy() {
  return (
    <>
      <SEO
        title="Cancellation Policy | Fish The Wahoo"
        description="Fish The Wahoo cancellation and refund policy for deep sea fishing charter bookings in Charleston, SC."
        canonicalPath="/cancellation-policy/"
      />

      <section className="pt-32 pb-20 bg-nautical-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Policies</span>
          <h1 className="text-5xl text-white uppercase mb-6">Cancellation Policy</h1>
          <div className="w-24 h-1 bg-accent-orange mb-12" />

          <div className="prose-dark space-y-8 text-slate-300 text-sm leading-relaxed">
            <div className="metallic-card rounded-xl p-8">
              <h2 className="text-xl text-white uppercase mb-4">Customer Cancellations</h2>
              <ul className="space-y-3">
                <li>Cancellations made 30+ days before the trip date: full deposit refund.</li>
                <li>Cancellations made 14-29 days before the trip date: 50% deposit refund.</li>
                <li>Cancellations made within 14 days: no deposit refund (credit toward a future trip may be available).</li>
                <li>No-shows: no refund.</li>
              </ul>
              <p className="mt-4 text-slate-400">
                All cancellations must be submitted in writing to{' '}
                <a href="mailto:info@fishthewahoo.com" className="text-accent-orange hover:underline">
                  info@fishthewahoo.com
                </a>
                .
              </p>
            </div>

            <div className="metallic-card rounded-xl p-8">
              <h2 className="text-xl text-white uppercase mb-4">Weather Cancellations</h2>
              <p>
                If we cancel your trip due to unsafe weather conditions, you will receive a full
                refund of your deposit OR the option to reschedule at no additional charge. We will
                notify you at least 24 hours in advance when possible.
              </p>
              <p className="mt-4 text-slate-400">
                Note: We do not cancel for rain alone. We cancel when conditions are unsafe for
                offshore operations (high seas, lightning, etc.).
              </p>
            </div>

            <div className="metallic-card rounded-xl p-8">
              <h2 className="text-xl text-white uppercase mb-4">Rescheduling</h2>
              <p>
                You may reschedule your trip up to 14 days before the original date at no charge,
                subject to availability. Rescheduling within 14 days is subject to a rescheduling
                fee.
              </p>
            </div>

            <p className="text-slate-500 text-xs mt-8">
              Last updated: 2026. Policy subject to change. Contact us with any questions.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
