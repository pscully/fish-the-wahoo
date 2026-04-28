import { motion } from 'motion/react';
import { Star } from 'lucide-react';

interface Review {
  name: string;
  text: string;
  stars: number;
  date?: string;
}

const defaultReviews: Review[] = [
  {
    name: 'Kelly Pipkin',
    text: "Captain Chris exceeded our expectations on Get R Done. The boat was clean and organized. The fishing was fantastic! Lots of high fives after we landed the 50lb yellowfin tuna. Could not ask for a better experience. 10/10",
    stars: 5,
  },
  {
    name: 'George McCurdy',
    text: "My family just went out with Capt Jamie on the Teaser 2. We had a blast. The whole crew did a fantastic job. My wife and I took our 8yr old son and 11yr niece and we all caught plenty of fish. Crew did a wonderful job helping the kids manage the bigger fish. Highly recommend for the whole family.",
    stars: 5,
  },
  {
    name: 'Kyle Lagunas',
    text: "Caught Wahoo, Dolphin and released a Marlin. Capt. Drew and David were great! They put us on the fish and provided an excellent environment for us to reel them in. Topped it off with fantastic photos and a video of it all. Can't recommend them enough.",
    stars: 5,
  },
];

interface ReviewsSectionProps {
  reviews?: Review[];
  title?: string;
  showHeader?: boolean;
}

export default function ReviewsSection({
  reviews = defaultReviews,
  title = "What Our Anglers Say",
  showHeader = true,
}: ReviewsSectionProps) {
  return (
    <section id="reviews" className="py-24 bg-nautical-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="text-center mb-16">
            <span className="section-label">Testimonials</span>
            <h2 className="text-4xl text-white mb-4 uppercase">{title}</h2>
            <div className="section-divider" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-nautical-blue p-8 rounded-xl border border-white/5 text-left"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent-orange text-accent-orange" />
                ))}
              </div>
              <p className="text-slate-300 italic mb-6">"{review.text}"</p>
              <div className="font-display font-bold text-white uppercase tracking-wider text-sm">
                — {review.name}
              </div>
              {review.date && (
                <div className="text-slate-500 text-xs mt-1">{review.date}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
