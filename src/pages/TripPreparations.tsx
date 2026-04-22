import SEO from '../components/seo/SEO';
import CTABanner from '../components/sections/CTABanner';
import { Link } from 'react-router-dom';
import { HandCoins, Backpack, Package, ShieldAlert } from 'lucide-react';

export default function TripPreparations() {
  return (
    <>
      <SEO
        title="Trip Preparations | Fish The Wahoo Charleston"
        description="Everything you need to know before your Fish The Wahoo charter — how to find the boats, what to bring, what's included, gratuity, and our cancellation terms."
        canonicalPath="/trip-preparations/"
      />

      <section className="pt-32 pb-8 bg-nautical-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Before You Go</span>
          <h1 className="text-5xl text-white uppercase mb-6">Trip Preparations</h1>
          <div className="w-24 h-1 bg-accent-orange mb-8" />
          <p className="text-slate-400 text-lg">
            Everything you need to prepare for your upcoming Charleston fishing adventure.
          </p>
        </div>
      </section>

      <section className="py-16 bg-nautical-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="metallic-card rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <HandCoins className="w-6 h-6 text-accent-orange" />
              <h2 className="text-2xl text-white uppercase">Gratuity</h2>
            </div>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                The industry standard gratuity for the crew is 20%. The crew will gladly accept
                whatever tip you feel their efforts deserved.
              </p>
              <p>
                Our captains and mates work hard to optimize the experience of their clients, and
                they rely on their tips to make a living. That said, no customer should ever pay a
                gratuity they feel was not earned. Hand the gratuity to the captain — he'll ensure
                proper distribution to the mate.
              </p>
            </div>
          </div>

          <div className="metallic-card rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Backpack className="w-6 h-6 text-accent-orange" />
              <h2 className="text-2xl text-white uppercase">What To Bring</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Camera',
                'Sunglasses',
                'Sunscreen',
                'Hat',
                'Food',
                'Drinks (beer is fine — no liquor or glass bottles)',
                'A cooler to take your catch home',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-accent-orange rounded-full shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="metallic-card rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-accent-orange" />
              <h2 className="text-2xl text-white uppercase">Included In Your Trip</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Ice',
                'Bait',
                'All fishing equipment',
                'All fishing licenses',
                'Crew cleans your catch',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-1.5 h-1.5 bg-accent-orange rounded-full shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="metallic-card rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-6 h-6 text-accent-orange" />
              <h2 className="text-2xl text-white uppercase">
                Cancellation &amp; Refund Disclaimer
              </h2>
            </div>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                While Fish The Wahoo tries its best to (1) keep our vessels neat, clean, and
                organized, (2) accurately describe our boats, and (3) accurately describe our
                services and normal customer experience, we cannot warrant or guarantee in any way
                (1) that any particular feature or system of any boat will be in working order,
                (2) the overall condition of any vessel, (3) that any particular kind of fishing
                will be attempted — the captain will decide based on circumstances, or (4) that
                any particular species will be caught or targeted.
              </p>
              <p className="text-white font-semibold">Cancellation terms:</p>
              <ul className="space-y-2 list-disc list-inside marker:text-accent-orange">
                <li>
                  Cancellations made <span className="text-white">more than 30 days</span> before
                  departure receive a full refund of the deposit.
                </li>
                <li>
                  Cancellations made <span className="text-white">7 to 30 days</span> before
                  departure forfeit the deposit.
                </li>
                <li>
                  Cancellations made <span className="text-white">inside 7 days</span> of
                  departure are responsible for the full charter payment.
                </li>
                <li>
                  Once the client is on the boat and the boat leaves the dock, no client is
                  entitled to any discount or refund for any reason.
                </li>
              </ul>
              <p>
                By completing a booking, you indicate you have read and agree to these terms.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-slate-400 text-sm">
              Also check out our{' '}
              <Link
                to="/faq"
                className="text-accent-orange font-semibold hover:underline"
              >
                Frequently Asked Questions
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
