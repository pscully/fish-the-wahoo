import SEO from '../components/seo/SEO';

export default function CancellationPolicy() {
  return (
    <>
      <SEO
        title="Cancellation Policy | Fish The Wahoo"
        description="Fish The Wahoo cancellation and refund policy for Charleston deep sea fishing charter bookings."
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
              <ul className="space-y-3 list-disc list-inside marker:text-accent-orange">
                <li>
                  Cancellations made <span className="text-white">more than 30 days</span> before
                  departure receive a full refund of the deposit.
                </li>
                <li>
                  Cancellations made <span className="text-white">7 to 30 days</span> before
                  departure forfeit the deposit.
                </li>
                <li>
                  Cancellations made <span className="text-white">inside 7 days</span> of departure
                  are responsible for the full charter payment.
                </li>
                <li>
                  Once the client is on the boat and the boat leaves the dock, no client is
                  entitled to any discount or refund for any reason.
                </li>
              </ul>
              <p className="mt-6 text-slate-400">
                All cancellations must be submitted in writing to{' '}
                <a href="mailto:chuck141w@yahoo.com" className="text-accent-orange hover:underline">
                  chuck141w@yahoo.com
                </a>
                .
              </p>
            </div>

            <div className="metallic-card rounded-xl p-8">
              <h2 className="text-xl text-white uppercase mb-4">Weather Cancellations</h2>
              <p>
                If we cancel your trip due to unsafe weather conditions, you'll receive a full
                refund of your deposit or the option to reschedule at no additional charge. We'll
                notify you at least 24 hours in advance when possible.
              </p>
              <p className="mt-4 text-slate-400">
                Note: we do not cancel for rain alone. We cancel when conditions are unsafe for
                offshore operations (high seas, lightning, etc.).
              </p>
            </div>

            <div className="metallic-card rounded-xl p-8">
              <h2 className="text-xl text-white uppercase mb-4">What We Do And Don't Guarantee</h2>
              <p>
                Fish The Wahoo cannot warrant or guarantee, in any way: (1) that any particular
                feature or system of any boat will be in working order, (2) the overall condition of
                any vessel, (3) that any particular kind of fishing will be attempted — trolling,
                bottom fishing, etc. — as the captain decides based on circumstances, or (4) that
                any particular species will be caught or targeted.
              </p>
            </div>

            <p className="text-slate-500 text-xs mt-8">
              By completing a booking, you indicate you have read and agree to these terms. Contact
              us with any questions.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
