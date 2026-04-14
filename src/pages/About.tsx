import { Link } from 'react-router-dom';
import { Ship, Users, Award, Shield } from 'lucide-react';
import SEO from '../components/seo/SEO';
import CTABanner from '../components/sections/CTABanner';

export default function About() {
  return (
    <>
      <SEO
        title="About Fish The Wahoo | Charleston Deep Sea Fishing"
        description="Fish The Wahoo is Charleston's premier deep sea fishing concierge. One booking platform, 15+ captains, and the perfect trip every time."
        canonicalPath="/about/"
      />

      <section className="relative pt-40 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/2131967/pexels-photo-2131967.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="absolute inset-0 bg-nautical-dark/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label">Our Story</span>
          <h1 className="text-5xl sm:text-6xl text-white uppercase mb-6">
            About Fish The Wahoo
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-lg">
            Your single source for the best deep sea fishing experiences in Charleston, SC
          </p>
        </div>
      </section>

      <section className="py-20 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="section-label">Who We Are</span>
              <h2 className="text-3xl sm:text-4xl text-white uppercase mb-6">
                One Booking Hub. 15+ Captains. The Perfect Trip Every Time.
              </h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Fish The Wahoo was born from a simple idea: booking a deep sea fishing charter
                  in Charleston shouldn't be complicated. With so many boats and captains to choose
                  from, how do you know which one is right for your group?
                </p>
                <p>
                  That's where we come in. We have built relationships with over 15 of the best
                  captains and boats operating out of Charleston. When you book through us, we
                  use our decades of experience to match your party with the ideal vessel and
                  captain based on your group size, goals, and budget.
                </p>
                <p>
                  We are not a boat operator — we are your fishing concierge. You pay a small
                  booking deposit to reserve your spot, and the full charter fee goes directly
                  to your captain on the day of your trip. It's that simple.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1574653/pexels-photo-1574653.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Charleston harbor fishing"
                className="rounded-xl w-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-nautical-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-label">Why Us</span>
            <h2 className="text-3xl text-white uppercase mb-4">How We Are Different</h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Ship,
                title: 'Massive Fleet',
                desc: 'Access to 15+ offshore sportfishing vessels from 48 to 65+ feet. We have the right boat for every group.',
              },
              {
                icon: Users,
                title: 'Expert Matching',
                desc: 'We pair your party with the perfect captain based on your group size, experience level, and target species.',
              },
              {
                icon: Award,
                title: '30+ Years Experience',
                desc: 'Our team has been running deep sea fishing expeditions out of Charleston for over three decades.',
              },
              {
                icon: Shield,
                title: 'Simple Pricing',
                desc: 'Pay a small deposit to book. The rest goes directly to your captain. No hidden fees, no surprises.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-orange/10 border border-accent-orange/20 rounded-xl mb-6 group-hover:bg-accent-orange/20 transition-colors">
                  <item.icon className="w-7 h-7 text-accent-orange" />
                </div>
                <h3 className="text-lg text-white uppercase mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-label">The Fleet</span>
            <h2 className="text-3xl text-white uppercase mb-4">Our Vessel Classes</h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: '48-50 Foot Sportfisher',
                image:
                  'https://images.pexels.com/photos/1223649/pexels-photo-1223649.jpeg?auto=compress&cs=tinysrgb&w=600',
                passengers: 6,
                desc: 'Fast and reliable with all the gear you need for a great day offshore.',
              },
              {
                name: '53-59 Foot Sportfisher',
                image:
                  'https://images.pexels.com/photos/2614418/pexels-photo-2614418.jpeg?auto=compress&cs=tinysrgb&w=600',
                passengers: 6,
                desc: 'True battlewagons built for blue water. Smooth ride, serious fish-raising equipment.',
              },
              {
                name: '60+ Foot Sportfisher',
                image:
                  'https://images.pexels.com/photos/3413678/pexels-photo-3413678.jpeg?auto=compress&cs=tinysrgb&w=600',
                passengers: 6,
                desc: 'The biggest and best in our fleet. Full luxury amenities for the ultimate offshore experience.',
              },
            ].map((boat) => (
              <div key={boat.name} className="metallic-card rounded-xl overflow-hidden">
                <img
                  src={boat.image}
                  alt={boat.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg text-white uppercase mb-1">{boat.name}</h3>
                  <p className="text-accent-orange text-xs font-bold uppercase tracking-widest mb-3">
                    Up to {boat.passengers} passengers
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">{boat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/tour-boats" className="btn-outline">
              View Full Fleet Details
            </Link>
          </div>
        </div>
      </section>

      <CTABanner
        headline="Ready to Book Your Charter?"
        subtext="Let us match you with the perfect boat and captain for an unforgettable Charleston deep sea fishing experience."
        ctaLabel="Book Your Charter"
        ctaTo="/book"
      />
    </>
  );
}
