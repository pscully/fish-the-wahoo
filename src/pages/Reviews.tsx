import SEO from '../components/seo/SEO';
import ReviewsSection from '../components/sections/ReviewsSection';
import CTABanner from '../components/sections/CTABanner';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Robert Thompson',
    text: "Best fishing trip of my life. The captain put us right on the marlin within the first hour. The boat was immaculate and the crew was top notch.",
    stars: 5,
    date: 'August 2025',
  },
  {
    name: 'James Wilson',
    text: "Took the family out on the 55ft class boat. The kids had a blast catching snapper and the crew was incredibly patient and helpful.",
    stars: 5,
    date: 'July 2025',
  },
  {
    name: 'Sarah Miller',
    text: "Professional, safe, and exciting. Everything you want in a charter. We've been booking with them for 5 years now and they never disappoint.",
    stars: 5,
    date: 'June 2025',
  },
  {
    name: 'Michael Davis',
    text: "We did the overnight Gulf Stream trip and caught a 250lb swordfish. Unbelievable experience. Worth every penny.",
    stars: 5,
    date: 'May 2025',
  },
  {
    name: 'Jennifer Brown',
    text: "Took my dad out for his 70th birthday on the 12-hour deep sea trip. He landed a 300lb blue marlin. He still talks about it every day.",
    stars: 5,
    date: 'September 2024',
  },
  {
    name: 'Chris Taylor',
    text: "Second trip with Fish The Wahoo this year. First was the mahi trip, second was the 9-hour offshore. Both were incredible. Already planning trip 3.",
    stars: 5,
    date: 'October 2024',
  },
];

export default function Reviews() {
  return (
    <>
      <SEO
        title="Reviews | Fish The Wahoo Charleston Fishing Charters"
        description="Read reviews from anglers who have fished with Fish The Wahoo out of Charleston, SC. 5-star Google and TripAdvisor reviews from real customers."
        canonicalPath="/reviews/"
      />

      <section className="pt-32 pb-8 bg-nautical-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label">Customer Reviews</span>
          <h1 className="text-5xl md:text-6xl text-white uppercase mb-6">People Are Talking</h1>
          <div className="section-divider" />
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} className="w-6 h-6 fill-accent-orange text-accent-orange" />
            ))}
            <span className="text-white font-bold ml-2">4.9 / 5</span>
            <span className="text-slate-400 text-sm ml-1">· 1,200+ trips</span>
          </div>
        </div>
      </section>

      <ReviewsSection reviews={reviews} showHeader={false} />

      <CTABanner
        headline="Ready to Create Your Own Story?"
        subtext="Join over 5,000 happy clients who have fished with us. Book your trip today."
        ctaLabel="Book A Trip"
        ctaTo="/book"
      />
    </>
  );
}
