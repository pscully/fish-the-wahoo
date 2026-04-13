import { Users, ChevronRight } from 'lucide-react';
import type { BoatClass, Pricing } from '../../lib/types';
import { formatCents } from '../../lib/format';

interface Props {
  boatClasses: BoatClass[];
  pricing: Pricing[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function StepSelectClass({ boatClasses, pricing, onSelect }: Props) {
  return (
    <div>
      <h2 className="text-2xl text-navy-900 mb-2 text-center">Select Your Boat Class</h2>
      <p className="text-navy-500 font-body text-center mb-8">
        Choose the vessel size that best fits your party
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {boatClasses.map((bc) => {
          const prices = pricing.filter((p) => p.boat_class_id === bc.id);
          const minDeposit = prices.length > 0 ? Math.min(...prices.map((p) => p.deposit_amount)) : 0;

          return (
            <button
              key={bc.id}
              onClick={() => onSelect(bc.id)}
              className="card text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-sea-500"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={bc.image_url}
                  alt={bc.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-navy-400 text-xs font-body mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Up to {bc.max_passengers} passengers</span>
                </div>
                <h3 className="text-lg text-navy-900 mb-1">{bc.name}</h3>
                <p className="text-sea-600 font-body text-sm font-medium mb-3">{bc.tagline}</p>
                <p className="text-navy-500 font-body text-sm leading-relaxed mb-4 line-clamp-2">
                  {bc.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-navy-100">
                  <div>
                    <span className="text-navy-400 font-body text-xs">Deposits from</span>
                    <p className="text-xl text-navy-900 font-display">{formatCents(minDeposit)}</p>
                  </div>
                  <span className="inline-flex items-center text-sea-600 font-body text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    Select
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
