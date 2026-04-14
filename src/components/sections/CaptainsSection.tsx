import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Instagram, Facebook } from 'lucide-react';
import type { Captain } from '../../lib/types';

interface CaptainsSectionProps {
  captains: Captain[];
}

export default function CaptainsSection({ captains }: CaptainsSectionProps) {
  return (
    <section id="captains" className="py-24 bg-nautical-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-20">
          <div className="lg:w-1/2">
            <span className="section-label">The Crew</span>
            <h2 className="text-4xl md:text-6xl text-white mb-8 uppercase leading-tight">
              Meet Your <br />
              <span className="text-accent-orange">Captains</span>
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              For over three generations, Fish The Wahoo has been the premier name in
              deep-sea adventure out of Charleston. Our expert captains are stewards of
              these waters, with decades of experience exploring the best fishing grounds
              off the South Carolina coast.
            </p>
            <Link
              to="/captains"
              className="inline-flex items-center gap-2 text-accent-orange font-bold uppercase tracking-widest hover:gap-4 transition-all"
            >
              Meet The Full Crew <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/1630344/pexels-photo-1630344.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Fishing action"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-accent-orange p-8 rounded-xl shadow-xl hidden md:block">
              <div className="text-4xl font-display font-bold text-white mb-1">75+</div>
              <div className="text-xs font-bold text-white/80 uppercase tracking-widest">
                Years Combined Experience
              </div>
            </div>
          </div>
        </div>

        {captains.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {captains.slice(0, 3).map((cap, i) => (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group"
              >
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
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-accent-orange transition-colors cursor-pointer">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-accent-orange transition-colors cursor-pointer">
                        <Facebook className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
                <h4 className="text-2xl text-white mb-2 uppercase">{cap.name}</h4>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{cap.bio}</p>
                <Link
                  to="/captains"
                  className="mt-4 inline-block text-xs font-bold text-white/40 uppercase tracking-widest hover:text-accent-orange transition-colors"
                >
                  Read More
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400">Captain profiles coming soon.</p>
          </div>
        )}
      </div>
    </section>
  );
}
