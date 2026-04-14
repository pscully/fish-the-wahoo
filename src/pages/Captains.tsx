import { useEffect, useState } from 'react';
import { Instagram, Facebook } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Captain } from '../lib/types';
import SEO from '../components/seo/SEO';
import Hero from '../components/sections/Hero';
import CTABanner from '../components/sections/CTABanner';

export default function Captains() {
  const [captains, setCaptains] = useState<Captain[]>([]);

  useEffect(() => {
    supabase
      .from('captains')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => {
        if (data) setCaptains(data as Captain[]);
      });
  }, []);

  return (
    <>
      <SEO
        title="Our Captains | Charleston Deep Sea Fishing"
        description="Meet the expert captains of Fish The Wahoo. With decades of offshore experience, our captains know Charleston's waters better than anyone."
        canonicalPath="/captains/"
      />
      <Hero
        badge="The Crew"
        headline={
          <>
            Meet Your <br />
            <span className="text-accent-orange">Captains</span>
          </>
        }
        subheadline="For over three generations, Fish The Wahoo has been the premier name in deep-sea adventure out of Charleston. Our captains are the best in the business."
        primaryCta={{ label: 'Book A Trip', to: '/book' }}
        fullscreen={false}
      />

      <section className="py-20 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {captains.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {captains.map((cap) => (
                <div key={cap.id} className="group">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-6 relative">
                    {cap.photo_url ? (
                      <img
                        src={cap.photo_url}
                        alt={cap.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-nautical-light flex items-center justify-center">
                        <span className="text-6xl font-display text-slate-500">
                          {cap.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-nautical-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-accent-orange transition-colors">
                          <Instagram className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-accent-orange transition-colors">
                          <Facebook className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl text-white mb-3 uppercase">{cap.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{cap.bio}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-nautical-blue rounded-xl p-12 text-center border border-white/10">
              <p className="text-slate-400 mb-4">Captain profiles are being updated.</p>
              <p className="text-slate-500 text-sm">
                Call us at{' '}
                <a href="tel:8435683222" className="text-accent-orange hover:underline">
                  (843) 568-3222
                </a>{' '}
                to speak with a captain directly.
              </p>
            </div>
          )}
        </div>
      </section>

      <CTABanner
        headline="Fish With Charleston's Best Captains"
        subtext="Every booking through Fish The Wahoo is matched with the ideal captain for your trip. Book your date today."
        ctaLabel="Book A Trip"
        ctaTo="/book"
      />
    </>
  );
}
