import { Link } from 'react-router-dom';
import { Ship, Users, Award, Shield, Anchor, ChevronRight, MapPin } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white">
      <section className="relative pt-32 pb-20 bg-navy-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/2131967/pexels-photo-2131967.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="relative container-wide mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl text-white mb-4">About Fish The Wahoo</h1>
          <p className="text-navy-300 font-body max-w-xl mx-auto text-lg">
            Your single source for the best deep sea fishing experiences in Charleston, SC
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-sea-600 font-body text-sm font-semibold mb-4">
                <MapPin className="w-4 h-4" />
                <span>Charleston, South Carolina</span>
              </div>
              <h2 className="text-3xl sm:text-4xl text-navy-900 mb-6">
                One Booking Hub. 15+ Captains. The Perfect Trip Every Time.
              </h2>
              <div className="space-y-4 text-navy-600 font-body leading-relaxed">
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
                  We are not a boat operator -- we are your fishing concierge. You pay a small
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

      <section className="section-padding bg-navy-50">
        <div className="container-wide mx-auto">
          <h2 className="text-3xl text-navy-900 mb-12 text-center">How We Are Different</h2>
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
              <div key={item.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-sea-100 rounded-xl mb-4">
                  <item.icon className="w-7 h-7 text-sea-600" />
                </div>
                <h3 className="text-lg text-navy-900 mb-2">{item.title}</h3>
                <p className="text-navy-500 font-body text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide mx-auto">
          <h2 className="text-3xl text-navy-900 mb-12 text-center">Our Vessel Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: '48-50 Foot Sportfisher',
                image: 'https://images.pexels.com/photos/1223649/pexels-photo-1223649.jpeg?auto=compress&cs=tinysrgb&w=600',
                passengers: 6,
                desc: 'Beautifully appointed yachts with mahogany interiors, leather seating, full kitchens, and decades of fish-raising reputation.',
              },
              {
                name: '53-59 Foot Sportfisher',
                image: 'https://images.pexels.com/photos/2614418/pexels-photo-2614418.jpeg?auto=compress&cs=tinysrgb&w=600',
                passengers: 6,
                desc: 'True battlewagons built for blue water. These beasts deliver the smoothest ride and go when others cannot.',
              },
              {
                name: '60+ Foot Party Sportfisher',
                image: 'https://images.pexels.com/photos/3413678/pexels-photo-3413678.jpeg?auto=compress&cs=tinysrgb&w=600',
                passengers: 12,
                desc: 'Coast Guard Inspected vessels purpose-built for large groups. The only boats in Charleston that take 7+ passengers fishing.',
              },
            ].map((boat) => (
              <div key={boat.name} className="card">
                <img
                  src={boat.image}
                  alt={boat.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-lg text-navy-900 mb-1">{boat.name}</h3>
                  <p className="text-sea-600 font-body text-xs font-medium mb-2">
                    Up to {boat.passengers} passengers
                  </p>
                  <p className="text-navy-500 font-body text-sm leading-relaxed">{boat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sea-600 section-padding">
        <div className="container-narrow mx-auto text-center">
          <Anchor className="w-10 h-10 text-sea-200 mx-auto mb-4" />
          <h2 className="text-3xl text-white mb-4">Ready to Book Your Charter?</h2>
          <p className="text-sea-100 font-body max-w-md mx-auto mb-8">
            Let us match you with the perfect boat and captain for an unforgettable
            Charleston deep sea fishing experience.
          </p>
          <Link to="/book" className="inline-flex items-center justify-center px-8 py-4 bg-white text-sea-700 font-body font-semibold rounded-lg hover:bg-sea-50 transition-all text-base">
            Book Your Charter
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
