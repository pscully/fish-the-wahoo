import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Ruler, Users, Check } from 'lucide-react';
import { formatCents } from '../../lib/format';
import { boats } from '../../content/boats';

export default function PackagesPreview() {
  return (
    <section id="packages" className="py-24 bg-nautical-dark relative overflow-hidden">
      {/* Background decorative rings */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 border border-white rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 border border-white rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="section-label">Start With The Boat</span>
          <h2 className="text-4xl md:text-5xl text-white mb-4 uppercase">
            Three Classes Of Sportfishers
          </h2>
          <div className="section-divider" />
          <p className="text-slate-400 max-w-2xl mx-auto">
            Every trip we book rolls on one of three boat size classes out of Charleston. Pick
            the class that fits your group and budget — the trip lengths and targets stay the
            same across all three.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {boats.map((boat, index) => (
            <motion.div
              key={boat.slug}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="metallic-card rounded-xl overflow-hidden flex flex-col h-full group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={boat.image}
                  alt={boat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-accent-orange text-white font-bold px-4 py-1 rounded-sm shadow-lg text-sm">
                  Deposit from {formatCents(boat.startingDepositCents)}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl text-white mb-2 uppercase tracking-tight">{boat.name}</h3>
                <p className="text-accent-orange text-sm font-bold uppercase tracking-widest mb-5">
                  {boat.tagline}
                </p>

                <div className="flex gap-2 mb-5 flex-wrap">
                  <span className="bg-nautical-light/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1.5">
                    <Ruler className="w-3 h-3 text-accent-orange" /> {boat.length}
                  </span>
                  <span className="bg-nautical-light/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-accent-orange" /> Up to {boat.capacity} passengers
                  </span>
                </div>

                <p className="text-slate-400 text-sm mb-6 leading-relaxed">{boat.description}</p>

                <div className="mb-6">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">
                    Best For
                  </p>
                  <ul className="space-y-2">
                    {boat.bestFor.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-slate-300 text-sm">
                        <Check className="w-4 h-4 text-accent-orange shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 mt-auto">
                  <Link
                    to={`/book/calendar?class=${boat.classSlug}`}
                    className="btn-primary flex-grow py-3 text-sm text-center"
                  >
                    Book This Class
                  </Link>
                  <Link
                    to={`/tour-boats/${boat.slug}`}
                    className="btn-outline px-4 py-3 text-sm"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/tour-boats"
            className="inline-flex items-center gap-2 text-accent-orange font-bold uppercase tracking-widest hover:gap-4 transition-all text-sm"
          >
            Compare All Boat Classes <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
