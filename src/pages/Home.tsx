import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ship, Calendar, Waves, Users, Award, Navigation, ChevronRight, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BoatClass, Pricing } from '../lib/types';
import { formatCents } from '../lib/format';

interface ClassWithPricing extends BoatClass {
  startingDeposit: number;
}

export default function Home() {
  const [boatClasses, setBoatClasses] = useState<ClassWithPricing[]>([]);

  useEffect(() => {
    async function load() {
      const [classRes, pricingRes] = await Promise.all([
        supabase.from('boat_classes').select('*').order('display_order'),
        supabase.from('pricing').select('*'),
      ]);

      if (classRes.data && pricingRes.data) {
        const classes = (classRes.data as BoatClass[]).map((bc) => {
          const prices = (pricingRes.data as Pricing[]).filter((p) => p.boat_class_id === bc.id);
          const minDeposit = prices.length > 0 ? Math.min(...prices.map((p) => p.deposit_amount)) : 0;
          return { ...bc, startingDeposit: minDeposit };
        });
        setBoatClasses(classes);
      }
    }
    load();
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/1586880/pexels-photo-1586880.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/60 to-navy-950/90" />
        <div className="relative z-10 container-wide mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-sea-600/20 border border-sea-500/30 rounded-full px-4 py-1.5 mb-6">
              <Navigation className="w-3.5 h-3.5 text-sea-400" />
              <span className="text-sea-300 text-xs font-body font-medium tracking-wide uppercase">
                Charleston, South Carolina
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 text-balance">
              Charleston's Best Deep Sea Fishing
            </h1>
            <p className="text-lg sm:text-xl text-navy-200 max-w-xl mb-10 leading-relaxed font-body">
              Book in one place and get access to 15+ captains and boats. We use our years of
              experience to ensure the perfect boat for your party every time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book" className="btn-primary text-base px-8 py-4">
                Book Your Charter
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="#packages" className="btn-secondary text-base px-8 py-4">
                View Packages
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path
              d="M0 80V40C240 0 480 0 720 40C960 80 1200 80 1440 40V80H0Z"
              fill="#f0f4f8"
            />
          </svg>
        </div>
      </section>

      <section className="bg-navy-50 section-padding" id="how-it-works">
        <div className="container-wide mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-navy-900 mb-4">How It Works</h2>
            <p className="text-navy-500 font-body max-w-lg mx-auto">
              Three simple steps to an unforgettable fishing experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Ship,
                step: '01',
                title: 'Choose Your Boat',
                desc: 'Select from three classes of offshore sportfishing vessels based on your party size and budget.',
              },
              {
                icon: Calendar,
                step: '02',
                title: 'Pick Your Date',
                desc: 'Check real-time availability and choose the perfect date for your deep sea adventure.',
              },
              {
                icon: Waves,
                step: '03',
                title: 'Hit the Water',
                desc: 'We match you with the ideal captain. Pay a small deposit now, settle the rest on your trip day.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-sea-50 rounded-2xl mb-6 group-hover:bg-sea-100 transition-colors duration-300">
                  <item.icon className="w-9 h-9 text-sea-600" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-navy-900 text-white text-xs font-body font-bold rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl text-navy-900 mb-3">{item.title}</h3>
                <p className="text-navy-500 font-body text-sm leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white section-padding" id="packages">
        <div className="container-wide mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-navy-900 mb-4">Choose Your Charter</h2>
            <p className="text-navy-500 font-body max-w-lg mx-auto">
              Three tiers of offshore sportfishing vessels, from economical to ultimate luxury
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {boatClasses.map((bc, index) => (
              <div
                key={bc.id}
                className={`card group relative ${
                  index === 1 ? 'md:-mt-4 md:mb-4 ring-2 ring-sea-500' : ''
                }`}
              >
                {index === 1 && (
                  <div className="absolute top-4 right-4 z-10 bg-sea-600 text-white text-xs font-body font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={bc.image_url}
                    alt={bc.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-white/80 text-xs font-body font-medium">
                      Up to {bc.max_passengers} passengers
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl text-navy-900 mb-1">{bc.name}</h3>
                  <p className="text-sea-600 font-body text-sm font-medium mb-3">{bc.tagline}</p>
                  <p className="text-navy-500 font-body text-sm leading-relaxed mb-6 line-clamp-3">
                    {bc.description}
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-navy-400 font-body text-xs">Deposits from</span>
                      <p className="text-2xl text-navy-900 font-display">
                        {formatCents(bc.startingDeposit)}
                      </p>
                    </div>
                    <Link
                      to={`/book?class=${bc.slug}`}
                      className="btn-primary text-sm py-2.5 px-5"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-900 section-padding">
        <div className="container-wide mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl text-white mb-6">
                Why Fish With Us?
              </h2>
              <p className="text-navy-300 font-body leading-relaxed mb-8">
                We are not just another charter service. With years of running deep sea fishing
                expeditions out of Charleston, we have built a curated network of the best captains
                and vessels on the coast. When you book with us, you get our expertise matching
                you with the right boat for your group -- every single time.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Ship, value: '15+', label: 'Boats & Captains' },
                  { icon: Users, value: '2-12', label: 'Party Sizes' },
                  { icon: Award, value: '30+', label: 'Years Experience' },
                  { icon: Star, value: '4.9', label: 'Average Rating' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-sea-600/20 rounded-lg flex items-center justify-center shrink-0">
                      <stat.icon className="w-5 h-5 text-sea-400" />
                    </div>
                    <div>
                      <p className="text-white font-display text-2xl">{stat.value}</p>
                      <p className="text-navy-400 font-body text-xs">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1630344/pexels-photo-1630344.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Deep sea fishing catch"
                className="rounded-xl w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-5 shadow-xl max-w-xs hidden lg:block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 text-sand-500 fill-sand-500" />
                    ))}
                  </div>
                  <span className="text-navy-400 font-body text-xs">1,200+ trips</span>
                </div>
                <p className="text-navy-700 font-body text-sm italic">
                  "Best fishing charter experience in Charleston. The captain knew exactly where
                  the fish were."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sea-600 section-padding">
        <div className="container-narrow mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl text-white mb-4">
            Ready to Reel in the Big One?
          </h2>
          <p className="text-sea-100 font-body max-w-md mx-auto mb-8">
            Book your Charleston deep sea fishing charter today. Pay a small deposit to
            reserve your spot -- the rest goes directly to your captain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book" className="inline-flex items-center justify-center px-8 py-4 bg-white text-sea-700 font-body font-semibold rounded-lg transition-all duration-200 hover:bg-sea-50 text-base">
              Book Your Charter
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/check" className="btn-secondary text-base px-8 py-4">
              Check Your Booking
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
