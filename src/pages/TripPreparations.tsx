import SEO from '../components/seo/SEO';
import CTABanner from '../components/sections/CTABanner';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function TripPreparations() {
  return (
    <>
      <SEO
        title="Trip Preparations | What to Bring Deep Sea Fishing"
        description="Everything you need to know before your deep sea fishing charter out of Charleston, SC. What to bring, seasickness tips, weather policies, and more."
        canonicalPath="/trip-preparations/"
      />

      <section className="pt-32 pb-8 bg-nautical-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Before You Go</span>
          <h1 className="text-5xl text-white uppercase mb-6">Trip Preparations</h1>
          <div className="w-24 h-1 bg-accent-orange mb-8" />
          <p className="text-slate-400 text-lg">
            Everything you need to know to have the best possible day on the water.
          </p>
        </div>
      </section>

      <section className="py-16 bg-nautical-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="metallic-card rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-accent-orange" />
              <h2 className="text-2xl text-white uppercase">What to Bring</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Sunscreen (SPF 50+)',
                'Sunglasses and hat',
                'Light, long-sleeve shirt',
                'Non-slip boat shoes',
                'Motion sickness medication',
                'Valid ID',
                'Snacks and non-alcoholic drinks',
                'Camera or waterproof phone case',
                'Comfortable clothes (layers in cooler months)',
                'Small backpack or bag',
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
              <AlertCircle className="w-6 h-6 text-accent-orange" />
              <h2 className="text-2xl text-white uppercase">Seasickness</h2>
            </div>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                Seasickness is a real concern on offshore trips, especially for first-timers. The best
                approach is prevention. Take your medication the night before and again the morning of
                the trip.
              </p>
              <p>
                Over-the-counter options like Dramamine and Bonine work well for most people.
                Scopolamine patches (prescription) are more effective for those who are particularly
                susceptible.
              </p>
              <p>
                Eat a light meal before the trip. Avoid alcohol the night before. Stay on deck and
                keep your eyes on the horizon if you feel unwell. Fresh ginger can help.
              </p>
            </div>
          </div>

          <div className="metallic-card rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-6 h-6 text-accent-orange" />
              <h2 className="text-2xl text-white uppercase">Weather Policy</h2>
            </div>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                Safety is our top priority. If conditions are unsafe — high seas, lightning, or severe
                weather — we will reschedule your trip at no charge. We monitor forecasts closely and
                will contact you 24-48 hours in advance if a reschedule is necessary.
              </p>
              <p>
                We fish in rain. We fish in wind. We draw the line at dangerous conditions. Our captains
                have decades of experience reading weather and will always make the right call.
              </p>
              <p>
                Spring and fall are the best times for consistent offshore conditions. Summer brings
                warm water but occasional afternoon thunderstorms. Winter offers excellent fishing but
                rougher seas.
              </p>
            </div>
          </div>

          <div className="metallic-card rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-6 h-6 text-accent-orange" />
              <h2 className="text-2xl text-white uppercase">Departure Information</h2>
            </div>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                All trips depart from Shem Creek Marina in Mount Pleasant, SC. Plan to arrive 30
                minutes before your scheduled departure time. Your captain will meet you at the dock
                to go over the day's plan.
              </p>
              <p>
                Parking is available at the marina. We'll send you detailed directions and a parking
                map when you book.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
