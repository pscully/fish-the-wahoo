import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';
import { packages } from '../../content/packages';

export default function PackagesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {packages.map((pkg) => (
        <div
          key={pkg.slug}
          className="metallic-card rounded-xl overflow-hidden flex flex-col group"
        >
          <div className="p-6 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-4 gap-3">
              <div className="flex gap-2 flex-wrap">
                <span className="bg-nautical-light/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3 text-accent-orange" /> {pkg.duration}
                </span>
                <span className="bg-nautical-light/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Users className="w-3 h-3 text-accent-orange" /> Up to {pkg.maxPassengers}
                </span>
              </div>
              <div className="bg-accent-orange text-white font-bold px-3 py-1 text-sm rounded-sm shrink-0">
                From ${pkg.priceFrom.toLocaleString()}
              </div>
            </div>
            <h3 className="text-lg text-white mb-2 uppercase leading-tight">{pkg.name}</h3>
            <p className="text-accent-orange text-xs font-bold uppercase tracking-widest mb-3">
              {pkg.tagline}
            </p>
            <p className="text-slate-400 text-sm leading-relaxed flex-grow mb-6">
              {pkg.description}
            </p>
            <div className="flex gap-3">
              <Link
                to={`/book/calendar?package=${pkg.slug}`}
                className="btn-primary flex-grow py-2 text-sm text-center"
              >
                Book Trip
              </Link>
              <Link to={`/packages/${pkg.slug}`} className="btn-outline px-4 py-2 text-sm">
                Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
