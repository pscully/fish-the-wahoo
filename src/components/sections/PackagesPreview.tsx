import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import type { BoatClass } from '../../lib/types';
import { formatCents } from '../../lib/format';

interface PackagesPreviewProps {
  boatClasses: Array<BoatClass & { startingDeposit: number }>;
}

export default function PackagesPreview({ boatClasses }: PackagesPreviewProps) {
  return (
    <section id="packages" className="py-24 bg-nautical-dark relative overflow-hidden">
      {/* Background decorative rings */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 border border-white rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 border border-white rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="section-label">Choose Your Adventure</span>
          <h2 className="text-4xl md:text-5xl text-white mb-4 uppercase">
            Fishing Charter Packages
          </h2>
          <div className="section-divider" />
          <p className="text-slate-400 max-w-2xl mx-auto">
            Three tiers of offshore sportfishing vessels, from economical to ultimate luxury.
            All trips include licenses, bait, tackle, and ice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {boatClasses.map((bc, index) => (
            <motion.div
              key={bc.id}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="metallic-card rounded-xl overflow-hidden flex flex-col h-full group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={bc.image_url}
                  alt={bc.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-accent-orange text-white font-bold px-4 py-1 rounded-sm shadow-lg text-sm">
                  From {formatCents(bc.startingDeposit)}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl text-white mb-2 uppercase tracking-tight">{bc.name}</h3>
                <p className="text-accent-orange text-sm font-bold uppercase tracking-widest mb-4">
                  {bc.tagline}
                </p>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed flex-grow">
                  {bc.description}
                </p>
                <div className="flex gap-3">
                  <Link
                    to={`/book?class=${bc.slug}`}
                    className="btn-primary flex-grow py-3 text-sm text-center"
                  >
                    Book Trip
                  </Link>
                  <Link
                    to={`/packages`}
                    className="btn-outline px-4 py-3 text-sm"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/packages" className="inline-flex items-center gap-2 text-accent-orange font-bold uppercase tracking-widest hover:gap-4 transition-all text-sm">
            View All Packages <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
